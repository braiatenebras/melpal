document.addEventListener('DOMContentLoaded', function () {
    // Função para formatar preços
    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }

    // Função para criar estrelas de avaliação
    function criarEstrelasAvaliacao(nota) {
        let estrelasHTML = '';
        const estrelasCheias = Math.floor(nota);
        const temMeiaEstrela = nota % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < estrelasCheias) {
                estrelasHTML += '<i class="fas fa-star"></i>';
            } else if (i === estrelasCheias && temMeiaEstrela) {
                estrelasHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                estrelasHTML += '<i class="far fa-star"></i>';
            }
        }

        return estrelasHTML;
    }

    // Função para carregar produtos relacionados
    function carregarProdutosRelacionados(produtosRelacionados, todosProdutos) {
        const container = document.getElementById('produtos-relacionados');
        container.innerHTML = '';

        if (!produtosRelacionados || produtosRelacionados.length === 0) {
            document.querySelector('.produtos-relacionados').style.display = 'none';
            return;
        }

        document.querySelector('.produtos-relacionados').style.display = 'block';

        produtosRelacionados.forEach(relacionado => {
            const produto = todosProdutos.find(p => p.id === relacionado.id);
            if (produto) {
                const productCard = document.createElement('div');
                productCard.className = 'cartao-produto';

                if (produto.desconto && produto.desconto > 0) {
                    productCard.innerHTML += `<span class="etiqueta-desconto">-${produto.desconto}%</span>`;
                }

                productCard.innerHTML += `
                    <a href="detalhes.html?id=${produto.id}">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <h3>${produto.nome}</h3>
                        <div class="preco">
                            ${produto.precoOriginal && produto.precoOriginal > produto.preco
                        ? `<span class="preco-antigo">${formatarPreco(produto.precoOriginal)}</span>` : ''}
                            <span class="preco-atual">${formatarPreco(produto.preco)}</span>
                        </div>
                        <div class="parcelamento">${produto.parcelamento || ''}</div>
                    </a>
                `;
                container.appendChild(productCard);
            }
        });
    }

    // Função para adicionar produto ao carrinho
    function adicionarAoCarrinho(produto) {
        const quantidade = parseInt(document.getElementById('quantidade').value);

        const produtoCarrinho = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: quantidade
        };

        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        const itemExistenteIndex = carrinho.findIndex(item => item.id === produto.id);

        if (itemExistenteIndex !== -1) {
            carrinho[itemExistenteIndex].quantidade += quantidade;
        } else {
            carrinho.push(produtoCarrinho);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        const feedback = document.createElement('div');
        feedback.className = 'feedback-carrinho';
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Produto adicionado ao carrinho!</span>
        `;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    // Função para adicionar/remover dos favoritos
    function toggleFavorito(produto) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const index = favoritos.findIndex(item => item.id === produto.id);
        
        if (index === -1) {
            // Adicionar aos favoritos
            favoritos.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                precoOriginal: produto.precoOriginal || null
            });
            mostrarFeedbackFavorito(true);
        } else {
            // Remover dos favoritos
            favoritos.splice(index, 1);
            mostrarFeedbackFavorito(false);
        }
        
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        atualizarIconeFavorito(produto.id);
    }

    // Função para mostrar feedback visual dos favoritos
    function mostrarFeedbackFavorito(adicionado) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-favorito';
        feedback.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${adicionado ? 'Adicionado aos' : 'Removido dos'} favoritos!</span>
        `;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    // Função para atualizar o ícone do favorito
    function atualizarIconeFavorito(produtoId) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        const favoritoBtn = document.querySelector('.favoritos button i');
        
        if (favoritos.some(item => item.id == produtoId)) {
            favoritoBtn.classList.remove('far');
            favoritoBtn.classList.add('fas');
        } else {
            favoritoBtn.classList.remove('fas');
            favoritoBtn.classList.add('far');
        }
    }

    // Função principal para carregar os dados do produto
    async function carregarDetalhesProduto() {
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = urlParams.get('id');

        if (!produtoId) {
            window.location.href = 'loja.html';
            return;
        }

        try {
            const response = await fetch('db.json');
            if (!response.ok) throw new Error('Falha ao carregar dados');

            const data = await response.json();
            const produtoAtual = data.produtos.find(p => p.id == produtoId);

            if (!produtoAtual) {
                window.location.href = '../../index.html';
                return;
            }

            // Preencher informações do produto
            document.title = `${produtoAtual.nome} - MelPal Tech`;
            document.getElementById('produto-titulo').textContent = produtoAtual.nome;
            document.getElementById('produto-nome').textContent = produtoAtual.nome;
            document.getElementById('produto-imagem').src = produtoAtual.imagem;
            document.getElementById('produto-descricao').textContent = produtoAtual.descricao;
            document.getElementById('categoria-produto').textContent = produtoAtual.categoria;
            document.getElementById('nome-produto-caminho').textContent = produtoAtual.nome;

            document.getElementById('produto-preco').textContent = formatarPreco(produtoAtual.preco);

            const precoOriginalElement = document.getElementById('produto-preco-original');
            if (produtoAtual.precoOriginal && produtoAtual.precoOriginal > produtoAtual.preco) {
                precoOriginalElement.textContent = formatarPreco(produtoAtual.precoOriginal);
                precoOriginalElement.style.display = 'block';
            } else {
                precoOriginalElement.style.display = 'none';
            }

            document.getElementById('produto-parcelamento').textContent = produtoAtual.parcelamento || '';
            document.getElementById('produto-vendidos').textContent = produtoAtual.vendidos ? `${produtoAtual.vendidos} vendidos` : 'Novo';

            const avaliacoesElement = document.getElementById('produto-avaliacoes');
            avaliacoesElement.textContent = produtoAtual.avaliacoes ? `(${produtoAtual.avaliacoes} avaliações)` : '(Sem avaliações)';

            const estrelasContainer = document.getElementById('produto-avaliacao');
            estrelasContainer.innerHTML = produtoAtual.avaliacao ? criarEstrelasAvaliacao(produtoAtual.avaliacao) : '';

            const beneficiosContainer = document.getElementById('produto-beneficios');
            beneficiosContainer.innerHTML = '';
            if (produtoAtual.beneficios && produtoAtual.beneficios.length > 0) {
                produtoAtual.beneficios.forEach(beneficio => {
                    const li = document.createElement('li');
                    li.textContent = beneficio;
                    beneficiosContainer.appendChild(li);
                });
            }

            // Verificar e atualizar estado do favorito
            atualizarIconeFavorito(produtoId);

            // Event listeners
            document.querySelector('.qtd-btn.mais').addEventListener('click', function () {
                const input = document.getElementById('quantidade');
                if (parseInt(input.value) < 10) {
                    input.value = parseInt(input.value) + 1;
                }
            });

            document.querySelector('.qtd-btn.menos').addEventListener('click', function () {
                const input = document.getElementById('quantidade');
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });

            document.getElementById('adicionar-carrinho').addEventListener('click', function () {
                adicionarAoCarrinho(produtoAtual);
            });

            document.querySelector('.favoritos button').addEventListener('click', function() {
                toggleFavorito(produtoAtual);
            });

            // Carregar produtos relacionados
            carregarProdutosRelacionados(produtoAtual.relacionados, data.produtos);

        } catch (error) {
            console.error('Erro ao carregar os detalhes do produto:', error);
            document.querySelector('.produtos-relacionados').style.display = 'none';
        }
    }

    // Inicializar
    carregarDetalhesProduto();

    // Modal Frete Grátis
    const freteGratisLink = document.getElementById('frete-gratis-link');
    const modalFrete = document.getElementById('modalFrete');
    const fecharModal = document.querySelector('.fechar-modal');
    const botaoModal = document.querySelector('.botao-modal');

    if (freteGratisLink && modalFrete) {
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
    }

    // Modal Atendimento
    const atendimentoLink = document.getElementById('modal-atendimento');
    const modalAtendimento = document.getElementById('modalAtendimento');
    const fecharModalAtendimento = document.querySelector('.fechar-modal-atendimento');
    const botaoModalAtendimento = document.querySelector('.botao-modal-atendimento');

    if (atendimentoLink && modalAtendimento) {
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
    }

    // Modal Localização
    const localizacaoLink = document.getElementById('modal-localizacao');
    const modalLocalizacao = document.getElementById('modalLocalizacao');
    const fecharModalLocalizacao = document.querySelector('.fechar-modal-localizacao');
    const botaoModalLocalizacao = document.querySelector('.botao-modal-localizacao');

    if (localizacaoLink && modalLocalizacao) {
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
    }

    // Menu hamburguer
    const hamburguer = document.querySelector('.menu-hamburguer');
    const menuNav = document.querySelector('.menu-nav');

    if (hamburguer && menuNav) {
        hamburguer.addEventListener('click', function () {
            this.classList.toggle('aberto');
            menuNav.classList.toggle('aberto');
        });
    }

    // Barra de busca
    const campoBusca = document.getElementById('campo-busca');
    const sugestoesContainer = document.getElementById('sugestoes-busca');
    const formBusca = document.getElementById('form-busca');
    let produtos = [];

    async function carregarProdutos() {
        try {
            const response = await fetch('db.json');
            if (!response.ok) throw new Error('Erro ao carregar produtos');
            const data = await response.json();
            produtos = data.produtos;
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function mostrarSugestoes(termo) {
        if (!sugestoesContainer) return;
        
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
                    window.location.href = `detalhes.html?id=${id}`;
                });
            });
        } else {
            sugestoesContainer.style.display = 'none';
        }
    }

    if (campoBusca && sugestoesContainer && formBusca) {
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
    }
});