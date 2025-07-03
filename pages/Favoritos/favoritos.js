document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDhAYCiRFLHWV79jfjM1YBP0cgOpZFf11c",
        authDomain: "melpal.firebaseapp.com",
        projectId: "melpal",
        storageBucket: "melpal.appspot.com",
        messagingSenderId: "1044309712631",
        appId: "1:1044309712631:web:3370112f3055bc20c23df2"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Verifica se o usuário está logado
    auth.onAuthStateChanged(function (user) {
        if (!user) {
            alert("Você precisa fazer login para acessar seus favoritos.");
            window.location.href = "../Login/login.html";
        } else {
            console.log("Usuário logado:", user.email);
            iniciarFavoritos();
        }
    });

    // Função principal dos favoritos
    function iniciarFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const itensContainer = document.querySelector('.itens-favoritos');

        // Atualiza a exibição dos favoritos
        function atualizarFavoritos() {
            itensContainer.innerHTML = '';

            if (favoritos.length === 0) {
                itensContainer.innerHTML = `
                    <div class="favoritos-vazio">
                        <i class="fas fa-heart"></i>
                        <p>Sua lista de favoritos está vazia</p>
                        <a href="../Categorias/hardware.html" class="botao">Continuar Comprando</a>
                    </div>
                `;
                return;
            }

            favoritos.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item-favorito';
                itemElement.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" class="item-favorito-img">
                    <div class="item-favorito-info">
                        <h3 class="item-favorito-titulo">${item.nome}</h3>
                        <div class="item-favorito-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="item-favorito-acoes">
                            <button class="adicionar-carrinho" data-index="${index}">
                                <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                            </button>
                            <button class="remover-favorito" data-index="${index}">
                                <i class="fas fa-trash"></i> Remover
                            </button>
                        </div>
                    </div>
                `;
                itensContainer.appendChild(itemElement);
            });

            // Event listener para remover itens dos favoritos
            document.querySelectorAll('.remover-favorito').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = parseInt(this.dataset.index);
                    favoritos.splice(index, 1);
                    localStorage.setItem('favoritos', JSON.stringify(favoritos));
                    atualizarFavoritos();
                });
            });

            // Event listener para adicionar ao carrinho
            document.querySelectorAll('.adicionar-carrinho').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = parseInt(this.dataset.index);
                    const produto = favoritos[index];
                    
                    // Adiciona ao carrinho
                    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                    const itemExistente = carrinho.find(item => item.id === produto.id);
                    
                    if (itemExistente) {
                        itemExistente.quantidade += 1;
                    } else {
                        carrinho.push({
                            ...produto,
                            quantidade: 1
                        });
                    }
                    
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    alert('Produto adicionado ao carrinho!');
                });
            });
        }

        // Inicializa os favoritos
        atualizarFavoritos();

        // Configuração dos modais (igual ao carrinho)
        const modalFrete = document.getElementById('modalFrete');
        const modalAtendimento = document.getElementById('modalAtendimento');
        const modalLocalizacao = document.getElementById('modalLocalizacao');

        document.getElementById('frete-gratis-link').addEventListener('click', e => {
            e.preventDefault();
            modalFrete.style.display = 'block';
        });
        document.getElementById('modal-atendimento').addEventListener('click', e => {
            e.preventDefault();
            modalAtendimento.style.display = 'block';
        });
        document.getElementById('modal-localizacao').addEventListener('click', e => {
            e.preventDefault();
            modalLocalizacao.style.display = 'block';
        });

        document.querySelectorAll('.fechar-modal, .fechar-modal-atendimento, .fechar-modal-localizacao, .botao-modal, .botao-modal-atendimento, .botao-modal-localizacao')
            .forEach(el => {
                el.addEventListener('click', () => {
                    modalFrete.style.display = 'none';
                    modalAtendimento.style.display = 'none';
                    modalLocalizacao.style.display = 'none';
                });
            });

        window.addEventListener('click', e => {
            if (e.target === modalFrete) modalFrete.style.display = 'none';
            if (e.target === modalAtendimento) modalAtendimento.style.display = 'none';
            if (e.target === modalLocalizacao) modalLocalizacao.style.display = 'none';
        });
    }

    // BARRA DE BUSCA
    document.addEventListener('DOMContentLoaded', function () {
        const campoBusca = document.getElementById('campo-busca');
        const sugestoesContainer = document.getElementById('sugestoes-busca');
        const formBusca = document.getElementById('form-busca');
        let produtos = [];

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

        function mostrarSugestoes(termo) {
            sugestoesContainer.innerHTML = '';
            if (!termo || termo.length < 2) {
                sugestoesContainer.style.display = 'none';
                return;
            }

            const termoLower = termo.toLowerCase();
            const sugestoes = produtos.filter(produto =>
                produto.nome.toLowerCase().includes(termoLower)
            ).slice(0, 5);

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

        function formatarPreco(preco) {
            return 'R$ ' + preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
        }

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

        carregarProdutos();
    });

    // MENU HAMBURGUER
    document.addEventListener('DOMContentLoaded', function () {
        const hamburguer = document.querySelector('.menu-hamburguer');
        const menuNav = document.querySelector('.menu-nav');

        hamburguer.addEventListener('click', function () {
            this.classList.toggle('aberto');
            menuNav.classList.toggle('aberto');
        });
    });
});