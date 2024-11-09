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
    // Navbar Top & Navbar Footer Bottom
        // A l'ouverture des navbar pour mobile, on change la couleur de fond, on cache le logo et on modifie la taille des colonnes
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
        // A la fermeture des navbar pour mobile, on remet la couleur de fond par défaut, on affiche le logo et on remet la taille des colonnes
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

    // Page de connexion et d'inscription dans mon espace
        // Masquer le mot de passe de la page de connexion et d'inscription
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
        // Vérification de la case à cocher des conditions générales d'utilisation
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

    //Page films
            const $clearIconGenre = $('.close-icon-genre');
            const $clearIconCinema = $('.close-icon-cinema');
        // Au clic sur le bouton cinéma pour afficher/masquer les options
            $('.custom-select-btn-cinema').on('click', function(e) {
            e.stopPropagation();
            $('.custom-options-cinema').toggle();
            $('.custom-options-genre').hide();
        });
        // Sélection d'une option de cinéma
            $('.custom-option-cinema').on('click', function() {
            let selectedText = $(this).text();
            let selectedValue = $(this).data('value');
            let customSelect = $('.custom-select-btn-cinema');
            customSelect.text(selectedText);
            $('#cinema-input').val(selectedValue);
            $('.custom-options-cinema').hide();
            customSelect.addClass('no-arrow');
            $('.close-icon-cinema').removeClass('d-none');
        });
        // Au clic sur l'icône "X" pour réinitialiser la sélection
            $clearIconCinema.on('click', function() {
            let customSelect = $('.custom-select-btn-cinema');
            $(this).addClass('d-none');
            $('#cinema-input').val('');
            customSelect.text('Cinéma');
            $('.custom-options-cinema').hide();
            customSelect.removeClass('no-arrow');
        });
        // Au clic sur le bouton genre pour afficher/masquer les options
            $('.custom-select-btn-genre').on('click', function(e) {
            e.stopPropagation();
            $('.custom-options-genre').toggle();
            $('.custom-options-cinema').hide();
        });
            $('.custom-option-genre').on('click', function() {
            let selectedText = $(this).text();
            let selectedValue = $(this).data('value');
            let customSelect = $('.custom-select-btn-genre');
            customSelect.text(selectedText);
            $('#genre-input').val(selectedValue);
            $('.custom-options-genre').hide();
            customSelect.addClass('no-arrow');
            $('.close-icon-genre').removeClass('d-none');
        });
            $clearIconGenre.on('click', function() {
            let customSelect = $('.custom-select-btn-genre');
            $(this).addClass('d-none');
            $('#genre-input').val('');
            customSelect.text('Genre');
            $('.custom-options-genre').hide();
            customSelect.removeClass('no-arrow');
        });
        // Clic en dehors du menu pour fermer les options
            $(window).on('click', function() {
            $('.custom-options-cinema').hide();
            $('.custom-options-genre').hide();
        });
        // Appliquer le style de hover/focus
            $clearIconCinema.on('mouseenter focus', function() {
            $('.custom-select-btn-cinema').addClass('btn-hover');
            $('.close-icon-cinema').addClass('btn-hover');
        });
        // Appliquer le style de hover/focus
            $clearIconGenre.on('mouseenter focus', function() {
            $('.custom-select-btn-genre').addClass('btn-hover');
            $('.close-icon-genre').addClass('btn-hover');
        });
        // Retirer le style quand on quitte le survol/focus
            $clearIconCinema.on('mouseleave blur', function() {
            $('.custom-select-btn-cinema').removeClass('btn-hover');
            $('.close-icon-cinema').removeClass('btn-hover');
        });
        // Retirer le style quand on quitte le survol/focus
            $clearIconGenre.on('mouseleave blur', function() {
            $('.custom-select-btn-genre').removeClass('btn-hover');
            $('.close-icon-genre').removeClass('btn-hover');
        });

        // Datepicker
                const $datepicker = $('#datepicker');
                const $calendarIcon = $('#icon-calendar');
                const $clearIcon = $('.close-icon-date');
                $datepicker.datepicker({
                    format: "dd/mm/yyyy",
                    orientation: "bottom",
                    language: "fr",
                    autoclose: true
                }).on('changeDate', function () {
                    // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                    $calendarIcon.addClass('d-none');
                    $clearIcon.removeClass('d-none');
                });
            // Au clic sur l'icône de croix, on réinitialise la date et on affiche l'icône calendrier
                $clearIcon.on('click', function () {
                $datepicker.datepicker('clearDates');
                $calendarIcon.removeClass('d-none');
                $clearIcon.addClass('d-none');
            });
            // Appliquer le style de hover/focus
                $clearIcon.on('mouseenter focus', function () {
                $datepicker.addClass('btn-hover');
                $clearIcon.addClass('btn-hover');
            });
            // Au clic sur l'icône de croix, on réinitialise la date
                $calendarIcon.on('mouseenter focus', function () {
                $datepicker.addClass('btn-hover');
                $calendarIcon.addClass('btn-hover');
            });
            // Retirer le style quand on quitte le survol/focus
                $clearIcon.on('mouseleave blur', function () {
                $datepicker.removeClass('btn-hover');
                $clearIcon.removeClass('btn-hover');
            });
            // Retirer le style quand on quitte le survol/focus
                $calendarIcon.on('mouseleave blur', function () {
                $datepicker.removeClass('btn-hover');
                $calendarIcon.removeClass('btn-hover');
            });
            // Ouvrir le calendrier
                $calendarIcon.on('click', function () {
                $datepicker.focus();
            });

    //Page administration
        //Création d'un film
            $('#btn-plus').click(function () {
            axios.post('/administrateur/administration/film/create')
                .then(response => {LoadFilm();console.log(response.data);})
                .catch(error => {
                    console.error(error);
                });
        });
        //Affichage des films sur clic bouton administration
            $('#btn-navbar-admin').click(function() {
            LoadFilm();
        });
        //Déconnexion sur clic bouton déconnexion
            $('#btn-deconnexion').click(function() {
            axios.post('/logout')
                .then(response => {console.log(response.data);window.location.href = '/accueil';})
                .catch(error => {console.error(error);});
        });
        //Affichage des films
            function LoadFilm() {
                $('#card-container').empty();
                axios.get('/administrateur/administration/film')
                    .then(response => {
                        const Film = response.data;
                        console.log(Film);
                        $.each(Film, function(index, film) {
                            $('#card-container').append(
                                `<div id="card-film" class="col-auto card" style="width: 12rem">
                                    <div class="d-flex position-absolute text-white">
                                            <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin" style="border-radius: 0 0 2px 0" data-bs-toggle="modal" data-bs-target="#modal-${film.id}"></button>
                                            <button id="x-square-${film.id}" class="btn bi bi-x-square text-danger p-0 fs-5 bg-admin position-relative" style="left: 124px; border-radius: 0 0 0 2px"></button>
                                        </div>
                                    <img src="" class="card-img-top" alt="" style="width: auto; height: 228px; background-color: #6A73AB">
                                    <div class="card-body p-0 py-1">
                                            <div class="card-title fs-5" style="color:#6A73AB">${film.name}
                                                <span class="age-badge-12 mx-4 d-none">12+</span>
                                                <span class="age-badge-16 mx-4 d-none">16+</span>
                                                <span class="age-badge-18 mx-4 d-none">18+</span>
                                            </div>
                                            <div class="card-title fs-6">${film.genre}</div>
                                            <p class="card-text m-0 my-1 text-warning">
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
                                    <div class="modal fade" id="modal-${film.id}" tabindex="-1" aria-labelledby="Modal-film" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered modal-xl">
                                            <div class="modal-content" style="background-color: #6A73AB">
                                                <div class="modal-body modal-admin row justify-content-center m-0 p-0">
                                                    <div class="col-4 p-4 text-white position-relative">
                                                        <div class="position-relative">
                                                            <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin position-absolute" style="top: 0; right: 0; border-radius: 0 0 0 2px"></button>
                                                            <img src="" class="img-fluid" alt="" style="width: 100%; height: 450px; background-color: white">
                                                        </div>                                          
                                                        <div class="row my-5 justify-content-center align-items-center">
                                                            <div class="col-6 d-flex justify-content-center">
                                                                <div class="dropdown dropdown-modal-admin">
                                                                    <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuGenre-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        Genre
                                                                    </button>
                                                                    <ul class="dropdown-menu p-0" aria-labelledby="dropdownMenuGenre">
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
                                                            <div class="col-6 d-flex justify-content-center">
                                                                <div class="dropdown dropdown-modal-admin">
                                                                    <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuAge-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        Age mini
                                                                    </button>
                                                                    <ul class="dropdown-menu p-0" aria-labelledby="dropdownMenuAge">
                                                                        <li><a class="dropdown-item drop-age" href="#">Tout public</a></li>
                                                                        <li><a class="dropdown-item drop-age" href="#">12</a></li>
                                                                        <li><a class="dropdown-item drop-age" href="#">16</a></li>
                                                                        <li><a class="dropdown-item drop-age" href="#">18</a></li>
                                                                    </ul>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                    <div class="col-8 p-4">
                                                        <div class="row">
                                                            <div class="col-5 d-flex align-items-center">
                                                                <div class="text-white fs-5 me-1">Nom:</div>
                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="TextareaNom-${film.id}"></textarea>
                                                                <label class="d-none" for="TextareaNom-${film.id}"></label>
                                                            </div>
                                                            <div class="col-3 d-flex align-items-center justify-content-end">
                                                                <div class="dropdown dropdown-modal-admin">
                                                                        <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuCinema-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            Cinéma
                                                                        </button>
                                                                        <ul class="dropdown-menu p-0" aria-labelledby="dropdownMenuCinema">
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
                                                            <div class="col-4 d-flex align-items-center justify-content-end">
                                                                <button id="btn-validate-film-${film.id}" class="btn bi bi-check-lg p-2 fs-4 d-flex justify-content-center align-items-center"></button>
                                                                <button class="btn bi bi-x-lg p-2 fs-4 d-flex justify-content-center align-items-center" data-bs-dismiss="modal"></button>
                                                            </div>
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-4 d-flex justify-content-start">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-date-admin text-black" id="datepicker-admin-debut-${film.id}" placeholder="Date début" readonly>
                                                                    <label for="datepicker-admin-debut-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-calendar" id="icon-calendar-debut-admin-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-date-debut-admin-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-4 d-flex justify-content-end">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-date-admin text-black" id="datepicker-admin-fin-${film.id}" placeholder="Date fin" readonly>
                                                                    <label for="datepicker-admin-fin-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-calendar" id="icon-calendar-fin-admin-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-date-fin-admin-${film.id}"></span>
                                                                </div>
                                                            </div> 
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                                <div class="fs-5">4DX:</div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${film.id}" placeholder="Heure début" readonly>
                                                                    <label for="timepicker-admin-debut-4DX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${film.id}" placeholder="Heure fin" readonly>
                                                                    <label for="timepicker-admin-fin-4DX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                                <div class="fs-5">Prix:</div>
                                                            </div>
                                                            <div class="col-2 d-flex align-items-center">
                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="Textarea-3DX-prix-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-3DX-prix-${film.id}"></label>
                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                            </div>
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                                <div class="fs-5">3DX:</div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${film.id}" placeholder="Heure début" readonly>
                                                                    <label for="timepicker-admin-debut-3DX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${film.id}" placeholder="Heure fin" readonly>
                                                                    <label for="timepicker-admin-fin-3DX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-3DX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-3DX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                                <div class="fs-5">Prix:</div>
                                                            </div>
                                                            <div class="col-2 d-flex align-items-center">
                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="Textarea-3DX-prix-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-3DX-prix-${film.id}"></label>
                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                            </div>
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                                <div class="fs-5">IMAX:</div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${film.id}" placeholder="Heure début" readonly>
                                                                    <label for="timepicker-admin-debut-IMAX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${film.id}" placeholder="Heure fin" readonly>
                                                                    <label for="timepicker-admin-fin-IMAX-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                                <div class="fs-5">Prix:</div>
                                                            </div>
                                                            <div class="col-2 d-flex align-items-center">
                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="Textarea-IMAX-prix-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-IMAX-prix-${film.id}"></label>
                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                            </div>
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                                <div class="fs-5">Dolby:</div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${film.id}" placeholder="Heure début" readonly>
                                                                    <label for="timepicker-admin-debut-Dolby-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-3 d-flex justify-content-center">
                                                                <div class="position-relative">
                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${film.id}" placeholder="Heure fin" readonly>
                                                                    <label for="timepicker-admin-fin-Dolby-${film.id}" class="d-none"></label>
                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-Dolby-${film.id}"></span>
                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-Dolby-${film.id}"></span>
                                                                </div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                                <div class="fs-5">Prix:</div>
                                                            </div>
                                                            <div class="col-2 d-flex align-items-center">
                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="Textarea-dolby-prix-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-dolby-prix-${film.id}"></label>
                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                            </div>
                                                        </div>
                                                        <div class="row my-3">
                                                            <div class="col-3 d-flex text-white align-items-center justify-content-start">
                                                                <div class="fs-5">Nombre de places:</div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center">
                                                                <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="Textarea-places-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-places-${film.id}"></label>
                                                            </div>
                                                            <div class="col-1 d-flex text-white align-items-center">
                                                                <div class="fs-5">Salle:</div>
                                                            </div>
                                                            <div class="col-2 d-flex text-white align-items-center">
                                                                <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="Textarea-salles-${film.id}"></textarea>
                                                                <label class="d-none" for="Textarea-salles-${film.id}"></label>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-3 mb-1">
                                                            <div class="col-3 text-white align-items-center justify-content-start">
                                                                <div class="fs-5">Description:</div>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-12 d-flex text-white align-items-center">
                                                                <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="Textarea-description-${film.id}" style="height:10rem"></textarea>
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
                                    .then(response => {$('#card-container').empty();console.log(response.data);})
                                    .catch(error => {console.error(error);})
                                    .finally(() => {LoadFilm();});
                            });
                            //Affichage badge age mini
                                if (film.age_minimum === '12') {
                                    $(`.age-badge-12`).removeClass('d-none');
                                }
                                if (film.age_minimum === '16') {
                                    $(`.age-badge-16`).removeClass('d-none');
                                }
                                if (film.age_minimum === '18') {
                                    $(`.age-badge-18`).removeClass('d-none');
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
                            //modal
                                //Menu déroulant genre
                                        let selectedGenre= '';
                                        $('.drop-genre').click(function(e) {
                                            e.preventDefault();
                                            selectedGenre = $(this).text();
                                            $('#dropdownMenuGenre-'+film.id).text(selectedGenre);
                                        });
                                //Menu déroulant age
                                        let selectedAge= '';
                                        $('.drop-age').click(function(e) {
                                            e.preventDefault();
                                            selectedAge= $(this).text();
                                            $('#dropdownMenuAge-'+film.id).text(selectedAge);
                                        });
                                //Menu déroulant Cinéma
                                        let selectedCinema= '';
                                        $('.drop-cinema').click(function(e) {
                                            e.preventDefault();
                                            selectedCinema= $(this).text();
                                            $('#dropdownMenuCinema-'+film.id).text(selectedCinema);
                                        });
                                // Réinitialiser le modal lorsque celui-ci est fermé
                                        const modal = $('#modal-' + film.id);
                                        modal.on('hidden.bs.modal', function () {
                                            // Réinitialiser tous les champs de texte (textarea) du modal
                                            modal.find('textarea').val('');

                                            // Réinitialiser toutes les sélections du dropdown
                                            modal.find('.dropdown-item').removeClass('active');
                                            $('#dropdownMenuGenre-' + film.id).text('Genre');
                                            $('#dropdownMenuAge-' + film.id).text('Age mini');
                                            $('#dropdownMenuCinema-' + film.id).text('Cinéma');

                                            // Réinitialiser tout autre champ si nécessaire
                                            modal.find('input').val('');
                                            $('#datepicker-admin-debut-' + film.id).datepicker('clearDates');
                                            $('#datepicker-admin-fin-' + film.id).datepicker('clearDates');
                                            $('#timepicker-admin-debut-4DX-' + film.id).val('');
                                            $('#timepicker-admin-fin-4DX-' + film.id).val('');
                                            $('#timepicker-admin-debut-3DX-' + film.id).val('');
                                            $('#timepicker-admin-fin-3DX-' + film.id).val('');
                                            $('#timepicker-admin-debut-IMAX-' + film.id).val('');
                                            $('#timepicker-admin-fin-IMAX-' + film.id).val('');
                                            $('#timepicker-admin-debut-Dolby-' + film.id).val('');
                                            $('#timepicker-admin-fin-Dolby-' + film.id).val('');
                                            $('#close-icon-date-debut-admin-' + film.id).addClass('d-none');
                                            $('#close-icon-date-fin-admin-' + film.id).addClass('d-none');
                                            $('#icon-calendar-debut-admin-' + film.id).removeClass('d-none');
                                            $('#icon-calendar-fin-admin-' + film.id).removeClass('d-none');
                                        });
                                //Valider les informations du film
                                        $('#btn-validate-film-'+film.id).click(function () {
                                            const data= {
                                                id: film.id,
                                                genre: selectedGenre,
                                                age: selectedAge,
                                                nom: $('#TextareaNom-'+film.id).val(),
                                                description: $('#Textarea-description-'+film.id).val(),
                                                cinema: selectedCinema,
                                            }
                                            axios.post('/administrateur/administration/film/validate', data)
                                                  .then(response => {console.log(response.data);$('#modal-' + film.id).modal('hide'); })
                                                  .catch(error => {console.error(error);})
                                                .finally(() => {LoadFilm();});
                                        });
                                // Datepicker
                                        const $datepickerDebut = $('#datepicker-admin-debut-'+film.id);
                                        const $calendarIconDebut = $('#icon-calendar-debut-admin-'+film.id);
                                        const $clearIconDebut = $('#close-icon-date-debut-admin-'+film.id);
                                        const $datepickerFin = $('#datepicker-admin-fin-'+film.id);
                                        const $calendarIconFin = $('#icon-calendar-fin-admin-'+film.id);
                                        const $clearIconFin = $('#close-icon-date-fin-admin-'+film.id);
                                    //Date début
                                        $datepickerDebut.datepicker({
                                            format: "dd/mm/yyyy",
                                            orientation: "bottom",
                                            language: "fr",
                                            autoclose: true
                                        }).on('changeDate', function () {
                                                // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                $calendarIconDebut.addClass('d-none');
                                                $clearIconDebut.removeClass('d-none');
                                            });
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
                                        $datepickerFin.datepicker({
                                            format: "dd/mm/yyyy",
                                            orientation: "bottom",
                                            language: "fr",
                                            autoclose: true
                                        }).on('changeDate', function () {
                                                // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
                                                $calendarIconFin.addClass('d-none');
                                                $clearIconFin.removeClass('d-none');
                                            });
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
                                //Timepicker
                                        const timepickerId3DXDebut = '#timepicker-admin-debut-3DX-'+film.id;
                                        const clockIconId3DXDebut = '#icon-clock-debut-admin-3DX-'+film.id;
                                        const clearIconId3DXDebut = '#close-icon-time-debut-admin-3DX-'+film.id;
                                        const timepickerId4DXDebut = '#timepicker-admin-debut-4DX-'+film.id;
                                        const clockIconId4DXDebut = '#icon-clock-debut-admin-4DX-'+film.id;
                                        const clearIconId4DXDebut = '#close-icon-time-debut-admin-4DX-'+film.id;
                                        const timepickerIdIMAXDebut = '#timepicker-admin-debut-IMAX-'+film.id;
                                        const clockIconIdIMAXDebut = '#icon-clock-debut-admin-IMAX-'+film.id;
                                        const clearIconIdIMAXDebut = '#close-icon-time-debut-admin-IMAX-'+film.id;
                                        const timepickerIdDolbyDebut = '#timepicker-admin-debut-Dolby-'+film.id;
                                        const clockIconIdDolbyDebut = '#icon-clock-debut-admin-Dolby-'+film.id;
                                        const clearIconIdDolbyDebut = '#close-icon-time-debut-admin-Dolby-'+film.id;
                                        const timepickerId3DXFin = '#timepicker-admin-fin-3DX-'+film.id;
                                        const clockIconId3DXFin = '#icon-clock-fin-admin-3DX-'+film.id;
                                        const clearIconId3DXFin = '#close-icon-time-fin-admin-3DX-'+film.id;
                                        const timepickerId4DXFin = '#timepicker-admin-fin-4DX-'+film.id;
                                        const clockIconId4DXFin = '#icon-clock-fin-admin-4DX-'+film.id;
                                        const clearIconId4DXFin = '#close-icon-time-fin-admin-4DX-'+film.id;
                                        const timepickerIdIMAXFin = '#timepicker-admin-fin-IMAX-'+film.id;
                                        const clockIconIdIMAXFin = '#icon-clock-fin-admin-IMAX-'+film.id;
                                        const clearIconIdIMAXFin = '#close-icon-time-fin-admin-IMAX-'+film.id;
                                        const timepickerIdDolbyFin = '#timepicker-admin-fin-Dolby-'+film.id;
                                        const clockIconIdDolbyFin = '#icon-clock-fin-admin-Dolby-'+film.id;
                                        const clearIconIdDolbyFin = '#close-icon-time-fin-admin-Dolby-'+film.id;
                                        function initTimepicker(timepickerId, clockIconId, clearIconId) {
                                const $timepicker = $(timepickerId);
                                const $clockIcon = $(clockIconId);
                                const $clearIcon = $(clearIconId);

                                // Initialisation du timepicker avec flatpickr
                                const timepickerInstance = flatpickr($timepicker, {
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: "H:i",
                                    time_24hr: true,
                                    minuteIncrement: 15,
                                    onChange: function() {
                                        // Cache l'icône de l'horloge et montre l'icône de suppression
                                        $clockIcon.addClass('d-none');
                                        $clearIcon.removeClass('d-none');
                                    }
                                });

                                // Réinitialiser l'heure au clic sur l'icône de suppression
                                $clearIcon.on('click', function() {
                                    timepickerInstance.clear();
                                    $clockIcon.removeClass('d-none');
                                    $clearIcon.addClass('d-none');
                                });

                                // Appliquer un style de hover/focus pour l'icône de suppression
                                $clearIcon.on('mouseenter focus', function() {
                                    $timepicker.addClass('btn-hover');
                                    $clearIcon.addClass('btn-hover');
                                });

                                // Appliquer un style de hover/focus pour l'icône de l'horloge
                                $clockIcon.on('mouseenter focus', function() {
                                    $timepicker.addClass('btn-hover');
                                    $clockIcon.addClass('btn-hover');
                                });

                                // Retirer le style de hover/focus
                                $clearIcon.on('mouseleave blur', function() {
                                    $timepicker.removeClass('btn-hover');
                                    $clearIcon.removeClass('btn-hover');
                                });

                                $clockIcon.on('mouseleave blur', function() {
                                    $timepicker.removeClass('btn-hover');
                                    $clockIcon.removeClass('btn-hover');
                                });

                                // Ouvrir l'horloge lorsque l'on clique sur l'icône horloge
                                $clockIcon.on('click', function() {
                                    $timepicker.focus();
                                });
                            }
                                        initTimepicker(timepickerId3DXDebut, clockIconId3DXDebut, clearIconId3DXDebut);
                                        initTimepicker(timepickerId4DXDebut, clockIconId4DXDebut, clearIconId4DXDebut);
                                        initTimepicker(timepickerIdIMAXDebut, clockIconIdIMAXDebut, clearIconIdIMAXDebut);
                                        initTimepicker(timepickerIdDolbyDebut, clockIconIdDolbyDebut, clearIconIdDolbyDebut);
                                        initTimepicker(timepickerId3DXFin, clockIconId3DXFin, clearIconId3DXFin);
                                        initTimepicker(timepickerId4DXFin, clockIconId4DXFin, clearIconId4DXFin);
                                        initTimepicker(timepickerIdIMAXFin, clockIconIdIMAXFin, clearIconIdIMAXFin);
                                        initTimepicker(timepickerIdDolbyFin, clockIconIdDolbyFin, clearIconIdDolbyFin);
                        });
                    })
                    .catch(error => {console.error(error)});
            }
    //Lancement des requètes AJAX au chargement des pages
        if (window.location.pathname === '/administrateur/administration') {LoadFilm();}
    });
