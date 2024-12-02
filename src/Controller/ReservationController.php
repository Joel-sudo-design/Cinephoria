<?php

namespace App\Controller;

use App\Repository\CinemaRepository;
use App\Repository\FilmRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

}
