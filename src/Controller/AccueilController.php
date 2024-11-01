<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
    public function index(): Response
    {
        return $this->render('accueil/index.html.twig', [
            'controller_name' => 'AccueilController',
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
}
