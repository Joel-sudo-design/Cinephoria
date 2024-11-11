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
            if ($film->getCinema() != null) {
                $cinemas = '';
                foreach ($film->getCinema() as $cinema) {
                    $cinemas = $cinema->getName();
                }
                $AllFilmsArray[count($AllFilmsArray) - 1]['cinema'] = $cinemas;
            }
            if ($film->getDateDebut() != null) {
                $AllFilmsArray[count($AllFilmsArray) - 1]['date_debut'] = $film->getDateDebut()->format('d/m/Y');
            }
            if ($film->getDateFin() != null) {
                $AllFilmsArray[count($AllFilmsArray) - 1]['date_fin'] = $film->getDateFin()->format('d/m/Y');
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
        $age = $data['age'];
        $label = $data['label'];
        $name = $data['nom'];
        $stringCinema = $data['cinema'];
        $stringDateDebut = $data['date_debut'];
        $stringDateFin = $data['date_fin'];
        $dateDebut = \DateTime::createFromFormat('Y-m-d', $stringDateDebut);
        $dateFin = \DateTime::createFromFormat('Y-m-d', $stringDateFin);
        $stringSalle = $data['salle'];
        $salle = $entityManager->getRepository(Salle::class)->findOneBy(['id' => $stringSalle]);
        $places = $data['places'];
        $salle3DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '3DX']);
        $stringHeureDebut3DX_1 = $data['heure_debut_3DX_1'];
        $stringHeureFin3DX_1 = $data['heure_fin_3DX_1'];
        $heureDebut3DX_1 = \DateTime::createFromFormat('H:i', $stringHeureDebut3DX_1);
        $heureFin3DX_1 = \DateTime::createFromFormat('H:i', $stringHeureFin3DX_1);
        $price3DX_1 = $data['price_3DX_1'];
        $description = $data['description'];
        if (!$stringGenre == null) {
            $genre = $entityManager->getRepository(Genre::class)->findOneBy(['name' => $stringGenre]);
            $film->setGenre($genre);
        }
        if (!$age == null) {
            $film->setAgeMinimum($age);
        }
        if (!$label == null) {
            $film->setLabel($label);
        }
        if (!$name==null) {
            $film->setName($name);
        }
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
        if (!$heureDebut3DX_1==null && !$heureFin3DX_1==null && !$price3DX_1==null) {
            while ($dateDebut <= $dateFin) {
                $seance = new Seance();
                $seance->setHeureDebut($heureDebut3DX_1);
                $seance->setHeureFin($heureFin3DX_1);
                $seance->setDate($dateDebut);
                $seance->setPrice($price3DX_1);
                $seance->setSalle($salle3DX);
                $entityManager->persist($seance);
                $entityManager->flush();
                $dateDebut->modify('+1 day');
            }
        }
        if (!$description==null) {
            $film->setDescription($description);
        }
        if (!$salle==null && !$places==null) {
            $salle->setPlaces($places);
            $entityManager->persist($salle);
            $entityManager->flush();
        }
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film modified']);
    }
}
