<?php

namespace App\Entity;

use App\Repository\SalleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SalleRepository::class)]
class Salle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $number = null;

    #[ORM\Column]
    private ?int $places = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $is_reserved_by = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $is_seen_by = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): static
    {
        $this->number = $number;

        return $this;
    }

    public function getPlaces(): ?int
    {
        return $this->places;
    }

    public function setPlaces(int $places): static
    {
        $this->places = $places;

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
}
