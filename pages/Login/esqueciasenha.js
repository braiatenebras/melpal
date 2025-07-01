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


    function getFriendlyErrorMessage(error) {
        if (typeof error === 'string') return error;

        switch (error.code) {
            case 'auth/invalid-email':
                return 'Por favor, insira um e-mail válido.';
            case 'auth/user-not-found':
                return 'E-mail não cadastrado.';
            default:
                return 'Ocorreu um erro. Por favor, tente novamente.';
        }
    }

    function showAuthError(message, formType = 'recovery') {
        const errorElement = document.getElementById(`${formType}-error`);
        const friendlyMessage = getFriendlyErrorMessage(message);

        if (errorElement) {
            errorElement.textContent = friendlyMessage;
            errorElement.style.display = 'block';

            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        } else {
            console.error(friendlyMessage);
        }
    }

    function showSuccessMessage(message, formType = 'recovery') {
        const successElement = document.getElementById(`${formType}-success`);
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';

            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
    }

    const recoveryForm = document.getElementById('recovery-form');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('recovery-email').value;

            if (!email) {
                showAuthError('Por favor, preencha o campo de e-mail.', 'recovery');
                return;
            }

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    showSuccessMessage('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.', 'recovery');
                    recoveryForm.reset();
                })
                .catch((error) => {
                    showAuthError(error, 'recovery');
                });
        });

        document.getElementById('recovery-email')?.addEventListener('input', () => {
            const errorElement = document.getElementById('recovery-error');
            const successElement = document.getElementById('recovery-success');
            if (errorElement) errorElement.style.display = 'none';
            if (successElement) successElement.style.display = 'none';
        });
    }
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