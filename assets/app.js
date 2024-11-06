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
    //Création template card films au clic bouton plus
    $('#btn-plus').click(function () {
        const newCard = `
            <div id="card-film" class="col-auto card" style="width: 12rem">
                <div class="d-flex position-absolute text-white">
                    <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin" style="border-radius: 0 0 2px 0"></button>
                    <button class="btn bi bi-x-square text-danger p-0 fs-5 bg-admin position-relative" style="left: 124px; border-radius: 0 0 0 2px"></button>
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
                                <button class="btn btn-description p-0 pb-1 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Description</button>
                            </div>
                            <div id="collapseExample" class="accordion-collapse collapse">
                                <div class="accordion-body p-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#card-container').append(newCard);
    });
    // Datepicker
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
});
