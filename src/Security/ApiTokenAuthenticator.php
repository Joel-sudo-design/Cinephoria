<?php
namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class ApiTokenAuthenticator extends AbstractAuthenticator
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function supports(Request $request): ?bool
    {
        // Vérifie si un token est présent dans le header Authorization
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
    {
        // Récupère le token depuis le header Authorization
        $token = $request->headers->get('Authorization');

        if (!$token) {
            throw new AuthenticationException('No API token provided');
        }

        // Retourne un Passport avec un UserBadge pour valider l'utilisateur
        return new SelfValidatingPassport(new UserBadge($token, function ($token) {
            return $this->userRepository->findOneBy(['apiToken' => $token]);
        }));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        // Authentification réussie, continuez la requête
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(['error' => 'Authentication failed'], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
