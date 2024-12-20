<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\Seance;
use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\Builder\BuilderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReservationController extends AbstractController
{
    #[Route('/reservation', name: 'app_reservation')]
    public function index(CinemaRepository $cinemaRepository, FilmRepository $filmRepository): Response
    {
        // Récupérer tous les cinémas et films
        $cinemas = $cinemaRepository->findAll();
        $films = $filmRepository->findAll();

        // Organiser les films par cinéma dans un tableau associatif
        $filmsData = [];
        foreach ($films as $film) {
            foreach ($film->getCinema() as $cinema) {
                $filmsData[$cinema->getId()][] = [
                    'id' => $film->getId(),
                    'title' => $film->getName()
                ];
            }
        }

        // Passer les données à la vue
        return $this->render('reservation/index.html.twig', [
            'cinemas' => $cinemas,
            'filmsData' => $filmsData
        ]);
    }
    #[Route('utilisateur/reservation', name: 'app_reservation_user')]
    public function indexUser(CinemaRepository $cinemaRepository, FilmRepository $filmRepository): Response
    {
        // Récupérer tous les cinémas et films
        $cinemas = $cinemaRepository->findAll();
        $films = $filmRepository->findAll();

        // Organiser les films par cinéma dans un tableau associatif
        $filmsData = [];
        foreach ($films as $film) {
            foreach ($film->getCinema() as $cinema) {
                $filmsData[$cinema->getId()][] = [
                    'id' => $film->getId(),
                    'title' => $film->getName()
                ];
            }
        }

        // Passer les données à la vue
        return $this->render('reservation/user.html.twig', [
            'cinemas' => $cinemas,
            'filmsData' => $filmsData
        ]);
    }
    #[Route('/utilisateur/reservation/paiement', name: 'app_reservation_paiement_user')]
    public function paid(): Response
    {
        return $this->render('reservation/paiement.html.twig');
    }
    #[Route('/reservation/film', name: 'app_reservation_film')]
    public function loadFilm(FilmRepository $filmRepository, Request $request, CinemaRepository $cinemaRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $filmId = $data['filmId'];
        $cinemaId = $data['cinemaId'];

        // Initialiser la réponse par défaut à un tableau vide
        $filmArray = [
            'film' => [],
            'seances' => [],
        ];

        if ($filmId && $cinemaId) {
            $structuredSeances = [];
            $film = $filmRepository->findOneBy(['id' => $filmId]);
            $cinema = $cinemaRepository->findOneBy(['id' => $cinemaId]);

            if ($film) {
                $seances = $film->getSeance();
                foreach ($seances as $seance) {
                    $seanceArray = $seance->toArray($cinemaId);
                    // Regrouper les séances par date
                    $date = $seanceArray['date'];
                    if (!isset($structuredSeances[$date])) {
                        $structuredSeances[$date] = [
                            'date' => $date,
                            'informations' => [],
                        ];
                    }
                    $structuredSeances[$date]['informations'][] = [
                        'id' => $seanceArray['id'],
                        'heureDebut' => $seanceArray['heure_debut_seance'],
                        'heureFin' => $seanceArray['heure_fin_seance'],
                        'qualite' => $seanceArray['qualite'],
                        'salle' => $seanceArray['salle'],
                        'prix' => $seanceArray['price']
                    ];

                    // Gérer les réservations de la séance
                    $reservations = $seance->getReservation();
                    foreach ($reservations as $res) {
                        $reservationArray = $res->toArray();

                        $lastIndex = count($structuredSeances[$date]['informations']) - 1;

                        if (!isset($structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'])) {
                            $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'] = [];
                        }

                        $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'] = array_merge(
                            $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'],
                            $reservationArray['siege_reserve']
                        );
                    }
                }

                $seancesArray = array_values($structuredSeances);

                // Ajouter les informations du film
                $filmArray['film'] = [
                    'name' => $film->getName(),
                    'cinema' => $cinema ? $cinema->getName() : null,
                    'dateDebut' => $film->getDateDebut()?->format('d/m/Y'),
                    'dateFin' => $film->getDateFin()?->format('d/m/Y'),
                    'image' => $film->getImageName()
                        ? $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName()
                        : null,
                    'genre' => $film->getGenre() ? $film->getGenre()->getName() : 'aucun',
                ];
                $filmArray['seances'] = $seancesArray;
            }
        }

        return new JsonResponse($filmArray);
    }
    #[Route('/reservation/paiement', name: 'app_reservation_paiement')]
    public function paiement(Request $request, EntityManagerInterface $entityManager, BuilderInterface $qrCodeBuilder): Response
    {
        $user = $this->getUser();
        $session = $request->getSession();

        $reservationData = json_decode($request->getContent(), true);
        $seanceId = $reservationData['seanceId'] ?? null;

        // Vérifier si l'utilisateur est connecté
        if (!$user) {
            $seats = $reservationData['seats'] ?? null;

            if ($seanceId && !empty($seats)) {
                $session->set('pending_reservation', [
                    'seanceId' => $seanceId,
                    'seats' => $seats,
                ]);

                // Retourner une redirection JSON pour une requête AJAX
                return $this->json([
                    'redirectToLogin' => $this->generateUrl('app_login', [
                        'redirect_to' => $this->generateUrl('app_reservation_paiement'),
                    ]),
                ]);
            }
        }

        // Vérifier si une réservation existe déjà pour cet utilisateur et cette séance
        $existingReservation = $entityManager->getRepository(Reservation::class)->findOneBy([
            'user' => $user,
            'seance' => $seanceId
        ]);

        if ($existingReservation) {
            return new JsonResponse(['error' => 'Vous avez déjà réservé pour cette séance.']);
        }

        // Vérifier les données de réservation en attente
        $pendingReservation = $session->get('pending_reservation');
        if ($pendingReservation) {
            $seanceId = $pendingReservation['seanceId'];
            $seats = $pendingReservation['seats'];
            $session->remove('pending_reservation');
        } else {
            $reservationData = json_decode($request->getContent(), true);
            $seanceId = $reservationData['seanceId'] ?? null;
            $seats = $reservationData['seats'] ?? null;
        }

        // Validation et création de la réservation
        if ($seanceId && !empty($seats)) {
            $seance = $entityManager->getRepository(Seance::class)->find($seanceId);

            $reservation = new Reservation();
            $reservation->setUser($user);
            $reservation->setSeance($seance);
            $reservation->setSiege($seats);

            // Créer une donnée unique pour le QR code (par exemple, l'ID de la réservation)
            $qrData = 'Reservation ID: ' . $reservation->getId() . ' - Seance ID: ' . $seanceId;

            // Générer le QR code avec les données uniques
            $qrCode = $qrCodeBuilder->build(
                data: $qrData,
                size: 200
            );

            // Convertir le QR code en image Base64
            $qrCodeDataUrl = $qrCode->getDataUri();

            // Enregistrer le QR code dans la réservation
            $reservation->setQrCode($qrCodeDataUrl);

            // Persister et sauvegarder la réservation avec le QR code
            $entityManager->persist($reservation);
            $entityManager->flush();

            if($pendingReservation){
                return $this->redirectToRoute('app_reservation_paiement_user');
            } else {
                return $this->json(['redirectTo' => $this->generateUrl('app_reservation_paiement_user')]);
            }
        }

        return new JsonResponse(['error' => 'Une erreur est survenue lors de la réservation.'], 400);
    }

}
