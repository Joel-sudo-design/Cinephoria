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

// Navbar & Footer
// Lorsque le menu offcanvas est ouvert
$(document).ready(function() {
    $('#navbar-togglerTop').click(function() {
        $('#offcanvasNavbarTop').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
        $('#logo').hide();
        $('#offcanvas-bodyTop').removeClass('row')
        $('#navbarLeft').removeClass('col-5').addClass('col-12');
        $('#navbarRight').removeClass('col-5').addClass('col-12');
    });
    $('#navbar-togglerBottom').click(function() {
        $('#offcanvasNavbarBottom').css("background", "linear-gradient(90deg, rgba(106, 115, 171, 0.85) 50%, rgba(43, 46, 69, 0.85) 100%)");
    });
});

// Lorsque le menu offcanvas est fermé
$('#offcanvasNavbarTop').on('hidden.bs.offcanvas', function () {
    $('#offcanvasNavbarTop').css("background", "");
    $('#logo').show();
    $('#offcanvas-bodyTop').addClass('row')
    $('#navbarLeft').removeClass('col-12').addClass('col-5');
    $('#navbarRight').removeClass('col-12').addClass('col-5');
});

$('#offcanvasNavbarBottom').on('hidden.bs.offcanvas', function () {
    $('#offcanvasNavbarBottom').css("background", "");
});
