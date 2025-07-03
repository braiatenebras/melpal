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

    // verifica se o usuario está logado
    auth.onAuthStateChanged(function (user) {
        if (!user) {
            alert("Você precisa fazer login para acessar o carrinho.");
            window.location.href = "../Login/login.html";
        } else {
            console.log("Usuário logado:", user.email);
            iniciarCarrinho();
        }
    });

    // Função principal do carrinho
    function iniciarCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const itensContainer = document.querySelector('.itens-carrinho');
        const resumoSubtotal = document.getElementById('subtotal');
        const resumoFrete = document.getElementById('frete');
        const resumoTotal = document.getElementById('total');
        const btnFinalizar = document.getElementById('finalizar-compra');

        // Atualiza a exibição do carrinho
        function atualizarCarrinho() {
            itensContainer.innerHTML = '';

            if (carrinho.length === 0) {
                itensContainer.innerHTML = `
                    <div class="carrinho-vazio">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Seu carrinho está vazio</p>
                        <a href="../Categorias/hardware.html" class="botao">Continuar Comprando</a>
                    </div>
                `;
                resumoSubtotal.textContent = 'R$ 0,00';
                resumoFrete.textContent = 'R$ 0,00';
                resumoTotal.textContent = 'R$ 0,00';
                btnFinalizar.disabled = true;
                return;
            }

            let subtotal = 0;

            carrinho.forEach((item, index) => {
                const totalItem = item.preco * item.quantidade;
                subtotal += totalItem;

                const itemElement = document.createElement('div');
                itemElement.className = 'item-carrinho';
                itemElement.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" class="item-carrinho-img">
                    <div class="item-carrinho-info">
                        <h3 class="item-carrinho-titulo">${item.nome}</h3>
                        <div class="item-carrinho-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="item-carrinho-controles">
                            <div class="quantidade-controle">
                                <button class="quantidade-btn diminuir" data-index="${index}">-</button>
                                <input type="number" value="${item.quantidade}" min="1" class="quantidade-input" data-index="${index}">
                                <button class="quantidade-btn aumentar" data-index="${index}">+</button>
                            </div>
                            <button class="remover-item" data-index="${index}">
                                <i class="fas fa-trash"></i> Remover
                            </button>
                        </div>
                    </div>
                    <div class="item-carrinho-subtotal">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
                `;
                itensContainer.appendChild(itemElement);
            });

            // Atualiza os totais
            resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            const frete = subtotal >= 500 ? 0 : 30;
            resumoFrete.textContent = frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2).replace('.', ',')}`;
            const total = subtotal + frete;
            resumoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            btnFinalizar.disabled = false;

            // Event listeners para os controles de quantidade
            document.querySelectorAll('.quantidade-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = parseInt(this.dataset.index);
                    if (this.classList.contains('aumentar')) {
                        carrinho[index].quantidade++;
                    } else if (this.classList.contains('diminuir') && carrinho[index].quantidade > 1) {
                        carrinho[index].quantidade--;
                    }
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                });
            });

            // Event listener para inputs de quantidade
            document.querySelectorAll('.quantidade-input').forEach(input => {
                input.addEventListener('change', function () {
                    const index = parseInt(this.dataset.index);
                    const novaQuantidade = parseInt(this.value) || 1;
                    carrinho[index].quantidade = novaQuantidade;
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                });
            });

            // Event listener para remover itens
            document.querySelectorAll('.remover-item').forEach(btn => {
                btn.addEventListener('click', function () {
                    const index = parseInt(this.dataset.index);
                    carrinho.splice(index, 1);
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                });
            });
        }

        // Finalizar compra
        btnFinalizar.addEventListener('click', function () {
            alert('Compra finalizada com sucesso! Obrigado por comprar na MelPal Tech.');
            localStorage.removeItem('carrinho');
            carrinho.length = 0;
            atualizarCarrinho();
        });

        // Inicializa o carrinho
        atualizarCarrinho();

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