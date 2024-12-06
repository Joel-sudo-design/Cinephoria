<?php

namespace App\Controller;

use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
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
    #[Route('/reservation/film', name: 'app_reservation_film')]
    public function reservation(FilmRepository $filmRepository, Request $request, CinemaRepository $cinemaRepository): Response
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
                        'heureDebut' => $seanceArray['heure_debut_seance'],
                        'heureFin' => $seanceArray['heure_fin_seance'],
                        'qualite' => $seanceArray['qualite'],
                        'salle' => 'Salle ' . $seanceArray['salle'],
                        'tarif' => $seanceArray['price']
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
                    'dateDebut' => $film->getDateDebut() ? $film->getDateDebut()->format('d/m/Y') : null,
                    'dateFin' => $film->getDateFin() ? $film->getDateFin()->format('d/m/Y') : null,
                    'image' => $film->getImageName()
                        ? $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName()
                        : null,
                    'genre' => $film->getGenre()->getName(),
                ];
                $filmArray['seances'] = $seancesArray;
            }
        }

        return new JsonResponse($filmArray);
    }
}
