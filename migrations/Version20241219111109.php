<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241219111109 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE seance_cinema (seance_id INT NOT NULL, cinema_id INT NOT NULL, INDEX IDX_ABF61F1CE3797A94 (seance_id), INDEX IDX_ABF61F1CB4CB84B6 (cinema_id), PRIMARY KEY(seance_id, cinema_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE seance_cinema ADD CONSTRAINT FK_ABF61F1CE3797A94 FOREIGN KEY (seance_id) REFERENCES seance (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE seance_cinema ADD CONSTRAINT FK_ABF61F1CB4CB84B6 FOREIGN KEY (cinema_id) REFERENCES cinema (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE seance DROP FOREIGN KEY FK_DF7DFD0EB4CB84B6');
        $this->addSql('DROP INDEX IDX_DF7DFD0EB4CB84B6 ON seance');
        $this->addSql('ALTER TABLE seance DROP cinema_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE seance_cinema DROP FOREIGN KEY FK_ABF61F1CE3797A94');
        $this->addSql('ALTER TABLE seance_cinema DROP FOREIGN KEY FK_ABF61F1CB4CB84B6');
        $this->addSql('DROP TABLE seance_cinema');
        $this->addSql('ALTER TABLE seance ADD cinema_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE seance ADD CONSTRAINT FK_DF7DFD0EB4CB84B6 FOREIGN KEY (cinema_id) REFERENCES cinema (id)');
        $this->addSql('CREATE INDEX IDX_DF7DFD0EB4CB84B6 ON seance (cinema_id)');
    }
}
