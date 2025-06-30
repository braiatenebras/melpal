document.addEventListener('DOMContentLoaded', function () {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDhAYCiRFLHWV79jfjM1YBP0cgOpZFf11c",
        authDomain: "melpal.firebaseapp.com",
        projectId: "melpal",
        storageBucket: "melpal.firebasestorage.app",
        messagingSenderId: "1044309712631",
        appId: "1:1044309712631:web:3370112f3055bc20c23df2"
    };

    // Inicialize o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Alternar entre login e cadastro 
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Função para mostrar mensagens de erro
    function showAuthError(message) {
        alert(message); 
    }

    // Login com e-mail e senha
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-senha').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem-sucedido
                window.location.href = '../../index.html'; // Redireciona para a página inicial
            })
            .catch((error) => {
                showAuthError(error.message);
            });
    });

    // Cadastro de novo usuário
    const cadastroForm = document.getElementById('cadastro-form');
    cadastroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('cadastro-nome').value;
        const email = document.getElementById('cadastro-email').value;
        const password = document.getElementById('cadastro-senha').value;
        const confirmPassword = document.getElementById('cadastro-confirmar-senha').value;

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            showAuthError('As senhas não coincidem!');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Cadastro bem-sucedido
                const user = userCredential.user;

                return user.updateProfile({
                    displayName: nome
                });
            })
            .then(() => {
                window.location.href = '../../index.html'; 
            })
            .catch((error) => {
                showAuthError(error.message);
            });
    });

    // Verificar se o usuário já está logado
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuário está logado
            console.log('Usuário logado:', user.email);
            // Você pode redirecionar ou atualizar a UI aqui
        } else {
            // Usuário não está logado
            console.log('Nenhum usuário logado');
        }
    });
});