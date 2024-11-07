<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241107130204 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE film_cinema (film_id INT NOT NULL, cinema_id INT NOT NULL, INDEX IDX_BF7139BE567F5183 (film_id), INDEX IDX_BF7139BEB4CB84B6 (cinema_id), PRIMARY KEY(film_id, cinema_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE film_cinema ADD CONSTRAINT FK_BF7139BE567F5183 FOREIGN KEY (film_id) REFERENCES film (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE film_cinema ADD CONSTRAINT FK_BF7139BEB4CB84B6 FOREIGN KEY (cinema_id) REFERENCES cinema (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE film ADD genre_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE film ADD CONSTRAINT FK_8244BE224296D31F FOREIGN KEY (genre_id) REFERENCES genre (id)');
        $this->addSql('CREATE INDEX IDX_8244BE224296D31F ON film (genre_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE film_cinema DROP FOREIGN KEY FK_BF7139BE567F5183');
        $this->addSql('ALTER TABLE film_cinema DROP FOREIGN KEY FK_BF7139BEB4CB84B6');
        $this->addSql('DROP TABLE film_cinema');
        $this->addSql('ALTER TABLE film DROP FOREIGN KEY FK_8244BE224296D31F');
        $this->addSql('DROP INDEX IDX_8244BE224296D31F ON film');
        $this->addSql('ALTER TABLE film DROP genre_id');
    }
}
