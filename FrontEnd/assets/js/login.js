document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        const erreurMsg = document.querySelector('#user-login-form p');

        const user = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
        .then(function(response) {
            if (response.status === 500 || response.status === 503) {
                alert("Erreur côté serveur!");
            } else if (response.status === 401 || response.status === 404) {
                // Email ou mot de passe incorrects, ajoutez une bordure rouge aux champs
                emailInput.style.border = '1px solid red';
                passwordInput.style.border = '1px solid red';
                erreurMsg.textContent = 'Email ou mot de passe invalide';
                erreurMsg.style.paddingBottom = '10px'
                erreurMsg.style.color = 'red';
            } else if (response.status === 200) {
                response.json().then(function (data){
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                window.sessionStorage.setItem('loged', 'true'); // Définir loged à true dans sessionStorage
                // Rediriger vers 'index.html'
                location.href = 'index.html';
                })
            } else {
                alert("Erreur inconnue!");
            }
        })
        .catch(function(err) {
        });
    });
});
