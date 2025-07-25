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

    // Função para mostrar mensagens de sucesso
    function showSuccessMessage(message, formType = 'recovery') {
        const successElement = document.getElementById(`${formType}-success`);
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';

            // Esconde a mensagem após 5 segundos
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
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

        // Listener para o campo de recuperação de senha
        document.getElementById('recovery-email')?.addEventListener('input', () => {
            const errorElement = document.getElementById('recovery-error');
            const successElement = document.getElementById('recovery-success');
            if (errorElement) errorElement.style.display = 'none';
            if (successElement) successElement.style.display = 'none';
        });
    }

    // Configura os listeners para limpar mensagens de erro
    setupInputListeners();

    // Login com e-mail e senha
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
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
    }

    // Cadastro de novo usuário
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
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
    }

    // Verifica se o usuário já está logado
    auth.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = '../../index.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // elementos do DOM
    const campoBusca = document.getElementById('campo-busca');
    const sugestoesContainer = document.getElementById('sugestoes-busca');
    const formBusca = document.getElementById('form-busca');
    let produtos = [];

    // carrega os produtos do JSON
    async function carregarProdutos() {
        try {
            const response = await fetch('../Detalhes/db.json');
            if (!response.ok) throw new Error('Erro ao carregar produtos');
            const data = await response.json();
            produtos = data.produtos;
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    // mostra sugestões de busca
    function mostrarSugestoes(termo) {
        sugestoesContainer.innerHTML = '';

        if (!termo || termo.length < 2) {
            sugestoesContainer.style.display = 'none';
            return;
        }

        const termoLower = termo.toLowerCase();
        const sugestoes = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(termoLower)
        ).slice(0, 5); // limita a 5 sugestões

        if (sugestoes.length > 0) {
            sugestoesContainer.innerHTML = sugestoes.map(produto => `
                <div class="sugestao-item" data-id="${produto.id}">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div>
                        <div class="sugestao-nome">${produto.nome}</div>
                        <div class="sugestao-preco">${formatarPreco(produto.preco)}</div>
                    </div>
                </div>
            `).join('');

            sugestoesContainer.style.display = 'block';

            // adiciona evento de clique nas sugestões
            document.querySelectorAll('.sugestao-item').forEach(item => {
                item.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    window.location.href = `../Detalhes/detalhes.html?id=${id}`;
                });
            });
        } else {
            sugestoesContainer.style.display = 'none';
        }
    }

    // Formata preço
    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }

    // Eventos
    campoBusca.addEventListener('input', function () {
        mostrarSugestoes(this.value);
    });

    campoBusca.addEventListener('focus', function () {
        if (this.value.length >= 2) {
            mostrarSugestoes(this.value);
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.barra-busca')) {
            sugestoesContainer.style.display = 'none';
        }
    });

    formBusca.addEventListener('submit', function (e) {
        e.preventDefault();
        const termo = campoBusca.value.trim();
        if (termo) {
            console.log('Buscar por:', termo);
        }
    });

    // Inicializa
    carregarProdutos();
});