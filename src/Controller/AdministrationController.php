<?php

namespace App\Controller;

use App\Entity\Film;
use App\Entity\Genre;
use App\Repository\CinemaRepository;
use App\Repository\GenreRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/administrateur/administration')]
class AdministrationController extends AbstractController
{
    #[Route('', name: 'app_administration')]
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository): Response
    {
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();
        return $this->render('administration/index.html.twig', [
            'controller_name' => 'AdministrationController',
            'cinemas' => $cinemas,
            'genres' => $genres
        ]);
    }

    #[Route('/film', name: 'app_administration_film')]
    public function Film(EntityManagerInterface $entityManager): Response
    {
        $AllFilms = $entityManager->getRepository(Film::class)->findAll();
        $AllFilmsArray = [];
        foreach ($AllFilms as $film) {
            $AllFilmsArray[] = $film->toArray();
        }
        return new JsonResponse($AllFilmsArray);
    }

    #[Route('/film/create', name: 'app_administration_creation_film')]
    public function CreateFilm(EntityManagerInterface $entityManager): Response
    {
        $film = new Film();
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film created']);
    }

    #[Route('/film/delete', name: 'app_administration_delete_film')]
    public function FilmDelete(Request $request,EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $Id = $data['id'];
        $film = $entityManager->getRepository(Film::class)->find($Id);
        $entityManager->remove($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film deleted']);
    }

    #[Route('/film/validate', name: 'app_administration_validate_film')]
    public function ValidateFilm(Request $request,EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $StringGenre = $data['genre'];
        $genre = $entityManager->getRepository(Genre::class)->findOneBy(['name' => $StringGenre]);
        $film = $entityManager->getRepository(Film::class)->find($id);
        $film->setGenre($genre);
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film modified']);
    }
}
