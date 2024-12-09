<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CommandesController extends AbstractController
{
    #[Route('/utilisateur/commandes/paiement', name: 'app_commandes_user_paiement')]
    public function index(): Response
    {
        return $this->render('commandes/paiement.html.twig', [
            'controller_name' => 'paiementController',
        ]);
    }
}
