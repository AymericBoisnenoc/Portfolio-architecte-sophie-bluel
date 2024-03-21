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
        console.log('Voici les éléments du tableau :', tableau);
        
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

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = `Catégorie ${category}`;
        button.dataset.categoryId = category;
        button.addEventListener('click', () => filtrerGalerie(category));
        categoryContainer.appendChild(button);
    });

    const allButton = document.createElement('button');
    allButton.classList.add('category-button');
    allButton.textContent = 'Toutes les catégories';
    allButton.addEventListener('click', () => filtrerGalerie(0));
    categoryContainer.appendChild(allButton);
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

console.log(loged);

const admin = document.querySelector('header nav .admin');
const logout = document.querySelector('header nav .logout');

if (loged === 'true') { // Utiliser === pour comparer correctement
    admin.textContent = 'admin';
    logout.textContent = 'logout';
}
