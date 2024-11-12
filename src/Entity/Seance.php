<?php

namespace App\Entity;

use App\Repository\SeanceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SeanceRepository::class)]
class Seance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $heure_debut = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $heure_fin = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $is_reserved_by = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $is_seen_by = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Salle $salle = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(inversedBy: 'seance')]
    private ?Film $film = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHeureDebut(): ?\DateTimeInterface
    {
        return $this->heure_debut;
    }

    public function setHeureDebut(\DateTimeInterface $heure_debut): static
    {
        $this->heure_debut = $heure_debut;

        return $this;
    }

    public function getHeureFin(): ?\DateTimeInterface
    {
        return $this->heure_fin;
    }

    public function setHeureFin(\DateTimeInterface $heure_fin): static
    {
        $this->heure_fin = $heure_fin;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getIsReservedBy(): ?string
    {
        return $this->is_reserved_by;
    }

    public function setIsReservedBy(?string $is_reserved_by): static
    {
        $this->is_reserved_by = $is_reserved_by;

        return $this;
    }

    public function getIsSeenBy(): ?string
    {
        return $this->is_seen_by;
    }

    public function setIsSeenBy(?string $is_seen_by): static
    {
        $this->is_seen_by = $is_seen_by;

        return $this;
    }

    public function getSalle(): ?salle
    {
        return $this->salle;
    }

    public function setSalle(?salle $salle): static
    {
        $this->salle = $salle;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getFilm(): ?Film
    {
        return $this->film;
    }

    public function setFilm(?Film $film): static
    {
        $this->film = $film;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'salle' => $this->salle->getQualite(),
            'heure_debut_seance' => $this->heure_debut->format('H:i'),
            'heure_fin_seance' => $this->heure_fin->format('H:i'),
            'price' => $this->price
        ];
    }

}
