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

//Autoload images
const imagesContext = require.context('../assets/images', true, /\.(png|jpg|jpeg|gif|ico|svg|webp)$/);
imagesContext.keys().forEach(imagesContext);

//Axios
const axios = require('axios');

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
    })
        .on('changeDate', function () {
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
    // Accordion description films
    const $accordionButton = $('.btn-description');
    const $accordionCollapse = $('#collapseOne');
    // Événement pour fermer l'accordéon lorsque vous cliquez en dehors
    $(document).click(function(event) {
        // Vérifie si le clic est à l'intérieur de l'accordéon
        if (!$accordionButton.is(event.target) && $accordionButton.has(event.target).length === 0 &&
            !$accordionCollapse.is(event.target) && $accordionCollapse.has(event.target).length === 0) {
            // Ferme l'accordéon si ouvert
            if ($accordionCollapse.hasClass('show')) {
                $accordionCollapse.collapse('hide'); // Utilise la méthode Bootstrap pour cacher
            }
        }
    });

    //Page administration
    // Datepicker modal
    const $datepickerDebut = $('#datepicker-admin-debut');
    const $calendarIconDebut = $('#icon-calendar-debut-admin');
    const $clearIconDebut = $('.close-icon-date-debut-admin');
    const $datepickerFin = $('#datepicker-admin-fin');
    const $calendarIconFin = $('#icon-calendar-fin-admin');
    const $clearIconFin = $('.close-icon-date-fin-admin');
    //Datepicker Date début
    $datepickerDebut.datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom",
        language: "fr",
        autoclose: true
    })
        .on('changeDate', function () {
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
    //Datepicker Date fin
    $datepickerFin.datepicker({
        format: "dd/mm/yyyy",
        orientation: "bottom",
        language: "fr",
        autoclose: true
    })
        .on('changeDate', function () {
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
    //Création template card films au sur clic bouton plus et affichage des films

    function LoadFilm() {$('#card-container').empty();
        axios.get('/administration/film')
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
                                <h5 class="card-title m-0 mt-1 mb-2" style="color:#6A73AB"></h5>
                                <p class="card-text m-0 my-1 text-warning">
                                    <i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                </p>
                                <div class="accordion accordion-flush">
                                    <div class="accordion-item">
                                        <div class="accordion-header">
                                            <button class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDescription-${film.id}" aria-expanded="false" aria-controls="collapseDescription">Description</button>
                                        </div>
                                        <div id="collapseDescription-${film.id}" class="accordion-collapse collapse">
                                            <div class="accordion-body p-0"></div>
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
                                                <div class="row my-3">
                                                  <div class="col-6 d-flex justify-content-center">
                                                    <div class="dropdown">
                                                      <button class="btn btn-secondary nav-link dropdown-toggle p-2 pe-1" type="button" id="dropdownMenuButton-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                         Genre
                                                      </button>
                                                      <ul class="dropdown-menu p-0" aria-labelledby="dropdownMenuButton">
                                                        <li><a class="dropdown-item" href="#">Action</a></li>
                                                        <li><a class="dropdown-item" href="#">Comédie</a></li>
                                                        <li><a class="dropdown-item" href="#">Horreur</a></li>
                                                        <li><a class="dropdown-item" href="#">Science-fiction</a></li>
                                                        <li><a class="dropdown-item" href="#">Romance</a></li>
                                                        <li><a class="dropdown-item" href="#">Thriller</a></li>
                                                        <li><a class="dropdown-item" href="#">Drame</a></li>
                                                        <li><a class="dropdown-item" href="#">Animation</a></li>
                                                      </ul>
                                                    </div> 
                                                  </div>
                                                  <div class="col-6 fs-5 text-center align-content-center">Durée: 1h30</div>
                                                </div> 
                                            </div>
                                            <div class="col-8 p-4">
                                                <div class="row px-2">
                                                  <div class="col-5 d-flex align-items-center p-0">
                                                     <div class="text-white fs-5 me-1">Nom:</div>
                                                     <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="TextareaNom-${film.id}"></textarea>
                                                     <label class="d-none" for="TextareaNom-${film.id}"></label>
                                                  </div>
                                                  <div class="col-7 d-flex align-items-center justify-content-end p-0">
                                                     <button class="btn bi bi-check-lg p-2 fs-4 d-flex justify-content-center align-items-center mx-2"></button>
                                                     <button class="btn bi bi-x-lg p-2 fs-4 d-flex justify-content-center align-items-center mx-1" data-bs-dismiss="modal"></button>
                                                  </div>      
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-4 d-flex justify-content-start">
                                                        <div class="position-relative">
                                                            <input type="text" class="btn-date-admin text-black" id="datepicker-admin-debut" placeholder="Date début" readonly>
                                                            <label for="datepicker-admin-debut" class="d-none"></label>
                                                            <span class="bi bi-calendar" id="icon-calendar-debut-admin"></span>
                                                            <span class="bi bi-x-circle close-icon-date-debut-admin d-none"></span>
                                                        </div>
                                                    </div>
                                                    <div class="col-4 d-flex justify-content-end">
                                                        <div class="position-relative">
                                                            <input type="text" class="btn-date-admin text-black" id="datepicker-admin-fin" placeholder="Date fin" readonly>
                                                            <label for="datepicker-admin-fin" class="d-none"></label>
                                                            <span class="bi bi-calendar" id="icon-calendar-fin-admin"></span>
                                                            <span class="bi bi-x-circle close-icon-date-fin-admin d-none"></span>
                                                        </div>
                                                    </div>
                                                    <div class="col-4 d-flex align-items-center justify-content-end">
                                                        <div class="text-white fs-5 me-1">Cinéma:</div>
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea2"></textarea>
                                                        <label class="d-none" for="floatingTextarea2"></label>
                                                    </div>
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                        <div class="fs-5">4DX:</div>
                                                    </div>
                                                    <div class="col-3 d-flex text-white">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea3"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                    <div class="col-3">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea4"></textarea>
                                                        <label class="d-none" for="floatingTextarea4"></label>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                        <div class="fs-5">Prix:</div>
                                                    </div>
                                                    <div class="col-2 d-flex align-items-center">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea5"></textarea>
                                                        <label class="d-none" for="floatingTextarea5"></label>
                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                    </div>
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                        <div class="fs-5">3DX:</div>
                                                    </div>
                                                    <div class="col-3 d-flex text-white">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea3"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                    <div class="col-3">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea4"></textarea>
                                                        <label class="d-none" for="floatingTextarea4"></label>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                        <div class="fs-5">Prix:</div>
                                                    </div>
                                                    <div class="col-2 d-flex align-items-center">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea5"></textarea>
                                                        <label class="d-none" for="floatingTextarea5"></label>
                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                    </div>
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                        <div class="fs-5">IMAX:</div>
                                                    </div>
                                                    <div class="col-3 d-flex text-white">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea3"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                    <div class="col-3">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea4"></textarea>
                                                        <label class="d-none" for="floatingTextarea4"></label>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                        <div class="fs-5">Prix:</div>
                                                    </div>
                                                    <div class="col-2 d-flex align-items-center">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea5"></textarea>
                                                        <label class="d-none" for="floatingTextarea5"></label>
                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                    </div>
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-start">
                                                        <div class="fs-5">Dolby:</div>
                                                    </div>
                                                    <div class="col-3 d-flex text-white">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea3"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                    <div class="col-3">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea4"></textarea>
                                                        <label class="d-none" for="floatingTextarea4"></label>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center justify-content-end">
                                                        <div class="fs-5">Prix:</div>
                                                    </div>
                                                    <div class="col-2 d-flex align-items-center">
                                                        <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="floatingTextarea5"></textarea>
                                                        <label class="d-none" for="floatingTextarea5"></label>
                                                        <div class="mx-1 fs-5 text-white">€</div>
                                                    </div>
                                                </div>
                                                <div class="row my-3">
                                                    <div class="col-3 d-flex text-white align-items-center justify-content-start">
                                                        <div class="fs-5">Nombre de places:</div>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center">
                                                        <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="floatingTextarea3"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                    <div class="col-1 d-flex text-white align-items-center">
                                                        <div class="fs-5">Salle:</div>
                                                    </div>
                                                    <div class="col-2 d-flex text-white align-items-center">
                                                        <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="floatingTextarea5"></textarea>
                                                        <label class="d-none" for="floatingTextarea5"></label>
                                                    </div>
                                                </div>
                                                <div class="row mt-3 mb-1">
                                                    <div class="col-3 text-white align-items-center justify-content-start">
                                                        <div class="fs-5">Description:</div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-12 d-flex text-white align-items-center">
                                                        <textarea class="form-control p-2 textarea-uniforme" placeholder="" id="floatingTextarea3" style="height:10rem"></textarea>
                                                        <label class="d-none" for="floatingTextarea3"></label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div></div>
                                    </div>
                            </div>
                        </div>`);
                    const dropdownMenuButton = $('#dropdownMenuButton-'+film.id);
                    $('.dropdown-item').click(function(e) {
                        e.preventDefault();
                        const selectedText = $(this).text();
                        dropdownMenuButton.text(selectedText);
                    });
                    const btnX = $('#x-square-'+film.id);
                    btnX.click(function () {
                        axios.post('/administration/film/delete', JSON.stringify({id: film.id}))
                            .then(response => {$('#card-container').empty();console.log(response.data);})
                            .catch(error => {console.error(error);})
                            .finally(() => {LoadFilm();});
                    });
                });
            })
            .catch(error => {console.error(error)});
    }

    $('#btn-plus').click(function () {
        axios.post('/administration/film/create')
            .then(response => {LoadFilm();console.log(response.data);})
            .catch(error => {
                console.error(error);
            });
    });
    //Affichage des films sur clic bouton administration
    $('#btn-navbar-admin').click(function() {
        LoadFilm();
    });

    //Lancement des requètes AJAX au chargement des pages
    if (window.location.pathname === '/administration') {
            LoadFilm();
        }
});
