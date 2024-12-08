<?php

namespace App\Controller;

use App\Repository\FilmRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
public function index(EntityManagerInterface $entityManager, FilmRepository $filmRepository): Response
{
    // Supposons que vous ayez déjà calculé $lastWednesday
    $lastWednesday = $this->getLastWednesday();

    // Récupérer les films filtrés
    $films = $filmRepository->findFilmsWithLastWednesdayBetweenDates($lastWednesday);

    // Si aucun film n'est trouvé, récupérer tous les films
    if (empty($films)) {
        $films = $filmRepository->findAll();  // Récupérer tous les films
    }

    $filmsArray = [];
    foreach ($films as $film) {
        $filmsArray[] = [
            'image' => $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName()
        ];
    }

    return $this->render('accueil/index.html.twig', [
        'controller_name' => 'AccueilController',
        'films' => $filmsArray,
    ]);
}
    #[Route('/utilisateur/accueil', name: 'app_accueil_user')]
    public function indexUser(): Response
    {
        return $this->render('accueil/user.html.twig', [
            'controller_name' => 'AccueilUserController',
        ]);
    }
    #[Route('/employe/accueil', name: 'app_accueil_employe')]
    public function indexEmploye(): Response
    {
        return $this->render('accueil/employe.html.twig', [
            'controller_name' => 'AccueilEmployeController',
        ]);
    }
    #[Route('/administrateur/accueil', name: 'app_accueil_admin')]
    public function indexAdmin(): Response
    {
        return $this->render('accueil/admin.html.twig', [
            'controller_name' => 'AccueilAdminController',
        ]);
    }
    // Fonction pour calculer le dernier mercredi
    private function getLastWednesday(): \DateTime
    {
        $currentDate = new \DateTime();

        // Trouver le dernier mercredi (le jour 3 de la semaine)
        while ($currentDate->format('N') != 3) {
            $currentDate->modify('-1 day');
        }

        return $currentDate;
    }
}
