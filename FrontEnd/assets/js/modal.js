document.addEventListener('DOMContentLoaded', function() {
    let modale;

    if (loged === 'true') {
        console.log('La modale peut être ouverte');

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

                modale = document.createElement("div");
                const modaleContent = document.createElement("div");
                const modaleText = document.createElement("div");
                const modaleClose = document.createElement("span");
                
                modaleText.innerHTML = `<h1 class="modale-txt" style="font-family:Syne;color:black;">Galerie photos</h1>`
                modaleText.classList.add('modale-texte')

                modale.classList.add('modal');
                modale.id = "MaModale";
                modaleContent.classList.add('modal-content');

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
                    modaleContent.innerHTML = galleries;

                    const deleteIcons = modaleContent.querySelectorAll('.delete-icon');
                    deleteIcons.forEach(icon => {
                        icon.addEventListener('click', async function(event) {
                            event.stopPropagation();
                            const imageId = icon.getAttribute('data-id');
                            icon.parentNode.remove();
                            await supprimerImage(imageId);
                            window.location.reload()
                        });
                    });
                }
                afficherGalerie(data);

                modaleClose.classList.add("close");
                modale.appendChild(modaleContent);
                modaleContent.appendChild(modaleText)
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

                modaleClose.textContent = "X";
                modaleClose.onclick = function() {
                    modale.style.display = "none";
                }

                const modaleBouton = document.createElement("button");
                modaleBouton.textContent = "Ajouter une image";
                modaleBouton.onclick = async function(){
                    modale.style.display = "none";
                    modaleAjoutImage.style.display = "block";
                    await displayCategoryModal();
                    await ajouterImage(formData);
                }
                modaleBouton.style.fontFamily = "'Syne'";
                modaleBouton.style.fontWeight = "700";
                modaleBouton.style.color = "white";
                modaleBouton.style.backgroundColor = "#1D6154";
                modaleBouton.style.width = "130%";
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
                        <!-- Utilisation d'une étiquette pour styliser la zone de sélection de fichier -->
                        <label for="photo" class="index1 image-input-label">
                            <input type="file" name="photo" id="photo" accept="image/*" style="display: none;">
                            <div id="imagePreview" class="index0 image-preview">+ Ajouter une photo</div>
                        </label>
                        <i class="fa-solid fa-image"></i>
                        <img class="preview-image" src="" style="display: none;"> <!-- Ajout de l'image avec style display: none; -->
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

                    const form = document.querySelector("form.modalAddPhoto");
                    const title = document.querySelector(".modalAddPhoto input[name='title']");
                    const category = document.querySelector(".modalAddPhoto select[name='category']");
                    const photo = document.querySelector(".modalAddPhoto input[name='photo']");

                    form.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        const imageData = {
                            title: title.value,
                            category: category.value,
                            photo: formData.get("photo"),
                        };

                        formData.append("title",title.value);
                        formData.append("category",category.value);
                        formData.append("image",photo.files[0]);

                        await ajouterImage(formData);
                        window.location.reload()
                    });
                }

                document.getElementById('photo').addEventListener('change', function(event) {
                    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
                
                    if (file) {
                        const reader = new FileReader();
                
                        reader.onload = function(e) {
                            const imagePreview = document.getElementById('imagePreview');
                            const previewImage = document.querySelector('.preview-image');
                            imagePreview.innerHTML = ''; // Efface tout contenu précédent
                
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.alt = file.name;
                            img.style.maxWidth = '100%'; // Optionnel : limite la largeur de l'image à 100%
                
                            imagePreview.appendChild(img);
                            previewImage.src = e.target.result; // Affiche l'image dans l'élément img avec la classe 'preview-image'
                            previewImage.style.display = 'block'; // Affiche l'image
                        };
                
                        reader.readAsDataURL(file); // Lit le contenu du fichier en tant qu'URL de données
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données de l\'API :', error);
            });
    }
});

function ajouterImage(imageData) {
    const init ={
        method: "POST",
        headers: {
            "Authorization":"Bearer " + localStorage.getItem("token")
        },
        body: (imageData)
    };

    return fetch("http://localhost:5678/api/works", init) // Retourne la promesse de la requête fetch
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'image');
            }
            return response.json(); // Parse la réponse JSON
        })
        .then(data => {
            console.log('Image ajoutée avec succès');
            return data; // Retourne les données pour la chaîne de promesse
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de l\'image :', error);
            throw error; // Propage l'erreur pour la chaîne de promesse
        });
}

function refreshGallery() {
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de l\'API');
            }
            return response.json();
        })
        .then(data => {
            // Une fois les données récupérées, afficher à nouveau la galerie
            afficherGalerie(data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'actualisation de la galerie :', error);
        });
}

function supprimerImage(imageId) {
    const init ={
        method: "DELETE",
        headers: {"Content-Type": "application/json","Authorization":"Bearer "+localStorage.getItem("token")},
    };
    return fetch("http://localhost:5678/api/works/" + imageId, init) // Retourne la promesse de la requête fetch
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'image');
            }
            console.log('Image supprimée avec succès');
            return imageId; // Retourne l'ID de l'image supprimée pour la chaîne de promesse
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image :', error);
            throw error; // Propage l'erreur pour la chaîne de promesse
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
