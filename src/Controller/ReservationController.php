<?php

namespace App\Controller;

use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReservationController extends AbstractController
{
    #[Route('/reservation', name: 'app_reservation')]
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, FilmRepository $filmRepository): Response
    {   $films = $filmRepository->findAll();
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('reservation/index.html.twig', [
            'controller_name' => 'FilmsController',
            'films' => $films,
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }
}
