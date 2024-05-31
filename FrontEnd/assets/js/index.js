let tableau = []; // Déclaration initiale du tableau vide

// Récupération des données depuis l'API
fetch('http://localhost:5678/api/works') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données de l\'API');
        }
        return response.json();
    })
    .then(projet => {
        // Stockage des données récupérées dans le tableau
        tableau = projet;
        
        // Affichage initial de la galerie
        afficherGalerie();
        
        // Génération du menu de catégories
        genererMenuCategories();
    })
    .catch(error => {
        console.error('Erreur :', error);
    });

// Fonction pour afficher la galerie
function afficherGalerie() {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = ''; // Vide la galerie avant d'afficher les éléments
    
    tableau.forEach(item => {
        const figure = document.createElement('figure');
        
        // Création de l'image
        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.title;
        
        // Création de la légende
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = item.title;
        
        // Ajout de l'image à la figure
        figure.appendChild(image);
        
        // Ajout de la légende à la figure
        figure.appendChild(figcaption);
        
        // Ajout de la figure à la galerie
        galleryContainer.appendChild(figure);
    });
}

// Fonction pour générer dynamiquement le menu des catégories
function genererMenuCategories() {
    const categories = [...new Set(tableau.map(item => item.categoryId))];
    const categoryContainer = document.querySelector('.categories');
    const categoryNames = {
        1:"Objets",
        2:"Appartements",
        3:"Hotels & restaurants",

    }

    const allButton = document.createElement('button');
    allButton.classList.add('category-button');
    allButton.textContent = 'Toutes les catégories';
    allButton.addEventListener('click', () => filtrerGalerie(0));
    categoryContainer.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = categoryNames[category];
        button.dataset.categoryId = category;
        button.addEventListener('click', () => filtrerGalerie(category));
        categoryContainer.appendChild(button);
        categoryContainer.style.display = "flex";
        categoryContainer.style.justifyContent = "center";
    });



    // ajout d'un if pour lorsque l'utilisateur se connecte masquer les boutons
    if (loged === 'true'){
        allButton.style.display = 'none'
        categoryContainer.style.display = 'none'
    }
}

function filtrerGalerie(selectedCategoryId) {
    if (selectedCategoryId === 0) {
        // Si la catégorie sélectionnée est "Toutes les catégories", affiche tous les éléments
        afficherGalerie();
    } else {
        // Sinon, filtre les éléments en fonction de la catégorie sélectionnée
        const filteredItems = tableau.filter(item => item.categoryId === selectedCategoryId);
        
        const galleryContainer = document.querySelector('.gallery');
        galleryContainer.innerHTML = ''; // Vide la galerie avant d'afficher les éléments filtrés
        
        filteredItems.forEach(item => {
            const figure = document.createElement('figure');
            const image = document.createElement('img');
            image.src = item.imageUrl;
            image.alt = item.title;
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = item.title;
            figure.appendChild(image);
            figure.appendChild(figcaption);
            galleryContainer.appendChild(figure);
        });
    }
}

// Après que l'utilisateur admin soit connecté 
const loged = window.sessionStorage.getItem('loged'); // Utiliser getItem pour récupérer la valeur
const logout = document.querySelector('header nav .logout');

if (loged === 'true') { // Utiliser === pour comparer correctement
    logout.textContent = 'logout';
    logout.classList = 'logout_selected';
}

// Sélectionnez le bouton "logout"
let logoutBtn = document.querySelector('header nav .logout_selected');
// Ajoutez un écouteur d'événements pour le clic sur le bouton "logout"
logoutBtn.addEventListener('click', function(event) {
    event.preventDefault();
    // Afficher une alerte indiquant que l'utilisateur a été déconnecté
    alert("Vous avez été déconnecté.");

    // Effacer les informations d'authentification de l'utilisateur du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Vous pouvez également effacer d'autres données d'utilisateur si nécessaire
});