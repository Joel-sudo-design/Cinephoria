<?php

namespace App\Controller;

use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/mon_espace/commandes', name: 'app_commandes_user')]
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

        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
            'reservations' => $reservationArray,
        ]);
    }

    #[Route('/utilisateur/mon_espace/commandes/notation', name: 'app_commandes_user_notation')]
    public function notation(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $reservationId = $data['reservation_id'] ?? null;
        $comment = $data['comment'] ?? '';
        $rating = $data['rating'] ?? null;
        $reservation = $entityManager->getRepository(Reservation::class)->find($reservationId);
        $filmId = $reservation->getSeance()->getFilm()->getId();
        $user = $this->getUser();
        $userId = $user->getId();

        $result = [
            'comment' => $comment,
            'rating' => $rating,
            'filmId' => $filmId,
            'userId' => $userId
        ];

        return new Response(
            json_encode([
                'success' => true,
                'message' => 'Les données ont été reçues avec succès.',
                'data' => $result,
            ]),
            Response::HTTP_OK,
            ['Content-Type' => 'application/json']
        );
    }
}
