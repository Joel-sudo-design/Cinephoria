<?php

namespace App\Entity;

use App\Repository\FilmRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FilmRepository::class)]
class Film
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_debut = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_fin = null;

    #[ORM\Column(type: 'boolean',nullable: true)]
    private ?bool $label = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $age_minimum = null;

    #[ORM\ManyToOne(inversedBy: 'films')]
    private ?Genre $genre = null;

    /**
     * @var Collection<int, cinema>
     */
    #[ORM\ManyToMany(targetEntity: Cinema::class, inversedBy: 'films')]
    private Collection $cinema;

    /**
     * @var Collection<int, seance>
     */
    #[ORM\OneToMany(targetEntity: Seance::class, mappedBy: 'film')]
    private Collection $seance;

    public function __construct()
    {
        $this->cinema = new ArrayCollection();
        $this->seance = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateDebut(): ?\DateTimeInterface
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTimeInterface $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        return $this->date_fin;
    }

    public function setDateFin(\DateTimeInterface $date_fin): static
    {
        $this->date_fin = $date_fin;

        return $this;
    }

    public function isLabel(): ?bool
    {
        return $this->label;
    }

    public function setLabel(?bool $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getAgeMinimum(): ?string
    {
        return $this->age_minimum;
    }

    public function setAgeMinimum(?string $age_minimum): static
    {
        $this->age_minimum = $age_minimum;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'label' => $this->isLabel(),
            'age_minimum' => $this->getAgeMinimum()
        ];
    }

    public function getGenre(): ?genre
    {
        return $this->genre;
    }

    public function setGenre(?genre $genre): static
    {
        $this->genre = $genre;

        return $this;
    }

    /**
     * @return Collection<int, cinema>
     */
    public function getCinema(): Collection
    {
        return $this->cinema;
    }

    public function addCinema(cinema $cinema): static
    {
        if (!$this->cinema->contains($cinema)) {
            $this->cinema->add($cinema);
        }

        return $this;
    }

    public function removeCinema(cinema $cinema): static
    {
        $this->cinema->removeElement($cinema);

        return $this;
    }

    /**
     * @return Collection<int, seance>
     */
    public function getSeance(): Collection
    {
        return $this->seance;
    }

    public function addSeance(seance $seance): static
    {
        if (!$this->seance->contains($seance)) {
            $this->seance->add($seance);
            $seance->setFilm($this);
        }

        return $this;
    }

    public function removeSeance(seance $seance): static
    {
        if ($this->seance->removeElement($seance)) {
            // set the owning side to null (unless already changed)
            if ($seance->getFilm() === $this) {
                $seance->setFilm(null);
            }
        }

        return $this;
    }

}
