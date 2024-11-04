<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241104080618 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE salle DROP is_reserved_by, DROP is_seen_by');
        $this->addSql('ALTER TABLE seance ADD is_reserved_by VARCHAR(255) DEFAULT NULL, ADD is_seen_by VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE salle ADD is_reserved_by VARCHAR(255) DEFAULT NULL, ADD is_seen_by VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE seance DROP is_reserved_by, DROP is_seen_by');
    }
}
