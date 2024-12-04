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
        $filmId = 245;
        $cinemaId = 1;
        if ($filmId !== '') {
            // Récupérer les séances du film
            $structuredSeances = [];
            $seances = $filmRepository->findOneBy(['id' => $filmId])->getSeance();
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
                // Récupérer les réservations de la séance
                $reservations = $seance->getReservation();
                foreach ($reservations as $res) {
                    $reservationArray = $res->toArray();

                    // Vérifier si la clé 'sieges_reserves' existe dans la dernière séance ajoutée
                    $lastIndex = count($structuredSeances[$date]['informations']) - 1;

                    // Ajouter tous les sièges réservés dans le tableau 'sieges_reserves' unique
                    if (!isset($structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'])) {
                        $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'] = [];
                    }

                    $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'] = array_merge(
                        $structuredSeances[$date]['informations'][$lastIndex]['sieges_reserves'],
                        $reservationArray['siege_reserve']
                    );
                }
            }

            // Convertir l'objet associatif en un tableau indexé
            $seancesArray = array_values($structuredSeances);
            //Informations sur le film
            $film = $filmRepository->findOneBy(['id' => $filmId]);
            $cinema = $cinemaRepository->findOneBy(['id' => $cinemaId]);
            $filmArray = [];
            if ($film->getDateDebut() && $film->getDateFin() !== null) {
                $filmArray['film'] = $film->toArray()
                    + ['cinema' => $cinema->getName()]
                    + ['Date_debut' => $film->getDateDebut()->format('d/m/Y')]
                    + ['Date_fin' => $film->getDateFin()->format('d/m/Y')]
                    + ['image' => $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName()];
            }
            else {
                $filmArray['film'] = $film->toArray()
                    + ['cinema' => $cinema->getName()];
                    + ['image' => $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName()];
            }
            $filmArray['seances'] = $seancesArray;
        }
        return new JsonResponse($filmArray);
    }
}
