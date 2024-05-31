document.addEventListener('DOMContentLoaded', function() {
    let modale;

    if (loged === 'true') {

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
                let h2Element = container.querySelector('h2')

                modaleBtn.appendChild(imgBtn);
                modaleBtn.appendChild(btnText);
                container.appendChild(modaleBtn);
                container.insertBefore(modaleBtn,h2Element)

                modale = document.createElement("div");
                const modaleContent = document.createElement("div");
                const modaleText = document.createElement("div");
                const modaleFigure = document.createElement("div");
                const modaleClose = document.createElement("span");
                
                modaleText.innerHTML = `<h1 class="modale-txt" style="font-family:Syne;color:black;margin-top:6%;margin-bottom:7%;text-align:center">Galerie photos</h1>`
                modaleText.classList.add('modale-texte')

                modale.classList.add('modal');
                modale.id = "MaModale";
                modaleContent.classList.add('modal-content');
                modaleFigure.classList.add('modale-figure')

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
                    modaleFigure.innerHTML = galleries;

                    const deleteIcons = modaleFigure.querySelectorAll('.delete-icon');
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
                modaleContent.appendChild(modaleText);
                container.appendChild(modale);
                modaleContent.appendChild(modaleClose);
                modaleContent.appendChild(modaleFigure);



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

                let hr = document.createElement('hr');

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
                modaleBouton.style.width = "40%";
                modaleBouton.style.textAlign = "center";
                modaleBouton.style.borderRadius = "60px";
                modaleBouton.style.padding = "3%";
                modaleBouton.style.marginTop = "20%";
                modaleBouton.style.display = "flex";
                modaleBouton.style.justifyContent = "space-around";
                modaleBouton.style.alignItems = "center";
                modaleBouton.style.height = "7%";
                modaleBouton.style.fontSize = "16px";

                modaleContent.appendChild(modaleBouton);
                modaleContent.appendChild(hr)

                const modaleAjoutImage = document.createElement("div");
                modaleAjoutImage.classList.add("modal");
                modaleAjoutImage.style.display = "none";
                modaleAjoutImage.innerHTML = `
                    <form class="modal-content modalAddPhoto">
                        <span class="back"><i class="fa-solid fa-arrow-left"></i></span>
                        <span class="close">X</span>
                        <h2>Ajouter photo</h2>
                        <!-- Utilisation d'une étiquette pour styliser la zone de sélection de fichier -->
                        <div class="image-container">
                            <label for="photo" class="index1 image-input-label">
                                <input type="file" name="photo" id="photo" accept="image/*" style="display: none;">
                                <div id="imagePreview" class="index0 image-preview">+ Ajouter une photo</div>
                            </label>
                            <i class="fa-solid fa-image"></i>
                        </div>
                        <label for="title" class="label-txt label-titre">Titre</label>
                        <input type="text" name="title" placeholder="Titre de l'image" required>
                        <label for="category" class="label-txt">Catégorie</label>
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
                            // Création de l'élément img ou utilisation de l'existant
                            let img = imagePreview.querySelector('img');
                            if (!img) {
                                img = document.createElement('img');
                                imagePreview.innerHTML = ''; // Nettoyage du texte initial
                                imagePreview.appendChild(img);
                            }
                            img.src = e.target.result;
                            img.style.display = 'block'; // Afficher l'image
                            icon.style.display = 'none'; // Cacher l'icône
                        };
                        reader.readAsDataURL(file);
                    } else {
                        // Réinitialiser si aucun fichier n'est sélectionné
                        const img = imagePreview.querySelector('img');
                        if (img) {
                            img.style.display = 'none';
                        }
                        icon.style.display = 'block'; // Afficher l'icône
                    
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
