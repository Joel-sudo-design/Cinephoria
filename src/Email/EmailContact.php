<?php

namespace App\Email;

use App\Entity\User;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;

class EmailContact
{
    public function __construct(private MailerInterface $mailer)
    {
    }

    public function sendEmailContact(String $username,String $object, String $description, TemplatedEmail $email): void
    {
        $context = $email->getContext();
        $usernameMail = $username;
        $objectMail = $object;
        $descriptionMail = $description;
        $context['username'] = $usernameMail;
        $context['object'] = $objectMail;
        $context['description'] = $descriptionMail;
        $email->context($context);
        $this->mailer->send($email);
    }

}

