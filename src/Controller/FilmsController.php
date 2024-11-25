<?php

namespace App\Controller;

use App\Entity\Film;
use App\Entity\Seance;
use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use App\Repository\GenreRepository;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FilmsController extends AbstractController
{
    #[Route('/films', name: 'app_films')]
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository): Response
    {
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/index.html.twig', [
            'controller_name' => 'FilmsController',
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
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
    public function indexEmploye(CinemaRepository $cinemaRepository, GenreRepository $genreRepository): Response
    {
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/employe.html.twig', [
            'controller_name' => 'FilmsEmployeController',
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
    #[Route('/administrateur/films', name: 'app_films_admin')]
    public function indexAdmin(CinemaRepository $cinemaRepository, GenreRepository $genreRepository): Response
    {
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('films/admin.html.twig', [
            'controller_name' => 'FilmsAdminController',
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
}
