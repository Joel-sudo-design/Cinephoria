<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private array $siege_reserve = [];

    #[ORM\ManyToOne(inversedBy: 'reservation')]
    private ?Seance $seance = null;

    #[ORM\ManyToOne(inversedBy: 'reservation')]
    private ?User $user = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $qrCode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSiege(): array
    {
        return $this->siege_reserve;
    }

    public function setSiege(array $siege): void
    {
        $this->siege_reserve = $siege;
    }

    public function getSeance(): ?Seance
    {
        return $this->seance;
    }

    public function setSeance(?Seance $seance): static
    {
        $this->seance = $seance;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'siege_reserve' => $this->siege_reserve,
        ];
    }

    public function getUser(): ?user
    {
        return $this->user;
    }

    public function setUser(?user $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getQrCode(): ?string
    {
        return $this->qrCode;
    }

    public function setQrCode(?string $qrCode): static
    {
        $this->qrCode = $qrCode;

        return $this;
    }
}
