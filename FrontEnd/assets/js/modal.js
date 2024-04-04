document.addEventListener('DOMContentLoaded', function() {
    if (loged === 'true') {
        console.log('La modale peut être ouverte');

        // On va recuperer les éléments du tableau pour les mettres dans la modale 
        fetch('http://localhost:5678/api/works')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données de l\'API');
                }
                return response.json();
            })
            .then(data => {
                const container = document.getElementById('portfolio');

                const modaleBtn = document.createElement('button');
                modaleBtn.classList.add('modaleBtn');

                const btnImg = './assets/icons/edit.png';
                const imgBtn = document.createElement('img');
                imgBtn.src = btnImg;
                imgBtn.style.marginRight = '5px';
                const btnText = document.createElement('span');
                btnText.textContent = 'Modifier';

                modaleBtn.appendChild(imgBtn);
                modaleBtn.appendChild(btnText);
                container.appendChild(modaleBtn);

                const modale = document.createElement("div");
                const modaleContent = document.createElement("div");
                const modaleClose = document.createElement("span");
                const closeBtn = document.createElement("button"); // Nouveau bouton pour fermer la modale

                modale.classList.add('modal');
                modale.id = "MaModale";
                modaleContent.classList.add('modal-content');

                function afficherGalerie(object, modaleContent) {
                    let galleries = "";
                    for (let work of object) {
                        galleries += `
                            <figure class="gallery-modal-work">
                                <img src="${work.imageURL}">
                                <i class="fa-solid fa-trash-can delete" id="${work.id}"></i>
                                <figcaption>éditer</figcaption>
                            </figure>`;
                    }

                    // Ajout de la galerie à la modaleContent
                    modaleContent.innerHTML = galleries;
                }

                // Appel de la fonction afficherGalerie avec votre tableau d'objets en tant que paramètre
                afficherGalerie(data, modaleContent);

                // Ajouter ici le contenu de la modale en utilisant les données récupérées

                modaleClose.classList.add("close");

                modale.appendChild(modaleContent);
                container.appendChild(modale);
                modale.appendChild(modaleClose);
                modale.appendChild(closeBtn); // Ajout du bouton pour fermer la modale

                modaleBtn.onclick = function() {
                    modale.style.display = "block";
                }

                modaleClose.onclick = function(event) {
                    if (event.target == modale) {
                        modale.style.display = "none";
                    }
                }

                closeBtn.textContent = "X"; // Texte du bouton pour fermer la modale
                closeBtn.onclick = function() {
                    modale.style.display = "none";
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
    }
});
