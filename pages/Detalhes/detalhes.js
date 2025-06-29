document.addEventListener('DOMContentLoaded', function () {
    // Função para formatar preços
    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }

    // Função para criar elementos de estrelas de avaliação
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
                        ? `<span class="preco-antigo">${formatarPreco(produto.precoOriginal)}</span>`
                        : ''}
                            <span class="preco-atual">${formatarPreco(produto.preco)}</span>
                        </div>
                        <div class="parcelamento">${produto.parcelamento || ''}</div>
                    </a>
                `;
                container.appendChild(productCard);
            }
        });
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
            const produto = data.produtos.find(p => p.id == produtoId);

            if (!produto) {
                window.location.href = '../../index.html';
                return;
            }

            // Atualizar título da página
            document.title = `${produto.nome} - MelPal Tech`;
            document.getElementById('produto-titulo').textContent = produto.nome;

            // Preencher informações básicas
            document.getElementById('produto-nome').textContent = produto.nome;
            document.getElementById('produto-imagem').src = produto.imagem;
            document.getElementById('produto-imagem').alt = produto.nome;
            document.getElementById('produto-descricao').textContent = produto.descricao;
            document.getElementById('categoria-produto').textContent = produto.categoria;
            document.getElementById('nome-produto-caminho').textContent = produto.nome;

            // Preencher informações de preço
            document.getElementById('produto-preco').textContent = formatarPreco(produto.preco);

            const precoOriginalElement = document.getElementById('produto-preco-original');
            if (produto.precoOriginal && produto.precoOriginal > produto.preco) {
                precoOriginalElement.textContent = formatarPreco(produto.precoOriginal);
                precoOriginalElement.style.display = 'block';
            } else {
                precoOriginalElement.style.display = 'none';
            }

            // Preencher parcelamento
            document.getElementById('produto-parcelamento').textContent = produto.parcelamento || '';

            // Preencher informações de vendas
            document.getElementById('produto-vendidos').textContent = produto.vendidos ? `${produto.vendidos} vendidos` : 'Novo';

            // Preencher avaliações
            const avaliacoesElement = document.getElementById('produto-avaliacoes');
            avaliacoesElement.textContent = produto.avaliacoes ? `(${produto.avaliacoes} avaliações)` : '(Sem avaliações)';

            // Preencher estrelas de avaliação
            const estrelasContainer = document.getElementById('produto-avaliacao');
            estrelasContainer.innerHTML = produto.avaliacao ? criarEstrelasAvaliacao(produto.avaliacao) : '';

            // Preencher benefícios
            const beneficiosContainer = document.getElementById('produto-beneficios');
            beneficiosContainer.innerHTML = '';

            if (produto.beneficios && produto.beneficios.length > 0) {
                produto.beneficios.forEach(beneficio => {
                    const li = document.createElement('li');
                    li.textContent = beneficio;
                    beneficiosContainer.appendChild(li);
                });
            }

            // Configurar botões de quantidade
            const inputQuantidade = document.getElementById('quantidade');
            document.querySelector('.qtd-btn.mais').addEventListener('click', function () {
                if (parseInt(inputQuantidade.value) < 10) {
                    inputQuantidade.value = parseInt(inputQuantidade.value) + 1;
                }
            });

            document.querySelector('.qtd-btn.menos').addEventListener('click', function () {
                if (parseInt(inputQuantidade.value) > 1) {
                    inputQuantidade.value = parseInt(inputQuantidade.value) - 1;
                }
            });

            // Carregar produtos relacionados
            if (produto.relacionados && produto.relacionados.length > 0) {
                carregarProdutosRelacionados(produto.relacionados, data.produtos);
            } else {
                document.querySelector('.produtos-relacionados').style.display = 'none';
            }

        } catch (error) {
            console.error('Erro ao carregar os detalhes do produto:', error);
            document.querySelector('.produtos-relacionados').style.display = 'none';
        }
    }

    // Iniciar o carregamento da página
    carregarDetalhesProduto();
});

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const campoBusca = document.getElementById('campo-busca');
    const sugestoesContainer = document.getElementById('sugestoes-busca');
    const formBusca = document.getElementById('form-busca');
    let produtos = [];

    // Carrega os produtos do JSON
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

    // Mostra sugestões de busca
    function mostrarSugestoes(termo) {
        sugestoesContainer.innerHTML = '';

        if (!termo || termo.length < 2) {
            sugestoesContainer.style.display = 'none';
            return;
        }

        const termoLower = termo.toLowerCase();
        const sugestoes = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(termoLower)
        ).slice(0, 5); // Limita a 5 sugestões

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

            // Adiciona evento de clique nas sugestões
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