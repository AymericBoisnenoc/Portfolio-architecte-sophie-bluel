document.addEventListener('DOMContentLoaded', function() {
    
    let modale;
    
    if (loged === 'true') { // Correction de la variable 'loged'
        console.log('La modale peut être ouverte');

        // On va récupérer les éléments du tableau pour les mettre dans la modale 
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

                // Ajouter ici le contenu de la modale en utilisant les données récupérées
                function afficherGalerie(object) {
                    let galleries = "";
                    for (let work of object) {
                        galleries += `
                            <figure class="gallery-modal-work">
                                <img src="${work.imageUrl}">
                                <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
                            </figure>
                            `;
                    }
                    // Ajout de la galerie à la modaleContent
                    modaleContent.innerHTML = galleries;

                    // Gestionnaire d'événements pour les icônes de corbeille
                    const deleteIcons = modaleContent.querySelectorAll('.delete');
                    deleteIcons.forEach(icon => {
                        icon.addEventListener('click', function(event) {
                            event.stopPropagation(); // Arrête la propagation de l'événement pour éviter les comportements indésirables
                            const imageId = icon.getAttribute('data-id');
                            // Supprimez l'image du DOM
                            icon.parentNode.remove();
                            // Envoyez une demande de suppression à l'API
                            supprimerImage(imageId);
                        });
                    });
                }
                // Appel de la fonction afficherGalerie avec votre tableau d'objets en tant que paramètre
                afficherGalerie(data);

                modaleClose.classList.add("close");

                modale.appendChild(modaleContent);
                container.appendChild(modale);
                modaleContent.appendChild(modaleClose);

                modaleBtn.onclick = function() {
                    modale.style.display = "block";
                }

                modaleClose.onclick = function(event) {
                    if (event.target == modaleClose) {
                        modale.style.display = "none";
                    }
                }

                modaleClose.textContent = "X"; // Texte du bouton pour fermer la modale
                modaleClose.onclick = function() {
                    modale.style.display = "none";
                }

                const modaleBouton = document.createElement("button");
                modaleBouton.textContent = "Ajouter une image";
                modaleBouton.onclick = function(){
                    modale.style.display = "none";
                    modaleAjoutImage.style.display = "block";
                    displayCategoryModal(); // Appel de la fonction pour afficher les catégories
                }
                modaleBouton.style.fontFamily = "'Syne'";
                modaleBouton.style.fontWeight = "700";
                modaleBouton.style.color = "white";
                modaleBouton.style.backgroundColor = "#1D6154";
                modaleBouton.style.width = "180px";
                modaleBouton.style.textAlign = "center";
                modaleBouton.style.borderRadius = "60px";
                modaleBouton.style.padding = "7%";
                modaleBouton.style.marginTop = "62%";
                
                modaleContent.appendChild(modaleBouton);
                

                const modaleAjoutImage = document.createElement("div");
                modaleAjoutImage.classList.add("modal");
                modaleAjoutImage.style.display = "none";
                modaleAjoutImage.innerHTML = `
                    <form class="modal-content modalAddPhoto">
                            <span class="back"><i class="fa-solid fa-arrow-left"></i></span>
                            <span class="close">&times;</span>
                            <h2>Ajouter photo</h2>
                            <button class="index0">
                                <input class="index1" type="file" name="photo" id="photo" required>
                                <p class="index0"> + Ajouter une photo</p>
                            </button>
                            <i class="fa-solid fa-image"></i>
                            <img class="preview-image" src="">
                            <label for="title">Titre</label>
                            <input type="text" name="title" placeholder="Titre de l'image" required>
                            <label for="category">Catégorie</label>
                            <select name="category" id="category" required></select>
                            <input type="submit" value="Valider">
                    </form>
                `;

                const retourBtn = modaleAjoutImage.querySelector(".back");
                retourBtn.addEventListener("click", function(){
                    modaleAjoutImage.style.display = "none";
                    modale.style.display = "block";
                });

                container.appendChild(modaleAjoutImage);

                const closeBtn = modaleAjoutImage.querySelector(".close");
                closeBtn.addEventListener("click", function() {
                    modaleAjoutImage.style.display = "none";
                });

                async function displayCategoryModal (){
                    const select = document.querySelector('.modalAddPhoto select[name="category"]');
                    const categorys = await getCategorys();
                    categorys.forEach(category => {
                        const option = document.createElement("option");
                        option.value = category.id;
                        option.textContent = category.name;
                        select.appendChild(option);
                    });

                    const form = document.querySelector(".modalAddPhoto form");
                    const title = document.querySelector(".modalAddPhoto input[name='title']");
                    const category = document.querySelector(".modalAddPhoto select[name='category']");

                    form.addEventListener("submit", async (e) => {
                        e.preventDefault(); // Empêcher la soumission du formulaire

                        const formData = new FormData(form);
                        const imageData = {
                            title: title.value,
                            category: category.value,
                            photo: formData.get("photo"),
                        };

                        ajouterImage(imageData);
                    });
                }

                const previewImg = modaleAjoutImage.querySelector(".preview-image");
                const inputFile = modaleAjoutImage.querySelector("input[type=file]");
                inputFile.addEventListener("change", function(){
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(){
                            previewImg.src = reader.result;
                        }
                        reader.readAsDataURL(file);
                    }
                });
            })
    }
                // Faire un POST pour ajouter des photos
    function ajouterImage(imageData) {
        const init ={
            title:title.value,
            categoryId:category.value,
            imageUrl:previewImg.src,
            category:{
                id:category.value,
                name: category.options[category.selectedIndex].textContent,
            },
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(imageData)
        };
        
        fetch("http://localhost:5678/api/works", init)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'image');
            }
            console.log('Image ajoutée avec succès');
            // Rafraîchir la galerie après l'ajout de l'image
            refreshGallery();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de l\'image :)')
        });
    }

    function supprimerImage(imageId) {
        const init ={
            method: "DELETE",
            headers: {"Content-Type": "application/json","Authorization":"Bearer "+localStorage.getItem("token")},        
        };
        fetch("http://localhost:5678/api/works/" + imageId, init)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'image');
            }
            console.log('Image supprimée avec succès');
            supprimerImageDuTableau(imageId);
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image :)')
        });
    }

    async function getCategorys() {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des catégories');
        }
        const data = await response.json();
        return data;
    }
});
