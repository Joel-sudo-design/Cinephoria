<?php

namespace App\Controller;

use App\Entity\Cinema;
use App\Entity\Film;
use App\Entity\Genre;
use App\Entity\Salle;
use App\Entity\Seance;
use App\Entity\User;
use App\Form\AccountEmployeFormType;
use App\Form\ChangePasswordFormType;
use App\Repository\CinemaRepository;
use App\Repository\GenreRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/administrateur/administration')]
class AdministrationController extends AbstractController
{
    use ResetPasswordControllerTrait;
    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher) {}

    #[Route('', name: 'app_administration')]
    public function index(CinemaRepository $cinemaRepository, GenreRepository $genreRepository): Response {

        // Récupérer les cinémas et les genres
        $cinemas = $cinemaRepository->findAll();
        $genres = $genreRepository->findAll();

        return $this->render('administration/index.html.twig', [
            'controller_name' => 'AdministrationController',
            'cinemas' => $cinemas,
            'genres' => $genres,
        ]);
    }

    #[Route('/film', name: 'app_administration_film')]
    public function Film(EntityManagerInterface $entityManager): Response
    {
        // Récupérer tous les films
        $AllFilms = $entityManager->getRepository(Film::class)->findAll();
        $AllFilmsArray = [];

        foreach ($AllFilms as $film) {
            // Convertir le film en tableau
            $filmArray = $film->toArray();

            // Ajouter l'image si disponible
            if ($film->getImageName() !== null) {
                $filmArray['image'] = $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName();
                $filmArray['image2'] = $this->getParameter('films_images_directory') . '/image_film/' . $film->getImageName();
            } else {
                $filmArray['image'] = $this->getParameter('films_images_directory') . '/image_film/' .'default-image.jpg';
                $filmArray['image2'] = $this->getParameter('films_images_directory') . '/image_film/' .'default-image2.jpg';
            }

            // Ajouter le genre si disponible
            if ($film->getGenre() !== null) {
                $filmArray['genre'] = $film->getGenre()->getName();
            } else {
                $filmArray['genre'] = 'Aucun';
            }

            // Récupérer et ajouter les cinémas
            $cinemasArray = [];
            foreach ($film->getCinema() as $cinema) {
                $cinemasArray[] = $cinema->getName();
            }
            if (!empty($cinemasArray)) {
                $filmArray['cinema'] = $cinemasArray;
            } else {
                $filmArray['cinema'] = 'Aucun';
            }

            // Ajouter les dates de début et de fin si disponibles
            if ($film->getDateDebut() !== null) {
                $filmArray['date_debut'] = $film->getDateDebut()->format('d/m/Y');
            }
            if ($film->getDateFin() !== null) {
                $filmArray['date_fin'] = $film->getDateFin()->format('d/m/Y');
            }

            // Récupérer les séances sur 1 jour
            $date_debut = $film->getDateDebut();
            $film_id = $film->getId();
            $seances = $entityManager->getRepository(Seance::class)->findByFilmId($film_id, $date_debut);

            // Ajouter les séances pour 1 jour
            $seancesArray = [];
            foreach ($seances as $Seance) {
                $seancesArray[] = $Seance->toArray();
            }
            $filmArray['seances'] = $seancesArray ?: [];

            // Récupérer les séances totales
            $seancesTotal = $film->getSeance();
            $reservations = [];
            foreach ($seancesTotal as $seance) {
                $reservations[] = $seance->toArrayReservation();
            }

            // Regrouper les réservations par date
            $reservationsByDate = [];

            foreach ($reservations as $reservation) {
                $date = $reservation['date'];

                // Initialiser le cumul pour cette date si elle n'existe pas encore
                if (!isset($reservationsByDate[$date])) {
                    $reservationsByDate[$date] = 0;
                }

                // Ajouter le nombre de réservations
                $reservationsByDate[$date] += $reservation['reservation'];
                $filmArray['reservations'] = $reservationsByDate;
            }

            // Ajouter le film au tableau final
            $AllFilmsArray[] = $filmArray;
        }

        return new JsonResponse($AllFilmsArray);
    }

    #[Route('/film/create', name: 'app_administration_creation_film')]
    public function CreateFilm(EntityManagerInterface $entityManager): Response
    {
        $film = new Film();
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film created']);
    }

    #[Route('/film/delete', name: 'app_administration_delete_film')]
    public function FilmDelete(Request $request,EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $Id = $data['id'];
        $film = $entityManager->getRepository(Film::class)->find($Id);
        $seances = $film->getSeance();
        if ($seances != null) {
            foreach ($seances as $seance) {
                $reservation = $seance->getReservation();
                foreach ($reservation as $res) {
                    $entityManager->remove($res);
                }
                $entityManager->remove($seance);
            }
        }
        $entityManager->remove($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film deleted']);
    }

    #[Route('/film/validate', name: 'app_administration_validate_film')]
    public function ValidateFilm(Request $request,EntityManagerInterface $entityManager): Response
    {
        $data = $request->request->all();
        $id = $data['id'];
        $film = $entityManager->getRepository(Film::class)->find($id);
        $image = $request->files->get('image');
        $stringGenre = $data['genre'];
        $age = $data['age'];
        $label = $data['label'];
        $name = $data['nom'];
        $stringCinema = $data['cinema'];
        $stringDateDebut = $data['date_debut'];
        $stringDateFin = $data['date_fin'];
        $dateDebut = \DateTime::createFromFormat('Y-m-d', $stringDateDebut);
        $dateFin = \DateTime::createFromFormat('Y-m-d', $stringDateFin);
        $stringSalle = $data['salle'];
        $places = $data['places'];
        $salle3DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '3DX']);
        $salle4DX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => '4DX']);
        $salleIMAX = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => 'IMAX']);
        $salleDolby = $entityManager->getRepository(Salle::class)->findOneBy(['qualite' => 'Dolby']);
        $formats = ['3DX', '4DX', 'IMAX', 'Dolby'];
        $description = $data['description'];
        if ($image) {
            $film->setImageFile($image);
        }
        if ($name != 'Titre du film') {
            $film->setName($name);
        }
        if ($stringGenre != '') {
            $genre = $entityManager->getRepository(Genre::class)->findOneBy(['name' => $stringGenre]);
            $film->setGenre($genre);
        }
        if ($age != '') {
            $film->setAgeMinimum($age);
        }
        $film->setLabel($label);
        if ($dateDebut != '') {
            $film->setDateDebut($dateDebut);
        }
        if ($dateFin != '') {
            $film->setDateFin($dateFin);
        }
        if ($stringCinema !== '') {
            $cinema = $entityManager->getRepository(Cinema::class)->findOneBy(['name' => $stringCinema]);
            $film->addCinema($cinema);
        }
        for ($i = 1; $i <= 4; $i++) {
            foreach ($formats as $format) {
                // Récupérer les informations associées à chaque format
                $heureDebutKey = "heure_debut_{$format}_{$i}";
                $heureFinKey = "heure_fin_{$format}_{$i}";
                $priceKey = "price_{$format}_{$i}";

                // Vérifier si les données existent avant d'y accéder
                if (isset($data[$heureDebutKey], $data[$heureFinKey], $data[$priceKey])) {
                    $stringHeureDebut = $data[$heureDebutKey];
                    $stringHeureFin = $data[$heureFinKey];
                    $price = $data[$priceKey];

                    // Convertir les heures en objets DateTime
                    $heureDebut = \DateTime::createFromFormat('H:i', $stringHeureDebut);
                    $heureFin = \DateTime::createFromFormat('H:i', $stringHeureFin);

                    // Vérification des conditions avant de passer à la méthode getSeance
                    if ($heureDebut && $heureFin && $dateDebut && $dateFin && is_numeric($price) && is_numeric($stringSalle)) {
                        // Appeler la méthode getSeance avec les données appropriées
                        $this->getSeance($heureDebut, $heureFin, $price, $dateDebut, $dateFin, ${"salle{$format}"}, $film, $entityManager);
                    }
                }
            }
        }
        if ($description != 'Description du film') {
            $film->setDescription($description);
        }
        if (is_numeric($stringSalle)) {
            $salle = $entityManager->getRepository(Salle::class)->findOneBy(['id' => $stringSalle]);
            $entityManager->persist($salle);
            $entityManager->flush();
        }
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'film modified']);
    }
    public function getSeance(\DateTime|false $heureDebut, \DateTime|false $heureFin, String $price, \DateTime|false $dateDebut, \DateTime|false $dateFin, ?Salle $salle, ?Film $film, EntityManagerInterface $entityManager): Void
    {
        if (!$heureDebut == null && !$heureFin == null && !$price == null) {
            $dateSeance = clone $dateDebut;
            while ($dateSeance <= $dateFin) {
                $seance = new Seance();
                $seance->setHeureDebut($heureDebut);
                $seance->setHeureFin($heureFin);
                $seance->setHeureFin($heureFin);
                $seance->setDate($dateSeance);
                $seance->setPrice($price);
                $seance->setSalle($salle);
                $seance->setFilm($film);
                $entityManager->persist($seance);
                $entityManager->flush();
                $dateSeance->modify('+1 day');
            }
        }
    }

    #[Route('/film/reset', name: 'app_administration_reset_film')]
    public function ResetFilm(Request $request,EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $film = $entityManager->getRepository(Film::class)->find($id);
        $seances = $film->getSeance();
        $cinemas = $film->getCinema();
        foreach ($seances as $seance) {
            $reservation = $seance->getReservation();
            foreach ($reservation as $res) {
                $entityManager->remove($res);
            }
            $entityManager->remove($seance);
        }
        foreach ($cinemas as $cinema) {
            $film->removeCinema($cinema);
        }
        $film->setDateDebut(null);
        $film->setDateFin(null);
        $film->setName('Titre du film');
        $film->setGenre(null);
        $film->setAgeMinimum('Aucun');
        $film->setLabel(false);
        $film->setDescription('Description du film');
        $entityManager->persist($film);
        $entityManager->flush();
        return new JsonResponse(['status' => 'champs reset']);
    }

    #[Route('/account_employe', name: 'app_administration_account_employe')]
    public function accountEmploye(Request $request,EntityManagerInterface $entityManager, UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository, MailerInterface $mailer): Response
    {
        $employes = $userRepository->findByRole('ROLE_EMPLOYE');

        $user = new User();
        $form = $this->createForm(AccountEmployeFormType::class, $user);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('password')->getData();
            $user->setRoles(['ROLE_EMPLOYE']);
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));
            $user->setVerified(true);
            $entityManager->persist($user);
            $entityManager->flush();
            $this->addFlash('success', 'Le compte est créé');
            return $this->redirectToRoute('app_administration_account_employe');
        }
        $employeId = $request->request->get('employe_id');
        if ($employeId) {
            $employe = $userRepository->find($employeId);
            $email = $employe->getEmail();
            $this->addFlash('successReset', 'Un email a été envoyé à l\'employé');
            return $this->processSendingPasswordResetEmail($email, $mailer );
        }
        return $this->render('administration/accountEmploye.html.twig', [
            'employeForm' => $form,
            'employes' => $employes,
        ]);
    }

    #[Route('/passwordReset', name: 'app_reset')]
    public function resetConfirmed(): Response
    {
        return $this->render('reset_password/confirmation_password_reset.twig', [
            'controller_name' => 'ResetPasswordController',]);
    }

    #[Route('/reset/{token}', name: 'app_reset_password')]
    public function reset(Request $request, UserPasswordHasherInterface $passwordHasher, ?string $token = null): Response
    {
        if ($token) {
            // We store the token in session and remove it from the URL, to avoid the URL being
            // loaded in a browser and potentially leaking the token to 3rd party JavaScript.
            $this->storeTokenInSession($token);

            return $this->redirectToRoute('app_reset_password');
        }

        $token = $this->getTokenFromSession();

        if (null === $token) {
            throw $this->createNotFoundException('Aucun token trouvé dans l\'URL.');
        }

        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            $this->addFlash('reset_password_error', sprintf(
                '%s - %s',
                ResetPasswordExceptionInterface::MESSAGE_PROBLEM_VALIDATE,
                $e->getReason()
            ));

            return $this->redirectToRoute('app_forgot_password_request');
        }

        // The token is valid; allow the user to change their password.
        $form = $this->createForm(ChangePasswordFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $provisionalPassword = $form->get('provisionalPassword')->getData();

            if (!$passwordHasher->isPasswordValid($user, $provisionalPassword)) {

                $this->addFlash('reset_password_error', 'Le mot de passe provisoire est incorrect');
                return $this->redirectToRoute('app_reset_password', ['token' => $token]);

            } else {

                // A password reset token should be used only once, remove it.
                $this->resetPasswordHelper->removeResetRequest($token);

                /** @var string $plainPassword */
                $plainPassword = $form->get('plainPassword')->getData();

                // Encode(hash) the plain password, and set it.
                $user->setPassword($passwordHasher->hashPassword($user, $plainPassword));
                $user->setPasswordMustChange(false);
                $this->entityManager->flush();

                // The session is cleaned up after the password has been changed.
                $this->cleanSessionAfterReset();}

            return $this->redirectToRoute('app_reset');
        }

        return $this->render('reset_password/reset.html.twig', [
            'resetForm' => $form,
        ]);
    }

    private function processSendingPasswordResetEmail(string $emailFormData, MailerInterface $mailer): RedirectResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $emailFormData,]);

        // Do not reveal whether a user account was found or not.
        if (!$user) {
            return $this->redirectToRoute('app_administration_account_employe');
        } else {
            $temporaryPassword = bin2hex(random_bytes(4));
            $passwordHasher = $this->passwordHasher;
            $hashedPassword = $passwordHasher->hashPassword($user, $temporaryPassword);
            $user->setPassword($hashedPassword);
            if (!$user->getPasswordMustChange()) {
                $user->setPasswordMustChange(true);
            }
            $this->entityManager->flush();
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            // If you want to tell the user why a reset email was not sent, uncomment
            // the lines below and change the redirect to 'app_forgot_password_request'.
            // Caution: This may reveal if a user is registered or not.
            //
            // $this->addFlash('reset_password_error', sprintf(
            //     '%s - %s',
            //     ResetPasswordExceptionInterface::MESSAGE_PROBLEM_HANDLE,
            //     $e->getReason()
            // ));

            return $this->redirectToRoute('app_administration_account_employe');
        }

        $email = (new TemplatedEmail())
            ->from(new Address('contact@joeldermont.fr', 'Mot de passe temporaire Cinéphoria'))
            ->to((string) $user->getEmail())
            ->subject('Votre demande de réinitialisation de mot de passe')
            ->htmlTemplate('reset_password/email.html.twig')
            ->context(['resetToken' => $resetToken,
                'temporaryPassword' => $temporaryPassword,]);

        $mailer->send($email);

        // Store the token object in session for retrieval in check-email route.
        $this->setTokenObjectInSession($resetToken);

        return $this->redirectToRoute('app_administration_account_employe');
    }

    #[Route('/reservations', name: 'app_administration_reservations')]
    public function reservations(): Response
    {
        return $this->render('administration/reservations.html.twig');
    }
}

