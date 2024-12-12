<?php

namespace App\Controller;

use App\Entity\Film;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/commandes', name: 'app_commandes_user')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $reservations = $user->getReservations();
        $seance = [];

        foreach ($reservations as $reservation) {
            $seance['seance'] = $reservation->getSeance()->toArray();
            $seance['seance']['sieges_reserves'] = $reservation->getSiege();
            $seance['film'] = $reservation->getSeance()->getFilm()->toArray();
            $imageName = $reservation->getSeance()->getFilm()->getImageName();
            $seance['film']['image'] = $imageName
                ? $this->getParameter('films_images_directory') . '/image_film/' . $imageName
                : null;
            $genreName = $reservation->getSeance()->getFilm()->getGenre()->getName();
            $seance['film']['genre'] = $genreName;
        }

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
            'seance' => $seance,
        ]);
    }
}
