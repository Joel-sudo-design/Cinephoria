<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AccueilUserController extends AbstractController
{
    #[Route('/accueil/user', name: 'app_accueil_user')]
    public function index(): Response
    {
        return $this->render('accueil_user/index.html.twig', [
            'controller_name' => 'AccueilUserController',
        ]);
    }
}
