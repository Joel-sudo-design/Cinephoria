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
        //Films
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
                            $.each(Film, function(index, film) {
                                $('#card-container').append(
                                    `<div id="card-film" class="col-auto card" style="width: 12rem">
                                        <div class="position-relative">
                                             <button class="btn bi bi-pencil-square text-success p-0 fs-5 bg-admin position-absolute" style="border-radius: 0 0 2px 0" data-bs-toggle="modal" data-bs-target="#modal-${film.id}"></button>
                                             <button id="x-square-${film.id}" class="btn bi bi-x-square text-danger p-0 fs-5 bg-admin position-absolute" style="top:0; right: 0; border-radius: 0 0 0 2px"></button>  
                                             <i class="bi bi-heart-fill position-absolute fs-3 text-warning d-none" style="top:1%; right: 5%"></i>
                                             <img src="${film.image}" class="card-img-top" alt="image">
                                        </div>
                                        <div class="card-body p-0 py-1">
                                                <div class="card-title m-0 fs-5">${film.name}
                                                    <span class="age-badge-12 mx-4 d-none">12+</span>
                                                    <span class="age-badge-16 mx-4 d-none">16+</span>
                                                    <span class="age-badge-18 mx-4 d-none">18+</span>
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
                                                            <!--Coup de coeur-->
                                                            <div class="row mt-3">
                                                                <div class="col-12 d-flex justify-content-start">
                                                                    <div class="text-white align-content-center fs-5 me-2">Coup de coeur:</div> 
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
                                                            <!--Nom du film & cinéma & boutons valider & sortie-->
                                                            <div class="row">
                                                                <!--Nom du film-->
                                                                <div class="col-5 d-flex align-items-center justify-content-start">
                                                                    <div class="text-white align-content-center fs-5 me-2">Nom:</div> 
                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" placeholder="" id="TextareaNom-${film.id}">${film.name}</textarea>
                                                                    <label class="d-none" for="TextareaNom-${film.id}"></label>
                                                                </div>                                                          
                                                                <!--Boutons valider & sortie-->
                                                                <div class="col-7 d-flex align-items-center justify-content-end">
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
                                                                <!--Salle & places & bouton reset -->                                                                                                                
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
                                                                        <div class="dropdown dropdown-modal-admin align-content-center">
                                                                            <button class="btn btn-secondary nav-link dropdown-toggle color-places p-2 pe-1" type="button" id="dropdownMenuPlaces-${film.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                Nbre
                                                                            </button>
                                                                            <ul class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenuPlaces">
                                                                                <li><a class="dropdown-item drop-places" href="#">22</a></li>
                                                                                <li><a class="dropdown-item drop-places" href="#">44</a></li>  
                                                                            </ul>
                                                                        </div>
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
                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1}-${film.id}" placeholder="Début" readonly value="${seance.heure_debut_seance}">
                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1}-${film.id}"></span>
                                                                            </div>
                                                                            <div class="position-relative me-3">
                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1}-${film.id}" placeholder="Fin" readonly value="${seance.heure_fin_seance}">
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
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Début" readonly>
                                                                                        <span class="bi bi-clock" id="icon-clock-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-3DX-${i + 1 + total3DX}-${film.id}"></span>
                                                                                    </div>
                                                                                    <div class="position-relative me-3">
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-3DX-${i + 1 + total3DX}-${film.id}" placeholder="Fin" readonly>
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
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1}-${film.id}" placeholder="Début" readonly value="${seance.heure_debut_seance}">
                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1}-${film.id}"></span>
                                                                                </div>
                                                                                <div class="position-relative me-3">
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1}-${film.id}" placeholder="Fin" readonly value="${seance.heure_fin_seance}">
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
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Début" readonly>
                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                </div>
                                                                                <div class="position-relative me-3">
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-4DX-${i + 1 + total4DX}-${film.id}" placeholder="Fin" readonly>
                                                                                    <span class="bi bi-clock" id="icon-clock-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-4DX-${i + 1 + total4DX}-${film.id}"></span>
                                                                                </div>
                                                                                <div class="d-flex justify-content-center align-items-center">
                                                                                    <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                    <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-4DX-${i + 1 + total4DX}-prix-${film.id}"></textarea>
                                                                                    <div class="mx-1 fs-5 text-white">€</div>
                                                                                </div>   
                                                                            </div>                                                                                                                                 
                                                                        </div>`).join('');
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
                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1}-${film.id}" placeholder="Début" readonly value="${seance.heure_debut_seance}">
                                                                                <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                            </div>
                                                                            <div class="position-relative me-3">
                                                                                <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1}-${film.id}" placeholder="Fin" readonly value="${seance.heure_fin_seance}">
                                                                                <span class="bi bi-clock" id="icon-clock-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                                <span class="bi bi-x-circle d-none" id="close-icon-time-fin-admin-IMAX-${i + 1}-${film.id}"></span>
                                                                            </div>
                                                                            <div class="d-flex justify-content-center align-items-center">
                                                                                <div class="text-white align-content-center fs-5 me-2">Prix:</div>
                                                                                <textarea class="form-control p-2 align-content-center textarea-uniforme" style="width: 5rem" placeholder="" id="Textarea-IMAX-${i + 1}-prix-${film.id}">${seance.price}</textarea>
                                                                                <div class="mx-1 fs-5 text-white">€</div>
                                                                            </div>
                                                                        </div> 
                                                                    </div>` : '').join('') + 
                                                                        [...Array(4 - totalIMAX)].map((_, i) => `
                                                                            <div class="row mb-3"> 
                                                                                <div class="col-12 d-flex align-items-center justify-content-start">
                                                                                    <div class="text-white align-content-center fs-5 me-2">Heure IMAX:</div>
                                                                                    <div class="position-relative me-3">
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Début" readonly>
                                                                                        <span class="bi bi-clock" id="icon-clock-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-IMAX-${i + 1 + totalIMAX}-${film.id}"></span>
                                                                                    </div>
                                                                                    <div class="position-relative me-3">
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-IMAX-${i + 1 + totalIMAX}-${film.id}" placeholder="Fin" readonly>
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
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1}-${film.id}" placeholder="Début" readonly value="${seance.heure_debut_seance}">
                                                                                    <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                    <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1}-${film.id}"></span>
                                                                                </div>
                                                                                <div class="position-relative me-3">
                                                                                    <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1}-${film.id}" placeholder="Fin" readonly value="${seance.heure_fin_seance}">
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
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-debut-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Début" readonly>
                                                                                        <span class="bi bi-clock" id="icon-clock-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                        <span class="bi bi-x-circle d-none" id="close-icon-time-debut-admin-Dolby-${i + 1 + totalDolby}-${film.id}"></span>
                                                                                    </div>
                                                                                    <div class="position-relative me-3">
                                                                                        <input type="text" class="btn-time-admin text-black" id="timepicker-admin-fin-Dolby-${i + 1 + totalDolby}-${film.id}" placeholder="Fin" readonly>
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
                                                                    <textarea class="form-control p-2 textarea-uniforme text-start" placeholder="" id="Textarea-description-${film.id}" style="height:8rem"></textarea>
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

                                    //Menu déroulant Coup de coeur
                                            let selectedCoupCoeur= '';
                                            $('.drop-label').click(function(e) {
                                                e.preventDefault();
                                                selectedCoupCoeur= $(this).text();
                                                $('#dropdownMenuLabel-'+film.id).text(selectedCoupCoeur);
                                            });
                                            $('#dropdownMenuLabel-' + film.id).text(film.label ? 'Oui' : 'Non');

                                    // Menu déroulant Salle
                                            let selectedSalle= '';
                                            const dropSalle = $('.drop-salle');
                                            dropSalle.click(function(e) {
                                                e.preventDefault();
                                                selectedSalle= $(this).text();
                                                $('#dropdownMenuSalle-'+film.id).text(selectedSalle);
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
                                            let selectedPlaces= '';
                                            $('.drop-places').click(function(e) {
                                                e.preventDefault();
                                                selectedPlaces= $(this).text();
                                                $('#dropdownMenuPlaces-'+film.id).text(selectedPlaces);
                                            });
                                    // Réinitialiser le modal lorsque celui-ci est fermé
                                            $('#modal-' + film.id).on('hidden.bs.modal', function () {
                                            LoadFilm();
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
                                                label = label === 'Oui';
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
                                                        // Si une heure de début est renseignée mais pas l'heure de fin
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
                                                        if ((heureDebut !== '' && heureFin !== '') && dropdownPlaces.text().trim() === 'Nbre') {
                                                            timeError = true;
                                                        }
                                                    }
                                                });

                                                if (timeError) {
                                                    alert('Veuillez renseigner une heure de fin, une date de début, une date de fin, le nombre de places et le prix lorsque vous spécifiez une heure de début.');
                                                    return;
                                                }

                                                axios.post('/administrateur/administration/film/validate', formData , {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                    }
                                                })
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
                                                } else {
                                                    $datepickerFin.prop('disabled', true);
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
                                                if ($timepickerFin.val().trim() ==='') {
                                                    $timepickerFin.attr('disabled', true);
                                                    $price.attr('disabled', true);
                                                }

                                                // Afficher les icônes de croix si les champs sont déjà remplis
                                                if ($timepickerDebut.val().trim() !== '') {
                                                    $clockIconDebut.addClass('d-none');
                                                    $clearIconDebut.removeClass('d-none');
                                                }
                                                if ($timepickerFin.val().trim() !== '') {
                                                    $clockIconFin.addClass('d-none');
                                                    $clearIconFin.removeClass('d-none');
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

                                    // Reset des champs vérouillés
                                            $('#btn-reset-' + film.id).click(function () {
                                             const data = {
                                                 id: film.id
                                             }
                                             axios.post('/administrateur/administration/film/reset', data)
                                                 .then(response => {console.log(response.data)})
                                                 .catch(error => {console.error(error);})
                                         });

                            });
                        })
                        .catch(error => {console.error(error)});
                }
        //Compte employé
            // Création compte
                $('#toggleEmployePassword').on('click', function () {
                    const passwordField = $('#employePassword');
                    const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                    passwordField.attr('type', type);
                    $(this).toggleClass('bi-eye bi-eye-slash');
                });

            // Réinnitialiser le mot de passe
                const $clearIconEmploye = $('.close-icon-employe');

                // Au clic sur le bouton choix employés pour afficher/masquer les options
                $('.custom-select-btn-employe').on('click', function(e) {
                    e.stopPropagation();
                    $('.custom-options-employe').toggle();
                });

                // Sélection d'une option de employés
                $('.custom-option-employe').on('click', function() {
                    let selectedText = $(this).text();
                    let selectedValue = $(this).data('value');
                    let customSelect = $('.custom-select-btn-employe');
                    customSelect.text(selectedText);
                    $('#employe-input').val(selectedValue);
                    $('.custom-options-employe').hide();
                    customSelect.addClass('no-arrow');
                    $('.close-icon-employe').removeClass('d-none');
                });

                // Au clic sur l'icône "X" pour réinitialiser la sélection
                $clearIconEmploye.on('click', function() {
                    let customSelect = $('.custom-select-btn-employe');
                    $(this).addClass('d-none');
                    $('#employe-input').val('');
                    customSelect.text('Choix employés');
                    $('.custom-options-employe').hide();
                    customSelect.removeClass('no-arrow');
                });

                // Clic en dehors du menu pour fermer les options
                $(window).on('click', function() {
                    $('.custom-options-employe').hide();
                });

                // Appliquer le style de hover/focus
                $clearIconEmploye.on('mouseenter focus', function() {
                    $('.custom-select-btn-employe').addClass('btn-hover');
                    $('.close-icon-employe').addClass('btn-hover');
                });

                // Retirer le style quand on quitte le survol/focus
                $clearIconEmploye.on('mouseleave blur', function() {
                    $('.custom-select-btn-employe').removeClass('btn-hover');
                    $('.close-icon-employe').removeClass('btn-hover');
                });

    //Lancement des requètes AJAX au chargement des pages
        if (window.location.pathname === '/administrateur/administration') {LoadFilm();}
    });
