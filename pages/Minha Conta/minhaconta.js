document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDhAYCiRFLHWV79jfjM1YBP0cgOpZFf11c",
        authDomain: "melpal.firebaseapp.com",
        projectId: "melpal",
        storageBucket: "melpal.firebasestorage.app",
        messagingSenderId: "1044309712631",
        appId: "1:1044309712631:web:3370112f3055bc20c23df2"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const nomeUsuario = document.getElementById('nome-usuario');
    const emailUsuario = document.getElementById('email-usuario');
    const nomeCompletoInput = document.getElementById('nome-completo');
    const emailInput = document.getElementById('email');
    const logoutBtn = document.getElementById('logout-btn');
    const menuOpcoes = document.querySelectorAll('.menu-opcao');
    const conteudoSecoes = document.querySelectorAll('.conta-secao');

    // verificar estado de autenticação
    auth.onAuthStateChanged(user => {
        if (user) {
            // usuário está logado
            nomeUsuario.textContent = user.displayName || 'Usuário';
            emailUsuario.textContent = user.email;

            // preencher formulário de dados
            nomeCompletoInput.value = user.displayName || '';
            emailInput.value = user.email;
        } else {
            // usuário não está logado, redirecionar para login
            window.location.href = '../Login/login.html';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        auth.signOut().then(() => {
            window.location.href = '../Login/login.html';
        }).catch(error => {
            alert('Erro ao fazer logout: ' + error.message);
        });
    });

    // Alternar entre seções
    menuOpcoes.forEach(opcao => {
        opcao.addEventListener('click', function () {
            const section = this.getAttribute('data-section');

            // Remover classe active de todas as opções
            menuOpcoes.forEach(op => op.classList.remove('active'));
            // Adicionar classe active à opção clicada
            this.classList.add('active');

            // Esconder todas as seções
            conteudoSecoes.forEach(sec => sec.classList.remove('active'));
            // Mostrar a seção correspondente
            document.getElementById(`${section}-secao`).classList.add('active');
        });
    });

    // Salvar dados do usuário
    const formDados = document.getElementById('form-dados');
    formDados.addEventListener('submit', function (e) {
        e.preventDefault();

        const user = auth.currentUser;
        if (user) {
            user.updateProfile({
                displayName: nomeCompletoInput.value
            }).then(() => {
                alert('Dados atualizados com sucesso!');
                nomeUsuario.textContent = nomeCompletoInput.value;
            }).catch(error => {
                alert('Erro ao atualizar dados: ' + error.message);
            });
        }
    });

    // Alterar senha
    const formSenha = document.getElementById('form-senha');
    formSenha.addEventListener('submit', function (e) {
        e.preventDefault();

        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            senhaAtual
        );

        user.reauthenticateWithCredential(credential).then(() => {
            return user.updatePassword(novaSenha);
        }).then(() => {
            alert('Senha alterada com sucesso!');
            formSenha.reset();
        }).catch(error => {
            alert('Erro ao alterar senha: ' + error.message);
        });
    });
});

// menu hamburguer
document.addEventListener('DOMContentLoaded', function () {
    const hamburguer = document.querySelector('.menu-hamburguer');
    const menuNav = document.querySelector('.menu-nav');

    hamburguer.addEventListener('click', function () {
        this.classList.toggle('aberto');
        menuNav.classList.toggle('aberto');
    });
});