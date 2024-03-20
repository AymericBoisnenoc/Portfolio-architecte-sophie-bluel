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



