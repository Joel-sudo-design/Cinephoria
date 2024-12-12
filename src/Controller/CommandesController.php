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
            $seance['reservation'] = $reservation->getSeance()->toArray();
            $seance['films'] = $reservation->getSeance()->getFilm()->toArray();
        }

        dump($seance);
        die();

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
        ]);
    }
}
