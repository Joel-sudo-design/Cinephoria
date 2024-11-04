<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241104090842 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE film ADD label TINYINT(1) DEFAULT NULL, ADD age_minimum VARCHAR(255) DEFAULT NULL, ADD notation INT DEFAULT NULL');
        $this->addSql('ALTER TABLE salle ADD qualite VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE seance DROP qualite');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE film DROP label, DROP age_minimum, DROP notation');
        $this->addSql('ALTER TABLE salle DROP qualite');
        $this->addSql('ALTER TABLE seance ADD qualite VARCHAR(255) NOT NULL');
    }
}
