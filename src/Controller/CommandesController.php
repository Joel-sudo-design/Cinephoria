<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/commandes', name: 'app_commandes_user')]
    public function index(): Response
    {
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

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
        ]);
    }
}
