<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/commandes', name: 'app_commandes_user')]
    public function index(): Response
    {
        $user = $this->getUser();
        $reservations = $user->getReservations();
        $reservationArray = [];

        foreach ($reservations as $reservation) {
            $seance = [];
            $seance['seance'] = $reservation->getSeance()->toArray();

            // Récupérer les heures de début et de fin
            $heureDebut =  $reservation->getSeance()->getHeureDebut();
            $heureFin = $reservation->getSeance()->getHeureFin();

            // Calculer la durée
            if ($heureDebut && $heureFin) {
                $diff = $heureDebut->diff($heureFin);
                $duree = sprintf('%dh %dm', $diff->h, $diff->i);
            } else {
                $duree = null; // En cas de données incorrectes
            }

            // Ajouter la durée au tableau de la séance
            $seance['seance']['duree'] = $duree;
            $seance['seance']['sieges_reserves'] = $reservation->getSiege();
            $seance['seance']['qrCode'] = $reservation->getQrCode();
            $seance['film'] = $reservation->getSeance()->getFilm()->toArray();
            $imageName = $reservation->getSeance()->getFilm()->getImageName();
            $seance['film']['image'] = $imageName
                ? $this->getParameter('films_images_directory') . '/image_film/' . $imageName
                : null;
            $genreName = $reservation->getSeance()->getFilm()->getGenre()->getName();
            $seance['film']['genre'] = $genreName;
            $reservationArray[] = $seance;
        }

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
            'reservations' => $reservationArray,
        ]);
    }
}
