document.addEventListener('DOMContentLoaded', function() {
    if (loged === 'true') {
        console.log('La modale peut être ouverte');
        
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

        const modale = document.createElement("div")
        const modaleContent = document.createElement("div")
        const modaleClose = document.createElement("span")

        modale.classList.add('modal')
        modale.id = "MaModale"
        modaleContent.classList.add('modal-content')
        modaleClose.classList.add("close")

        modale.appendChild(modaleContent)
        modale.appendChild(modaleClose)

        modaleBtn.onclick = function(){
            modale.style.display = "block"
        }
        modaleClose.onclick=function(event){
            if (event.target == modale){
                modale.style.display="none"
            }
        }
    }
});