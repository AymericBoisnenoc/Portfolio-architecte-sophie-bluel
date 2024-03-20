document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

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
				alert('les identifiants sont incorrect')
            } else if (response.status === 200) {
                console.log("Authentification réussie.");
                return response.json();
            } else {
                alert("Erreur inconnue!");
            }
        })
        .then(function(data) {
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            // Rediriger vers 'index.html'
            location.href = 'index.html';
        })
        .catch(function(err) {
            console.log(err);
        });
    });
});
