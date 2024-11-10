<?php

namespace App\Controller;

use App\Entity\Cinema;
use App\Entity\Film;
use App\Entity\Genre;
use App\Entity\Salle;
use App\Entity\Seance;
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
            if ($film->getGenre() != null) {
                $AllFilmsArray[count($AllFilmsArray) - 1]['genre'] = $film->getGenre()->getName();
            }
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
        $film = $entityManager->getRepository(Film::class)->find($id);
        $stringGenre = $data['genre'];
        $description = $data['description'];
        $name = $data['nom'];
        $age = $data['age'];
        $label = $data['label'];
        $stringCinema = $data['cinema'];
        $stringDateDebut = $data['date_debut'];
        $stringDateFin = $data['date_fin'];
        $dateDebut = \DateTime::createFromFormat('Y-m-d', $stringDateDebut);
        $dateFin = \DateTime::createFromFormat('Y-m-d', $stringDateFin);
        $stringHeureDebut3DX = $data['heure_debut_3DX'];
        $stringHeureFin3DX = $data['heure_debut_3DX'];
        $salle3DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '3DX']);
        $heureDebut3DX = \DateTime::createFromFormat('H:i', $stringHeureDebut3DX);
        $heureFin3DX = \DateTime::createFromFormat('H:i', $stringHeureFin3DX);
        if (!$stringGenre == null) {
            $genre = $entityManager->getRepository(Genre::class)->findOneBy(['name' => $stringGenre]);
            $film->setGenre($genre);
        }
        if (!$age == null) {
            $film->setAgeMinimum($age);
        }
        if (!$name==null) {
            $film->setName($name);
        }
        if (!$description==null) {
            $film->setDescription($description);
        }
        $film->setLabel($label);
        if (!$stringCinema==null) {
            $cinema = $entityManager->getRepository(Cinema::class)->findOneBy(['name' => $stringCinema]);
            $film->addCinema($cinema);
        }
        if (!$dateDebut==null) {
            $film->setDateDebut($dateDebut);
        }
        if (!$dateFin==null) {
            $film->setDateFin($dateFin);
        }
        if (!$heureDebut3DX==null && !$heureFin3DX==null) {
            $seance = new Seance();
            $seance->setHeureDebut($heureDebut3DX);
            $seance->setHeureFin($heureFin3DX);
            $salle3DX->addSeance($seance);
        }
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film modified']);
    }
}
