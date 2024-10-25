<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AccueilEmployeController extends AbstractController
{
    #[Route('/accueil/employe', name: 'app_accueil_employe')]
    public function index(): Response
    {
        return $this->render('accueil_employe/index.html.twig', [
            'controller_name' => 'AccueilEmployeController',
        ]);
    }
}
