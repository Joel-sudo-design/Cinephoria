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

    // Navbar Top & Footer Bottom
    // A l'ouverture des navbar, on change la couleur de fond, on cache le logo et on modifie la taille des colonnes
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
    // A la fermeture des navbar, on remet la couleur de fond par défaut, on affiche le logo et on remet la taille des colonnes
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

    // Custom select page films
    // Clic sur le bouton pour afficher/masquer les options
    $('.custom-select-btn-cinema').on('click', function(e) {
        e.stopPropagation();
        $('.custom-options-cinema').toggle();
        $('.custom-options-genre').hide();
    });
    $('.custom-option-cinema').on('click', function() {
        let selectedText = $(this).text();
        let selectedValue = $(this).data('value');

        $('.custom-select-btn-cinema').text(selectedText);
        $('#cinema-input').val(selectedValue);

        $('.custom-options-cinema').hide();
    });
    $('.custom-select-btn-genre').on('click', function(e) {
        e.stopPropagation();
        $('.custom-options-genre').toggle();
        $('.custom-options-cinema').hide();
    });
    $('.custom-option-genre').on('click', function() {
        let selectedText = $(this).text();
        let selectedValue = $(this).data('value');

        $('.custom-select-btn-genre').text(selectedText);
        $('#genre-input').val(selectedValue);

        $('.custom-options-genre').hide();
    });

    // Clic en dehors du menu pour fermer les options
    $(window).on('click', function() {
        $('.custom-options-cinema').hide();
        $('.custom-options-genre').hide();
    });

    // Datepicker séance page films
    const $datepicker = $('#datepicker');
    const $calendarIcon = $('.bi-calendar');
    const $clearIcon = $('.bi-x-circle');
    $datepicker.datepicker({
        format: "dd/mm/yyyy",
        language: "fr",
        autoclose: true
    }).on('changeDate', function () {
        // Affiche l'icône de croix et cache l'icône calendrier après sélection d'une date
        $calendarIcon.addClass('d-none');
        $clearIcon.removeClass('d-none');
    });

    // Au clic sur l'icône de croix, on réinitialise la date
    $clearIcon.on('click', function () {
        $datepicker.datepicker('clearDates'); // Supprime la date
        $calendarIcon.removeClass('d-none'); // Réaffiche l'icône calendrier
        $clearIcon.addClass('d-none'); // Cache l'icône de croix
    });

    // Appliquer le style de hover/focus à btn-date lors du hover/focus de clear-icon
    $clearIcon.on('mouseenter focus', function () {
        $datepicker.addClass('btn-hover');
        $clearIcon.addClass('btn-hover');
    });

    // Appliquer le style de hover/focus à btn-date lors du hover/focus de calendarIcon
    $calendarIcon.on('mouseenter focus', function () {
        $datepicker.addClass('btn-hover');
        $calendarIcon.addClass('btn-hover');
    });

    // Retirer le style quand on quitte le survol/focus de clear-icon
    $clearIcon.on('mouseleave blur', function () {
        $datepicker.removeClass('btn-hover');
        $clearIcon.removeClass('btn-hover');
    });

    // Retirer le style quand on quitte le survol/focus de calendarIcon
    $calendarIcon.on('mouseleave blur', function () {
        $datepicker.removeClass('btn-hover');
        $calendarIcon.removeClass('btn-hover');
    });

    // Ouvrir le calendrier lorsque l'on clique sur l'icône calendrier
    $calendarIcon.on('click', function () {
        $datepicker.focus(); // Met le focus sur le champ de date, ce qui ouvre le calendrier
    });
});
