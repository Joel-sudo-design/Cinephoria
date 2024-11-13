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
            $filmArray = $film->toArray();
            if ($film->getGenre() !== null) {
                $filmArray['genre'] = $film->getGenre()->getName();
            }
            $cinemasArray = [];
            foreach ($film->getCinema() as $cinema) {
                $cinemasArray[] = $cinema->getName();
            }
            if (!empty($cinemasArray)) {
                $filmArray['cinema'] = $cinemasArray;
            }
            if ($film->getDateDebut() !== null) {
                $filmArray['date_debut'] = $film->getDateDebut()->format('d/m/Y');
            }
            if ($film->getDateFin() !== null) {
                $filmArray['date_fin'] = $film->getDateFin()->format('d/m/Y');
            }
            $date_debut = $film->getDateDebut();
            $film_id = $film->getId();
            $seances = $entityManager->getRepository(Seance::class)->findByFilmId($film_id, $date_debut);
            foreach ($seances as $Seance) {
                    $seances[] = $Seance->toArray();
                    $filmArray['seances'] = $seances;
                }}
            if (empty($filmArray['seances'])) {
                $filmArray['seances'] = [];
            }
            $AllFilmsArray[] = $filmArray;
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
        $seances = $film->getSeance();
        $entityManager->remove($film);
        foreach ($seances as $seance) {
            $entityManager->remove($seance);
        }
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
        $places = $data['places'];
        $salle3DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '3DX']);
        $salle4DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '4DX']);
        $salleIMAX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => 'IMAX']);
        $salleDolby = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => 'Dolby']);
        for ($i = 1; $i <= 1; $i++) {
            $stringHeureDebut3DX = $data["heure_debut_3DX_$i"];
            $stringHeureFin3DX = $data["heure_fin_3DX_$i"];
            $heureDebut3DX = \DateTime::createFromFormat('H:i', $stringHeureDebut3DX);
            $heureFin3DX = \DateTime::createFromFormat('H:i', $stringHeureFin3DX);
            $price3DX = $data["price_3DX_$i"];
            if ($heureDebut3DX && $heureFin3DX && $dateDebut && $dateFin && is_numeric($price3DX)  && is_numeric($places) && is_numeric($stringSalle)) {
                $this->getSeance($heureDebut3DX, $heureFin3DX, $price3DX, $dateDebut, $dateFin, $salle3DX, $film, $entityManager);
            }
            $stringHeureDebut4DX = $data["heure_debut_4DX_$i"];
            $stringHeureFin4DX = $data["heure_fin_4DX_$i"];
            $heureDebut4DX = \DateTime::createFromFormat('H:i', $stringHeureDebut4DX);
            $heureFin4DX = \DateTime::createFromFormat('H:i', $stringHeureFin4DX);
            $price4DX = $data["price_4DX_$i"];
            if ($heureDebut4DX && $heureFin4DX && $dateDebut && $dateFin && is_numeric($price4DX) && is_numeric($places) && is_numeric($stringSalle)) {
                $this->getSeance($heureDebut4DX, $heureFin4DX, $price4DX, $dateDebut, $dateFin, $salle4DX, $film, $entityManager);
            }
            $stringHeureDebutIMAX = $data["heure_debut_IMAX_$i"];
            $stringHeureFinIMAX = $data["heure_fin_IMAX_$i"];
            $heureDebutIMAX = \DateTime::createFromFormat('H:i', $stringHeureDebutIMAX);
            $heureFinIMAX = \DateTime::createFromFormat('H:i', $stringHeureFinIMAX);
            $priceIMAX = $data["price_IMAX_$i"];
            if ($heureDebutIMAX && $heureFinIMAX && $dateDebut && $dateFin && is_numeric($priceIMAX) && is_numeric($places) && is_numeric($stringSalle)) {
                $this->getSeance($heureDebutIMAX, $heureFinIMAX, $priceIMAX, $dateDebut, $dateFin, $salleIMAX, $film, $entityManager);
            }
            $stringHeureDebutDolby = $data["heure_debut_Dolby_$i"];
            $stringHeureFinDolby = $data["heure_fin_Dolby_$i"];
            $heureDebutDolby = \DateTime::createFromFormat('H:i', $stringHeureDebutDolby);
            $heureFinDolby = \DateTime::createFromFormat('H:i', $stringHeureFinDolby);
            $priceDolby = $data["price_Dolby_$i"];
            if ($heureDebutDolby && $heureFinDolby && $dateDebut && $dateFin && is_numeric($priceDolby) && is_numeric($places) && is_numeric($stringSalle)) {
                $this->getSeance($heureDebutDolby, $heureFinDolby, $priceDolby, $dateDebut, $dateFin, $salleDolby, $film, $entityManager);
            }
        }
        $description = $data['description'];
        if ($dateDebut != '') {
            $film->setDateDebut($dateDebut);
        }
        if ($dateFin != '') {
            $film->setDateFin($dateFin);
        }
        if ($stringGenre != '') {
            $genre = $entityManager->getRepository(Genre::class)->findOneBy(['name' => $stringGenre]);
            $film->setGenre($genre);
        }
        if ($age != '') {
            $film->setAgeMinimum($age);
        }
        if ($label != '') {
            $film->setLabel(false);
        }else{$film->setLabel($label);}
        if ($name != '') {
            $film->setName($name);
        }
        if ($stringCinema !== '') {
            $cinema = $entityManager->getRepository(Cinema::class)->findOneBy(['name' => $stringCinema]);
            $film->addCinema($cinema);
        }
        if ($description != '') {
            $film->setDescription($description);
        }
        if (is_numeric($stringSalle) && is_numeric($places)) {
            $salle = $entityManager->getRepository(Salle::class)->findOneBy(['id' => $stringSalle]);
            $salle->setPlaces($places);
            $entityManager->persist($salle);
            $entityManager->flush();
        }
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film modified']);
    }
    public function getSeance(\DateTime|false $heureDebut, \DateTime|false $heureFin, String $price, \DateTime|false $dateDebut, \DateTime|false $dateFin, ?Salle $salle, ?Film $film, EntityManagerInterface $entityManager): Void
    {
        if (!$heureDebut == null && !$heureFin == null && !$price == null) {
            $dateSeance = clone $dateDebut;
            while ($dateSeance <= $dateFin) {
                $seance = new Seance();
                $seance->setHeureDebut($heureDebut);
                $seance->setHeureFin($heureFin);
                $seance->setHeureFin($heureFin);
                $seance->setDate($dateSeance);
                $seance->setPrice($price);
                $seance->setSalle($salle);
                $seance->setFilm($film);
                $entityManager->persist($seance);
                $entityManager->flush();
                $dateSeance->modify('+1 day');
            }
        }
    }
}
