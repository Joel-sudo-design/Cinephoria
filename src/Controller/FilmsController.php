<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FilmsController extends AbstractController
{
    #[Route('/films', name: 'app_films')]
    public function index(): Response
    {
        return $this->render('films/index.html.twig', [
            'controller_name' => 'FilmsController',
        ]);
    }

    #[Route('/utilisateur/films', name: 'app_films_user')]
    public function indexUser(): Response
    {
        return $this->render('films/user.html.twig', [
            'controller_name' => 'FilmsController',
        ]);
    }
    #[Route('/utilisateur/films', name: 'app_films_employe')]
    public function indexEmploye(): Response
    {
        return $this->render('films/employe.html.twig', [
            'controller_name' => 'FilmsController',
        ]);
    }
    #[Route('/administrateur/films', name: 'app_films_admin')]
    public function indexAdmin(): Response
    {
        return $this->render('films/admin.html.twig', [
            'controller_name' => 'FilmsController',
        ]);
    }
}
