<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\Seance;
use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use Doctrine\ORM\EntityManagerInterface;
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
                    $seanceArray = $seance->toArray();
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
                        'salle' => 'Salle ' . $seanceArray['salle'],
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
    public function paiement(Request $request, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $reservationData = json_decode($request->getContent(), true);
        $seanceId = $reservationData['seanceId'];
        $seats = $reservationData['seats'];

        if ($user) {
            if ($seanceId && !empty ($seats)){
                    $reservation = new Reservation();
                    $reservation->setUser($user);
                    $seance = $entityManager->getRepository(Seance::class)->find($seanceId);
                    $reservation->setSeance($seance);
                    $reservation->setSiege($seats);
                    $entityManager->persist($reservation);
                    $entityManager->flush();
            }
        }
        return new JsonResponse(['success' => 'seats']);
    }
    #[Route('/utilisateur/reservation/paiement', name: 'app_reservation_paiement_user')]
    public function paid(): Response
    {
        return $this->render('reservation/paiement.html.twig');
    }
}
