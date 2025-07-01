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

    // Função para traduzir mensagens de erro do Firebase
    function getFriendlyErrorMessage(error) {
        if (typeof error === 'string') return error;

        switch (error.code) {
            case 'auth/invalid-email':
                return 'Por favor, insira um e-mail válido.';
            case 'auth/user-disabled':
                return 'Esta conta foi desativada.';
            case 'auth/user-not-found':
                return 'E-mail não cadastrado.';
            case 'auth/wrong-password':
                return 'Senha incorreta.';
            case 'auth/email-already-in-use':
                return 'Este e-mail já está em uso.';
            case 'auth/weak-password':
                return 'A senha deve ter pelo menos 6 caracteres.';
            case 'auth/operation-not-allowed':
                return 'Operação não permitida.';
            case 'auth/too-many-requests':
                return 'Muitas tentativas. Tente novamente mais tarde.';
            default:
                return 'Ocorreu um erro. Por favor, tente novamente ou se cadastre.';
        }
    }

    // Função para mostrar mensagens de erro na tela
    function showAuthError(message, formType = 'login') {
        const errorElement = document.getElementById(`${formType}-error`);
        const friendlyMessage = getFriendlyErrorMessage(message);

        if (errorElement) {
            errorElement.textContent = friendlyMessage;
            errorElement.style.display = 'block';

            // Esconde a mensagem após 5 segundos
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            console.error(friendlyMessage);
        }
    }

    // Limpa mensagens de erro quando o usuário começa a digitar
    function setupInputListeners() {
        document.getElementById('login-email').addEventListener('input', () => {
            const errorElement = document.getElementById('login-error');
            if (errorElement) errorElement.style.display = 'none';
        });

        document.getElementById('login-senha').addEventListener('input', () => {
            const errorElement = document.getElementById('login-error');
            if (errorElement) errorElement.style.display = 'none';
        });

        document.getElementById('cadastro-email').addEventListener('input', () => {
            const errorElement = document.getElementById('cadastro-error');
            if (errorElement) errorElement.style.display = 'none';
        });

        document.getElementById('cadastro-senha').addEventListener('input', () => {
            const errorElement = document.getElementById('cadastro-error');
            if (errorElement) errorElement.style.display = 'none';
        });
    }

    // Configura os listeners para limpar mensagens de erro
    setupInputListeners();

    // Login com e-mail e senha
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-senha').value;

        // Validação básica antes de enviar ao Firebase
        if (!email || !password) {
            showAuthError('Por favor, preencha todos os campos.', 'login');
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem-sucedido
                window.location.href = '../../index.html';
            })
            .catch((error) => {
                showAuthError(error, 'login');
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
        const termosAceitos = document.getElementById('cadastro-termos').checked;

        // Validações antes de enviar ao Firebase
        if (!nome || !email || !password || !confirmPassword) {
            showAuthError('Por favor, preencha todos os campos.', 'cadastro');
            return;
        }

        if (!termosAceitos) {
            showAuthError('Você deve aceitar os termos de uso.', 'cadastro');
            return;
        }

        if (password !== confirmPassword) {
            showAuthError('As senhas não coincidem!', 'cadastro');
            return;
        }

        if (password.length < 6) {
            showAuthError('A senha deve ter pelo menos 6 caracteres.', 'cadastro');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                return user.updateProfile({
                    displayName: nome
                });
            })
            .then(() => {
                window.location.href = '../../index.html';
            })
            .catch((error) => {
                showAuthError(error, 'cadastro');
            });
    });

    // Verifica se o usuário já está logado
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuário já está autenticado, redireciona
            window.location.href = '../../index.html';
        }
    });
});