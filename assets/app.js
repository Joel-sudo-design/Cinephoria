import './styles/app.css';

//Active Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.fr.min.js';

//Active Flatpickr
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

//Active jQuery
const $ = require('jquery');
window.$ = window.jQuery = $;

//Autoload images
const imagesContext = require.context('../assets/images', true, /\.(png|jpg|jpeg|gif|ico|svg|webp)$/);
imagesContext.keys().forEach(imagesContext);

//Axios
const axios = require('axios');
axios.defaults.withCredentials = true;

//Script
    $(document).ready(function() {
        //Navbar & footer
        function configureNavbarBehavior() {
            // Navbar Top - Ouverture
            $('#navbar-togglerTop').click(function() {
                $('#offcanvasNavbarTop').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
                $('#logo').hide();
                $('#offcanvas-bodyTop').removeClass('row');
                $('#navbarLeft').removeClass('col-5').addClass('col-12');
                $('#navbarRight').removeClass('col-5').addClass('col-12');
            });

            // Navbar Bottom - Ouverture
            $('#navbar-togglerBottom').click(function() {
                $('#offcanvasNavbarBottom').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
                $('#col-2-bottom').remove();
            });

            // Navbar Top - Fermeture
            $('#offcanvasNavbarTop').on('hidden.bs.offcanvas', function () {
                $('#offcanvasNavbarTop').css("background", "");
                $('#logo').show();
                $('#offcanvas-bodyTop').addClass('row');
                $('#navbarLeft').removeClass('col-12').addClass('col-5');
                $('#navbarRight').removeClass('col-12').addClass('col-5');
            });

            // Navbar Bottom - Fermeture
            $('#offcanvasNavbarBottom').on('hidden.bs.offcanvas', function () {
                $('#offcanvasNavbarBottom').css("background", "");
                $('#col-5-bottom').after('<div id="col-2-bottom" class="col-2" style="width: 7.5rem"></div>');
            });
        }
        //Appel de la fonction pour configurer le comportement des navbars
        configureNavbarBehavior();

        //Page de connexion et d'inscription dans mon espace
        // Fonction principale pour initialiser les fonctionnalités
        function initializeFormFeatures() {
            // Fonction pour basculer l'affichage du mot de passe
            function togglePasswordVisibility(toggleButtonId, passwordFieldId) {
                $(toggleButtonId).on('click', function () {
                    const passwordField = $(passwordFieldId);
                    const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                    passwordField.attr('type', type);
                    $(this).toggleClass('bi-eye bi-eye-slash');
                });
            }

            // Appliquer la fonction aux différents champs
            togglePasswordVisibility('#togglePassword', '#password');
            togglePasswordVisibility('#toggleConfirmPassword', '#confirmPassword');
            togglePasswordVisibility('#toggleProvisionalPassword', '#provisional-password');

            // Vérification de la case à cocher des conditions générales d'utilisation
            $('.btn-register').click(function (event) {
                const checkbox = $("input[name='registration_form[agreeTerms]']");
                const message = $('.checkbox-error');

                if (!checkbox.is(':checked')) {
                    event.preventDefault();
                    message.show();
                } else {
                    message.hide();
                }
            });
        }

        //Page accueil
        function resizeCarrousel() {
            const carousel = document.getElementById('carouselExample');
            const imageContainers = carousel.querySelectorAll('.carousel-inner .image-carousel');
            const totalImages = imageContainers.length;

            let newWidth = 75; // Largeur de base pour 7 images

            // Si moins de 7 images, ajuster la largeur proportionnellement
            if (totalImages < 7) {
                newWidth = 75 * (totalImages / 7); // Proportionnellement à 75%
            }

            // Appliquer la nouvelle largeur au carrousel
            carousel.style.width = `${newWidth}%`;

            // Calculer la largeur des images pour qu'elles tiennent sur une ligne
            const imageWidthPercentage = 100 / Math.min(totalImages, 7); // Max 7 images par ligne

            imageContainers.forEach((container) => {
                const image = container.querySelector('img');
                if (image) {
                    container.style.flex = `0 0 ${imageWidthPercentage}%`; // Ajuster la largeur
                    image.style.width = '100%'; // S'assurer que l'image remplit son conteneur
                    image.style.height = 'auto'; // Conserver les proportions
                    image.style.objectFit = 'cover'; // Ajuster l'image au conteneur sans déformation
                }
            });
        }

        //Page Films
        //Fonction pour affichage du badge age minimum
        function displayAgeBadge(film) {
            const ageFilm = $('#age-' + film.id).closest('.d-flex');
            // Ciblez chaque badge d'âge à partir du conteneur
            const ageBadgePublic = ageFilm.find('.age-badge-public');
            const ageBadge12 = ageFilm.find('.age-badge-12');
            const ageBadge16 = ageFilm.find('.age-badge-16');
            const ageBadge18 = ageFilm.find('.age-badge-18');
            // Logique de gestion des classes pour afficher/masquer les badges d'âge
            if (film.age_minimum === '12') {
                ageBadge12.removeClass('d-none');
                ageBadge16.addClass('d-none');
                ageBadge18.addClass('d-none');
                ageBadgePublic.addClass('d-none');
            } else if (film.age_minimum === '16') {
                ageBadge16.removeClass('d-none');
                ageBadge12.addClass('d-none');
                ageBadge18.addClass('d-none');
                ageBadgePublic.addClass('d-none');
            } else if (film.age_minimum === '18') {
                ageBadge18.removeClass('d-none');
                ageBadge12.addClass('d-none');
                ageBadge16.addClass('d-none');
                ageBadgePublic.addClass('d-none');
            } else {
                ageBadgePublic.removeClass('d-none');
                ageBadge12.addClass('d-none');
                ageBadge16.addClass('d-none');
                ageBadge18.addClass('d-none');
            }
        }
        //Fonction pour charger les séances selon la date
        function updateModalAndSessions(filmId, selectedDate, updateDays = true) {
                    // Vider les conteneurs avant de les remplir
                    const seancesContainer = $('#date-seance-' + filmId);
                    const modalContainer = $('#modal-date-seance-' + filmId);
                    const cinemaId = $('#cinema-input').val();
                    seancesContainer.empty();

                    // Ajouter un spinner de chargement
                    const spinner = `
                        <div class="text-center my-3">
                            <div class="spinner-border" style="color: #6A73AB" role="status">
                                <span class="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    `;
                    seancesContainer.html(spinner);

                    // Si updateDays est vrai, préparer les 7 prochains jours
                    if (updateDays) {
                        const selectedDateObj = new Date(selectedDate); // Date dans le format "mois/jour"
                        const days = [];
                        for (let i = 0; i < 7; i++) {
                            const nextDay = new Date(selectedDateObj);
                            nextDay.setDate(selectedDateObj.getDate() + i);
                            days.push(nextDay.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'}));
                        }

                        // Mettre à jour le conteneur des dates dans la modale
                        modalContainer.html(
                            days.map(day => `<div class="col clickable-day">${day}</div>`).join('')
                        );
                    }

                    // Convertir la date sélectionnée en objet Date pour comparaison
                    const selectedDateObj = new Date(selectedDate); // La date est déjà dans le format "mois/jour"
                    const selectedDateFormatted = selectedDateObj.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });

                    // Ajouter la classe active pour le jour correspondant
                    modalContainer.find('.clickable-day').each(function () {
                        const dayText = $(this).text().trim(); // Récupérer le texte au format "jour/mois"

                        // Ajouter l'année courante à la date inversée
                        const currentYear = new Date().getFullYear(); // Récupérer l'année actuelle
                        const selectedDateWithYear = `${dayText}/${currentYear}`; // Créer la date complète "YYYY-MM-DD"
                        if (selectedDateWithYear === selectedDateFormatted) {
                            $(this).addClass('active');
                        } else {
                            $(this).removeClass('active');
                        }
                    });

                    // Charger les séances correspondantes via AJAX (Axios)
                    axios.post('/films/seances', {filmId,cinemaId})
                        .then(response => {
                            const seances = response.data; // Liste des séances par date

                            // Trouver les séances correspondant à la date sélectionnée
                            const seancesForSelectedDate = seances.find(date => date.date === selectedDateFormatted);

                            // Si des séances existent pour la date sélectionnée
                            if (seancesForSelectedDate && seancesForSelectedDate.seances.length > 0) {
                                // Afficher les séances
                                seancesContainer.html(seancesForSelectedDate.seances.map(seance => `
                                    <div class="col-6">
                                        <div class="uniform-block fs-5">
                                            <div id="btn-modal-reservation-${seance.id}" class="btn-modal-reservation" style="cursor: pointer">
                                                <div class="row justify-content-center align-items-center p-3">
                                                    <div class="col-3">VF</div>
                                                    <div class="col-6 d-flex flex-column text-center">
                                                        <span>${seance.heureDebut}</span>
                                                        <span>(fin ${seance.heureFin})</span>
                                                    </div>
                                                    <div class="col-3">${seance.format}</div>
                                                </div>
                                                <div class="row text-center p-3">
                                                    <div class="col-12">
                                                        <div class="salle mb-3 fs-5">${seance.salle}</div>
                                                        <div>Tarif: ${seance.tarif}€</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join(''));
                            } else {
                                // Afficher un message si aucune séance n'est disponible
                                seancesContainer.html('<div class="col-12 text-center my-3" style="color:#6A73AB">Aucune séance disponible pour cette date.</div>');
                            }
                            // Gestion du clic sur le bouton de réservation
                            $('.btn-modal-reservation').click(function () {
                                // Récupérer l'id complet de l'élément
                                const fullId = $(this).attr('id');

                                // Extraire les id de la séance et du cinéma
                                const idParts = fullId.split('-');

                                const seanceId = idParts[3];
                                // Rediriger vers la page de réservation avec les informations nécessaires
                                window.location.href = `/reservation?filmId=${filmId}&seanceId=${seanceId}&cinemaId=${cinemaId}&date=${selectedDate}`;
                            });
                        })
                        .catch(error => {
                            console.error('Erreur lors du chargement des séances:', error);
                            seancesContainer.html('<div class="col-12 text-center text-danger">Erreur de chargement.</div>');
                        });
        }
        //Fonction pour charger les séances avec le Datepicker selon la date choisie
        function initializeDatepicker(filmId) {
            const $datepicker = $(`#datepicker-${filmId}`);
            const $calendarIcon = $(`#icon-calendar-${filmId}`);
            const $clearIcon = $(`#close-icon-date-${filmId}`);
            const $dateSeance = $(`#date-seance-${filmId}`);
            const $modalDateSeance = $(`#modal-date-seance-${filmId}`);

            // Initialisation du datepicker
            $datepicker.datepicker({
                format: "dd/mm/yyyy",
                orientation: "bottom",
                language: "fr",
                autoclose: true
            }).on('changeDate', function () {
                // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                $calendarIcon.addClass('d-none');
                $clearIcon.removeClass('d-none');
                const selectedDate = $(this).val();
                const [day, month, year] = selectedDate.split('/');
                const formattedDate = `${year}-${month}-${day}`;

                // Charger les séances pour la date sélectionnée
                updateModalAndSessions(filmId, formattedDate);
            });

            // Gestion du clic sur l'icône de croix
            $clearIcon.on('click', function () {
                // Réinitialiser la date
                $datepicker.datepicker('update', '').val('');
                $calendarIcon.removeClass('d-none');
                $clearIcon.addClass('d-none');
                $dateSeance.empty();
                $modalDateSeance.empty();
            });

            // Gestion des effets de survol
            [$calendarIcon, $clearIcon].forEach($icon => {
                $icon.on('mouseenter focus', function () {
                    $datepicker.addClass('btn-hover');
                    $icon.addClass('btn-hover');
                }).on('mouseleave blur', function () {
                    $datepicker.removeClass('btn-hover');
                    $icon.removeClass('btn-hover');
                });
            });

            // Ouvrir le calendrier au clic sur l'icône calendrier
            $calendarIcon.on('click', function () {
                $datepicker.focus();
            });
        }
        //Fonction pour initialiser le modal et le datepicker avec la date du jour
        function initializeModalAndDatepicker(filmId, updateSessionsCallback) {
            // Ajout du gestionnaire d'événements pour ouvrir le modal et initialiser la date
            $(`a[data-bs-toggle="modal"][data-bs-target="#modal-${filmId}"]`).on('click', function () {
                // Obtenir la date du jour
                const today = new Date();
                const day = ("0" + today.getDate()).slice(-2); // Ajouter un zéro si nécessaire
                const month = ("0" + (today.getMonth() + 1)).slice(-2); // Ajouter un zéro si nécessaire
                const year = today.getFullYear();
                const todayFormatted = `${day}/${month}/${year}`;
                const formattedDate = `${year}-${month}-${day}`;
                const dayFormatted = `${day}/${month}`;

                // Appeler la fonction de mise à jour des séances
                updateSessionsCallback(filmId, formattedDate);

                // Mettre à jour la valeur du datepicker
                $(`#datepicker-${filmId}`).datepicker('setDate', todayFormatted);

                // Gérer l'icône de calendrier et de suppression
                $(`#icon-calendar-${filmId}`).addClass('d-none');
                $(`#close-icon-date-${filmId}`).removeClass('d-none');

                // Ajouter la classe active pour le jour correspondant
                $(`#modal-date-seance-${filmId} .clickable-day`).each(function () {
                    // Récupérer la date affichée dans cet élément
                    const dayText = $(this).text().trim(); // Extrait "jour/mois"

                    // Ajouter la classe active si la date correspond
                    if (dayText === dayFormatted) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            });
        }
        //Fonction pour générer le template HTML d'une carte de film
        function generateFilmCardHTML(film) {
            return `
                    <div class="col-auto card" style="width: 12rem">
                        <div class="position-relative">
                            <i id="heart-${film.id}" class="bi bi-heart-fill position-absolute fs-3 text-warning d-none z-3" style="top:1%; right: 5%"></i> 
                            <a class="card-image-film" href="" data-bs-toggle="modal" data-bs-target="#modal-${film.id}">
                              <img src="${film.image}" class="card-img-top" alt="image" />
                            </a>
                        </div>
                        <div class="card-body p-0 py-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <!-- Titre du film -->
                                <div id="age-${film.id}" class="card-title m-0 fs-5">${film.name}</div>
                                <!-- Badges -->
                                <div class="d-flex">
                                    <span class="age-badge-public d-none mx-2">
                                        <div>tout</div>
                                        <div>public</div>
                                    </span>
                                    <span class="age-badge-12 d-none mx-2">12+</span>
                                    <span class="age-badge-16 d-none mx-2">16+</span>
                                    <span class="age-badge-18 d-none mx-2">18+</span>
                                </div>
                            </div>
                            <div class="card-title m-0 fs-6">${film.genre}</div>
                            <p class="card-text m-0 text-warning my-2">
                                <i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                            </p>
                            <div class="accordion accordion-flush">
                                <div class="accordion-item">
                                    <div class="accordion-header">
                                        <button id="btn-description-${film.id}" class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                    </div>
                                    <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                        <div class="accordion-body p-0">${film.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Modal-->
                    <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-keyboard="false" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content seances">
                                <div class="modal-header position-relative header-seances" style="border: none">
                                    <div class="modal-title w-75 position-absolute text-center fs-3 fw-semibold" style="left:50%; transform: translateX(-50%)">${film.name}</div>
                                    <button type="button" class="btn-close btn-close-seances" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body modal-admin row justify-content-center m-0 p-3">
                                    <div class="row justify-content-center align-items-center mb-4">
                                        <div class="col-12 d-flex justify-content-center align-items-center">
                                            <div class="position-relative">
                                                <input type="text" class="btn-date" id="datepicker-${film.id}" placeholder="Date" readonly data-film-id="${film.id}">
                                                <label for="datepicker-${film.id}" class="d-none"></label>
                                                <span class="bi bi-calendar" id="icon-calendar-${film.id}"></span>
                                                <span class="bi bi-x-circle d-none" id="close-icon-date-${film.id}"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="modal-date-seance-${film.id}" class="row text-center"></div>
                                    <div id="loading-spinner-seances-${film.id}" class="row justify-content-center align-content-center d-none my-3">
                                        <div class="spinner-border" role="status" style="color: #6A73AB;">
                                             <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div id="date-seance-${film.id}" class="row text-center mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }
        //Fonction pour Gérer le clic sur les jours pour les séances
        function handleDateClick(filmId) {
            // Ajouter un gestionnaire de clic pour chaque jour
            $(`#modal-date-seance-${filmId}`).on('click', '.clickable-day', function () {
                // Récupérer la date de l'élément cliqué
                const selectedDate = $(this).text().trim();

                // Inverser la date du format "jour/mois" vers "mois/jour"
                const dateParts = selectedDate.split('/'); // Découper la date par "/"
                const invertedDate = `${dateParts[1]}/${dateParts[0]}`; // Inverser jour et mois

                // Ajouter l'année courante à la date inversée
                const currentYear = new Date().getFullYear(); // Récupérer l'année actuelle
                const selectedDateWithYear = `${currentYear}-${invertedDate}`; // Créer la date complète "YYYY-MM-DD"

                // Activer le jour sélectionné
                $(this).addClass('active').siblings().removeClass('active');

                // Mettre à jour les séances pour ce jour avec la date inversée et l'année ajoutée
                updateModalAndSessions(filmId, selectedDateWithYear, false); // Ne pas mettre à jour les 7 jours
            });
        }
        // Disable click image si pas de cinéma sélectionné
        function validateCinemaSelection(filmId) {
            const cinemaSelected = $('#cinema-input').val();
            const $images = $('.card-image-film');

            if (!cinemaSelected) {
                // Désactiver les images
                $images.addClass('disabled');
                // Bloquer l'affichage du modal associé au film
                $('#modal-' + filmId).on('show.bs.modal', function (e) {
                    e.preventDefault(); // Empêche l'affichage du modal
                });
            } else {
                // Activer les images
                $images.removeClass('disabled');
            }
        }

        //Affichage de tous les films
        function film() {
            // Vider le conteneur des films
            $('#film-container-public').empty();
            // Afficher le spinner de chargement
            $('#loading-spinner').removeClass('d-none');
            // Requête Axios pour récupérer les films par défaut
            axios.get('/films/loading')
            .then(response => {
                                    // Parcourir les films retournés par la requête
                                    const films = response.data;
                                    $.each(films, function (index, film) {
                                        // Ajouter chaque film dans le conteneur
                                        const filmHTML = generateFilmCardHTML(film);
                                        $('#film-container-public').append(filmHTML);

                                        // Désactiver le clic sur les images si aucun cinéma n'est sélectionné
                                        validateCinemaSelection(film.id);

                                        // Attacher un événement `change` ou `keyup` à l'input de cinéma pour mettre à jour
                                        $('#cinema-input').on('change keyup', function () {
                                            validateCinemaSelection(film.id);
                                        });

                                        if (!$('.card-image-film').hasClass('disabled')) {
                                            // Initialiser le modal et le datepicker avec la date du jour pour ce film
                                            initializeModalAndDatepicker(film.id, updateModalAndSessions);

                                            // Initialiser le datepicker pour ce film
                                            initializeDatepicker(film.id);

                                            // Gérer le clic sur les jours pour les séances
                                            handleDateClick(film.id);
                                        }

                                        // Affichage du cœur si le film est un coup de cœur
                                        if (film.label === true) {
                                            $(`#heart-${film.id}`).removeClass('d-none');
                                        }

                                        // Accordion description films
                                        // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                        $(document).click(function(event) {
                                            const accordionButton = $('#btn-description-'+film.id);
                                            const accordionCollapse = $('#collapseDescription-'+film.id);
                                            // Vérifie si le clic est à l'intérieur de l'accordéon
                                            if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                                // Ferme l'accordéon si ouvert
                                                if (accordionCollapse.hasClass('show')) {
                                                    accordionCollapse.collapse('hide');
                                                }
                                            }
                                        });

                                        //Affichage badge age mini
                                        displayAgeBadge(film)
                                    });
                                })
                                .catch(error => {console.error('Erreur lors du chargement des films :', error);})
                                .finally(() => {
                                    // Cacher le spinner de chargement
                                    $('#loading-spinner').addClass('d-none');
                                });
        }
        //Menu Films
        function menuFilms() {
            const $datepicker = $('#datepicker');
            const $calendarIcon = $('#icon-calendar');
            const $clearIcon = $('.close-icon-date');
            const $clearIconGenre = $('.close-icon-genre');
            const $clearIconCinema = $('.close-icon-cinema');

            //filtrer les films par cinéma, genre et date
            function reloadFilms() {
                const cinemaId = $('#cinema-input').val(); // Récupère le filtre cinéma
                const genreId = $('#genre-input').val();  // Récupère le filtre genre
                const selectedDate = $datepicker.val(); // Récupère le filtre date

                // Formatage de la date si elle est sélectionnée
                let formattedDate = null;
                if (selectedDate) {
                    const [day, month, year] = selectedDate.split('/');
                    formattedDate = `${year}-${month}-${day}`;
                }

                // Préparer les données pour la requête
                let filters = {
                    cinema: cinemaId || null,
                    genre: genreId || null,
                    date: formattedDate || null
                };
                // Vider le conteneur des films
                $('#film-container-public').empty();
                // Afficher le spinner
                $('#loading-spinner').removeClass('d-none');

                // Envoyer la requête avec les filtres actifs
                axios.post('/films/filter', filters)
                    .then(response => {
                        const films = response.data;

                        // Vérifier si aucun film ne correspond aux critères de recherche
                        if (films.length === 0) {
                            $('#film-container-public').append('<div class="col-12 text-center my-3" style="color:#6A73AB">Aucun film ne correspond aux critères de recherche.</div>');
                        }

                        // Ajouter les films au conteneur
                        $.each(films, function (index, film) {
                            const filmHTML = generateFilmCardHTML(film);
                            $('#film-container-public').append(filmHTML);

                            // Désactiver le clic sur les images si aucun cinéma n'est sélectionné
                            validateCinemaSelection(film.id);

                            // Attacher un événement `change` ou `keyup` à l'input de cinéma pour mettre à jour
                            $('#cinema-input').on('change keyup', function () {
                                validateCinemaSelection(film.id);
                            });

                            // Initialiser le modal et le datepicker avec la date du jour pour ce film
                            initializeModalAndDatepicker(film.id, updateModalAndSessions);

                            // Initialiser le datepicker pour ce film
                            initializeDatepicker(film.id);

                            // Gérer le clic sur les jours pour les séances
                            handleDateClick(film.id);

                            // Affichage du cœur si le film est un coup de cœur
                            if (film.label === true) {
                                $(`#heart-${film.id}`).removeClass('d-none');
                            }

                            // Accordion description films
                            // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                            $(document).click(function(event) {
                                const accordionButton = $('#btn-description-'+film.id);
                                const accordionCollapse = $('#collapseDescription-'+film.id);
                                // Vérifie si le clic est à l'intérieur de l'accordéon
                                if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                    // Ferme l'accordéon si ouvert
                                    if (accordionCollapse.hasClass('show')) {
                                        accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                    }
                                }
                            });

                            //Affichage badge age mini
                            displayAgeBadge(film)
                        });
                    })
                    .catch(error => {
                        console.error('Erreur lors du rechargement des films :', error);
                    })
                    .finally(() => {
                        // Cacher le spinner
                        $('#loading-spinner').addClass('d-none');
                    });
            }

            //Au clic sur le bouton cinéma pour afficher/masquer les options
            $('.custom-select-btn-cinema').on('click', function (e) {
                        e.stopPropagation();
                        $('.custom-options-cinema').toggle();
                        $('.custom-options-genre').hide();
                    });

            //Sélection d'une option de cinéma
            $('.custom-option-cinema').on('click', function () {
                        let selectedText = $(this).text();
                        let selectedValue = $(this).data('value');
                        let customSelect = $('.custom-select-btn-cinema');
                        customSelect.text(selectedText);
                        $('#cinema-input').val(selectedValue);
                        $('.custom-options-cinema').hide();
                        customSelect.addClass('no-arrow');
                        $('.close-icon-cinema').removeClass('d-none');
                        // Vider le conteneur des films
                        $('#film-container-public').empty();
                        $('#loading-spinner').removeClass('d-none');
                        reloadFilms()
                    });

            //Au clic sur l'icône "X" pour réinitialiser la sélection
            $clearIconCinema.on('click', function () {
                        const customSelect = $('.custom-select-btn-cinema');
                        $(this).addClass('d-none');
                        $('#cinema-input').val('');
                        customSelect.text('Cinéma');
                        $('.custom-options-cinema').hide();
                        customSelect.removeClass('no-arrow');
                        reloadFilms();
                    });

            //Au clic sur le bouton genre pour afficher/masquer les options
            $('.custom-select-btn-genre').on('click', function (e) {
                        e.stopPropagation();
                        $('.custom-options-genre').toggle();
                        $('.custom-options-cinema').hide();
                    });

            //Sélection d'une option de genre
            $('.custom-option-genre').on('click', function () {
                        let selectedText = $(this).text();
                        let selectedValue = $(this).data('value');
                        let customSelect = $('.custom-select-btn-genre');
                        customSelect.text(selectedText);
                        $('#genre-input').val(selectedValue);
                        $('.custom-options-genre').hide();
                        customSelect.addClass('no-arrow');
                        $('.close-icon-genre').removeClass('d-none');
                        // Vider le conteneur des films
                        $('#film-container-public').empty();
                        // Afficher le spinner de chargement
                        $('#loading-spinner').removeClass('d-none');
                        reloadFilms()
                    });

            //Au clic sur l'icône "X" pour réinitialiser la sélection
            $clearIconGenre.on('click', function () {
                        const customSelect = $('.custom-select-btn-genre');
                        $(this).addClass('d-none');
                        $('#genre-input').val('');
                        customSelect.text('Genre');
                        $('.custom-options-genre').hide();
                        customSelect.removeClass('no-arrow');
                        reloadFilms();
                    });

            // Clic en dehors du menu pour fermer les options
            $(window).on('click', function () {
                        $('.custom-options-cinema').hide();
                        $('.custom-options-genre').hide();
                    });

            //Appliquer le style de hover/focus
            $clearIconCinema.on('mouseenter focus', function () {
                        $('.custom-select-btn-cinema').addClass('btn-hover');
                        $('.close-icon-cinema').addClass('btn-hover');
                    });

            //Appliquer le style de hover/focus
            $clearIconGenre.on('mouseenter focus', function () {
                        $('.custom-select-btn-genre').addClass('btn-hover');
                        $('.close-icon-genre').addClass('btn-hover');
                    });

            //Retirer le style quand on quitte le survol/focus
            $clearIconCinema.on('mouseleave blur', function () {
                        $('.custom-select-btn-cinema').removeClass('btn-hover');
                        $('.close-icon-cinema').removeClass('btn-hover');
                    });

            //Retirer le style quand on quitte le survol/focus
            $clearIconGenre.on('mouseleave blur', function () {
                        $('.custom-select-btn-genre').removeClass('btn-hover');
                        $('.close-icon-genre').removeClass('btn-hover');
                    });

            //Datepicker
            $datepicker.datepicker({
                        format: "dd/mm/yyyy",
                        orientation: "bottom",
                        language: "fr",
                        autoclose: true
                    })
                .on('changeDate', function () {
                            // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                            $calendarIcon.addClass('d-none');
                            $clearIcon.removeClass('d-none');
                            // Récupère la valeur sélectionnée
                            const selectedDate = $datepicker.val();
                            const [day, month, year] = selectedDate.split('/');
                            const FormattedDate = `${year}-${month}-${day}`;
                            // Vide le conteneur des films
                            $('#film-container-public').empty();
                            // Affiche le spinner de chargement
                            $('#loading-spinner').removeClass('d-none');
                            reloadFilms()
                        });

            //Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
            $clearIcon.on('click', function () {
                        $datepicker.datepicker('update', '').val(''); // Réinitialiser la valeur du champ
                        $clearIcon.addClass('d-none'); // Masquer l'icône de croix
                        $calendarIcon.removeClass('d-none'); // Afficher l'icône du calendrier
                        reloadFilms();
                    });

            //Appliquer le style de hover/focus
            $clearIcon.on('mouseenter focus', function () {
                        $datepicker.addClass('btn-hover');
                        $clearIcon.addClass('btn-hover');
                    });
            $calendarIcon.on('mouseenter focus', function () {
                        $datepicker.addClass('btn-hover');
                        $calendarIcon.addClass('btn-hover');
                    });

            //Retirer le style quand on quitte le survol/focus
            $clearIcon.on('mouseleave blur', function () {
                        $datepicker.removeClass('btn-hover');
                        $clearIcon.removeClass('btn-hover');
                    });
            $calendarIcon.on('mouseleave blur', function () {
                        $datepicker.removeClass('btn-hover');
                        $calendarIcon.removeClass('btn-hover');
                    });

            //Ouvrir le calendrier
            $calendarIcon.on('click', function () {
                        $datepicker.focus();
                    });
        }

        //Page Réservation
        //Fonction pour récupérer les données du film et des séances
        function reservation() {

            // Parse les données des films depuis l'attribut data-films
            const filmsData = JSON.parse($('#films-data').attr('data-films'));

            // Récupérer les données du film et des séances et permettre la réservation
            function handleReservation(cinemaId, filmId, dateInitiale = null, seanceId = null) {
                axios.post('/reservation/film', {'cinemaId': cinemaId, 'filmId': filmId})
                    .then(response => {
                        const data = response.data;

                        if (data.film) {
                            // Mettre à jour les informations du film
                            $('#film-name').text(data.film.name + " - " + data.film.cinema);
                            $('#reservation .img-fluid').attr('src', data.film.image);
                            $('#film-genre').text('Genre:' + ' ' + data.film.genre);
                            $('#film-duree').text(function () {
                                if (data.seances && data.seances.length > 0 && data.seances[0].informations.length > 0) {
                                    const heureDebut = data.seances[0].informations[0].heureDebut;
                                    const heureFin = data.seances[0].informations[0].heureFin;

                                    // Convertir les heures en objets Date
                                    const debut = new Date(`1970-01-01T${heureDebut}:00`);
                                    const fin = new Date(`1970-01-01T${heureFin}:00`);

                                    // Calculer la différence en minutes
                                    const dureeMinutes = (fin - debut) / (1000 * 60);

                                    // Convertir en heures et minutes
                                    const heures = Math.floor(dureeMinutes / 60);
                                    const minutes = dureeMinutes % 60;

                                    // Si les minutes sont 0, afficher seulement les heures
                                    if (minutes === 0) {
                                        return `Durée: ${heures}h`;
                                    } else {
                                        return `Durée: ${heures}h ${minutes}min`;
                                    }
                                } else {
                                    return 'Durée : Non disponible';
                                }
                            });

                            const $seancesButtons = $('#seances-buttons');
                            const $seancesSelected = $('#seance-selected');

                            // Afficher les sièges réservés
                            function afficherSiegesReserves(seance) {
                                // Réinitialiser tous les sièges à l'état libre
                                $('[id^="seating-area"] .seat').removeClass('reserve selectionne').addClass('libre');

                                // Marquer les sièges réservés
                                if (seance.sieges_reserves && seance.sieges_reserves.length > 0) {
                                    seance.sieges_reserves.forEach(idSiege => {
                                        $(`.seat[data-id="${idSiege}"]`).removeClass('libre').addClass('reserve');
                                        [1, 2, 3, 4].forEach(id => {
                                            $(`.seat[data-id="${id}"]`).addClass('reserve');
                                        });
                                    });
                                } else {
                                    [1, 2, 3, 4].forEach(id => {
                                        $(`.seat[data-id="${id}"]`).addClass('reserve');
                                    });
                                }
                            }

                            // Initialiser les sièges
                            function initialiserSieges() {
                                // Retirer les anciens événements de clic pour éviter qu'ils ne se déclenchent plusieurs fois
                                const seatingAreas = $('[id^="seating-area"]');
                                seatingAreas.off('click', '.seat');
                                seatingAreas.on('click', '.seat', function () {
                                    const $seat = $(this);

                                    // Vérifier l'état actuel du siège
                                    if ($seat.hasClass('reserve')) {
                                        // Si le siège est déjà réservé, afficher un message ou empêcher l'action
                                        alert("Ce siège est déjà réservé !");
                                        return;
                                    }

                                    // Empeche plus de selection que le nombre de place indiqué
                                    const maxSeats = parseInt($('#Textarea-places-reservations').val(), 10) || 0;
                                    const totalSeatsSelected = $('.seat.selectionne').length;
                                    if (totalSeatsSelected > maxSeats && !$seat.hasClass('selectionne')) {
                                        alert("Le nombre de sièges réservés dépasse le nombre de places!");
                                        return;
                                    }

                                    if (totalSeatsSelected === maxSeats) {
                                        $('#paiement-reservations').removeClass('disabled');
                                    } else {
                                        $('#paiement-reservations').addClass('disabled');
                                    }

                                    if ($seat.hasClass('selectionne')) {
                                        // Si le siège est déjà sélectionné, on le désélectionne
                                        $seat.removeClass('selectionne');
                                    } else {
                                        // Sinon, on le sélectionne
                                        $seat.addClass('selectionne');
                                    }
                                });
                            }

                            // Mettre à jour les séances disponibles
                            function updateSeances(selectedDate) {
                                $seancesButtons.empty(); // Effacer les anciens boutons
                                let availableSeances = [];
                                let atLeastOneAvailable = false;
                                const textAreaReservations = $('#Textarea-places-reservations');

                                // Filtrer les séances correspondant à la date sélectionnée
                                data.seances.forEach(seance => {
                                    if (seance.date === selectedDate) {
                                        availableSeances = availableSeances.concat(seance.informations);
                                    }
                                });

                                // Vérifier si des séances sont disponibles
                                if (availableSeances.length === 0) {
                                    $seancesButtons.addClass('disabled'); // Désactive la `row`
                                    $seancesSelected.text('Aucune séance disponible pour cette date');
                                    textAreaReservations.addClass('disabled');
                                    $('#selection-sieges').addClass('disabled'); // Désactiver la sélection des sièges
                                } else {
                                    $seancesSelected.text('Séances disponibles'); // Réinitialise le message
                                    textAreaReservations.removeClass('disabled');

                                    // Ajouter les boutons pour chaque séance
                                    availableSeances.forEach(seance => {
                                        const $button = $(`
                                            <button id="${seance.id}" class="btn btn-reservation col mt-2 disabled d-flex justify-content-center align-items-center flex-column text-center mx-2">
                                                <span>${seance.qualite}</span>
                                                <span>${seance.heureDebut}</span>
                                                <span>${seance.heureFin}</span>
                                            </button>
                                        `);

                                        $seancesButtons.append($button);

                                        // Calcul des sièges réservés et gestion de l'état des boutons
                                        let totalReservedSeats = seance.sieges_reserves ? seance.sieges_reserves.length : 0;
                                        const remainingSeats = 100 - totalReservedSeats;

                                        // Vérifier si le nombre de places demandées est inférieur ou égal au nombre de places restantes lors de la redirection depuis la page film
                                        const salleReservations = $('#salle-reservations');
                                        if (parseInt(seanceId, 10) === seance.id) {
                                            const requestedSeats = parseInt(textAreaReservations.val(), 10) || 0;
                                            if (requestedSeats <= remainingSeats) {
                                                $button.removeClass('disabled');
                                                atLeastOneAvailable = true; // Marque qu'au moins une séance est disponible

                                                // Ajout de la salle
                                                // Récupère le texte actuel dans #salle-reservations
                                                let currentText = salleReservations.text();

                                                // Vérifie si le texte contient déjà seance.salle
                                                if (!currentText.includes(seance.salle)) {
                                                    // Si le texte ne contient pas déjà seance.salle, ajoute-le
                                                    salleReservations.append(seance.salle);
                                                }

                                                // Mettre à jour l'affichage de la séance sélectionnée
                                                $seancesSelected.text(`Qualité choisie : ${seance.qualite}`);

                                                // Mettre à jour le prix
                                                let nombrePlaces = parseInt(textAreaReservations.val(), 10);
                                                let prixUnitaire = seance.prix;

                                                // Calcul du prix dégressif
                                                if (nombrePlaces >= 5) {
                                                    prixUnitaire = prixUnitaire * 0.8; // 20% de réduction
                                                } else if (nombrePlaces >= 2) {
                                                    prixUnitaire = prixUnitaire * 0.9; // 10% de réduction
                                                }

                                                // Mettre à jour l'affichage du prix
                                                $('#prix-reservations').text(`Prix : ${prixUnitaire.toFixed(2)} €`);

                                                // Afficher les sièges réservés pour cette séance
                                                $('#selection-sieges').removeClass('disabled');
                                                afficherSiegesReserves(seance);
                                            } else {
                                                $button.addClass('disabled');
                                            }

                                            // Mise à jour globale des états
                                            if (atLeastOneAvailable) {
                                                $('#seances-buttons').removeClass('disabled');
                                                $(`#${seanceId}`).addClass('active');
                                            } else {
                                                $('#seances-buttons').addClass('disabled');
                                            }

                                        }

                                        // Vérification dynamique lors de la saisie
                                        textAreaReservations.on('input', function () {
                                            $('#seances-buttons .btn-reservation').removeClass('active');
                                            const requestedSeats = parseInt($(this).val(), 10) || 0;

                                            if (requestedSeats <= remainingSeats) {
                                                $button.removeClass('disabled');
                                                atLeastOneAvailable = true;// Marque qu'au moins une séance est disponible
                                            } else {
                                                $button.addClass('disabled');
                                                $('#selection-sieges').addClass('disabled');
                                            }

                                            // Mise à jour globale des états
                                            if (atLeastOneAvailable) {
                                                $('#seances-buttons').removeClass('disabled');
                                            } else {
                                                $('#seances-buttons').addClass('disabled');
                                            }

                                            if (requestedSeats === null || requestedSeats === 0) {
                                                $seancesSelected.text('Séances disponibles');
                                                $('#seances-buttons').addClass('disabled')
                                                $('#selection-sieges').addClass('disabled');
                                                $('#prix-reservations').text(`Prix :`);
                                                $('[id^="seating-area"] .seat').each(function () {
                                                    $(this).removeClass('selectionne').removeClass('reserve');
                                                    $(this).addClass('libre');
                                                });
                                                $('#salle-reservations').text('Salle');
                                                $('#paiement-reservations').addClass('disabled');
                                            }
                                        });

                                        // Gestion du clic sur le bouton de choix de séance
                                        $button.on('click', function () {
                                            if (!$(this).hasClass('disabled')) {
                                                // Ajout de la salle
                                                // Récupère le texte actuel dans #salle-reservations
                                                let currentText = salleReservations.text();

                                                // Vérifie si le texte contient déjà seance.salle
                                                if (!currentText.includes(seance.salle) && currentText === 'Salle') {
                                                    // Si le texte ne contient pas déjà seance.salle, ajoute-le
                                                    salleReservations.append(seance.salle);
                                                } else {
                                                    // Si le texte contient déjà seance.salle, le remplace
                                                    salleReservations.empty().append(`Salle ${seance.salle}`);
                                                }
                                                // Gestion de la sélection de la séance
                                                $('#seances-buttons .btn-reservation').removeClass('active');
                                                $(this).addClass('active');

                                                // Mettre à jour l'affichage de la séance sélectionnée
                                                $seancesSelected.text(`Qualité choisie : ${seance.qualite}`);

                                                // Mettre à jour le prix
                                                let nombrePlaces = parseInt(textAreaReservations.val(), 10);
                                                let prixUnitaire = seance.prix;

                                                // Calcul du prix dégressif
                                                if (nombrePlaces >= 5) {
                                                    prixUnitaire = prixUnitaire * 0.8; // 20% de réduction
                                                } else if (nombrePlaces >= 2) {
                                                    prixUnitaire = prixUnitaire * 0.9; // 10% de réduction
                                                }

                                                // Mettre à jour l'affichage du prix
                                                $('#prix-reservations').text(`Prix : ${prixUnitaire.toFixed(2)} €`);
                                            }
                                            // Afficher les sièges réservés pour cette séance
                                            $('#selection-sieges').removeClass('disabled');
                                            afficherSiegesReserves(seance);
                                        });
                                    });
                                }
                            }

                            // Initialiser le datepicker
                            const $calendarIcon = $('#icon-calendar');
                            const $clearIcon = $('#close-icon-date');
                            const $datepicker = $('#datepicker');
                            $datepicker.datepicker({
                                format: "dd/mm/yyyy",
                                orientation: "bottom",
                                language: "fr",
                                autoclose: true
                            })
                                .on('changeDate', function () {
                                    const selectedDate = $datepicker.val();
                                    $calendarIcon.addClass('d-none');
                                    $clearIcon.removeClass('d-none');
                                    updateSeances(selectedDate);
                                    initialiserSieges();
                                });

                            // Si une dateInitiale est passée, l'initialiser dans le datepicker
                            if (dateInitiale) {
                                $datepicker.datepicker('setDate', dateInitiale);
                                $calendarIcon.addClass('d-none');
                                $clearIcon.removeClass('d-none');
                                updateSeances(dateInitiale);
                                initialiserSieges();
                            }

                            // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                            $clearIcon.on('click', function () {
                                // Effacer la date sélectionnée en réinitialisant la valeur du champ
                                $datepicker.datepicker('update', '').val('');
                                // Afficher l'icône du calendrier et masquer l'icône de suppression
                                $clearIcon.addClass('d-none');
                                $calendarIcon.removeClass('d-none');
                                $seancesButtons.empty().addClass('disabled');
                                $seancesSelected.text('');
                                $('#Textarea-places-reservations').addClass('disabled').val('');
                                $('#seances-buttons').addClass('disabled');
                                $('#selection-sieges').addClass('disabled');
                                $('#prix-reservations').text(`Prix :`);
                                $('[id^="seating-area"] .seat').each(function () {
                                    $(this).removeClass('selectionne').removeClass('reserve'); // Retirer les classes de sélection et de réservation
                                    $(this).addClass('libre'); // Ajouter la classe libre pour rendre le siège disponible
                                });
                                $('#salle-reservations').text('Salle');
                                $('#paiement-reservations').addClass('disabled');
                            });

                            // Appliquer le style de hover/focus
                            $clearIcon.on('mouseenter focus', function () {
                                $datepicker.addClass('btn-hover');
                                $clearIcon.addClass('btn-hover');
                            });
                            $calendarIcon.on('mouseenter focus', function () {
                                $datepicker.addClass('btn-hover');
                                $calendarIcon.addClass('btn-hover');
                            });

                            // Retirer le style quand on quitte le survol/focus
                            $clearIcon.on('mouseleave blur', function () {
                                $datepicker.removeClass('btn-hover');
                                $clearIcon.removeClass('btn-hover');
                            });
                            $calendarIcon.on('mouseleave blur', function () {
                                $datepicker.removeClass('btn-hover');
                                $calendarIcon.removeClass('btn-hover');
                            });

                            // Ouvrir le calendrier
                            $calendarIcon.on('click', function () {
                                $datepicker.focus();
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des données :', error);
                    });
            }

            // Récupérer les paramètres depuis l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const filmId = urlParams.get('filmId');
            const cinemaId = urlParams.get('cinemaId');
            const seanceId = urlParams.get('seanceId');
            const dateParam = urlParams.get('date');

            // Fonction pour gérer la réservation si les bonnes infos sont présentes dans l'URL
            function handleSelection(cinemaId, filmId, seanceId, dateParam) {
                $('#Textarea-places-reservations').val(1);
                $('#cinema-input').val(cinemaId); // Met à jour le champ caché pour le cinéma
                const filmContainer = $(`#films-${cinemaId}`);

                if (filmsData[cinemaId] && filmsData[cinemaId].length > 0) {
                    filmsData[cinemaId].forEach((film) => {
                        // Ajoute chaque film dans le sous-menu
                        const filmOption = `<div class="custom-option-film" data-film-id="${film.id}">${film.title}</div>`;
                        filmContainer.append(filmOption);
                    });
                }

                const filmElement = $(`.custom-option-film[data-film-id="${filmId}"]`);
                if (!filmElement.length) return; // Vérifie si l'élément existe

                // Vérifier si la date est présente dans l'URL
                // Séparer la date en parties
                const [year, month, day] = dateParam.split('-');

                // Reformater la date au format 'dd/mm/yyyy'
                const dateInitiale = `${day}/${month}/${year}`;
                handleReservation(cinemaId, filmId, dateInitiale, seanceId);

                const filmTitle = filmElement.text().trim();
                let customSelect = $('.custom-select-btn-cinema');
                const $clearIconCinema = $('.close-icon-cinema');

                $('#film-input').val(filmId); // Met à jour le champ caché pour le film
                customSelect.text(filmTitle); // Met à jour le texte du bouton principal

                // Affiche l'icône de fermeture et active le datepicker
                customSelect.addClass('no-arrow');
                $clearIconCinema.removeClass('d-none');
                $('#datepicker').removeClass('disabled');

                // Paiement
                $('#paiement-reservations').on('click', function () {
                    const selectedSeanceId = $('#seances-buttons .btn-reservation.active').attr('id');
                    const cinemaId = $('#cinema-input').val();
                    const selectedSeats = $('.seat.selectionne').map(function () {
                        return $(this).data('id');
                    }).get();
                    axios.post('/reservation/paiement', {
                        seanceId: selectedSeanceId,
                        cinemaId: cinemaId,
                        seats: selectedSeats,
                    })
                        .then(function (response) {
                            if (response.data.redirectToLogin) {
                                window.location.assign(response.data.redirectToLogin);
                            } else if (response.data.redirectTo) {
                                window.location.assign(response.data.redirectTo);
                            } else if (response.data.error) {
                                alert(response.data.error);
                            }
                        })
                        .catch(function (error) {
                            console.error(error);
                            alert('Une erreur est survenue. Veuillez réessayer.');
                        });
                });

                // Réinitialiser la sélection avec l'icône de fermeture
                $clearIconCinema.on('click', function () {
                    $('#cinema-input').val('');
                    $('#film-input').val('');
                    $('.custom-select-btn-cinema').text('Cinéma').removeClass('no-arrow', 'btn-hover');
                    $('.custom-options-films').addClass('d-none').empty();
                    $(this).addClass('d-none');
                    $('#film-name').text('');
                    $('#reservation .img-fluid').attr('src', '/image_film/default-image2.jpg');
                    $('#film-genre').text('');
                    $('#film-duree').text('')
                    $('#datepicker').addClass('disabled').datepicker('update', '').val('');
                    $('#icon-calendar').removeClass('d-none');
                    $('#close-icon-date').addClass('d-none');
                    $('#Textarea-places-reservations').addClass('disabled').val('');
                    $('#seances-buttons').empty().addClass('disabled');
                    $('#selection-sieges').addClass('disabled');
                    $('#seance-selected').text('');
                    $('#prix-reservations').text(`Prix :`);
                    // Remettre tous les sièges en état "libre"
                    $('[id^="seating-area"] .seat').each(function () {
                        $(this).removeClass('selectionne').removeClass('reserve'); // Retirer les classes de sélection et de réservation
                        $(this).addClass('libre'); // Ajouter la classe libre pour rendre le siège disponible
                    });
                    $('#salle-reservations').text('Salle');
                    $('#paiement-reservations').addClass('disabled');
                });

                //Appliquer le style de hover/focus
                $clearIconCinema.on('mouseenter focus', function () {
                    $('.custom-select-btn-cinema').addClass('btn-hover');
                    $('.close-icon-cinema').addClass('btn-hover');
                });

                //Retirer le style quand on quitte le survol/focus
                $clearIconCinema.on('mouseleave blur', function () {
                    $('.custom-select-btn-cinema').removeClass('btn-hover');
                    $('.close-icon-cinema').removeClass('btn-hover');
                });
            }

            if (filmId && cinemaId && dateParam && seanceId) {
                handleSelection(cinemaId, filmId, seanceId, dateParam);
            }

            // Afficher/masquer la liste des cinémas
            $('.btn-films').on('click', function () {
                $('.custom-options-cinema').toggle();
            });

            // Quand un cinéma est sélectionné
            $(document).on('mouseenter', '.custom-option-cinema', function (e) {
                e.stopPropagation(); // Empêche la fermeture involontaire du menu
                const cinemaId = $(this).data('cinema-id');

                // Met à jour le champ caché pour le cinéma
                $('#cinema-input').val(cinemaId);

                // Réinitialise les sous-menus pour les films
                $('.custom-options-films').addClass('d-none').empty();

                // Vérifie si des films sont disponibles pour ce cinéma
                const filmContainer = $(`#films-${cinemaId}`);
                if (filmsData[cinemaId] && filmsData[cinemaId].length > 0) {
                    filmsData[cinemaId].forEach((film) => {
                        // Ajoute chaque film dans le sous-menu
                        const filmOption = `<div class="custom-option-film" data-film-id="${film.id}">${film.title}</div>`;
                        filmContainer.append(filmOption);
                    });

                    // Affiche le sous-menu des films pour le cinéma sélectionné
                    filmContainer.removeClass('d-none');

                    // Calculer la position du cinéma sélectionné et ajuster la position du sous-menu des films
                    const cinemaPosition = $(this).offset(); // Récupère la position de l'élément cinéma
                    filmContainer.css({
                        top: cinemaPosition.top - 4 * ($(this).outerHeight()), // Aligné avec le cinéma
                        left: $(this).outerWidth(), // Décalé à droite du cinéma
                    });
                } else {
                    // Aucun film disponible pour ce cinéma
                    const noFilmMessage = `<div class="custom-option-film">Aucun film disponible</div>`;
                    filmContainer.append(noFilmMessage).removeClass('d-none');
                    // Calculer la position du cinéma sélectionné et ajuster la position du sous-menu des films
                    const cinemaPosition = $(this).offset(); // Récupère la position de l'élément cinéma
                    filmContainer.css({
                        top: cinemaPosition.top - 4 * ($(this).outerHeight()), // Aligné avec le cinéma
                        left: $(this).outerWidth(), // Décalé à droite du cinéma
                    });
                }
            });

            // Quand un film est sélectionné
            $(document).on('click', '.custom-option-film', function () {
                const filmId = $(this).data('film-id');
                const cinemaId = $('#cinema-input').val();

                // Réservation
                handleReservation(cinemaId, filmId);

                const filmTitle = $(this).text().trim();
                let customSelect = $('.custom-select-btn-cinema');
                const $clearIconCinema = $('.close-icon-cinema')

                $('#film-input').val(filmId); // Met à jour le champ caché pour le film

                // Met à jour le texte du bouton principal pour indiquer le film sélectionné
                customSelect.text(filmTitle);

                // Masque tous les menus
                $('.custom-options-films').addClass('d-none');

                // Affiche l'icône de fermeture
                customSelect.addClass('no-arrow');
                $clearIconCinema.removeClass('d-none');
                $('#datepicker').removeClass('disabled');

                // Masque ou affiche le menu des cinemas
                $('.custom-options-cinema').toggle();

                // Paiement
                $('#paiement-reservations').on('click', function () {
                    const selectedSeanceId = $('#seances-buttons .btn-reservation.active').attr('id');
                    const cinemaId = $('#cinema-input').val();
                    const selectedSeats = $('.seat.selectionne').map(function () {
                        return $(this).data('id');
                    }).get();
                    axios.post('/reservation/paiement', {
                        seanceId: selectedSeanceId,
                        cinemaId: cinemaId,
                        seats: selectedSeats,
                    })
                        .then(function (response) {
                            if (response.data.redirectToLogin) {
                                window.location.assign(response.data.redirectToLogin);
                            } else if (response.data.redirectTo) {
                                window.location.assign(response.data.redirectTo);
                            } else if (response.data.error) {
                                alert(response.data.error);
                            }
                        })
                        .catch(function (error) {
                            console.error(error);
                            alert('Une erreur est survenue. Veuillez réessayer.');
                        });
                });

                // Réinitialiser la sélection avec l'icône de fermeture
                $clearIconCinema.on('click', function () {
                    $('#cinema-input').val('');
                    $('#film-input').val('');
                    $('.custom-select-btn-cinema').text('Cinéma').removeClass('no-arrow', 'btn-hover');
                    $('.custom-options-films').addClass('d-none').empty();
                    $(this).addClass('d-none');
                    $('#film-name').text('');
                    $('#reservation .img-fluid').attr('src', '/image_film/default-image2.jpg');
                    $('#film-genre').text('');
                    $('#film-duree').text('')
                    $('#datepicker').addClass('disabled').datepicker('update', '').val('');
                    $('#icon-calendar').removeClass('d-none');
                    $('#close-icon-date').addClass('d-none');
                    $('#Textarea-places-reservations').addClass('disabled').val('');
                    $('#seances-buttons').empty().addClass('disabled');
                    $('#selection-sieges').addClass('disabled');
                    $('#seance-selected').text('');
                    $('#prix-reservations').text(`Prix :`);
                    // Remettre tous les sièges en état "libre"
                    $('[id^="seating-area"] .seat').each(function () {
                        $(this).removeClass('selectionne').removeClass('reserve'); // Retirer les classes de sélection et de réservation
                        $(this).addClass('libre'); // Ajouter la classe libre pour rendre le siège disponible
                    });
                    $('#salle-reservations').text('Salle');
                    $('#paiement-reservations').addClass('disabled');
                });

                // Clic en dehors pour fermer les menus
                $(document).on('click', function (e) {
                    if (!$(e.target).closest('.custom-dropdown').length) {
                        $('.custom-options-cinema').hide();
                        $('.custom-options-films').addClass('d-none');
                    }
                });

                //Appliquer le style de hover/focus
                $clearIconCinema.on('mouseenter focus', function () {
                    $('.custom-select-btn-cinema').addClass('btn-hover');
                    $('.close-icon-cinema').addClass('btn-hover');
                });

                //Retirer le style quand on quitte le survol/focus
                $clearIconCinema.on('mouseleave blur', function () {
                    $('.custom-select-btn-cinema').removeClass('btn-hover');
                    $('.close-icon-cinema').removeClass('btn-hover');
                });
            });

            // Clic en dehors pour fermer les menus
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.custom-dropdown, .btn-films').length) {
                    $('.custom-options-cinema').hide();
                    $('.custom-options-films').addClass('d-none');
                }
            });

        }

        //Page commandes
        //Fonction pour noter la séance
        function handleFilmRating() {
            // Gestion des boutons de déclenchement du modal
            $('.btn-paiement').click(function () {
                // Vérifier si le bouton est désactivé
                if ($(this).hasClass('disabled')) {
                    alert("Vous ne pouvez pas noter un film pour une séance future.");
                    return;
                }

                // Récupérer l'ID de la réservation depuis le data-bs-target
                const modalId = $(this).data('bs-target').replace('#notationModal-', '');
                const reservationId = $('.commande-avis').attr('id').replace('avis-', '');
                const $modal = $(`#notationModal-${modalId}`);

                if ($modal.length === 0) {
                    console.error(`Le modal pour la réservation ID ${modalId} est introuvable.`);
                    return;
                }

                // Gérer les étoiles dans le modal
                $modal.find('.star').click(function () {
                    const $star = $(this);
                    $star.toggleClass('selected');

                    const value = parseInt($star.data('value'));
                    $modal.find('.star').each(function () {
                        const $s = $(this);
                        if (parseInt($s.data('value')) <= value) {
                            $s.addClass('selected');
                        }
                    });
                });

                // Gérer le clic sur le bouton d'enregistrement
                $modal.find('.btn-connexion').click(function () {
                    const comment = $(`#floatingTextareaComments-${modalId}`).val();
                    const selectedStars = $modal.find('.star.selected');
                    const rating = selectedStars.length > 0 ? Math.max(...selectedStars.map((_, star) => parseInt($(star).data('value')))) : null;

                    // Vérifier si la note et le commentaire sont présents
                    if (!rating) {
                        alert("Veuillez sélectionner une note !");
                        return;
                    }
                    if (!comment.trim()) {
                        alert("Veuillez laisser un commentaire !");
                        return;
                    }

                    // Préparer les données
                    const data = {
                        reservation_id: modalId,
                        comment: comment,
                        rating: rating
                    };

                    // Envoyer les données avec Axios
                    axios.post('/utilisateur/mon_espace/commandes/notation', data)
                        .then(response => {
                            console.log('Données envoyées avec succès:', response.data);
                            const data  = response.data.avis;
                            // Fermer le modal après l'envoi réussi
                            $modal.modal('hide');

                            // Supprimer le bouton après la fermeture du modal
                            $(`#avis-${modalId}`)
                                .empty()
                                .append(
                                    `<button type="button" class="btn btn-commandes-avis fs-5 px-3" data-bs-toggle="modal" data-bs-target="#avisModal-${reservationId}">
                                     Avis déposé
                                    <i class="ms-2 bi bi-eye bi-eye-avis"></i>
                                    </button>`);
                            $('.avis-depose').append(`<div>${data}</div>`)
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'envoi:', error);
                        });
                });
            });
        }

        //Page Administration
        //Générer des films
        function filmAdmin() {
                        // Vider le conteneur des films
                        $('#card-container').empty();

                        const loadingBar = $('#loading-bar');
                        const progressBar = loadingBar.find('.progress-bar');

                        // Réinitialiser la barre de chargement à 0% immédiatement
                        loadingBar.removeClass('d-none');
                        progressBar.css('width', '0%').attr('aria-valuenow', '0');

                        let progress = 0;
                        const updateInterval = 100; // Intervalle pour mise à jour (rapide pour effet fluide)
                        const interval = setInterval(() => {
                            if (progress < 90) {
                                progress += 5; // Incrément de 5% pour une progression fluide
                                progressBar.css('width', progress + '%').attr('aria-valuenow', progress);
                            }
                        }, updateInterval);

                        // Récupérer les films
                        axios.get('/administrateur/administration/film')
                            .then(response => {
                                const Film = response.data;
                                $.each(Film, function(index, film) {
                                    $('#card-container').append(
                                        `<div class="col-auto card" style="width: 12rem">
                                                    <div class="position-relative">
                                                         <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin position-absolute" style="border-radius: 0 0 2px 0" data-bs-toggle="modal" data-bs-target="#modal-${film.id}"></button>
                                                         <button id="x-square-${film.id}" class="btn bi bi-x-square text-danger p-0 fs-5 bg-admin position-absolute" style="top:0; right: 0; border-radius: 0 0 0 2px"></button>  
                                                         <i class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
                                                         <img src="${film.image}" class="card-img-top" alt="image">
                                                    </div>
                                                    <div class="card-body p-0 py-1">
                                                            <div id="age-${film.id}" class="col-12 card-title m-0 fs-5">${film.name}
                                                                <span class="age-badge-12 d-none ms-2">12+</span>
                                                                <span class="age-badge-16 d-none ms-2">16+</span>
                                                                <span class="age-badge-18 d-none ms-2">18+</span>
                                                            </div>                        
                                                            <div class="card-title m-0 fs-6">${film.genre}</div>
                                                            <p class="card-text m-0 text-warning" style="margin: 0.3rem 0 0.3rem 0">
                                                                <i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                            </p>
                                                            <div class="accordion accordion-flush">
                                                                <div class="accordion-item">
                                                                    <div class="accordion-header">
                                                                        <button id="btn-description-${film.id}" class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                                                    </div>
                                                                    <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                                                        <div class="accordion-body p-0">${film.description}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    <!--Modal-->
                                                    <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered modal-xl">
                                                            <div class="modal-content" style="background-color: #6A73AB">
                                                                <div class="modal-body modal-admin row justify-content-center m-0 p-0">
                                                                    <div class="col-4 p-4 text-white position-relative">
                                                                        <!--Image-->
                                                                        <div class="position-relative">
                                                                            <input type="file" id="fileInput-${film.id}" style="display: none">
                                                                            <button id="uploadButton-${film.id}" class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin-modal position-absolute" style="top: 0; right: 20px; border-radius: 0 0 0 2px"></button>
                                                                            <img src="${film.image2}" class="img-fluid" alt="image">
                                                                        </div>    
                                                                        <!--Genre-->                                                                                                                                          
                                                                        <div class="row my-3">
                                                                            <div class="col-12 d-flex justify-content-start">
                                                                                <div class="text-white align-content-center fs-5 me-2">Genre:</div> 
                                                                                <div class="dropdown dropdown-modal-admin">
                                                                                    <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuGenre-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                        ${film.genre}
                                                                                    </button>
                                                                                    <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuGenre">
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Action</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Comédie</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Horreur</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Science-fiction</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Romance</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Thriller</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Drame</a></li>
                                                                                        <li><a class="dropdown-item drop-genre" href="#">Animation</a></li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div> 
                                                                        </div>
                                                                        <!--Age minimum-->
                                                                        <div class="row my-3">
                                                                            <div class="col-12 d-flex justify-content-start">
                                                                                <div class="text-white align-content-center fs-5 me-2">Age minimum:</div> 
                                                                                <div class="dropdown dropdown-modal-admin">
                                                                                    <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuAge-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                        ${film.age_minimum}
                                                                                    </button>
                                                                                    <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuAge">
                                                                                        <li><a class="dropdown-item drop-age" href="#">Tout public</a></li>
                                                                                        <li><a class="dropdown-item drop-age" href="#">12</a></li>
                                                                                        <li><a class="dropdown-item drop-age" href="#">16</a></li>
                                                                                        <li><a class="dropdown-item drop-age" href="#">18</a></li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div> 
                                                                        </div>
                                                                        <!--Coup de cœur-->
                                                                        <div class="row mt-3">
                                                                            <div class="col-12 d-flex justify-content-start">
                                                                                <div class="text-white align-content-center fs-5 me-2">Coup de cœur:</div> 
                                                                                <div class="dropdown dropdown-modal-admin">
                                                                                    <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuLabel-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">           
                                                                                    </button>
                                                                                    <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuLabel">
                                                                                        <li><a class="dropdown-item drop-label" href="#">Oui</a></li>
                                                                                        <li><a class="dropdown-item drop-label" href="#">Non</a></li>                                                                      
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>    
                                                                    </div>
                                                                    <div class="col-8 p-4">
                                                                        <!--Nom du film et cinéma et boutons-->
                                                                        <div class="row">
                                                                            <!--Nom du film-->
                                                                            <div class="col-6 d-flex align-items-center justify-content-start">
                                                                                <div class="text-white align-content-center fs-5 me-2">Nom:</div> 
                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="TextareaNom-${film.id}">${film.name}</textarea>
                                                                                <label class="d-none" for="TextareaNom-${film.id}"></label>
                                                                            </div>                                                          
                                                                            <!--Boutons valider + sortie + reset-->
                                                                            <div class="col-6 d-flex align-items-center justify-content-end">
                                                                                <button id="btn-reset-${film.id}" class="btn bi bi-arrow-counterclockwise p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                                                <button id="btn-validate-film-${film.id}" class="btn bi bi-check-lg p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                                                <button class="btn bi bi-x-lg p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                                            </div>
                                                                        </div>
                                                                        <!--Nom du Cinéma-->  
                                                                        <div class="row my-3">                                                                                                  
                                                                            <div class="col-12 d-flex align-content-center justify-content-start">
                                                                                <div class="text-white align-content-center fs-5 me-2">Cinéma:</div> 
                                                                                <div class="dropdown dropdown-modal-admin">                                                             
                                                                                     <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuCinema-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                         ${film.cinema}
                                                                                     </button>
                                                                                     <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuCinema">
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Toulouse</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Nantes</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Bordeaux</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Lille</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Charleroi</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Liège</a></li>
                                                                                         <li><a class="dropdown-item drop-cinema" href="#">Paris</a></li>
                                                                                     </ul>
                                                                                </div>
                                                                            </div>  
                                                                        </div>
                                                                        <!--Date de début et de fin de diffusion-->
                                                                        <div class="row my-3">
                                                                            <div class="col-12 d-flex justify-content-start align-items-center">
                                                                                 <div class="text-white align-content-center fs-5 me-2">Date de diffusion:</div>
                                                                                 <div class="position-relative me-3">
                                                                                        <input type="text" class="btn-date-admin" id="datepicker-admin-debut-${film.id}" placeholder="Début" readonly>
                                                                                        <label for="datepicker-admin-debut-${film.id}" class="d-none"></label>
                                                                                        <span class="bi bi-calendar" id="icon-calendar-debut-admin-${film.id}"></span>
                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-date-debut-admin-${film.id}"></span>
                                                                                 </div>
                                                                                 <div class="position-relative">
                                                                                        <input type="text" class="btn-date-admin" id="datepicker-admin-fin-${film.id}" placeholder="Fin" readonly>
                                                                                        <label for="datepicker-admin-fin-${film.id}" class="d-none"></label>
                                                                                        <span class="bi bi-calendar" id="icon-calendar-fin-admin-${film.id}"></span>
                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-date-fin-admin-${film.id}"></span>
                                                                                    </div>
                                                                             </div>                                                                                                                     
                                                                        </div>
                                                                        <!--Salle & Places-->
                                                                        <div class="row my-3">                                                                                                                     
                                                                            <!--Salle et places -->                                                                                                                
                                                                            <div class="col-12 d-flex justify-content-start align-items-center">
                                                                                <div class="text-white align-content-center fs-5 me-2">Salle:</div>                                                               
                                                                                <div class="dropdown dropdown-modal-admin align-content-center me-3">
                                                                                    <button class="btn btn-secondary nav-link dropdown-toggle color-salle p-2 pe-1" type="button" id="dropdownMenuSalle-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                        N°
                                                                                    </button>
                                                                                    <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuSalle">
                                                                                        <li><a class="dropdown-item drop-salle" href="#">1</a></li>
                                                                                        <li><a class="dropdown-item drop-salle" href="#">2</a></li>
                                                                                        <li><a class="dropdown-item drop-salle" href="#">3</a></li>
                                                                                        <li><a class="dropdown-item drop-salle" href="#">4</a></li>
                                                                                    </ul>
                                                                                </div>
                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                    <div class="text-white align-content-center fs-5 me-2">Places:</div> 
                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-${film.id}" disabled></textarea>
                                                                                </div> 
                                                                            </div>
                                                                        </div>
                                                                        <!--3DX-->
                                                                        <div id="row-3DX-${film.id}" class="row mt-3 d-none">
                                                                            ${(() => {
                                                                                const total3DX = film.seances.filter(seance => seance.qualite === "3DX").length;
                                                                                const seances3DX = film.seances.filter(seance => seance.qualite === "3DX");
                                                                                return seances3DX.map((seance, i) => seance.qualite === "3DX" ? `
                                                                                <div class="row mb-3">   
                                                                                    <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                        <div class="text-white align-content-center fs-5 me-2">Heure 3DX:</div>
                                                                                        <div class="position-relative me-3">
                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                            <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                        </div>
                                                                                        <div class="position-relative me-3">
                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                            <span class="bi bi-clock" id="icon-clock-fin-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                        </div>
                                                                                        <div class="d-flex justify-content-center align-items-center">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                            <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-3DX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                            <div class="mx-1 fs-5 text-white">€</div>
                                                                                        </div>
                                                                                    </div> 
                                                                                </div>
                                                                                ` : '').join('') +
                                                                                    [...Array(4 - total3DX)].map((_, i) => `
                                                                                        <div class="row mb-3"> 
                                                                                            <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Heure 3DX:</div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Début">
                                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Fin">
                                                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                                    <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-3DX-${i + 1 + total3DX}-prix-${film.id}"></textarea>
                                                                                                    <div class="mx-1 fs-5 text-white">€</div>
                                                                                                </div>   
                                                                                            </div>                                                                                                                                 
                                                                                        </div>
                                                                                    `).join('');
                                                                            })()}
                                                                        </div>
                                                                        <!--4DX-->
                                                                        <div id="row-4DX-${film.id}" class="row mt-3 d-none">                                          
                                                                            ${(() => {
                                                                                const total4DX = film.seances.filter(seance => seance.qualite === "4DX").length;
                                                                                const seances4DX = film.seances.filter(seance => seance.qualite === "4DX");
                                                                                return seances4DX.map((seance, i) => seance.qualite === "4DX" ? `
                                                                                    <div class="row mb-3">   
                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure 4DX:</div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-4DX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                            </div>
                                                                                        </div> 
                                                                                    </div>
                                                                                ` : '').join('') +
                                                                                    [...Array(4 - total4DX)].map((_, i) => `
                                                                                        <div class="row mb-3"> 
                                                                                            <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Heure 4DX:</div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Début">
                                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Fin">
                                                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                                    <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-4DX-${i + 1 + total4DX}-prix-${film.id}"></textarea>
                                                                                                    <div class="mx-1 fs-5 text-white">€</div>
                                                                                                </div>   
                                                                                            </div>                                                                                                                                 
                                                                                    </div>
                                                                                `).join('');
                                                                            })()}
                                                                        </div>
                                                                        <!--IMAX-->
                                                                        <div id="row-IMAX-${film.id}" class="row mt-3 d-none">                                                                                                        
                                                                            ${(() => {
                                                                                const totalIMAX = film.seances.filter(seance => seance.qualite === "IMAX").length;
                                                                                const seancesIMAX = film.seances.filter(seance => seance.qualite === "IMAX");
                                                                                return seancesIMAX.map((seance, i) => seance.qualite === "IMAX" ? `
                                                                                    <div class="row mb-3">   
                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure IMAX:</div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-IMAX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                            </div>
                                                                                        </div> 
                                                                                </div>
                                                                                ` : '').join('') +
                                                                                    [...Array(4 - totalIMAX)].map((_, i) => `
                                                                                        <div class="row mb-3"> 
                                                                                            <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Heure IMAX:</div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Début">
                                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Fin">
                                                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                </div>
                                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                                    <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-IMAX-${i + 1 + totalIMAX}-prix-${film.id}"></textarea>
                                                                                                    <div class="mx-1 fs-5 text-white">€</div>
                                                                                                </div>   
                                                                                            </div>                                                                                                                                 
                                                                                        </div>
                                                                                    `).join('');
                                                                            })()}
                                                                        </div>
                                                                        <!--Dolby-->
                                                                        <div id="row-Dolby-${film.id}" class="row mt-3 d-none">
                                                                            ${(() => {
                                                                                const totalDolby = film.seances.filter(seance => seance.qualite === "Dolby").length;
                                                                                const seancesDolby = film.seances.filter(seance => seance.qualite === "Dolby");
                                                                                return seancesDolby.map((seance, i) => seance.qualite === "Dolby" ? `
                                                                                    <div class="row mb-3">   
                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure Dolby:</div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly">
                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="position-relative me-3">
                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                            </div>
                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-Dolby-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                            </div>
                                                                                        </div> 
                                                                                    </div>` : '').join('') +
                                                                                        [...Array(4 - totalDolby)].map((_, i) => `
                                                                                            <div class="row mb-3"> 
                                                                                                <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                    <div class="text-white align-content-center fs-5 me-2">Heure Dolby:</div>
                                                                                                    <div class="position-relative me-3">
                                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Début">
                                                                                                        <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                    </div>
                                                                                                    <div class="position-relative me-3">
                                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Fin">
                                                                                                        <span class="bi bi-clock" id="icon-clock-fin-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                    </div>
                                                                                                    <div class="d-flex justify-content-center align-items-center">
                                                                                                        <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-Dolby-${i + 1 + totalDolby}-prix-${film.id}"></textarea>
                                                                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                                                                    </div>   
                                                                                                </div>                                                                                                                                 
                                                                                            </div>
                                                                                    `).join('');
                                                                            })()}
                                                                        </div>
                                                                        <!--Description-->
                                                                        <div class="row">
                                                                            <div class="col-3 text-white align-items-center justify-content-start">
                                                                                <div class="fs-5">Description:</div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-12 d-flex text-white align-items-center">
                                                                                <textarea class="form-control p-2 textarea-uniforme text-start overflow-y-scroll" placeholder="" id="Textarea-description-${film.id}" style="height:8rem">${film.description}</textarea>
                                                                                <label class="d-none" for="Textarea-description-${film.id}"></label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`);

                                    //suppression film
                                        $('#x-square-'+film.id).click(function () {
                                        axios.post('/administrateur/administration/film/delete', JSON.stringify({id: film.id}))
                                            .then(response => {filmAdmin();console.log(response.data);})
                                            .catch(error => {console.error(error);})
                                    });

                                    //Affichage badge age mini
                                        function displayAgeBadge() {
                                                const  ageFilm = $('#age-' + film.id);
                                                // Ciblez chaque badge d'âge à partir du conteneur
                                                const ageBadge12 = ageFilm.find('.age-badge-12');
                                                const ageBadge16 = ageFilm.find('.age-badge-16');
                                                const ageBadge18 = ageFilm.find('.age-badge-18');
                                                // Logique de gestion des classes pour afficher/masquer les badges d'âge
                                                if (film.age_minimum === '12') {
                                                    ageBadge12.removeClass('d-none');
                                                    ageBadge16.addClass('d-none');
                                                    ageBadge18.addClass('d-none');
                                                } else if (film.age_minimum === '16') {
                                                    ageBadge16.removeClass('d-none');
                                                    ageBadge12.addClass('d-none');
                                                    ageBadge18.addClass('d-none');
                                                } else if (film.age_minimum === '18') {
                                                    ageBadge18.removeClass('d-none');
                                                    ageBadge12.addClass('d-none');
                                                    ageBadge16.addClass('d-none');
                                                } else {
                                                    ageBadge12.addClass('d-none');
                                                    ageBadge16.addClass('d-none');
                                                    ageBadge18.addClass('d-none');
                                                }
                                        }
                                        displayAgeBadge()

                                    // Accordion description films
                                        const accordionButton = $('#btn-description-'+film.id);
                                        const accordionCollapse = $('#collapseDescription-'+film.id);

                                        // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                            $(document).click(function(event) {
                                                // Vérifie si le clic est à l'intérieur de l'accordéon
                                                if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                                    // Ferme l'accordéon si ouvert
                                                    if (accordionCollapse.hasClass('show')) {
                                                        accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                                    }
                                                }
                                            });

                                    //modal
                                        // Upload image
                                            let imageData = null;
                                            $('#uploadButton-'+film.id).on('click', function () {
                                                const fileInput = $('#fileInput-'+film.id)[0];
                                                fileInput.click();
                                                $(fileInput).off('change').on('change', function () { // Supprime les écouteurs existants avant d'en ajouter un nouveau
                                                    const selectedFile = fileInput.files[0];
                                                    if (selectedFile) {
                                                        imageData = new FormData(); // Crée un nouvel objet FormData
                                                        imageData.append('image', selectedFile); // Ajoute le fichier sélectionné
                                                        console.log('Image sélectionnée :', selectedFile.name);
                                                    } else {
                                                        console.error('Aucun fichier sélectionné');
                                                    }
                                                });
                                            });

                                        //Menu déroulant genre
                                            const dropdownMenuGenre = $('#dropdownMenuGenre-'+film.id);
                                            const dropGenre = dropdownMenuGenre.siblings('.dropdown-menu').find('.drop-genre');
                                            let selectedGenre= '';
                                            dropGenre.click(function(e) {
                                                e.preventDefault();
                                                selectedGenre = $(this).text();
                                                dropdownMenuGenre.text(selectedGenre);
                                        });

                                        //Menu déroulant age
                                            const dropdownMenuAge = $('#dropdownMenuAge-'+film.id);
                                            const dropAge = dropdownMenuAge.siblings('.dropdown-menu').find('.drop-age');
                                            let selectedAge= '';
                                            dropAge.click(function(e) {
                                                e.preventDefault();
                                                selectedAge= $(this).text();
                                                dropdownMenuAge.text(selectedAge);
                                            });

                                        //Menu déroulant Cinéma
                                            const dropdownMenuCinema = $('#dropdownMenuCinema-'+film.id);
                                            const dropCinema = dropdownMenuCinema.siblings('.dropdown-menu').find('.drop-cinema');
                                            let selectedCinema = '';

                                            // Gérer le clic sur le menu
                                                dropCinema.click(function (e) {
                                                e.preventDefault();
                                                selectedCinema = $(this).text();
                                                dropdownMenuCinema.text(selectedCinema);
                                            });

                                        //Menu déroulant Coup de cœur
                                            const dropdownMenuLabel = $('#dropdownMenuLabel-' + film.id);
                                            const label = dropdownMenuLabel.siblings('.dropdown-menu').find('.drop-label');
                                            let selectedCoupCoeur= '';
                                            label.click(function(e) {
                                                e.preventDefault();
                                                selectedCoupCoeur= $(this).text();
                                                dropdownMenuLabel.text(selectedCoupCoeur);
                                            });
                                            dropdownMenuLabel.text(film.label ? 'Oui' : 'Non');

                                        // Menu déroulant Salle
                                            const dropdownMenuSalle = $('#dropdownMenuSalle-'+film.id);
                                            const dropSalle = dropdownMenuSalle.siblings('.dropdown-menu').find('.drop-salle');
                                            let selectedSalle= '';
                                            dropSalle.click(function(e) {
                                                e.preventDefault();
                                                selectedSalle= $(this).text();
                                                dropdownMenuSalle.text(selectedSalle);
                                            });

                                        // Écoute l'événement de clic sur les éléments du menu déroulant
                                            dropSalle.on('click', function(e) {
                                            e.preventDefault();
                                            const value = $(this).text();
                                            const row3DX = $('#row-3DX-'+film.id);
                                            const row4DX = $('#row-4DX-'+film.id);
                                            const rowIMAX = $('#row-IMAX-'+film.id);
                                            const rowDolby = $('#row-Dolby-'+film.id);
                                            if (value === '1') {
                                                row3DX.removeClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '2') {
                                                row4DX.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '3') {
                                                rowIMAX.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '4') {
                                                rowDolby.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                            }
                                        });

                                        // Menu déroulant places
                                            const dropdownMenuPlaces = $('#dropdownMenuPlaces-'+film.id);
                                            const dropPlaces = dropdownMenuPlaces.siblings('.dropdown-menu').find('.drop-places');
                                            let selectedPlaces= '';
                                            dropPlaces.click(function(e) {
                                                e.preventDefault();
                                                selectedPlaces= $(this).text();
                                                dropdownMenuPlaces.text(selectedPlaces);
                                            });

                                        // Réinitialiser le modal lorsque celui-ci est fermé
                                            $('#modal-' + film.id).on('hidden.bs.modal', function () {
                                            filmAdmin();
                                        });

                                        //Valider les informations du film
                                            const formats = ["3DX", "4DX", "IMAX", "Dolby"];
                                            const nombreSeances = 4;
                                            $('#btn-validate-film-'+film.id).click(function () {
                                            const datepickerDebut = $('#datepicker-admin-debut-'+film.id);
                                            const datepickerFin = $('#datepicker-admin-fin-'+film.id);
                                            const dropdownPlaces = $(`#dropdownMenuPlaces-${film.id}`);
                                            let datePartsDebut = datepickerDebut.val().split('/');
                                            let datePartsFin = datepickerFin.val().split('/');
                                            let formattedDateDebut = datePartsDebut[2] + '-' + datePartsDebut[1] + '-' + datePartsDebut[0];
                                            let formattedDateFin = datePartsFin[2] + '-' + datePartsFin[1] + '-' + datePartsFin[0];
                                            let label = $('#dropdownMenuLabel-'+film.id).text();
                                            label = label === 'Oui' ? 1 : 0;
                                            const data = {
                                                id: film.id,
                                                genre: selectedGenre,
                                                age: selectedAge,
                                                label: label,
                                                nom: $(`#TextareaNom-${film.id}`).val(),
                                                cinema: selectedCinema,
                                                date_debut: formattedDateDebut,
                                                date_fin: formattedDateFin,
                                                salle: $(`#dropdownMenuSalle-${film.id}`).text(),
                                                places: dropdownPlaces.text(),
                                                description: $(`#Textarea-description-${film.id}`).val(),
                                                film_reset: ''
                                            };
                                            formats.forEach(format => {
                                                for (let i = 1; i <= nombreSeances; i++) {
                                                    data[`heure_debut_${format}_${i}`] = $(`#timepicker-admin-debut-${format}-${i}-${film.id}`).val();
                                                    data[`heure_fin_${format}_${i}`] = $(`#timepicker-admin-fin-${format}-${i}-${film.id}`).val();
                                                    data[`price_${format}_${i}`] = $(`#Textarea-${format}-${i}-prix-${film.id}`).val();
                                                }
                                            });
                                            let formData = new FormData();
                                            if (imageData) {
                                                formData.append('image', imageData.get('image'));
                                            }
                                            for (const key in data) {
                                                formData.append(key, data[key]);
                                            }
                                            // Vérification des timepickers (heure de début et heure de fin)
                                            let timeError = false;
                                            formats.forEach(format => {
                                                for (let i = 1; i <= nombreSeances; i++) {
                                                    let heureDebut = $(`#timepicker-admin-debut-${format}-${i}-${film.id}`).val().trim();
                                                    let heureFin = $(`#timepicker-admin-fin-${format}-${i}-${film.id}`).val().trim();
                                                    let prix = $(`#Textarea-${format}-${i}-prix-${film.id}`).val().trim();
                                                    // Si une heure de début est renseignée, mais pas l'heure de fin
                                                    if (heureDebut !== '' && heureFin === '') {
                                                        timeError = true;
                                                    }

                                                    // Si une heure de début et une heure de fin sont renseignées, mais pas de date
                                                    if ((heureDebut !== '' && heureFin !== '') && (datepickerDebut.val().trim() === '' || datepickerFin.val().trim() === '')) {
                                                        timeError = true;
                                                    }
                                                    // Si une heure de début et une heure de fin sont renseignées, mais pas de prix
                                                    if ((heureDebut !== '' && heureFin !== '') && prix === '') {
                                                        timeError = true;
                                                    }
                                                }
                                            });
                                            if (timeError) {
                                                alert('Veuillez renseigner une heure de fin, une date de début, une date de fin et le prix lorsque vous spécifiez une heure de début.');
                                                return;
                                            }
                                            axios.post('/administrateur/administration/film/validate', formData , {
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                }
                                            })
                                                .then(response => {console.log(response.data);})
                                                .catch(error => {console.error(error);})
                                        });

                                        // Reset des champs
                                            $('#btn-reset-' + film.id).click(function () {
                                                const data = {id: film.id};
                                                axios.post('/administrateur/administration/film/reset', data)
                                                    .then(response => {console.log(response.data)})
                                                    .catch(error => {console.error(error);})
                                            });

                                        // Datepicker
                                            const $datepickerDebut = $('#datepicker-admin-debut-'+film.id);
                                            const $calendarIconDebut = $('#icon-calendar-debut-admin-'+film.id);
                                            const $clearIconDebut = $('#close-icon-date-debut-admin-'+film.id);
                                            const $datepickerFin = $('#datepicker-admin-fin-'+film.id);
                                            const $calendarIconFin = $('#icon-calendar-fin-admin-'+film.id);
                                            const $clearIconFin = $('#close-icon-date-fin-admin-'+film.id);

                                        //Date début
                                            $datepickerDebut.val(film.date_debut);
                                            $datepickerDebut.datepicker({
                                                format: "dd/mm/yyyy",
                                                orientation: "bottom",
                                                language: "fr",
                                                autoclose: true
                                            })
                                                .on('changeDate', function () {
                                                    if ($datepickerDebut.val().trim() === '') {
                                                        $datepickerFin.prop('disabled', true);
                                                    } else {
                                                        $datepickerFin.val('').prop('disabled', false);
                                                    }
                                                    // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                    $calendarIconDebut.addClass('d-none');
                                                    $clearIconDebut.removeClass('d-none');
                                                });

                                        // Affiche l'icône de croix et cache l'icône calendrier si une date est déjà sélectionnée
                                            if ($datepickerDebut.val().trim() !== '') {
                                                $calendarIconDebut.addClass('d-none');
                                                $clearIconDebut.removeClass('d-none');
                                            }

                                        // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                            $clearIconDebut.on('click', function () {
                                            $datepickerDebut.datepicker('clearDates');
                                            $calendarIconDebut.removeClass('d-none');
                                            $clearIconDebut.addClass('d-none');
                                        });

                                        // Appliquer le style de hover/focus lors du clic sur l'icône croix
                                            $clearIconDebut.on('mouseenter focus', function () {
                                            $datepickerDebut.addClass('btn-hover');
                                            $clearIconDebut.addClass('btn-hover');
                                        });

                                        // Appliquer le style de hover/focus
                                            $calendarIconDebut.on('mouseenter focus', function () {
                                            $datepickerDebut.addClass('btn-hover');
                                            $calendarIconDebut.addClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                            $clearIconDebut.on('mouseleave blur', function () {
                                            $datepickerDebut.removeClass('btn-hover');
                                            $clearIconDebut.removeClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                            $calendarIconDebut.on('mouseleave blur', function () {
                                            $datepickerDebut.removeClass('btn-hover');
                                            $calendarIconDebut.removeClass('btn-hover');
                                        });

                                        // Ouvrir le calendrier lorsque l'on clique sur l'icône calendrier
                                            $calendarIconDebut.on('click', function () {
                                            $datepickerDebut.focus();
                                        });

                                        //Date fin
                                            $datepickerFin.val(film.date_fin);
                                            $datepickerFin.datepicker({
                                                format: "dd/mm/yyyy",
                                                orientation: "bottom",
                                                language: "fr",
                                                autoclose: true
                                            })
                                                .on('changeDate', function () {
                                                    if ($datepickerFin.val().trim()) {
                                                        const dateDebut = new Date($datepickerDebut.val().trim().split('/').reverse().join('-'));
                                                        const dateFin = new Date($datepickerFin.val().trim().split('/').reverse().join('-'));
                                                        if (dateFin < dateDebut) {
                                                            $calendarIconFin.removeClass('d-none');
                                                            $clearIconFin.addClass('d-none');
                                                            $datepickerFin.val('');
                                                            alert('La date de fin doit être supérieure ou égale à la date de début.');
                                                        }else {
                                                            // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                            $calendarIconFin.addClass('d-none');
                                                            $clearIconFin.removeClass('d-none');
                                                        }
                                                    }
                                                });

                                        // Affiche l'icône de croix et cache l'icône calendrier si une date est déjà sélectionnée
                                            if ($datepickerFin.val().trim() !== '') {
                                            $calendarIconFin.addClass('d-none');
                                            $clearIconFin.removeClass('d-none');
                                        }

                                        // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                            $clearIconFin.on('click', function () {
                                            $datepickerFin.datepicker('clearDates');
                                            $calendarIconFin.removeClass('d-none');
                                            $clearIconFin.addClass('d-none');
                                        });

                                        // Appliquer le style de hover/focus
                                            $clearIconFin.on('mouseenter focus', function () {
                                            $datepickerFin.addClass('btn-hover');
                                            $clearIconFin.addClass('btn-hover');
                                        });

                                        // Appliquer le style de hover/focus
                                            $calendarIconFin.on('mouseenter focus', function () {
                                            $datepickerFin.addClass('btn-hover');
                                            $calendarIconFin.addClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                            $clearIconFin.on('mouseleave blur', function () {
                                            $datepickerFin.removeClass('btn-hover');
                                            $clearIconFin.removeClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                            $calendarIconFin.on('mouseleave blur', function () {
                                            $datepickerFin.removeClass('btn-hover');
                                            $calendarIconFin.removeClass('btn-hover');
                                        });

                                        // Ouvrir le calendrier lorsque l'on clique sur l'icône calendrier
                                            $calendarIconFin.on('click', function () {
                                            $datepickerFin.focus();
                                        });

                                        // Désactiver les datepickers si une date de début et une date de fin sont déjà renseignées
                                            if ($datepickerDebut.val().trim() && $datepickerFin.val().trim()) {
                                            $datepickerDebut.prop('disabled', true);
                                            $datepickerFin.prop('disabled', true);
                                            $clearIconDebut.addClass('d-none');
                                            $clearIconFin.addClass('d-none');
                                            $calendarIconDebut.removeClass('d-none');
                                            $calendarIconFin.removeClass('d-none');
                                        } else {
                                            $datepickerFin.prop('disabled', true);
                                        }

                                        //Timepicker
                                            // Fonction pour générer les constantes pour chaque combinaison
                                            function generateTimepickerConstants(filmId) {
                                                const types = ['3DX', '4DX', 'IMAX', 'Dolby'];  // Les types 3DX et 4DX
                                                const sessions = [1, 2, 3, 4];  // Les sessions 1, 2, 3, 4
                                                let constants = [];

                                                // Boucles pour générer les constantes
                                                types.forEach(type => {
                                                    sessions.forEach(session => {
                                                        constants.push({
                                                            // Début
                                                            timepickerIdDebut: `#timepicker-admin-debut-${type}-${session}-${filmId}`,
                                                            clockIconIdDebut: `#icon-clock-debut-admin-${type}-${session}-${filmId}`,
                                                            clearIconIdDebut: `#close-icon-time-debut-admin-${type}-${session}-${filmId}`,
                                                            // Fin
                                                            timepickerIdFin: `#timepicker-admin-fin-${type}-${session}-${filmId}`,
                                                            clockIconIdFin: `#icon-clock-fin-admin-${type}-${session}-${filmId}`,
                                                            clearIconIdFin: `#close-icon-time-fin-admin-${type}-${session}-${filmId}`,
                                                            price: `#Textarea-${type}-${session}-prix-${filmId}`
                                                        });
                                                    });
                                                });

                                                return constants;
                                            }
                                            function initTimepickerWithValidation(timepickerIdDebut, clockIconIdDebut, clearIconIdDebut, timepickerIdFin, clockIconIdFin, clearIconIdFin, price, modalTimeFieldIdFin) {
                                            const $timepickerDebut = $(timepickerIdDebut);
                                            const $clockIconDebut = $(clockIconIdDebut);
                                            const $clearIconDebut = $(clearIconIdDebut);

                                            const $timepickerFin = $(timepickerIdFin);
                                            const $clockIconFin = $(clockIconIdFin);
                                            const $clearIconFin = $(clearIconIdFin);

                                            const $price = $(price);

                                            const $modalTimeFieldFin = $(modalTimeFieldIdFin); // Élément du modal où l'heure de fin doit être mise à jour

                                            // Initialisation du Timepicker pour "Début"
                                            const timepickerDebutInstance = flatpickr($timepickerDebut, {
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                                minuteIncrement: 15,
                                                onChange: function(selectedDates, dateStr) {
                                                    if (dateStr.trim()) {
                                                        $timepickerFin.removeAttr('disabled'); // Activer le champ "Fin"
                                                        $price.removeAttr('disabled'); // Activer le champ "Prix"
                                                        $clockIconDebut.addClass('d-none');
                                                        $clearIconDebut.removeClass('d-none');

                                                        // Validation de "Fin" par rapport à "Début"
                                                        const timeDebut = new Date(`1970-01-01T${dateStr}:00`);
                                                        const timeFin = $timepickerFin.val().trim() ? new Date(`1970-01-01T${$timepickerFin.val()}:00`) : null;

                                                        if (timeFin && timeFin <= timeDebut) {
                                                            // Si l'heure de fin est inférieure ou égale à l'heure de début
                                                            timepickerFinInstance.setDate(null); // Ne pas afficher de valeur par défaut dans le timepicker
                                                            $timepickerFin.val(''); // Réinitialiser la valeur de l'input
                                                            $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                            $price.text(''); // Réinitialiser le prix
                                                            alert('L’heure de fin doit être supérieure à l’heure de début.');

                                                            // Supprimer la valeur de "Début" si "Fin" <= "Début"
                                                            $timepickerDebut.val('');
                                                            $clearIconDebut.removeClass('d-none');
                                                            $clockIconDebut.addClass('d-none');
                                                        }
                                                    } else {
                                                        $timepickerFin.val('').attr('disabled', true); // Désactiver le champ "Fin"
                                                        $clockIconFin.removeClass('d-none');
                                                        $clearIconFin.addClass('d-none');
                                                        $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                        $price.attr('disabled', true); // Désactiver le champ "Prix"
                                                        $price.val(''); // Réinitialiser le prix
                                                    }
                                                }
                                            });

                                            // Initialisation du Timepicker pour "Fin"
                                            const timepickerFinInstance = flatpickr($timepickerFin, {
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                                minuteIncrement: 15,
                                                onOpen: function() {
                                                    // Set the menu (dropdown) to 12:15 when opening the timepicker, but do not set the input
                                                    if (!$timepickerFin.val().trim() && $timepickerDebut.val().trim()) {
                                                        timepickerFinInstance.setDate('12:15', true); // Set time for menu display only (not input)
                                                    }
                                                },
                                                onChange: function(selectedDates, dateStr) {
                                                    if (dateStr.trim()) {
                                                        const timeDebut = $timepickerDebut.val().trim() ? new Date(`1970-01-01T${$timepickerDebut.val()}:00`) : null;
                                                        const timeFin = new Date(`1970-01-01T${dateStr}:00`);

                                                        if (timeDebut && timeFin <= timeDebut) {
                                                            // Réinitialiser "Fin" si l'heure est inférieure ou égale à l'heure de début
                                                            timepickerFinInstance.setDate(null); // Réinitialiser avec aucune valeur
                                                            $timepickerFin.val(''); // Réinitialiser la valeur de l'input
                                                            $price.val(''); // Réinitialiser le prix
                                                            $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                            alert('L’heure de fin doit être supérieure à l’heure de début.');
                                                            $clockIconFin.removeClass('d-none');
                                                            $clearIconFin.addClass('d-none');

                                                            // Supprimer la valeur de "Début" si "Fin" <= "Début"
                                                            $timepickerDebut.val('');
                                                            $clearIconDebut.addClass('d-none');
                                                            $clockIconDebut.removeClass('d-none');
                                                            $timepickerFin.attr('disabled', true); // Désactiver le champ "Fin"
                                                            $price.attr('disabled', true); // Désactiver le champ "Prix"
                                                        } else {
                                                            $clockIconFin.addClass('d-none');
                                                            $clearIconFin.removeClass('d-none');
                                                            $modalTimeFieldFin.val(dateStr); // Mettre à jour l'heure de fin dans le modal
                                                        }
                                                    }
                                                }
                                            });

                                            // Quand l'icône de l'horloge est cliquée
                                            $clockIconFin.on("click", function() {
                                                const $input = $(this).siblings("input"); // Trouve l'input associé
                                                $input.trigger("focus"); // Déclenche le focus sur l'input
                                                $input.click(); // Déclenche l'événement de clic s'il y en a un
                                            });
                                            $clockIconDebut.on("click", function() {
                                                const $input = $(this).siblings("input"); // Trouve l'input associé
                                                $input.trigger("focus"); // Déclenche le focus sur l'input
                                                $input.click(); // Déclenche l'événement de clic s'il y en a un
                                            });

                                            // Quand la souris entre dans l'icône de l'horloge
                                            $clockIconDebut.on("mouseenter", function() {
                                                const inputId = $(this).siblings("input").attr("id"); // Trouve l'input associé
                                                $(`#${inputId}`).addClass("btn-hover");
                                            });
                                            $clockIconFin.on("mouseenter", function() {
                                                const inputId = $(this).siblings("input").attr("id"); // Trouve l'input associé
                                                $(`#${inputId}`).addClass("btn-hover");
                                            });

                                            // Quand la souris quitte l'icône de l'horloge
                                            $clockIconDebut.on("mouseleave", function() {
                                                const inputId = $(this).siblings("input").attr("id");
                                                $(`#${inputId}`).removeClass("btn-hover");
                                            });
                                            $clockIconFin.on("mouseleave", function() {
                                                const inputId = $(this).siblings("input").attr("id");
                                                $(`#${inputId}`).removeClass("btn-hover");
                                            });

                                            // Desactiver le timepicker "Fin" et prix si "Début" est vide
                                            if ($timepickerDebut.attr('placeholder').trim() !== 'Début' && $timepickerFin.attr('placeholder').trim() !== 'Fin') {
                                                $timepickerDebut.attr('disabled', true);
                                                $timepickerFin.attr('disabled', true);
                                                $price.attr('disabled', true);
                                                $clearIconDebut.addClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                                $clockIconDebut.removeClass('d-none');
                                                $clockIconFin.removeClass('d-none');
                                            } else {
                                                $timepickerFin.attr('disabled', true);
                                                $price.attr('disabled', true);
                                            }

                                            // Icônes pour "Début"
                                            $clearIconDebut.on('click', function() {
                                                timepickerDebutInstance.clear();
                                                $clockIconDebut.removeClass('d-none');
                                                $clearIconDebut.addClass('d-none');
                                                $timepickerFin.val('').attr('disabled', true);
                                                $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                $clockIconFin.removeClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                            });

                                            // Icônes pour "Fin"
                                            $clearIconFin.on('click', function() {
                                                timepickerFinInstance.clear();
                                                $clockIconFin.removeClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                                $modalTimeFieldFin.val('');// Réinitialiser l'heure de fin dans le modal
                                            });
                                        }
                                            function initAllTimepickers(filmId) {
                                            // Générer les constantes pour le film
                                            const timepickerConstants = generateTimepickerConstants(filmId);

                                            // Initialiser chaque timepicker avec validation entre "Début" et "Fin"
                                            timepickerConstants.forEach(function(constant) {
                                                initTimepickerWithValidation(
                                                    constant.timepickerIdDebut,
                                                    constant.clockIconIdDebut,
                                                    constant.clearIconIdDebut,
                                                    constant.timepickerIdFin,
                                                    constant.clockIconIdFin,
                                                    constant.clearIconIdFin,
                                                    constant.price,
                                                    constant.modalTimeFieldIdFin // Ajouter l'ID du champ du modal pour "Fin"
                                                );
                                            });
                                        }

                                            const filmId = film.id;
                                            initAllTimepickers(filmId);

                                });

                                // Finaliser la progression à 100 % lorsque les données sont chargées
                                clearInterval(interval); // Stopper l'intervalle de mise à jour
                                progress = 100;
                                progressBar.css('width', '100%').attr('aria-valuenow', progress);

                                // Masquer la barre de chargement après un délai de 500ms
                                setTimeout(() => loadingBar.addClass('d-none'), 500);
                            })
                            .catch(error => {
                                console.error('Erreur lors du chargement des films :', error);

                                // Finaliser à 100 % en cas d'erreur
                                clearInterval(interval);
                                progress = 100;
                                progressBar.css('width', '100%').attr('aria-valuenow', progress);

                                // Masquer la barre de chargement après un délai de 500ms
                                setTimeout(() => loadingBar.addClass('d-none'), 500);
                            });
                    }
        //Création d'un film sur clic bouton plus
        $('#btn-plus-admin').click(function () {
                        axios.post('/administrateur/administration/film/create')
                        .then(response => {filmAdmin();console.log(response.data);})
                        .catch(error => {
                            console.error(error);
                        });
                });
        //Affichage des films sur clic bouton administration
        $('#btn-navbar-admin').click(function() {
                    filmAdmin();
                });
        //Déconnexion sur clic bouton déconnexion
        $('#btn-deconnexion-admin').click(function() {
                    axios.post('/logout')
                        .then(response => {console.log(response.data);window.location.href = '/accueil';})
                        .catch(error => {console.error(error);});
                });
        //Fonction pour générer les réservations
        function loadReservations() {
            const $datepickerReservations = $('#datepicker_reservations');
            const $calendarIconReservations = $('#icon-calendar-reservations');
            const $clearIconReservations = $('.close-icon-reservations');
            const $reservationsContainer = $('#reservations-container');

            $reservationsContainer.empty();
            axios.get('/administrateur/administration/film')
                .then(response => {
                    const films = response.data;
                    const datesWithReservations = {};

                    films.forEach(film => {
                        if (film.reservations) {
                            Object.keys(film.reservations).forEach(date => {
                                if (!datesWithReservations[date]) {
                                    datesWithReservations[date] = 0;
                                }
                                datesWithReservations[date] += film.reservations[date];
                            });
                        }
                    });
                    // Initialisation du datepicker
                    $datepickerReservations.datepicker({
                        orientation: "bottom",
                        language: "fr",
                        autoclose: true,
                        format: 'dd/mm/yyyy',
                        beforeShowDay: function (date) {
                            const dateString = formatDate(date);
                            const reservations = datesWithReservations[dateString] || 0;
                            if (reservations > 0) {
                                return {
                                    classes: 'has-reservation',
                                    tooltip: `Réservations: ${reservations}`
                                };
                            } else {
                                return {tooltip: 'Aucune réservation'};
                            }
                        }
                    });

                    // Fonction pour formater les dates au format "dd/mm/yyyy"
                    function formatDate(date) {
                        let day = date.getDate();
                        let month = date.getMonth() + 1; // Les mois commencent à
                        let year = date.getFullYear();
                        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
                    }

                    // Fonction pour obtenir les 7 jours à partir de la date sélectionnée
                    function getNext7Days(selectedDate) {
                        const days = [];
                        const baseDate = new Date(selectedDate);
                        for (let i = 0; i < 7; i++) {
                            let newDate = new Date(baseDate);
                            newDate.setDate(baseDate.getDate() + i);
                            days.push(newDate);
                        }
                        return days;
                    }

                    // Fonction pour afficher les informations dans le tableau
                    function updateTableWithReservations(selectedDate) {
                        const days = getNext7Days(selectedDate);
                        const formattedDays = days.map(date => formatDate(date));

                        $reservationsContainer.empty();

                        // Créer la première colonne : Noms des films
                        const col2 = $('<div class="col-2" style="background-color: #6A73AB"></div>');
                        col2.append('<div class="row"><div class="col grid-cell fw-bold">Nombre de réservations</div></div>');
                        films.forEach(film => {
                            col2.append(`<div class="row"><div class="col grid-cell fw-bold">${film.name}</div></div>`);
                        });

                        // Créer la deuxième colonne : Dates et réservations
                        const col6 = $('<div class="col-6" style="background-color: #6A73AB"></div>');

                        // Ajouter les dates formatées
                        const datesRow = $('<div class="row"></div>');
                        formattedDays.forEach(day => {
                            const dayFormatted = day.slice(0, 5);
                            datesRow.append(`<div class="col grid-cell fw-bold">${dayFormatted}</div>`);
                        });
                        col6.append(datesRow);

                        // Ajouter les lignes pour les films
                        films.forEach(film => {
                            const filmRow = $('<div class="row"></div>');
                            formattedDays.forEach(day => {
                                const reservations = film.reservations[day] || 0;
                                filmRow.append(`<div class="col grid-cell">${reservations}</div>`);
                            });
                            col6.append(filmRow);
                        })

                        // Ajouter les colonnes au conteneur principal
                        const headerRow = $('<div class="row justify-content-center text-white mb-4"></div>');
                        headerRow.append(col2).append(col6);
                        $reservationsContainer.append(headerRow);
                    }

                    // Datepicker
                    $datepickerReservations.on('changeDate', function (e) {
                        // Lors de la sélection d'une date
                        const selectedDate = $(this).val();
                        const [day, month, year] = selectedDate.split('/');
                        const formattedDate = `${year}-${month}-${day}`;
                        updateTableWithReservations(formattedDate);
                        // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                        $calendarIconReservations.addClass('d-none');
                        $clearIconReservations.removeClass('d-none');
                    });

                    // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                    $clearIconReservations.on('click', function () {
                        $datepickerReservations.datepicker('clearDates');
                        $calendarIconReservations.removeClass('d-none');
                        $clearIconReservations.addClass('d-none');
                        $('#reservations-container').empty();
                    });

                    // Appliquer le style de hover/focus
                    $clearIconReservations.on('mouseenter focus', function () {
                        $datepickerReservations.addClass('btn-hover');
                        $clearIconReservations.addClass('btn-hover');
                    });

                    // Au clic sur l'icône de croix, on réinitialise la date
                    $calendarIconReservations.on('mouseenter focus', function () {
                        $datepickerReservations.addClass('btn-hover');
                        $calendarIconReservations.addClass('btn-hover');
                    });

                    // Retirer le style quand on quitte le survol/focus
                    $clearIconReservations.on('mouseleave blur', function () {
                        $datepickerReservations.removeClass('btn-hover');
                        $clearIconReservations.removeClass('btn-hover');
                    });

                    // Retirer le style quand on quitte le survol/focus
                    $calendarIconReservations.on('mouseleave blur', function () {
                        $datepickerReservations.removeClass('btn-hover');
                        $calendarIconReservations.removeClass('btn-hover');
                    });

                    // Ouvrir le calendrier
                    $calendarIconReservations.on('click', function () {
                        $datepickerReservations.focus();
                    });
                })
                .catch(error => {
                    console.error(error);
                })
        }
        //Fonction pour gérer les employés
        function employe() {
                    //Affichage des réservations sur clic datepicker
                    loadReservations();

                    //Création compte
                    $('#toggleEmployePassword').on('click', function () {
                        const passwordField = $('#employePassword');
                        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                        passwordField.attr('type', type);
                        $(this).toggleClass('bi-eye bi-eye-slash');
                    });

                    //Réinnitialiser le mot de passe
                    const $clearIconEmploye = $('.close-icon-employe');

                    //Au clic sur le bouton choix employés pour afficher/masquer les options
                    $('.custom-select-btn-employe').on('click', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        $('.custom-options-employe').toggle();
                    });

                    //Sélection d'une option employés
                    $('.custom-option-employe').on('click', function () {
                        let selectedText = $(this).text();
                        let selectedValue = $(this).data('value');
                        let customSelect = $('.custom-select-btn-employe');
                        customSelect.text(selectedText);
                        $('#employe-input').val(selectedValue);
                        $('.custom-options-employe').hide();
                        customSelect.addClass('no-arrow');
                        $('.close-icon-employe').removeClass('d-none');
                    });

                    //Au clic sur l'icône "X" pour réinitialiser la sélection
                    $clearIconEmploye.on('click', function () {
                        let customSelect = $('.custom-select-btn-employe');
                        $(this).addClass('d-none');
                        $('#employe-input').val('');
                        customSelect.text('Choix employés');
                        $('.custom-options-employe').hide();
                        customSelect.removeClass('no-arrow');
                    });

                    //Clic en dehors du menu pour fermer les options
                    $(window).on('click', function () {
                        $('.custom-options-employe').hide();
                    });

                    //Appliquer le style de hover/focus
                    $clearIconEmploye.on('mouseenter focus', function () {
                        $('.custom-select-btn-employe').addClass('btn-hover');
                        $('.close-icon-employe').addClass('btn-hover');
                    });

                    //Retirer le style quand on quitte le survol/focus
                    $clearIconEmploye.on('mouseleave blur', function () {
                        $('.custom-select-btn-employe').removeClass('btn-hover');
                        $('.close-icon-employe').removeClass('btn-hover');
                    });

                    //Affichage des réservations sur clic bouton données réservations
                    $('#btn-reservations').click(function () {
                    loadReservations()
                    });
                }

        //Page Employé
        //Générer des films
        function filmEmploye() {

                        // Vider le conteneur des films
                            $('#card-container').empty();

                        // Barre de chargement
                            const loadingBar = $('#loading-bar');
                            const progressBar = loadingBar.find('.progress-bar');

                        // Réinitialiser la barre de chargement à 0% immédiatement
                            loadingBar.removeClass('d-none');
                            progressBar.css('width', '0%').attr('aria-valuenow', '0');
                            let progress = 0;
                            const updateInterval = 100; // Intervalle pour mise à jour (rapide pour effet fluide)
                            const interval = setInterval(() => {
                                if (progress < 90) {
                                    progress += 5; // Incrément de 5% pour une progression fluide
                                    progressBar.css('width', progress + '%').attr('aria-valuenow', progress);
                                }
                            }, updateInterval);

                        // Récupérer les films
                            axios.get('/employe/administration/film')
                                .then(response => {
                                    const Film = response.data;
                                    $.each(Film, function(index, film) {
                                        $('#card-container').append(
                                            `<div class="col-auto card" style="width: 12rem">
                                                                <div class="position-relative">
                                                                     <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin position-absolute" style="border-radius: 0 0 2px 0" data-bs-toggle="modal" data-bs-target="#modal-${film.id}"></button>
                                                                     <button id="x-square-${film.id}" class="btn bi bi-x-square text-danger p-0 fs-5 bg-admin position-absolute" style="top:0; right: 0; border-radius: 0 0 0 2px"></button>  
                                                                     <i class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
                                                                     <img src="${film.image}" class="card-img-top" alt="image">
                                                                </div>
                                                                <div class="card-body p-0 py-1">
                                                                        <div id="age-${film.name.replace(/\s+/g, '-')}" class="col-12 card-title m-0 fs-5">${film.name}
                                                                            <span class="age-badge-12 d-none ms-2">12+</span>
                                                                            <span class="age-badge-16 d-none ms-2">16+</span>
                                                                            <span class="age-badge-18 d-none ms-2">18+</span>
                                                                        </div>                        
                                                                        <div class="card-title m-0 fs-6">${film.genre}</div>
                                                                        <p class="card-text m-0 text-warning" style="margin: 0.3rem 0 0.3rem 0">
                                                                            <i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                                        </p>
                                                                        <div class="accordion accordion-flush">
                                                                            <div class="accordion-item">
                                                                                <div class="accordion-header">
                                                                                    <button id="btn-description-${film.id}" class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                                                                </div>
                                                                                <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                                                                    <div class="accordion-body p-0">${film.description}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                <!--Modal-->
                                                                <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                                                    <div class="modal-dialog modal-dialog-centered modal-xl">
                                                                        <div class="modal-content" style="background-color: #6A73AB">
                                                                            <div class="modal-body modal-admin row justify-content-center m-0 p-0">
                                                                                <div class="col-4 p-4 text-white position-relative">
                                                                                    <!--Image-->
                                                                                    <div class="position-relative">
                                                                                        <input type="file" id="fileInput-${film.id}" style="display: none">
                                                                                        <button id="uploadButton-${film.id}" class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin-modal position-absolute" style="top: 0; right: 20px; border-radius: 0 0 0 2px"></button>
                                                                                        <img src="${film.image2}" class="img-fluid" alt="image">
                                                                                    </div>    
                                                                                    <!--Genre-->                                                                                                                                          
                                                                                    <div class="row my-3">
                                                                                        <div class="col-12 d-flex justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Genre:</div> 
                                                                                            <div class="dropdown dropdown-modal-admin">
                                                                                                <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuGenre-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                    ${film.genre}
                                                                                                </button>
                                                                                                <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuGenre">
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Action</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Comédie</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Horreur</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Science-fiction</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Romance</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Thriller</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Drame</a></li>
                                                                                                    <li><a class="dropdown-item drop-genre" href="#">Animation</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div> 
                                                                                    </div>
                                                                                    <!--Age minimum-->
                                                                                    <div class="row my-3">
                                                                                        <div class="col-12 d-flex justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Age minimum:</div> 
                                                                                            <div class="dropdown dropdown-modal-admin">
                                                                                                <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuAge-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                    ${film.age_minimum}
                                                                                                </button>
                                                                                                <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuAge">
                                                                                                    <li><a class="dropdown-item drop-age" href="#">Tout public</a></li>
                                                                                                    <li><a class="dropdown-item drop-age" href="#">12</a></li>
                                                                                                    <li><a class="dropdown-item drop-age" href="#">16</a></li>
                                                                                                    <li><a class="dropdown-item drop-age" href="#">18</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div> 
                                                                                    </div>
                                                                                    <!--Coup de cœur-->
                                                                                    <div class="row mt-3">
                                                                                        <div class="col-12 d-flex justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Coup de cœur:</div> 
                                                                                            <div class="dropdown dropdown-modal-admin">
                                                                                                <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuLabel-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">           
                                                                                                </button>
                                                                                                <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuLabel">
                                                                                                    <li><a class="dropdown-item drop-label" href="#">Oui</a></li>
                                                                                                    <li><a class="dropdown-item drop-label" href="#">Non</a></li>                                                                      
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>    
                                                                                </div>
                                                                                <div class="col-8 p-4">
                                                                                    <!--Nom du film et cinéma et boutons validé & sortie-->
                                                                                    <div class="row">
                                                                                        <!--Nom du film-->
                                                                                        <div class="col-6 d-flex align-items-center justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Nom:</div> 
                                                                                            <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="TextareaNom-${film.id}">${film.name}</textarea>
                                                                                            <label class="d-none" for="TextareaNom-${film.id}"></label>
                                                                                        </div>                                                          
                                                                                        <!--Boutons valider & sortie-->
                                                                                        <div class="col-6 d-flex align-items-center justify-content-end">
                                                                                            <button id="btn-reset-${film.id}" class="btn bi bi-arrow-counterclockwise p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                                                            <button id="btn-validate-film-${film.id}" class="btn bi bi-check-lg p-2 fs-4 d-flex justify-content-center align-items-center"></button>
                                                                                            <button class="btn bi bi-x-lg p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <!--Nom du Cinéma-->  
                                                                                    <div class="row my-3">                                                                                                  
                                                                                        <div class="col-12 d-flex align-content-center justify-content-start">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Cinéma:</div> 
                                                                                            <div class="dropdown dropdown-modal-admin">                                                             
                                                                                                 <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuCinema-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                     ${film.cinema}
                                                                                                 </button>
                                                                                                 <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuCinema">
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Toulouse</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Nantes</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Bordeaux</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Lille</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Charleroi</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Liège</a></li>
                                                                                                     <li><a class="dropdown-item drop-cinema" href="#">Paris</a></li>
                                                                                                 </ul>
                                                                                            </div>
                                                                                        </div>  
                                                                                    </div>
                                                                                    <!--Date de début et de fin de diffusion-->
                                                                                    <div class="row my-3">
                                                                                        <div class="col-12 d-flex justify-content-start align-items-center">
                                                                                             <div class="text-white align-content-center fs-5 me-2">Date de diffusion:</div>
                                                                                             <div class="position-relative me-3">
                                                                                                    <input type="text" class="btn-date-admin" id="datepicker-admin-debut-${film.id}" placeholder="Début" readonly>
                                                                                                    <label for="datepicker-admin-debut-${film.id}" class="d-none"></label>
                                                                                                    <span class="bi bi-calendar" id="icon-calendar-debut-admin-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-date-debut-admin-${film.id}"></span>
                                                                                             </div>
                                                                                             <div class="position-relative">
                                                                                                    <input type="text" class="btn-date-admin" id="datepicker-admin-fin-${film.id}" placeholder="Fin" readonly>
                                                                                                    <label for="datepicker-admin-fin-${film.id}" class="d-none"></label>
                                                                                                    <span class="bi bi-calendar" id="icon-calendar-fin-admin-${film.id}"></span>
                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-date-fin-admin-${film.id}"></span>
                                                                                                </div>
                                                                                         </div>                                                                                                                     
                                                                                    </div>
                                                                                    <!--Salle & Places-->
                                                                                    <div class="row my-3">                                                                                                                     
                                                                                        <!--Salle et places et bouton reset -->                                                                                                                
                                                                                        <div class="col-12 d-flex justify-content-start align-items-center">
                                                                                            <div class="text-white align-content-center fs-5 me-2">Salle:</div>                                                               
                                                                                            <div class="dropdown dropdown-modal-admin align-content-center me-3">
                                                                                                <button class="btn btn-secondary nav-link dropdown-toggle color-salle p-2 pe-1" type="button" id="dropdownMenuSalle-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                    N°
                                                                                                </button>
                                                                                                <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuSalle">
                                                                                                    <li><a class="dropdown-item drop-salle" href="#">1</a></li>
                                                                                                    <li><a class="dropdown-item drop-salle" href="#">2</a></li>
                                                                                                    <li><a class="dropdown-item drop-salle" href="#">3</a></li>
                                                                                                    <li><a class="dropdown-item drop-salle" href="#">4</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                <div class="text-white align-content-center fs-5 me-2">Places:</div> 
                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-${film.id}" disabled></textarea>
                                                                                            </div> 
                                                                                        </div>
                                                                                    </div>
                                                                                    <!--3DX-->
                                                                                    <div id="row-3DX-${film.id}" class="row mt-3 d-none">
                                                                                        ${(() => {
                                                const total3DX = film.seances.filter(seance => seance.qualite === "3DX").length;
                                                const seances3DX = film.seances.filter(seance => seance.qualite === "3DX");
                                                return seances3DX.map((seance, i) => seance.qualite === "3DX" ? `
                                                                                            <div class="row mb-3">   
                                                                                                <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                    <div class="text-white align-content-center fs-5 me-2">Heure 3DX:</div>
                                                                                                    <div class="position-relative me-3">
                                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                                        <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                                    </div>
                                                                                                    <div class="position-relative me-3">
                                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                        <span class="bi bi-clock" id="icon-clock-fin-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                                    </div>
                                                                                                    <div class="d-flex justify-content-center align-items-center">
                                                                                                        <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-3DX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                                                                    </div>
                                                                                                </div> 
                                                                                            </div>
                                                                                            ` : '').join('') +
                                                    [...Array(4 - total3DX)].map((_, i) => `
                                                                                                    <div class="row mb-3"> 
                                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure 3DX:</div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Début">
                                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Fin">
                                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-3DX-${i + 1 + total3DX}-prix-${film.id}"></textarea>
                                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                                            </div>   
                                                                                                        </div>                                                                                                                                 
                                                                                                    </div>
                                                                                                `).join('');
                                            })()}
                                                                                    </div>
                                                                                    <!--4DX-->
                                                                                    <div id="row-4DX-${film.id}" class="row mt-3 d-none">                                          
                                                                                        ${(() => {
                                                const total4DX = film.seances.filter(seance => seance.qualite === "4DX").length;
                                                const seances4DX = film.seances.filter(seance => seance.qualite === "4DX");
                                                return seances4DX.map((seance, i) => seance.qualite === "4DX" ? `
                                                                                                <div class="row mb-3">   
                                                                                                    <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                        <div class="text-white align-content-center fs-5 me-2">Heure 4DX:</div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                                            <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                            <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="d-flex justify-content-center align-items-center">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                            <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-4DX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                            <div class="mx-1 fs-5 text-white">€</div>
                                                                                                        </div>
                                                                                                    </div> 
                                                                                                </div>
                                                                                            ` : '').join('') +
                                                    [...Array(4 - total4DX)].map((_, i) => `
                                                                                                    <div class="row mb-3"> 
                                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure 4DX:</div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Début">
                                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Fin">
                                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-4DX-${i + 1 + total4DX}-prix-${film.id}"></textarea>
                                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                                            </div>   
                                                                                                        </div>                                                                                                                                 
                                                                                                </div>
                                                                                            `).join('');
                                            })()}
                                                                                    </div>
                                                                                    <!--IMAX-->
                                                                                    <div id="row-IMAX-${film.id}" class="row mt-3 d-none">                                                                                                        
                                                                                        ${(() => {
                                                const totalIMAX = film.seances.filter(seance => seance.qualite === "IMAX").length;
                                                const seancesIMAX = film.seances.filter(seance => seance.qualite === "IMAX");
                                                return seancesIMAX.map((seance, i) => seance.qualite === "IMAX" ? `
                                                                                                <div class="row mb-3">   
                                                                                                    <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                        <div class="text-white align-content-center fs-5 me-2">Heure IMAX:</div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly>
                                                                                                            <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                            <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="d-flex justify-content-center align-items-center">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                            <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-IMAX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                            <div class="mx-1 fs-5 text-white">€</div>
                                                                                                        </div>
                                                                                                    </div> 
                                                                                            </div>
                                                                                            ` : '').join('') +
                                                    [...Array(4 - totalIMAX)].map((_, i) => `
                                                                                                    <div class="row mb-3"> 
                                                                                                        <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Heure IMAX:</div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Début">
                                                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="position-relative me-3">
                                                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Fin">
                                                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                                            </div>
                                                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-IMAX-${i + 1 + totalIMAX}-prix-${film.id}"></textarea>
                                                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                                                            </div>   
                                                                                                        </div>                                                                                                                                 
                                                                                                    </div>
                                                                                                `).join('');
                                            })()}
                                                                                    </div>
                                                                                    <!--Dolby-->
                                                                                    <div id="row-Dolby-${film.id}" class="row mt-3 d-none">
                                                                                        ${(() => {
                                                const totalDolby = film.seances.filter(seance => seance.qualite === "Dolby").length;
                                                const seancesDolby = film.seances.filter(seance => seance.qualite === "Dolby");
                                                return seancesDolby.map((seance, i) => seance.qualite === "Dolby" ? `
                                                                                                <div class="row mb-3">   
                                                                                                    <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                        <div class="text-white align-content-center fs-5 me-2">Heure Dolby:</div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1}-${film.id}" placeholder="${seance.heure_debut_seance}" readonly">
                                                                                                            <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="position-relative me-3">
                                                                                                            <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1}-${film.id}" placeholder="${seance.heure_fin_seance}" readonly>
                                                                                                            <span class="bi bi-clock" id="icon-clock-fin-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                            <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                                        </div>
                                                                                                        <div class="d-flex justify-content-center align-items-center">
                                                                                                            <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                            <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-Dolby-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                                            <div class="mx-1 fs-5 text-white">€</div>
                                                                                                        </div>
                                                                                                    </div> 
                                                                                                </div>` : '').join('') +
                                                    [...Array(4 - totalDolby)].map((_, i) => `
                                                                                                        <div class="row mb-3"> 
                                                                                                            <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                                                <div class="text-white align-content-center fs-5 me-2">Heure Dolby:</div>
                                                                                                                <div class="position-relative me-3">
                                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Début">
                                                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                                </div>
                                                                                                                <div class="position-relative me-3">
                                                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Fin">
                                                                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                                                </div>
                                                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                                                    <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-Dolby-${i + 1 + totalDolby}-prix-${film.id}"></textarea>
                                                                                                                    <div class="mx-1 fs-5 text-white">€</div>
                                                                                                                </div>   
                                                                                                            </div>                                                                                                                                 
                                                                                                        </div>
                                                                                                `).join('');
                                            })()}
                                                                                    </div>
                                                                                    <!--Description-->
                                                                                    <div class="row">
                                                                                        <div class="col-3 text-white align-items-center justify-content-start">
                                                                                            <div class="fs-5">Description:</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="row">
                                                                                        <div class="col-12 d-flex text-white align-items-center">
                                                                                            <textarea class="form-control p-2 textarea-uniforme text-start overflow-y-scroll" placeholder="" id="Textarea-description-${film.id}" style="height:8rem">${film.description}</textarea>
                                                                                            <label class="d-none" for="Textarea-description-${film.id}"></label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>`);

                                        //suppression film
                                        $('#x-square-'+film.id).click(function () {
                                            axios.post('/employe/administration/film/delete', JSON.stringify({id: film.id}))
                                                .then(response => {filmEmploye();console.log(response.data);})
                                                .catch(error => {console.error(error);})
                                        });

                                        //Affichage badge age mini
                                        function displayAgeBadge() {
                                            const sanitizedFilmName = film.name.replace(/\s+/g, '-');
                                            const  ageFilm = $('#age-' + sanitizedFilmName);
                                            // Ciblez chaque badge d'âge à partir du conteneur
                                            const ageBadge12 = ageFilm.find('.age-badge-12');
                                            const ageBadge16 = ageFilm.find('.age-badge-16');
                                            const ageBadge18 = ageFilm.find('.age-badge-18');
                                            // Logique de gestion des classes pour afficher/masquer les badges d'âge
                                            if (film.age_minimum === '12') {
                                                ageBadge12.removeClass('d-none');
                                                ageBadge16.addClass('d-none');
                                                ageBadge18.addClass('d-none');
                                            } else if (film.age_minimum === '16') {
                                                ageBadge16.removeClass('d-none');
                                                ageBadge12.addClass('d-none');
                                                ageBadge18.addClass('d-none');
                                            } else if (film.age_minimum === '18') {
                                                ageBadge18.removeClass('d-none');
                                                ageBadge12.addClass('d-none');
                                                ageBadge16.addClass('d-none');
                                            } else {
                                                ageBadge12.addClass('d-none');
                                                ageBadge16.addClass('d-none');
                                                ageBadge18.addClass('d-none');
                                            }
                                        }
                                        displayAgeBadge()

                                        // Accordion description films
                                        const accordionButton = $('#btn-description-'+film.id);
                                        const accordionCollapse = $('#collapseDescription-'+film.id);

                                        // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                        $(document).click(function(event) {
                                            // Vérifie si le clic est à l'intérieur de l'accordéon
                                            if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                                // Ferme l'accordéon si ouvert
                                                if (accordionCollapse.hasClass('show')) {
                                                    accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                                }
                                            }
                                        });

                                        //modal
                                        // Upload image
                                        let imageData = null;
                                        $('#uploadButton-'+film.id).on('click', function () {
                                            const fileInput = $('#fileInput-'+film.id)[0];
                                            fileInput.click();
                                            $(fileInput).off('change').on('change', function () { // Supprime les écouteurs existants avant d'en ajouter un nouveau
                                                const selectedFile = fileInput.files[0];
                                                if (selectedFile) {
                                                    imageData = new FormData(); // Crée un nouvel objet FormData
                                                    imageData.append('image', selectedFile); // Ajoute le fichier sélectionné
                                                    console.log('Image sélectionnée :', selectedFile.name);
                                                } else {
                                                    console.error('Aucun fichier sélectionné');
                                                }
                                            });
                                        });

                                        //Menu déroulant genre
                                        const dropdownMenuGenre = $('#dropdownMenuGenre-'+film.id);
                                        const dropGenre = dropdownMenuGenre.siblings('.dropdown-menu').find('.drop-genre');
                                        let selectedGenre= '';
                                        dropGenre.click(function(e) {
                                            e.preventDefault();
                                            selectedGenre = $(this).text();
                                            dropdownMenuGenre.text(selectedGenre);
                                        });

                                        //Menu déroulant age
                                        const dropdownMenuAge = $('#dropdownMenuAge-'+film.id);
                                        const dropAge = dropdownMenuAge.siblings('.dropdown-menu').find('.drop-age');
                                        let selectedAge= '';
                                        dropAge.click(function(e) {
                                            e.preventDefault();
                                            selectedAge= $(this).text();
                                            dropdownMenuAge.text(selectedAge);
                                        });

                                        //Menu déroulant Cinéma
                                        const dropdownMenuCinema = $('#dropdownMenuCinema-'+film.id);
                                        const dropCinema = dropdownMenuCinema.siblings('.dropdown-menu').find('.drop-cinema');
                                        let selectedCinema = '';

                                        // Gérer le clic sur le menu
                                        dropCinema.click(function (e) {
                                            e.preventDefault();
                                            selectedCinema = $(this).text();
                                            dropdownMenuCinema.text(selectedCinema);
                                        });

                                        //Menu déroulant Coup de cœur
                                        const dropdownMenuLabel = $('#dropdownMenuLabel-' + film.id);
                                        const label = dropdownMenuLabel.siblings('.dropdown-menu').find('.drop-label');
                                        let selectedCoupCoeur= '';
                                        label.click(function(e) {
                                            e.preventDefault();
                                            selectedCoupCoeur= $(this).text();
                                            dropdownMenuLabel.text(selectedCoupCoeur);
                                        });
                                        dropdownMenuLabel.text(film.label ? 'Oui' : 'Non');

                                        // Menu déroulant Salle
                                        const dropdownMenuSalle = $('#dropdownSalle-'+film.id);
                                        const dropSalle = dropdownMenuSalle.find('.drop-salle');
                                        let selectedSalle= '';
                                        dropSalle.click(function(e) {
                                            e.preventDefault();
                                            selectedSalle= $(this).text();
                                            dropdownMenuSalle.text(selectedSalle);
                                        });

                                        // Écoute l'événement de clic sur les éléments du menu déroulant
                                        dropSalle.on('click', function(e) {
                                            e.preventDefault();
                                            const value = $(this).text();
                                            const row3DX = $('#row-3DX-'+film.id);
                                            const row4DX = $('#row-4DX-'+film.id);
                                            const rowIMAX = $('#row-IMAX-'+film.id);
                                            const rowDolby = $('#row-Dolby-'+film.id);
                                            if (value === '1') {
                                                row3DX.removeClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '2') {
                                                row4DX.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '3') {
                                                rowIMAX.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowDolby.addClass('d-none');
                                            } else if (value === '4') {
                                                rowDolby.removeClass('d-none');
                                                row3DX.addClass('d-none');
                                                row4DX.addClass('d-none');
                                                rowIMAX.addClass('d-none');
                                            }
                                        });

                                        // Menu déroulant places
                                        const dropdownMenuPlaces = $('#dropdownMenuPlaces-'+film.id);
                                        const dropPlaces = dropdownMenuPlaces.siblings('.dropdown-menu').find('.drop-places');
                                        let selectedPlaces= '';
                                        dropPlaces.click(function(e) {
                                            e.preventDefault();
                                            selectedPlaces= $(this).text();
                                            dropdownMenuPlaces.text(selectedPlaces);
                                        });

                                        // Réinitialiser le modal lorsque celui-ci est fermé
                                        $('#modal-' + film.id).on('hidden.bs.modal', function () {
                                            filmEmploye();
                                        });

                                        //Valider les informations du film
                                        const formats = ["3DX", "4DX", "IMAX", "Dolby"];
                                        const nombreSeances = 4;
                                        $('#btn-validate-film-'+film.id).click(function () {
                                            const datepickerDebut = $('#datepicker-admin-debut-'+film.id);
                                            const datepickerFin = $('#datepicker-admin-fin-'+film.id);
                                            const dropdownPlaces = $(`#dropdownMenuPlaces-${film.id}`);
                                            let datePartsDebut = datepickerDebut.val().split('/');
                                            let datePartsFin = datepickerFin.val().split('/');
                                            let formattedDateDebut = datePartsDebut[2] + '-' + datePartsDebut[1] + '-' + datePartsDebut[0];
                                            let formattedDateFin = datePartsFin[2] + '-' + datePartsFin[1] + '-' + datePartsFin[0];
                                            let label = $('#dropdownMenuLabel-'+film.id).text();
                                            label = label === 'Oui' ? 1 : 0;
                                            const data = {
                                                id: film.id,
                                                genre: selectedGenre,
                                                age: selectedAge,
                                                label: label,
                                                nom: $(`#TextareaNom-${film.id}`).val(),
                                                cinema: selectedCinema,
                                                date_debut: formattedDateDebut,
                                                date_fin: formattedDateFin,
                                                salle: $(`#dropdownMenuSalle-${film.id}`).text(),
                                                places: dropdownPlaces.text(),
                                                description: $(`#Textarea-description-${film.id}`).val(),
                                                film_reset: ''
                                            };
                                            formats.forEach(format => {
                                                for (let i = 1; i <= nombreSeances; i++) {
                                                    data[`heure_debut_${format}_${i}`] = $(`#timepicker-admin-debut-${format}-${i}-${film.id}`).val();
                                                    data[`heure_fin_${format}_${i}`] = $(`#timepicker-admin-fin-${format}-${i}-${film.id}`).val();
                                                    data[`price_${format}_${i}`] = $(`#Textarea-${format}-${i}-prix-${film.id}`).val();
                                                }
                                            });
                                            let formData = new FormData();
                                            if (imageData) {
                                                formData.append('image', imageData.get('image'));
                                            }
                                            for (const key in data) {
                                                formData.append(key, data[key]);
                                            }
                                            // Vérification des timepickers (heure de début et heure de fin)
                                            let timeError = false;
                                            formats.forEach(format => {
                                                for (let i = 1; i <= nombreSeances; i++) {
                                                    let heureDebut = $(`#timepicker-admin-debut-${format}-${i}-${film.id}`).val().trim();
                                                    let heureFin = $(`#timepicker-admin-fin-${format}-${i}-${film.id}`).val().trim();
                                                    let prix = $(`#Textarea-${format}-${i}-prix-${film.id}`).val().trim();
                                                    // Si une heure de début est renseignée, mais pas l'heure de fin
                                                    if (heureDebut !== '' && heureFin === '') {
                                                        timeError = true;
                                                    }

                                                    // Si une heure de début et une heure de fin sont renseignées, mais pas de date
                                                    if ((heureDebut !== '' && heureFin !== '') && (datepickerDebut.val().trim() === '' || datepickerFin.val().trim() === '')) {
                                                        timeError = true;
                                                    }
                                                    // Si une heure de début et une heure de fin sont renseignées, mais pas de prix
                                                    if ((heureDebut !== '' && heureFin !== '') && prix === '') {
                                                        timeError = true;
                                                    }
                                                }
                                            });
                                            if (timeError) {
                                                alert('Veuillez renseigner une heure de fin, une date de début, une date de fin et le prix lorsque vous spécifiez une heure de début.');
                                                return;
                                            }
                                            axios.post('/employe/administration/film/validate', formData , {
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                }
                                            })
                                                .then(response => {console.log(response.data);$('#modal-' + film.id).modal('hide'); })
                                                .catch(error => {console.error(error);})
                                                .finally(() => {filmEmploye();});
                                        });

                                        // Reset des champs
                                        $('#btn-reset-' + film.id).click(function () {
                                            const data = {id: film.id};
                                            axios.post('/employe/administration/film/reset', data)
                                                .then(response => {console.log(response.data)})
                                                .catch(error => {console.error(error);})
                                        });

                                        // Datepicker
                                        const $datepickerDebut = $('#datepicker-admin-debut-'+film.id);
                                        const $calendarIconDebut = $('#icon-calendar-debut-admin-'+film.id);
                                        const $clearIconDebut = $('#close-icon-date-debut-admin-'+film.id);
                                        const $datepickerFin = $('#datepicker-admin-fin-'+film.id);
                                        const $calendarIconFin = $('#icon-calendar-fin-admin-'+film.id);
                                        const $clearIconFin = $('#close-icon-date-fin-admin-'+film.id);

                                        //Date début
                                        $datepickerDebut.val(film.date_debut);
                                        $datepickerDebut.datepicker({
                                            format: "dd/mm/yyyy",
                                            orientation: "bottom",
                                            language: "fr",
                                            autoclose: true
                                        })
                                            .on('changeDate', function () {
                                                if ($datepickerDebut.val().trim() === '') {
                                                    $datepickerFin.prop('disabled', true);
                                                } else {
                                                    $datepickerFin.val('').prop('disabled', false);
                                                }
                                                // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                $calendarIconDebut.addClass('d-none');
                                                $clearIconDebut.removeClass('d-none');
                                            });

                                        // Affiche l'icône de croix et cache l'icône calendrier si une date est déjà sélectionnée
                                        if ($datepickerDebut.val().trim() !== '') {
                                            $calendarIconDebut.addClass('d-none');
                                            $clearIconDebut.removeClass('d-none');
                                        }

                                        // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                        $clearIconDebut.on('click', function () {
                                            $datepickerDebut.datepicker('clearDates');
                                            $calendarIconDebut.removeClass('d-none');
                                            $clearIconDebut.addClass('d-none');
                                        });

                                        // Appliquer le style de hover/focus lors du clic sur l'icône croix
                                        $clearIconDebut.on('mouseenter focus', function () {
                                            $datepickerDebut.addClass('btn-hover');
                                            $clearIconDebut.addClass('btn-hover');
                                        });

                                        // Appliquer le style de hover/focus
                                        $calendarIconDebut.on('mouseenter focus', function () {
                                            $datepickerDebut.addClass('btn-hover');
                                            $calendarIconDebut.addClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                        $clearIconDebut.on('mouseleave blur', function () {
                                            $datepickerDebut.removeClass('btn-hover');
                                            $clearIconDebut.removeClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                        $calendarIconDebut.on('mouseleave blur', function () {
                                            $datepickerDebut.removeClass('btn-hover');
                                            $calendarIconDebut.removeClass('btn-hover');
                                        });

                                        // Ouvrir le calendrier lorsque l'on clique sur l'icône calendrier
                                        $calendarIconDebut.on('click', function () {
                                            $datepickerDebut.focus();
                                        });

                                        //Date fin
                                        $datepickerFin.val(film.date_fin);
                                        $datepickerFin.datepicker({
                                            format: "dd/mm/yyyy",
                                            orientation: "bottom",
                                            language: "fr",
                                            autoclose: true
                                        })
                                            .on('changeDate', function () {
                                                if ($datepickerFin.val().trim()) {
                                                    const dateDebut = new Date($datepickerDebut.val().trim().split('/').reverse().join('-'));
                                                    const dateFin = new Date($datepickerFin.val().trim().split('/').reverse().join('-'));
                                                    if (dateFin < dateDebut) {
                                                        $calendarIconFin.removeClass('d-none');
                                                        $clearIconFin.addClass('d-none');
                                                        $datepickerFin.val('');
                                                        alert('La date de fin doit être supérieure ou égale à la date de début.');
                                                    }else {
                                                        // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                        $calendarIconFin.addClass('d-none');
                                                        $clearIconFin.removeClass('d-none');
                                                    }
                                                }
                                            });

                                        // Affiche l'icône de croix et cache l'icône calendrier si une date est déjà sélectionnée
                                        if ($datepickerFin.val().trim() !== '') {
                                            $calendarIconFin.addClass('d-none');
                                            $clearIconFin.removeClass('d-none');
                                        }

                                        // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                        $clearIconFin.on('click', function () {
                                            $datepickerFin.datepicker('clearDates');
                                            $calendarIconFin.removeClass('d-none');
                                            $clearIconFin.addClass('d-none');
                                        });

                                        // Appliquer le style de hover/focus
                                        $clearIconFin.on('mouseenter focus', function () {
                                            $datepickerFin.addClass('btn-hover');
                                            $clearIconFin.addClass('btn-hover');
                                        });

                                        // Appliquer le style de hover/focus
                                        $calendarIconFin.on('mouseenter focus', function () {
                                            $datepickerFin.addClass('btn-hover');
                                            $calendarIconFin.addClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                        $clearIconFin.on('mouseleave blur', function () {
                                            $datepickerFin.removeClass('btn-hover');
                                            $clearIconFin.removeClass('btn-hover');
                                        });

                                        // Retirer le style quand on quitte le survol/focus
                                        $calendarIconFin.on('mouseleave blur', function () {
                                            $datepickerFin.removeClass('btn-hover');
                                            $calendarIconFin.removeClass('btn-hover');
                                        });

                                        // Ouvrir le calendrier lorsque l'on clique sur l'icône calendrier
                                        $calendarIconFin.on('click', function () {
                                            $datepickerFin.focus();
                                        });

                                        // Désactiver les datepickers si une date de début et une date de fin sont déjà renseignées
                                        if ($datepickerDebut.val().trim() && $datepickerFin.val().trim()) {
                                            $datepickerDebut.prop('disabled', true);
                                            $datepickerFin.prop('disabled', true);
                                            $clearIconDebut.addClass('d-none');
                                            $clearIconFin.addClass('d-none');
                                            $calendarIconDebut.removeClass('d-none');
                                            $calendarIconFin.removeClass('d-none');
                                        } else {
                                            $datepickerFin.prop('disabled', true);
                                        }

                                        //Timepicker
                                        // Fonction pour générer les constantes pour chaque combinaison
                                        function generateTimepickerConstants(filmId) {
                                            const types = ['3DX', '4DX', 'IMAX', 'Dolby'];  // Les types 3DX et 4DX
                                            const sessions = [1, 2, 3, 4];  // Les sessions 1, 2, 3, 4
                                            let constants = [];

                                            // Boucles pour générer les constantes
                                            types.forEach(type => {
                                                sessions.forEach(session => {
                                                    constants.push({
                                                        // Début
                                                        timepickerIdDebut: `#timepicker-admin-debut-${type}-${session}-${filmId}`,
                                                        clockIconIdDebut: `#icon-clock-debut-admin-${type}-${session}-${filmId}`,
                                                        clearIconIdDebut: `#close-icon-time-debut-admin-${type}-${session}-${filmId}`,
                                                        // Fin
                                                        timepickerIdFin: `#timepicker-admin-fin-${type}-${session}-${filmId}`,
                                                        clockIconIdFin: `#icon-clock-fin-admin-${type}-${session}-${filmId}`,
                                                        clearIconIdFin: `#close-icon-time-fin-admin-${type}-${session}-${filmId}`,
                                                        price: `#Textarea-${type}-${session}-prix-${filmId}`
                                                    });
                                                });
                                            });

                                            return constants;
                                        }
                                        function initTimepickerWithValidation(timepickerIdDebut, clockIconIdDebut, clearIconIdDebut, timepickerIdFin, clockIconIdFin, clearIconIdFin, price, modalTimeFieldIdFin) {
                                            const $timepickerDebut = $(timepickerIdDebut);
                                            const $clockIconDebut = $(clockIconIdDebut);
                                            const $clearIconDebut = $(clearIconIdDebut);

                                            const $timepickerFin = $(timepickerIdFin);
                                            const $clockIconFin = $(clockIconIdFin);
                                            const $clearIconFin = $(clearIconIdFin);

                                            const $price = $(price);

                                            const $modalTimeFieldFin = $(modalTimeFieldIdFin); // Élément du modal où l'heure de fin doit être mise à jour

                                            // Initialisation du Timepicker pour "Début"
                                            const timepickerDebutInstance = flatpickr($timepickerDebut, {
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                                minuteIncrement: 15,
                                                onChange: function(selectedDates, dateStr) {
                                                    if (dateStr.trim()) {
                                                        $timepickerFin.removeAttr('disabled'); // Activer le champ "Fin"
                                                        $price.removeAttr('disabled'); // Activer le champ "Prix"
                                                        $clockIconDebut.addClass('d-none');
                                                        $clearIconDebut.removeClass('d-none');

                                                        // Validation de "Fin" par rapport à "Début"
                                                        const timeDebut = new Date(`1970-01-01T${dateStr}:00`);
                                                        const timeFin = $timepickerFin.val().trim() ? new Date(`1970-01-01T${$timepickerFin.val()}:00`) : null;

                                                        if (timeFin && timeFin <= timeDebut) {
                                                            // Si l'heure de fin est inférieure ou égale à l'heure de début
                                                            timepickerFinInstance.setDate(null); // Ne pas afficher de valeur par défaut dans le timepicker
                                                            $timepickerFin.val(''); // Réinitialiser la valeur de l'input
                                                            $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                            $price.text(''); // Réinitialiser le prix
                                                            alert('L’heure de fin doit être supérieure à l’heure de début.');

                                                            // Supprimer la valeur de "Début" si "Fin" <= "Début"
                                                            $timepickerDebut.val('');
                                                            $clearIconDebut.removeClass('d-none');
                                                            $clockIconDebut.addClass('d-none');
                                                        }
                                                    } else {
                                                        $timepickerFin.val('').attr('disabled', true); // Désactiver le champ "Fin"
                                                        $clockIconFin.removeClass('d-none');
                                                        $clearIconFin.addClass('d-none');
                                                        $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                        $price.attr('disabled', true); // Désactiver le champ "Prix"
                                                        $price.val(''); // Réinitialiser le prix
                                                    }
                                                }
                                            });

                                            // Initialisation du Timepicker pour "Fin"
                                            const timepickerFinInstance = flatpickr($timepickerFin, {
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true,
                                                minuteIncrement: 15,
                                                onOpen: function() {
                                                    // Set the menu (dropdown) to 12:15 when opening the timepicker, but do not set the input
                                                    if (!$timepickerFin.val().trim() && $timepickerDebut.val().trim()) {
                                                        timepickerFinInstance.setDate('12:15', true); // Set time for menu display only (not input)
                                                    }
                                                },
                                                onChange: function(selectedDates, dateStr) {
                                                    if (dateStr.trim()) {
                                                        const timeDebut = $timepickerDebut.val().trim() ? new Date(`1970-01-01T${$timepickerDebut.val()}:00`) : null;
                                                        const timeFin = new Date(`1970-01-01T${dateStr}:00`);

                                                        if (timeDebut && timeFin <= timeDebut) {
                                                            // Réinitialiser "Fin" si l'heure est inférieure ou égale à l'heure de début
                                                            timepickerFinInstance.setDate(null); // Réinitialiser avec aucune valeur
                                                            $timepickerFin.val(''); // Réinitialiser la valeur de l'input
                                                            $price.val(''); // Réinitialiser le prix
                                                            $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                            alert('L’heure de fin doit être supérieure à l’heure de début.');
                                                            $clockIconFin.removeClass('d-none');
                                                            $clearIconFin.addClass('d-none');

                                                            // Supprimer la valeur de "Début" si "Fin" <= "Début"
                                                            $timepickerDebut.val('');
                                                            $clearIconDebut.addClass('d-none');
                                                            $clockIconDebut.removeClass('d-none');
                                                            $timepickerFin.attr('disabled', true); // Désactiver le champ "Fin"
                                                            $price.attr('disabled', true); // Désactiver le champ "Prix"
                                                        } else {
                                                            $clockIconFin.addClass('d-none');
                                                            $clearIconFin.removeClass('d-none');
                                                            $modalTimeFieldFin.val(dateStr); // Mettre à jour l'heure de fin dans le modal
                                                        }
                                                    }
                                                }
                                            });

                                            // Quand l'icône de l'horloge est cliquée
                                            $clockIconFin.on("click", function() {
                                                const $input = $(this).siblings("input"); // Trouve l'input associé
                                                $input.trigger("focus"); // Déclenche le focus sur l'input
                                                $input.click(); // Déclenche l'événement de clic s'il y en a un
                                            });
                                            $clockIconDebut.on("click", function() {
                                                const $input = $(this).siblings("input"); // Trouve l'input associé
                                                $input.trigger("focus"); // Déclenche le focus sur l'input
                                                $input.click(); // Déclenche l'événement de clic s'il y en a un
                                            });

                                            // Quand la souris entre dans l'icône de l'horloge
                                            $clockIconDebut.on("mouseenter", function() {
                                                const inputId = $(this).siblings("input").attr("id"); // Trouve l'input associé
                                                $(`#${inputId}`).addClass("btn-hover");
                                            });
                                            $clockIconFin.on("mouseenter", function() {
                                                const inputId = $(this).siblings("input").attr("id"); // Trouve l'input associé
                                                $(`#${inputId}`).addClass("btn-hover");
                                            });

                                            // Quand la souris quitte l'icône de l'horloge
                                            $clockIconDebut.on("mouseleave", function() {
                                                const inputId = $(this).siblings("input").attr("id");
                                                $(`#${inputId}`).removeClass("btn-hover");
                                            });
                                            $clockIconFin.on("mouseleave", function() {
                                                const inputId = $(this).siblings("input").attr("id");
                                                $(`#${inputId}`).removeClass("btn-hover");
                                            });

                                            // Desactiver le timepicker "Fin" et prix si "Début" est vide
                                            if ($timepickerDebut.attr('placeholder').trim() !== 'Début' && $timepickerFin.attr('placeholder').trim() !== 'Fin') {
                                                $timepickerDebut.attr('disabled', true);
                                                $timepickerFin.attr('disabled', true);
                                                $price.attr('disabled', true);
                                                $clearIconDebut.addClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                                $clockIconDebut.removeClass('d-none');
                                                $clockIconFin.removeClass('d-none');
                                            } else {
                                                $timepickerFin.attr('disabled', true);
                                                $price.attr('disabled', true);
                                            }

                                            // Icônes pour "Début"
                                            $clearIconDebut.on('click', function() {
                                                timepickerDebutInstance.clear();
                                                $clockIconDebut.removeClass('d-none');
                                                $clearIconDebut.addClass('d-none');
                                                $timepickerFin.val('').attr('disabled', true);
                                                $modalTimeFieldFin.val(''); // Réinitialiser l'heure de fin dans le modal
                                                $clockIconFin.removeClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                            });

                                            // Icônes pour "Fin"
                                            $clearIconFin.on('click', function() {
                                                timepickerFinInstance.clear();
                                                $clockIconFin.removeClass('d-none');
                                                $clearIconFin.addClass('d-none');
                                                $modalTimeFieldFin.val('');// Réinitialiser l'heure de fin dans le modal
                                            });
                                        }
                                        function initAllTimepickers(filmId) {
                                            // Générer les constantes pour le film
                                            const timepickerConstants = generateTimepickerConstants(filmId);

                                            // Initialiser chaque timepicker avec validation entre "Début" et "Fin"
                                            timepickerConstants.forEach(function(constant) {
                                                initTimepickerWithValidation(
                                                    constant.timepickerIdDebut,
                                                    constant.clockIconIdDebut,
                                                    constant.clearIconIdDebut,
                                                    constant.timepickerIdFin,
                                                    constant.clockIconIdFin,
                                                    constant.clearIconIdFin,
                                                    constant.price,
                                                    constant.modalTimeFieldIdFin // Ajouter l'ID du champ du modal pour "Fin"
                                                );
                                            });
                                        }

                                        const filmId = film.id;
                                        initAllTimepickers(filmId);

                                    });

                                    // Finaliser la progression à 100 % lorsque les données sont chargées
                                    clearInterval(interval); // Stopper l'intervalle de mise à jour
                                    progress = 100;
                                    progressBar.css('width', '100%').attr('aria-valuenow', progress);

                                    // Masquer la barre de chargement après un délai de 500ms
                                    setTimeout(() => loadingBar.addClass('d-none'), 500);
                                })
                                .catch(error => {
                                    console.error('Erreur lors du chargement des films :', error);

                                    // Finaliser à 100 % en cas d'erreur
                                    clearInterval(interval);
                                    progress = 100;
                                    progressBar.css('width', '100%').attr('aria-valuenow', progress);

                                    // Masquer la barre de chargement après un délai de 500ms
                                    setTimeout(() => loadingBar.addClass('d-none'), 500);
                                });
                    }
        //Création d'un film sur clic bouton plus
        $('#btn-plus-employe').click(function () {
                    axios.post('/employe/administration/film/create')
                        .then(response => {filmEmploye();console.log(response.data);})
                        .catch(error => {
                            console.error(error);
                        });
                });
        //Affichage des films sur clic bouton Intranet
        $('#btn-navbar-employe').click(function() {
                    filmEmploye();
                });
        //Déconnexion sur clic bouton déconnexion
        $('#btn-deconnexion-employe').click(function() {
                    axios.post('/logout')
                        .then(response => {console.log(response.data);window.location.href = '/accueil';})
                        .catch(error => {console.error(error);});
                });
        //Page Validation des avis
        function avis() {
                // Vider le conteneur des avis
                    $('.card-container-avis').empty();
                // Récupérer les avis
                    axios.get('/employe/administration/film')
                        .then(response => {
                            const film = response.data;
                            $.each(film, function(index, film) {
                                $.each(film.avis, function(index, avis) {
                                    $('#card-container-avis-' + film.id).append(
                                        `<div class="row m-0 mb-2 p-0">
                                            <div class="col-avis col-9 bg-white p-0" style="border: 1px solid white; border-radius: 6px">
                                                <button id="btn-avis-${avis.id}" class="btn btn-avis w-100 p-1 text-center" style="font-size: 0.8rem; border: none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAvis-${avis.id}" aria-expanded="false" aria-controls="collapseAvis">
                                                    avis de ${avis.user}
                                                </button>
                                                <div id="collapseAvis-${avis.id}" class="collapse">
                                                    <div class="p-2" style="font-size: 0.8rem; color: #6A73AB">${avis.description}</div>
                                                </div>
                                            </div>
                                            <div class="col-3 d-flex justify-content-center align-items-center">
                                                 <button id="btn-validate-avis-${avis.id}" class="btn bi bi-check-lg p-1 d-flex justify-content-center align-items-center"></button>
                                                 <button id="btn-delete-avis-${avis.id}" class="btn bi bi-x-lg p-1 d-flex justify-content-center align-items-center"></button>
                                            </div>
                                        </div>`);

                                    // Accordion description Avis
                                        const accordionButton = $('#btn-avis-' + avis.id);
                                        const accordionCollapse = $('#collapseAvis-' + avis.id);

                                    // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                        $(document).click(function (event) {
                                        // Vérifie si le clic est à l'intérieur de l'accordéon
                                        if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                            // Ferme l'accordéon si ouvert
                                            if (accordionCollapse.hasClass('show')) {
                                                accordionCollapse.collapse('hide');
                                            }
                                        }
                                    });

                                    //Validation avis
                                        $('#btn-validate-avis-' + avis.id).click(function () {
                                        axios.post('/employe/administration/avis/validate', JSON.stringify({id: avis.id}))
                                            .then(response => {avis();console.log(response.data);})
                                            .catch(error => {console.error(error);})
                                    });
                                        if (avis.isValidate === true) {
                                            accordionButton.addClass('validate')
                                        }

                                    //Suppression avis
                                        $('#btn-delete-avis-' + avis.id).click(function () {
                                        axios.post('/employe/administration/avis/delete', JSON.stringify({id: avis.id}))
                                            .then(response => {avis();console.log(response.data);})
                                            .catch(error => {console.error(error);})
                                        });
                                });
                            });
                        })
                        .catch(error => {
                            console.error('Erreur lors du chargement des Avis :', error);
                        });
                }

        //Lancement des fonctions au chargement des pages
        const pathFunctions = {
            '/accueil': [resizeCarrousel],
            '/films': [film, menuFilms],
            '/reservation': [reservation],
            '/mon_espace/connexion': [initializeFormFeatures],
            '/mon_espace/inscription': [initializeFormFeatures],
            '/utilisateur/mon_espace/commandes': [handleFilmRating],
            '/utilisateur/accueil': [resizeCarrousel],
            '/utilisateur/films': [film, menuFilms],
            '/utilisateur/reservation': [reservation],
            '/employe/films': [film, menuFilms],
            '/employe/administration': [filmEmploye],
            '/employe/administration/avis': [avis],
            '/administrateur/accueil': [resizeCarrousel],
            '/administrateur/films': [film, menuFilms],
            '/administrateur/reservation': [reservation],
            '/administrateur/administration': [filmAdmin],
            '/administrateur/administration/account_employe': [employe],
            '/administrateur/administration/reservations': [employe],
        };
        // Récupérer le chemin actuel
        const currentPath = window.location.pathname;
        // Vérifier si une entrée correspond au chemin actuel
        if (pathFunctions[currentPath]) {
            // Appeler chaque fonction associée au chemin
            pathFunctions[currentPath].forEach(func => func());
        }
    });

