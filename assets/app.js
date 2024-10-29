/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

//Active jQuery
const $ = require('jquery');
window.$ = window.jQuery = $;

//Active Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
});

