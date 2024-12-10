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
        return $this->render('commandes/index.html.twig', [
            'controller_name' => 'CommandesUserController',
        ]);
    }
}
