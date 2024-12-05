import './styles/app.css';

//Active jQuery
const $ = require('jquery');
window.$ = window.jQuery = $;

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

//Autoload images
const imagesContext = require.context('../assets/images', true, /\.(png|jpg|jpeg|gif|ico|svg|webp)$/);
imagesContext.keys().forEach(imagesContext);

//Axios
const axios = require('axios');
axios.defaults.withCredentials = true;

//Script
    $(document).ready(function() {
        //Navbar Top & Navbar Footer Bottom
        //A l'ouverture des navbar pour mobile, on change la couleur de fond, on cache le logo et on modifie la taille des colonnes
        $('#navbar-togglerTop').click(function() {
                    $('#offcanvasNavbarTop').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
                    $('#logo').hide();
                    $('#offcanvas-bodyTop').removeClass('row')
                    $('#navbarLeft').removeClass('col-5').addClass('col-12');
                    $('#navbarRight').removeClass('col-5').addClass('col-12');
                });
        $('#navbar-togglerBottom').click(function() {
                    $('#offcanvasNavbarBottom').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
                    $('#col-2-bottom').remove()
                });

        //À la fermeture des navbar pour mobile, on remet la couleur de fond par défaut, on affiche le logo et on remet la taille des colonnes
        $('#offcanvasNavbarTop').on('hidden.bs.offcanvas', function () {
                    $('#offcanvasNavbarTop').css("background", "");
                    $('#logo').show();
                    $('#offcanvas-bodyTop').addClass('row')
                    $('#navbarLeft').removeClass('col-12').addClass('col-5');
                    $('#navbarRight').removeClass('col-12').addClass('col-5');
                });
        $('#offcanvasNavbarBottom').on('hidden.bs.offcanvas', function () {
                    $('#offcanvasNavbarBottom').css("background", "");
                    $('#col-5-bottom').after('<div id="col-2-bottom" class="col-2" style="width: 7.5rem"></div>');
                });

        //Page de connexion et d'inscription dans mon espace
        //Masquer le mot de passe de la page de connexion et d'inscription
        $('#togglePassword').on('click', function () {
                    const passwordField = $('#password');
                    const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                    passwordField.attr('type', type);
                    $(this).toggleClass('bi-eye bi-eye-slash');
                });
        $('#toggleConfirmPassword').on('click', function () {
                    const passwordField = $('#confirmPassword');
                    const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                    passwordField.attr('type', type);
                    $(this).toggleClass('bi-eye bi-eye-slash');
                });
        $('#toggleProvisionalPassword').on('click', function () {
                    const passwordField = $('#provisional-password');
                    const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                    passwordField.attr('type', type);
                    $(this).toggleClass('bi-eye bi-eye-slash');
                });

        //Vérification de la case à cocher des conditions générales d'utilisation
        $('.btn-register').click(function(event) {
                const checkbox = $("input[name='registration_form[agreeTerms]']");
                const message = $(".checkbox-error");
                if (!checkbox.is(":checked")) {
                    event.preventDefault();
                    message.show();
                } else {
                    message.hide();
                }
            });

        //Page Films
        //Affichage de tout les films
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
                                        $('#film-container-public').append(`
                                                <div class="col-auto card" style="width: 12rem">
                                                    <div class="position-relative">
                                                        <i id="heart-${film.id}" class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
                                                        <a href="" data-bs-toggle="modal" data-bs-target="#modal-${film.id}">
                                                          <img src="${film.image}" class="card-img-top" alt="image" />
                                                        </a>
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
                                                </div>
                                                <!--Modal-->
                                                <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-keyboard="false" aria-hidden="true">
                                                    <div class="modal-dialog modal-dialog-centered modal-lg">
                                                        <div class="modal-content seances">
                                                            <div class="modal-header position-relative header-seances" style="border: none">
                                                                <div class="modal-title position-absolute text-center fs-3 fw-semibold" style="left:50%; transform: translateX(-50%)">${film.name}</div>
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
                                                </div>
                                            `);

                                        // Ajout du gestionnaire d'événements pour ouvrir le modal et initialiser la date
                                        $(`a[data-bs-toggle="modal"][data-bs-target="#modal-${film.id}"]`).on('click', function () {
                                            // Définir la date du jour dans le datepicker
                                            const today = new Date();
                                            const day = ("0" + today.getDate()).slice(-2); // Ajoute un zéro si le jour est inférieur à 10
                                            const month = ("0" + (today.getMonth() + 1)).slice(-2); // Ajoute un zéro si le mois est inférieur à 10
                                            const year = today.getFullYear();
                                            const todayFormatted = `${day}/${month}/${year}`;
                                            const formattedDate = `${year}-${month}-${day}`;
                                            const dayFormatted = `${day}/${month}`;

                                            // Exécuter la fonction pour charger les séances avec la date du jour
                                            updateModalAndSessions(film.id, formattedDate);

                                            // Mettre à jour la valeur du datepicker
                                            $(`#datepicker-${film.id}`).datepicker('setDate', todayFormatted);

                                            // Afficher l'icône de croix et masquer l'icône calendrier après sélection d'une date
                                            $(`#icon-calendar-${film.id}`).addClass('d-none');
                                            $(`#close-icon-date-${film.id}`).removeClass('d-none');

                                            // Ajouter la classe active à la journée correspondant à la date du jour dans le modal
                                            $(`#modal-${film.id} .clickable-day[data-date="${dayFormatted}"]`).addClass('active').siblings().removeClass('active');
                                        });

                                        // Fonction appelée après sélection d'une date
                                        function updateModalAndSessions(filmId, selectedDate) {
                                            // Afficher le spinner de chargement
                                            const spinner = $('#loading-spinner-seances-' + filmId);
                                            spinner.removeClass('d-none');

                                            // Vider les conteneurs avant de les remplir
                                            const seancesContainer = $('#date-seance-' + filmId);
                                            const modalContainer = $('#modal-date-seance-' + filmId);
                                            seancesContainer.empty();

                                            // Convertir la date sélectionnée en un objet Date
                                            const selectedDateObj = new Date(selectedDate);

                                            // Préparer les 7 prochains jours pour la modale
                                            const days = [];
                                            const nextDay = new Date(selectedDateObj);
                                            const day = ("0" + nextDay.getDate()).slice(-2); // Ajoute un zéro si le jour est inférieur à 10
                                            const month = ("0" + (nextDay.getMonth() + 1)).slice(-2); // Ajoute un zéro si le mois est inférieur à 10
                                            const dayFormatted = `${day}/${month}`;
                                            for (let i = 0; i < 7; i++) {
                                                nextDay.setDate(selectedDateObj.getDate() + i);
                                                days.push(nextDay.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
                                            }

                                            // Générer le contenu des jours cliquables dans la modale
                                            modalContainer.html(days.map(day => `<div class="col clickable-day" data-date="${day}">${day}</div>`).join(''));

                                            // Ajouter la classe active à la journée correspondant à la date du jour dans le modal
                                            $(`#modal-${film.id} .clickable-day[data-date="${dayFormatted}"]`).addClass('active').siblings().removeClass('active');

                                            // Charger les séances correspondantes via AJAX (Axios)
                                            axios
                                                .post('/films/seances', { filmId })
                                                .then(response => {
                                                    const seances = response.data; // Liste des séances par date

                                                    // Fonction pour afficher les séances pour une date donnée
                                                    function displaySeancesForDate(clickedDate) {
                                                        seancesContainer.empty();

                                                        // Reformater la date cliquée (dd/mm) en (dd/mm/yyyy)
                                                        const parts = clickedDate.split('/');
                                                        const reformattedDate = `${parts[0]}/${parts[1]}/${selectedDateObj.getFullYear()}`;

                                                        // Trouver les séances pour la date donnée
                                                        const seancesForSelectedDate = seances.find(seance => seance.date === reformattedDate);

                                                        if (seancesForSelectedDate && seancesForSelectedDate.seances.length > 0) {
                                                            // Afficher les séances
                                                            seancesForSelectedDate.seances.forEach(seance => {
                                                                seancesContainer.append(`
                                                                    <div class="col-6">
                                                                        <div class="uniform-block fs-5">
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
                                                                `);
                                                            });
                                                        } else {
                                                            // Si aucune séance n'est trouvée, afficher un message
                                                            seancesContainer.append('<div class="my-3" style="color: #6A73AB">Aucune séance disponible pour cette date.</div>');
                                                        }
                                                    }

                                                    // Initialement, afficher les séances pour la date sélectionnée
                                                    const initialFormattedDate = selectedDateObj.toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    displaySeancesForDate(initialFormattedDate);

                                                    // Ajouter un gestionnaire d'événements pour chaque jour cliquable
                                                    $('.clickable-day').on('click', function () {
                                                        $('.clickable-day').removeClass('active');
                                                        $(this).addClass('active');
                                                        const clickedDate = $(this).data('date'); // Format dd/mm
                                                        displaySeancesForDate(clickedDate);
                                                    });
                                                })
                                                .catch(error => console.error('Erreur lors du chargement des séances:', error))
                                                .finally(() => spinner.addClass('d-none'));
                                        }

                                        //Datepicker modal
                                        const $calendarIcon = $('#icon-calendar-'+film.id);
                                        const $clearIcon = $('#close-icon-date-'+film.id);
                                        const $datepicker = $(`#datepicker-${film.id}`);
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
                                                const selectedDate = $(this).val();
                                                // Convertir la date au format souhaité ici
                                                const [day, month, year] = selectedDate.split('/');
                                                const formattedDate = `${year}-${month}-${day}`;

                                                const filmId = $(this).data('film-id');
                                                updateModalAndSessions(filmId, formattedDate);
                                            });

                                        //Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                        $clearIcon.on('click', function () {

                                            // Effacer la date sélectionnée en réinitialisant la valeur du champ
                                            $datepicker.val('');
                                            // Afficher l'icône du calendrier et masquer l'icône de suppression
                                            $clearIcon.addClass('d-none');
                                            $calendarIcon.removeClass('d-none');
                                            $('#date-seance-' + film.id).empty();
                                            $('#modal-date-seance-' + film.id).empty();
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

                                        // Affichage du cœur si le film est un coup de cœur
                                        if (film.label === true) {
                                            $(`#heart-${film.id}`).removeClass('d-none');
                                        }

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

                                        // Gestion des badges d'âge
                                        const ageFilm = $(`#age-${film.id}`);
                                        const ageBadge12 = ageFilm.find('.age-badge-12');
                                        const ageBadge16 = ageFilm.find('.age-badge-16');
                                        const ageBadge18 = ageFilm.find('.age-badge-18');

                                        if (film.age_minimum === '12') {
                                            ageBadge12.removeClass('d-none');
                                            ageBadge16.addClass('d-none');
                                            ageBadge18.addClass('d-none');
                                        }
                                        else if (film.age_minimum === '16') {
                                            ageBadge16.removeClass('d-none');
                                            ageBadge12.addClass('d-none');
                                            ageBadge18.addClass('d-none');
                                        }
                                        else if (film.age_minimum === '18') {
                                            ageBadge18.removeClass('d-none');
                                            ageBadge12.addClass('d-none');
                                            ageBadge16.addClass('d-none');
                                        }
                                        else {
                                            ageBadge12.addClass('d-none');
                                            ageBadge16.addClass('d-none');
                                            ageBadge18.addClass('d-none');
                                        }
                                    });
                                })
            .catch(error => {
                                    console.error('Erreur lors du chargement des films :', error);
                                })
            .finally(() => {
                                    // Cacher le spinner de chargement
                                    $('#loading-spinner').addClass('d-none');
                                });
        }
        // Menu Films
        function menuFilms() {
                    //Filtrage des films par cinéma, genre et date
                    const $clearIconGenre = $('.close-icon-genre');
                    const $clearIconCinema = $('.close-icon-cinema');

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
                        axios.post('/films/cinema', {id: selectedValue})
                            .then(response => {
                                // Parcourir les films retournés par la requête
                                const films = response.data;
                                $.each(films, function (index, film) {
                                    // Ajouter chaque film dans le conteneur
                                    $('#film-container-public').append(`
                                                    <div class="col-auto card" style="width: 12rem">
                                                        <div class="position-relative">
                                                            <i id="heart-${film.id}" class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
                                                            <a href="" data-bs-toggle="modal" data-bs-target="#modal-${film.id}">
                                                              <img src="${film.image}" class="card-img-top" alt="image" />
                                                            </a>
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
                                                    </div>
                                                    <!--Modal-->
                                                    <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-keyboard="false" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog-centered modal-lg">
                                                            <div class="modal-content seances">
                                                                <div class="modal-header position-relative header-seances" style="border: none">
                                                                    <div class="modal-title position-absolute text-center fs-3 fw-semibold" style="left:50%; transform: translateX(-50%)">${film.name}</div>
                                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                                                    <div id="modal-date-seance-${film.id}" class="row justify-content-center align-items-center text-center"></div>
                                                                    <div id="date-seance-${film.id}" class="row justify-content-center align-items-center mt-2"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `);


                                    // Fonction appelée après sélection d'une date
                                    function updateModalAndSessions(filmId, selectedDate) {
                                        // Vider les conteneurs avant de les remplir
                                        const seancesContainer = $('#date-seance-' + filmId);
                                        const modalContainer = $('#modal-date-seance-' + filmId);
                                        seancesContainer.empty();
                                        modalContainer.empty();

                                        // Convertir la date sélectionnée en objet Date pour comparaison
                                        const selectedDateObj = new Date(selectedDate);
                                        const selectedDateFormatted = selectedDateObj.toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        });

                                        // Préparer les 7 prochains jours
                                        const days = [];
                                        for (let i = 0; i < 7; i++) {
                                            const nextDay = new Date(selectedDateObj);
                                            nextDay.setDate(selectedDateObj.getDate() + i);
                                            days.push(nextDay.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'}));
                                        }

                                        // Mettre à jour le conteneur des dates dans la modale
                                        modalContainer.html(
                                            days.map(day => `<div class="col">${day}</div>`).join('')
                                        );

                                        // Charger les séances correspondantes via AJAX (Axios)
                                        axios.post('/films/seances', {filmId})
                                            .then(response => {
                                                const seances = response.data; // Liste des séances par date
                                                console.log('Séances pour le film', filmId, seances);

                                                // Trouver les séances correspondant à la date sélectionnée
                                                const seancesForSelectedDate = seances.find(date => date.date === selectedDateFormatted);

                                                // Si des séances existent pour la date sélectionnée
                                                if (seancesForSelectedDate && seancesForSelectedDate.seances.length > 0) {
                                                    // Afficher les séances
                                                    seancesForSelectedDate.seances.forEach(seance => {
                                                        seancesContainer.append(`
                                                                    <div class="col-6">
                                                                        <div class="uniform-block fs-5">
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
                                                                `);
                                                    });
                                                } else {
                                                    // Afficher un message si aucune séance n'est disponible
                                                    seancesContainer.html('<div class="col-12 text-center my-3" style="color:#6A73AB">Aucune séance disponible pour cette date.</div>');
                                                }
                                            })
                                            .catch(error => {
                                                console.error('Erreur lors du chargement des séances:', error);
                                                seancesContainer.html('<div class="col-12 text-center text-danger">Erreur de chargement.</div>');
                                            });
                                    }

                                    //Datepicker modal
                                    const $calendarIcon = $('#icon-calendar-' + film.id);
                                    const $clearIcon = $('#close-icon-date-' + film.id);
                                    const $datepicker = $(`#datepicker-${film.id}`);
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
                                            const selectedDate = $(this).val();
                                            // Convertir la date au format souhaité ici
                                            const [day, month, year] = selectedDate.split('/');
                                            const formattedDate = `${year}-${month}-${day}`;

                                            const filmId = $(this).data('film-id');
                                            updateModalAndSessions(filmId, formattedDate);
                                        });

                                    //Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                                    $clearIcon.on('click', function () {

                                        // Effacer la date sélectionnée en réinitialisant la valeur du champ
                                        $datepicker.val('');
                                        // Afficher l'icône du calendrier et masquer l'icône de suppression
                                        $clearIcon.addClass('d-none');
                                        $calendarIcon.removeClass('d-none');
                                        $('#date-seance-' + film.id).empty();
                                        $('#modal-date-seance-' + film.id).empty();
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

                                    // Affichage du cœur si le film est un coup de cœur
                                    if (film.label === true) {
                                        $(`#heart-${film.id}`).removeClass('d-none');
                                    }

                                    // Accordion description films
                                    const accordionButton = $('#btn-description-' + film.id);
                                    const accordionCollapse = $('#collapseDescription-' + film.id);

                                    // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                    $(document).click(function (event) {
                                        // Vérifie si le clic est à l'intérieur de l'accordéon
                                        if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                            // Ferme l'accordéon si ouvert
                                            if (accordionCollapse.hasClass('show')) {
                                                accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                            }
                                        }
                                    });

                                    // Gestion des badges d'âge
                                    const ageFilm = $(`#age-${film.id}`);
                                    const ageBadge12 = ageFilm.find('.age-badge-12');
                                    const ageBadge16 = ageFilm.find('.age-badge-16');
                                    const ageBadge18 = ageFilm.find('.age-badge-18');

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
                                });
                            })
                            .catch(error => {
                                console.error('Erreur lors du chargement des films :', error);
                            })
                            .finally(() => {
                                $('#loading-spinner').addClass('d-none')
                            });
                    });

                    //Au clic sur l'icône "X" pour réinitialiser la sélection
                    $clearIconCinema.on('click', function () {
                        let customSelect = $('.custom-select-btn-cinema');
                        $(this).addClass('d-none');
                        $('#cinema-input').val('');
                        customSelect.text('Cinéma');
                        $('.custom-options-cinema').hide();
                        customSelect.removeClass('no-arrow');
                        film();
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
                        axios.post('/films/genre', {id: selectedValue})
                            .then(response => {
                                const films = response.data;
                                $.each(films, function (index, film) {
                                    $('#film-container-public').append(
                                        `
                                                                        <div class="col-auto card" style="width: 12rem">
                                                                            <div class="position-relative">
                                                                                <i id="heart-${film.id}" class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
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
                                                                                            <button id="btn-description${film.id}" class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                                                                        </div>
                                                                                        <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                                                                            <div class="accordion-body p-0">${film.description}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <!--Modal-->
                                                                        <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                                                            <div class="modal-dialog modal-dialog-centered modal-xl">
                                                                                <div class="modal-content" style="background-color: #6A73AB">
                                                                                    <div class="modal-body modal-admin row justify-content-center m-0 p-0"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    `);

                                    // Affichage cœur si Coup de cœur
                                    if (film.label === true) {
                                        $('#heart-' + film.id).removeClass('d-none');
                                    }

                                    // Accordion description films
                                    const accordionButton = $('#btn-description-' + film.id);
                                    const accordionCollapse = $('#collapseDescription-' + film.id);
                                    // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                    $(document).click(function (event) {
                                        // Vérifie si le clic est à l'intérieur de l'accordéon
                                        if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                            // Ferme l'accordéon si ouvert
                                            if (accordionCollapse.hasClass('show')) {
                                                accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                            }
                                        }
                                    });

                                    //Affichage badge age mini
                                    function displayAgeBadge() {
                                        const ageFilm = $('#age-' + film.id);
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
                                });
                            })
                            .catch(error => {
                                console.log(error)
                            })
                            .finally(() => {
                                $('#loading-spinner').addClass('d-none')
                            });
                    });

                    //Au clic sur l'icône "X" pour réinitialiser la sélection
                    $clearIconGenre.on('click', function () {
                        let customSelect = $('.custom-select-btn-genre');
                        $(this).addClass('d-none');
                        $('#genre-input').val('');
                        customSelect.text('Genre');
                        $('.custom-options-genre').hide();
                        customSelect.removeClass('no-arrow');
                        film();
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
                    const $datepicker = $('#datepicker');
                    const $calendarIcon = $('#icon-calendar');
                    const $clearIcon = $('.close-icon-date');
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
                            axios.post('/films/date', {id: FormattedDate})
                                .then(response => {
                                    const films = response.data;
                                    $.each(films, function (index, film) {
                                        $('#film-container-public').append(
                                            `
                                                                        <div class="col-auto card" style="width: 12rem">
                                                                            <div class="position-relative">
                                                                                <i id="heart-${film.id}" class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
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
                                                                                            <button id="btn-description${film.id}" class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                                                                        </div>
                                                                                        <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                                                                            <div class="accordion-body p-0">${film.description}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <!--Modal-->
                                                                        <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                                                            <div class="modal-dialog modal-dialog-centered modal-xl">
                                                                                <div class="modal-content" style="background-color: #6A73AB">
                                                                                    <div class="modal-body modal-admin row justify-content-center m-0 p-0"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    `);

                                        // Affichage cœur si Coup de cœur
                                        if (film.label === true) {
                                            $('#heart-' + film.id).removeClass('d-none');
                                        }

                                        // Accordion description films
                                        const accordionButton = $('#btn-description-' + film.id);
                                        const accordionCollapse = $('#collapseDescription-' + film.id);
                                        // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
                                        $(document).click(function (event) {
                                            // Vérifie si le clic est à l'intérieur de l'accordéon
                                            if (!accordionButton.is(event.target) && accordionButton.has(event.target).length === 0 && !accordionCollapse.is(event.target) && accordionCollapse.has(event.target).length === 0) {
                                                // Ferme l'accordéon si ouvert
                                                if (accordionCollapse.hasClass('show')) {
                                                    accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
                                                }
                                            }
                                        });

                                        //Affichage badge age mini
                                        function displayAgeBadge() {
                                            const ageFilm = $('#age-' + film.id);
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
                                    });
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                                .finally(() => {
                                    $('#loading-spinner').addClass('d-none')
                                });
                        });

                    //Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                    $clearIcon.on('click', function () {

                        // Effacer la date sélectionnée en réinitialisant la valeur du champ
                        $datepicker.val('');
                        // Afficher l'icône du calendrier et masquer l'icône de suppression
                        $clearIcon.addClass('d-none');
                        $calendarIcon.removeClass('d-none');

                        // Recharger les films par défaut
                        film();

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
        function reservation() {
            // Parse les données des films depuis l'attribut data-films
            const filmsData = JSON.parse($('#films-data').attr('data-films'));

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
                        top: cinemaPosition.top - 4*($(this).outerHeight()), // Aligné avec le cinéma
                        left: $(this).outerWidth(), // Décalé à droite du cinéma
                    });
                } else {
                    // Aucun film disponible pour ce cinéma
                    const noFilmMessage = `<div class="custom-option-film">Aucun film disponible</div>`;
                    filmContainer.append(noFilmMessage).removeClass('d-none');
                    // Calculer la position du cinéma sélectionné et ajuster la position du sous-menu des films
                    const cinemaPosition = $(this).offset(); // Récupère la position de l'élément cinéma
                    filmContainer.css({
                        top: cinemaPosition.top - 4*($(this).outerHeight()), // Aligné avec le cinéma
                        left: $(this).outerWidth(), // Décalé à droite du cinéma
                    });
                }
            });

            // Quand un film est sélectionné
            $(document).on('click', '.custom-option-film', function () {
                const filmId = $(this).data('film-id');
                const filmTitle = $(this).text().trim();
                let customSelect = $('.custom-select-btn-cinema');
                // Met à jour le champ caché pour le film
                $('#film-input').val(filmId);

                // Met à jour le texte du bouton principal pour indiquer le film sélectionné
                customSelect.text(filmTitle);

                // Masque tous les menus
                $('.custom-options-films').addClass('d-none');

                // Affiche l'icône de fermeture
                customSelect.addClass('no-arrow');
                $('.close-icon-cinema').removeClass('d-none');
            });

            const $clearIconCinema = $('.close-icon-cinema')

            // Réinitialiser la sélection avec l'icône de fermeture
            $clearIconCinema.on('click', function () {
                $('#cinema-input').val('');
                $('#film-input').val('');
                $('.custom-select-btn-cinema').text('Cinéma');
                $('.custom-options-films').addClass('d-none').empty();
                $(this).addClass('d-none');
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
        }
        // Fonction pour récupérer les données du film et des séances
        function reservationFilmData() {
            axios.get('/reservation/film')
                .then(function (response) {
                    const data = response.data;
                    if (data.film) {
                        // Mettre à jour les informations du film
                        $('#film-name').text(data.film.name + " - " + data.film.cinema);
                        $('#reservation .img-fluid').attr('src', data.film.image);

                        // Gérer les séances
                        const availableSeances = data.seances[0].informations;
                        $('#seances-buttons .btn-reservation').each(function() {
                            const seanceType = $(this).data('seance');
                            const isAvailable = availableSeances.some(function(info) {
                                return info.qualite === seanceType;
                            });

                            // Si la séance est disponible, activer le bouton
                            if (isAvailable) {
                                $(this).removeClass('disabled').on('click', function() {
                                    // Retirer la classe active des autres boutons
                                    $('#seances-buttons .btn-reservation').not(this).removeClass('active');
                                    // Ajouter la classe active au bouton cliqué
                                    $(this).addClass('active');

                                    // Logique de réservation : mettre à jour l'interface avec la séance choisie
                                    const seance = availableSeances.find(function(info) {
                                        return info.qualite === seanceType;
                                    });

                                    if (seance) {
                                        // Mettre à jour l'affichage de la séance
                                        $('#seance-selected').text(`Qualité ${seance.qualite} - ${seance.heureDebut} à ${seance.heureFin}`);

                                        // Réinitialiser les sièges
                                        const seatingArea = $('#seating-area');
                                        seatingArea.each(function() {
                                            $(this).removeClass('reserve selectionne').addClass('libre');
                                        });

                                        // Marquer les sièges réservés
                                        if (seance.sieges_reserves) {
                                            seance.sieges_reserves.forEach(function(seatId) {
                                                $(`#seating-area .seat[data-id="${seatId}"]`).removeClass('libre').addClass('reserve');
                                            });
                                        }

                                        // Gestion des sièges sélectionnables
                                        seatingArea.off('click').on('click', function() {
                                            if (!$(this).hasClass('reserve')) {
                                                $(this).toggleClass('selectionne');
                                            }
                                        });
                                    }
                                });
                            } else {
                                // Si la séance n'est pas disponible, griser le bouton
                                $(this).addClass('disabled').off('click');
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.error('Erreur lors de la récupération des données :', error);
                });

            //Datepicker
            const $datepicker = $('#datepicker');
            const $calendarIcon = $('#icon-calendar');
            const $clearIcon = $('#close-icon-date');
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
                });

            //Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
            $clearIcon.on('click', function () {

                // Effacer la date sélectionnée en réinitialisant la valeur du champ
                $datepicker.val('');
                // Afficher l'icône du calendrier et masquer l'icône de suppression
                $clearIcon.addClass('d-none');
                $calendarIcon.removeClass('d-none');
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

        //Page Administration
        //Films
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

        //Compte employé
        //Fonction pour générer les réservations
        function loadReservations() {
                            const $datepickerReservations = $('#datepicker_reservations');
                            const $calendarIconReservations = $('#icon-calendar-reservations');
                            const $clearIconReservations = $('.close-icon-reservations');
                            $('#reservations-container').empty();
                            axios.get('/administrateur/administration/film')
                                .then(response => {
                                    const films = response.data;
                                    const datesWithReservations = {};
                                    const datepicker = $('#datepicker_reservations');
                                    // Initialiser le datepicker avec les réservations
                                    if (films.reservations) {
                                        films.forEach(film => {
                                            Object.keys(film.reservations).forEach(date => {
                                                if (!datesWithReservations[date]) {
                                                    datesWithReservations[date] = 0;
                                                }
                                                datesWithReservations[date] += film.reservations[date];
                                            });
                                        });
                                        datepicker.datepicker({
                                            orientation: "bottom",
                                            language: "fr",
                                            autoclose: true,
                                            todayHighlight: true,
                                            format: 'dd/mm/yyyy',
                                            beforeShowDay: function (date) {
                                                const dateString = date.toLocaleDateString('fr-FR');
                                                const reservations = datesWithReservations[dateString] || 0;
                                                const day = date.getDate();
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
                                    }

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
                                        const container = $('#reservations-container');
                                        if (films.reservations) {
                                            const days = getNext7Days(selectedDate); // Récupère les 7 jours à partir de la date sélectionnée
                                            const formattedDays = days.map(date => formatDate(date)); // Formate chaque date
                                            container.empty();

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
                                                const dayFormatted = day.slice(0, 5); // Afficher uniquement le format dd/mm
                                                datesRow.append(`<div class="col grid-cell fw-bold">${dayFormatted}</div>`);
                                            });
                                            col6.append(datesRow);

                                            // Ajouter les lignes pour les films
                                            films.forEach(film => {
                                                const filmRow = $('<div class="row"></div>');
                                                formattedDays.forEach(day => {
                                                    const reservations = film.reservations[day] || 0; // Obtenir le nombre de réservations
                                                    filmRow.append(`<div class="col grid-cell">${reservations}</div>`);
                                                });
                                                col6.append(filmRow);
                                            });

                                            // Ajouter les colonnes au conteneur principal
                                            const headerRow = $('<div class="row justify-content-center text-white"></div>');
                                            headerRow.append(col2).append(col6);
                                            container.append(headerRow);
                                        } else {
                                            container.html('<p class="text-center" style="color: #6A73AB">Aucune réservation pour le moment.</p>');
                                        }
                                    }

                                    // Écouter le changement de date dans le datepicker
                                    datepicker.datepicker({
                                        autoclose: true,
                                        format: 'dd/mm/yyyy',
                                        language: 'fr',
                                    }).on('changeDate', function (e) {
                                        // Appeler la fonction pour mettre à jour le tableau avec les réservations
                                        updateTableWithReservations(e.date);
                                    });

                                    // Datepicker
                                    $datepickerReservations.on('changeDate', function (e) {
                                        // Lors de la sélection d'une date
                                        const selectedDate = e.date;
                                        updateTableWithReservations(selectedDate);
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
        //Films
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

        //Lancement des requètes AJAX et fonctions au chargement des pages
        if (window.location.pathname === '/administrateur/administration') {filmAdmin()}
        if (window.location.pathname === '/administrateur/administration/account_employe') {employe()}
        if (window.location.pathname === '/administrateur/administration/reservations') {employe()}
        if (window.location.pathname === '/administrateur/films') {film()}
        if (window.location.pathname === '/employe/administration') {filmEmploye()}
        if (window.location.pathname === '/employe/administration/avis') {avis()}
        if (window.location.pathname === '/employe/films') {film()}
        if (window.location.pathname === '/utilisateur/films') {film()}
        if (window.location.pathname === '/films') {film(); menuFilms()}
        if (window.location.pathname === '/reservation') {reservation(); reservationFilmData()}
    });

