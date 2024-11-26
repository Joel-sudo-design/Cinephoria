<?php

namespace App\Controller;

use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FilmsController extends AbstractController
{
    #[Route('/films', name: 'app_films')]
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, FilmRepository $filmRepository): Response
    {   $films = $filmRepository->findAll();
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/index.html.twig', [
            'controller_name' => 'FilmsController',
            'films' => $films,
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
    #[Route('/films/loading', name: 'app_films_loading_user')]
    public function film(FilmRepository $filmRepository): Response
    {
        // Récupérer tous les films
        $AllFilms = $filmRepository->findAll();
        $AllFilmsArray = [];

        foreach ($AllFilms as $film) {
            // Convertir le film en tableau
            $filmArray = $film->toArray();

            // Récupérer et ajouter les cinémas
            $cinemasArray = [];
            foreach ($film->getCinema() as $cinema) {
                $cinemasArray[] = $cinema->getName();
            }
            if (!empty($cinemasArray)) {
                $filmArray['cinema'] = $cinemasArray;
            } else {
                $filmArray['cinema'] = 'Aucun';
            }

            // Ajouter les dates de début et de fin si disponibles
            if ($film->getDateDebut() !== null) {
                $filmArray['date_debut'] = $film->getDateDebut()->format('d/m/Y');
            }
            if ($film->getDateFin() !== null) {
                $filmArray['date_fin'] = $film->getDateFin()->format('d/m/Y');
            }

            // Récupérer les séances totales
            $seancesTotal = $film->getSeance();
            $reservations = [];
            foreach ($seancesTotal as $seance) {
                $reservations[] = $seance->toArrayReservation();
            }

            // Regrouper les réservations par date
            $reservationsByDate = [];

            foreach ($reservations as $reservation) {
                $date = $reservation['date'];

                // Initialiser le cumul pour cette date si elle n'existe pas encore
                if (!isset($reservationsByDate[$date])) {
                    $reservationsByDate[$date] = 0;
                }

                // Ajouter le nombre de réservations
                $reservationsByDate[$date] += $reservation['reservation'];
                $filmArray['reservations'] = $reservationsByDate;
            }

            // Ajouter le film au tableau final
            $AllFilmsArray[] = $filmArray;
        }

        return new JsonResponse($AllFilmsArray);
    }
    #[Route('/utilisateur/films', name: 'app_films_user')]
    public function indexUser(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, FilmRepository $filmRepository): Response
    {
        $films = $filmRepository->findAll();
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/user.html.twig', [
            'films' => $films,
            'controller_name' => 'FilmsUserController',
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
    #[Route('/employe/films', name: 'app_films_employe')]
    public function indexEmploye(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, FilmRepository $filmRepository): Response
    {   $films = $filmRepository->findAll();
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/employe.html.twig', [
            'controller_name' => 'FilmsEmployeController',
            'films' => $films,
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
    #[Route('/administrateur/films', name: 'app_films_admin')]
    public function indexAdmin(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, FilmRepository $filmRepository): Response
    {   $films = $filmRepository->findAll();
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/admin.html.twig', [
            'controller_name' => 'FilmsAdminController',
            'films' => $films,
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
}
