<?php

namespace App\Controller;

use App\Entity\Cinema;
use App\Entity\Film;
use App\Entity\Genre;
use App\Entity\Salle;
use App\Entity\Seance;
use App\Form\ImageType;
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
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository, Request $request, EntityManagerInterface $entityManager): Response {

        // Récupérer les cinémas et les genres
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();

        return $this->render('administration/index.html.twig', [
            'controller_name' => 'AdministrationController',
            'cinemas' => $cinemas,
            'genres' => $genres,
        ]);
    }

    #[Route('/film', name: 'app_administration_film')]
    public function Film(EntityManagerInterface $entityManager): Response
    {
        // Récupérer tous les films
        $AllFilms = $entityManager->getRepository(Film::class)->findAll();
        $AllFilmsArray = [];

        foreach ($AllFilms as $film) {
            // Convertir le film en tableau
            $filmArray = $film->toArray();

            // Ajouter l'image si disponible
            if ($film->getImageName() !== null) {
                $filmArray['image'] = $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName();
            }

            // Ajouter le genre si disponible
            if ($film->getGenre() !== null) {
                $filmArray['genre'] = $film->getGenre()->getName();
            }

            // Récupérer et ajouter les cinémas
            $cinemasArray = [];
            foreach ($film->getCinema() as $cinema) {
                $cinemasArray[] = $cinema->getName();
            }
            if (!empty($cinemasArray)) {
                $filmArray['cinema'] = $cinemasArray;
            }

            // Ajouter les dates de début et de fin si disponibles
            if ($film->getDateDebut() !== null) {
                $filmArray['date_debut'] = $film->getDateDebut()->format('d/m/Y');
            }
            if ($film->getDateFin() !== null) {
                $filmArray['date_fin'] = $film->getDateFin()->format('d/m/Y');
            }

            // Votre logique pour récupérer les séances
            $date_debut = $film->getDateDebut();
            $film_id = $film->getId();
            $seances = $entityManager->getRepository(Seance::class)->findByFilmId($film_id, $date_debut);

            // Ajouter les séances
            $seancesArray = [];
            foreach ($seances as $Seance) {
                $seancesArray[] = $Seance->toArray();
            }
            $filmArray['seances'] = $seancesArray ?: [];

            // Ajouter le film au tableau final
            $AllFilmsArray[] = $filmArray;
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
        $data = $request->request->all();
        $id = $data['id'];
        $film = $entityManager->getRepository(Film::class)->find($id);
        $image = $request->files->get('image');
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
        $formats = ['3DX', '4DX', 'IMAX', 'Dolby'];
        $description = $data['description'];
        if ($image) {
            $film->setImageFile($image);
        }
        if ($name != '') {
            $film->setName($name);
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
        if ($dateDebut != '') {
            $film->setDateDebut($dateDebut);
        }
        if ($dateFin != '') {
            $film->setDateFin($dateFin);
        }
        if ($stringCinema !== '') {
            $cinema = $entityManager->getRepository(Cinema::class)->findOneBy(['name' => $stringCinema]);
            $film->addCinema($cinema);
        }
        for ($i = 1; $i <= 4; $i++) {
            foreach ($formats as $format) {
                // Récupérer les informations associées à chaque format
                $heureDebutKey = "heure_debut_{$format}_{$i}";
                $heureFinKey = "heure_fin_{$format}_{$i}";
                $priceKey = "price_{$format}_{$i}";

                // Vérifier si les données existent avant d'y accéder
                if (isset($data[$heureDebutKey], $data[$heureFinKey], $data[$priceKey])) {
                    $stringHeureDebut = $data[$heureDebutKey];
                    $stringHeureFin = $data[$heureFinKey];
                    $price = $data[$priceKey];

                    // Convertir les heures en objets DateTime
                    $heureDebut = \DateTime::createFromFormat('H:i', $stringHeureDebut);
                    $heureFin = \DateTime::createFromFormat('H:i', $stringHeureFin);

                    // Vérification des conditions avant de passer à la méthode getSeance
                    if ($heureDebut && $heureFin && $dateDebut && $dateFin && is_numeric($price) && is_numeric($places) && is_numeric($stringSalle)) {
                        // Appeler la méthode getSeance avec les données appropriées
                        $this->getSeance($heureDebut, $heureFin, $price, $dateDebut, $dateFin, ${"salle{$format}"}, $film, $entityManager);
                    }
                }
            }
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
