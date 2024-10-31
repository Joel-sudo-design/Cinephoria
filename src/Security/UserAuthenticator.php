<?php

namespace App\Security;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\SecurityRequestAttributes;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class UserAuthenticator extends AbstractLoginFormAuthenticator
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = 'app_login';
    private $userProvider;

    public function __construct(private UrlGeneratorInterface $urlGenerator, UserProviderInterface $userProvider, private AuthenticationUtils $authenticationUtils, private LoggerInterface $logger)
    {
        $this->userProvider = $userProvider;
    }

    public function authenticate(Request $request): Passport
    {
        $email = $request->getPayload()->getString('email');
        $request->getSession()->set(SecurityRequestAttributes::LAST_USERNAME, $email);
        $user = $this->userProvider->loadUserByIdentifier($email);

        $password = $request->getPayload()->getString('password');

        if ($user->getPasswordMustChange()) {
            throw new AuthenticationException('Mot de passe provisoire généré');
        }
        if (!password_verify($password, $user->getPassword())) {
            throw new AuthenticationException('Mot de passe incorrect');
        }

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($request->getPayload()->getString('password')),
            [
                new CsrfTokenBadge('authenticate', $request->getPayload()->getString('_csrf_token')),
            ]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        if ($targetPath = $this->getTargetPath($request->getSession(), $firewallName)) {
            return new RedirectResponse($targetPath);
        }

        $user = $token->getRoleNames();
        if ($user == ['ROLE_ADMIN', 'ROLE_USER']) {
            return new RedirectResponse($this->urlGenerator->generate('app_accueil_admin'));
        } else if ($user == ['ROLE_EMPLOYE','ROLE_USER']) {
            return new RedirectResponse($this->urlGenerator->generate('app_accueil_employe'));
        } else
            return new RedirectResponse($this->urlGenerator->generate('app_accueil_user'));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        if ($exception->getMessage() === 'Mot de passe provisoire généré') {
            $request->getSession()->set('authentication_error', 'Le mot de passe doit être changé, consultez votre boîte mail. Si vous n\'avez pas reçu de mail, contactez-nous');
        }
        else if ($exception->getMessage() === 'Mot de passe incorrect') {
            $request->getSession()->set('authentication_error', 'Mot de passe incorrect');
        } else {
            $request->getSession()->set('authentication_error', 'Email incorrect');
        }
        return new RedirectResponse($this->getLoginUrl($request));
    }

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }
}
