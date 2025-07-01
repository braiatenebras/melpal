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

// menu hamburguer
document.addEventListener('DOMContentLoaded', function () {
    const hamburguer = document.querySelector('.menu-hamburguer');
    const menuNav = document.querySelector('.menu-nav');

    hamburguer.addEventListener('click', function () {
        this.classList.toggle('aberto');
        menuNav.classList.toggle('aberto');
    });
});

// Modal Frete Grátis
document.addEventListener('DOMContentLoaded', function () {
    const freteGratisLink = document.getElementById('frete-gratis-link');
    const modalFrete = document.getElementById('modalFrete');
    const fecharModal = document.querySelector('.fechar-modal');
    const botaoModal = document.querySelector('.botao-modal');

    freteGratisLink.addEventListener('click', function (e) {
        e.preventDefault();
        modalFrete.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    fecharModal.addEventListener('click', function () {
        modalFrete.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    botaoModal.addEventListener('click', function () {
        modalFrete.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modalFrete) {
            modalFrete.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Modal Atendimento 
document.addEventListener('DOMContentLoaded', function () {
    const atendimentoLink = document.getElementById('modal-atendimento');
    const modalAtendimento = document.getElementById('modalAtendimento');
    const fecharModalAtendimento = document.querySelector('.fechar-modal-atendimento');
    const botaoModalAtendimento = document.querySelector('.botao-modal-atendimento');

    atendimentoLink.addEventListener('click', function (e) {
        e.preventDefault();
        modalAtendimento.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    fecharModalAtendimento.addEventListener('click', function () {
        modalAtendimento.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    botaoModalAtendimento.addEventListener('click', function () {
        modalAtendimento.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modalAtendimento) {
            modalAtendimento.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Modal Localização 
document.addEventListener('DOMContentLoaded', function () {
    const localizacaoLink = document.getElementById('modal-localizacao');  // ID corrigido
    const modalLocalizacao = document.getElementById('modalLocalizacao');
    const fecharModalLocalizacao = document.querySelector('.fechar-modal-localizacao');  // Seletor único
    const botaoModalLocalizacao = document.querySelector('.botao-modal-localizacao');  // Seletor único

    localizacaoLink.addEventListener('click', function (e) {
        e.preventDefault();
        modalLocalizacao.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    fecharModalLocalizacao.addEventListener('click', function () {
        modalLocalizacao.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    botaoModalLocalizacao.addEventListener('click', function () {
        modalLocalizacao.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modalLocalizacao) {
            modalLocalizacao.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});