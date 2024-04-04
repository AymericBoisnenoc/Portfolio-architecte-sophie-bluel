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

                modale.classList.add('modal');
                modale.id = "MaModale";
                modaleContent.classList.add('modal-content');

                
                // Appel de la fonction afficherGalerie avec votre tableau d'objets en tant que paramètre
                afficherGalerie(data, modaleContent);
                
                // Ajouter ici le contenu de la modale en utilisant les données récupérées
                
                modaleClose.classList.add("close");
                
                modale.appendChild(modaleContent);
                container.appendChild(modale);
                modaleContent.appendChild(modaleClose);
                
                modaleBtn.onclick = function() {
                    modale.style.display = "block";
                }

                modaleClose.onclick = function(event) {
                    if (event.target == modale) {
                        modale.style.display = "none";
                    }
                }

                modaleClose.textContent = "X"; // Texte du bouton pour fermer la modale
                modaleClose.onclick = function() {
                    modale.style.display = "none";
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
        }
    });
    function afficherGalerie(object, modaleContent) {
        let galleries = "";
        for (let work of object) {
            galleries += `
                <figure class="gallery-modal-work">
                    <img src="${work.imageUrl}">
                    <i class="fa-solid fa-trash-can delete" id="${work.id}"></i>
                    <figcaption>éditer</figcaption>
                </figure>`;
                console.log(object)
        }

        // Ajout de la galerie à la modaleContent
        modaleContent.innerHTML = galleries;
    }
