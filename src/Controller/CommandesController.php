<?php

namespace App\Controller;

use App\Entity\Avis;
use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/mon_espace/commandes', name: 'app_commandes_user')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $reservations = $user->getReservations();
        $avis = $entityManager->getRepository(Avis::class)->findBy(['user' => $user]);
        $reservationArray = [];

        foreach ($reservations as $reservation) {
            $seance = [];
            $seance['seance'] = $reservation->getSeance()->toArray();

            // Récupérer les heures de début et de fin
            $heureDebut =  $reservation->getSeance()->getHeureDebut();
            $heureFin = $reservation->getSeance()->getHeureFin();

            if ($heureDebut && $heureFin) {
                $diff = $heureDebut->diff($heureFin);

                if ($diff->i === 0) {
                    // Si les minutes sont 0, afficher uniquement les heures
                    $duree = sprintf('%dh', $diff->h);
                } else {
                    // Sinon, afficher heures et minutes
                    $duree = sprintf('%dh %dm', $diff->h, $diff->i);
                }
            } else {
                $duree = null; // En cas de données incorrectes
            }

            // Ajouter la durée au tableau de la séance
            $seance['seance']['duree'] = $duree;

            $seance['reservation_id'] = $reservation->getId();
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

        // Récupération des avis
        foreach ($avis as $avi) {
            $reservationArray[0]['seance']['avis'] = $avi->getDescription();
        }

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
            'reservations' => $reservationArray,
        ]);
    }

    #[Route('/utilisateur/mon_espace/commandes/notation', name: 'app_commandes_user_notation')]
    public function notation(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données d'entrée
        if (empty($data['reservation_id']) || !isset($data['rating'])) {
            return new JsonResponse(['success' => false, 'error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $reservationId = $data['reservation_id'];
        $comment = $data['comment'] ?? '';
        $rating = (int) $data['rating'];

        // Récupération de la réservation
        $reservation = $entityManager->getRepository(Reservation::class)->find($reservationId);
        if (!$reservation) {
            return new JsonResponse(['success' => false, 'error' => 'Reservation not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupération du film associé
        $film = $reservation->getSeance()->getFilm();
        if (!$film) {
            return new JsonResponse(['success' => false, 'error' => 'Film not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $this->getUser();

        // Création de l'avis
        $avis = new Avis();
        $avis->setDescription($comment);
        $avis->setNotation($rating);
        $avis->setUser($user);
        $avis->setFilm($film);

        $entityManager->persist($avis);
        $entityManager->flush();

        return new JsonResponse(['success' => true], Response::HTTP_OK);
    }
}
