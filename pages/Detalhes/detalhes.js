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

            document.title = `${produtoAtual.nome} - MelPal Tech`;
            document.getElementById('produto-titulo').textContent = produtoAtual.nome;

            document.getElementById('produto-nome').textContent = produtoAtual.nome;
            document.getElementById('produto-imagem').src = produtoAtual.imagem;
            document.getElementById('produto-imagem').alt = produtoAtual.nome;
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

            // ⚠️ Aqui está a chamada para carregar os produtos relacionados
            carregarProdutosRelacionados(produtoAtual.relacionados, data.produtos);

        } catch (error) {
            console.error('Erro ao carregar os detalhes do produto:', error);
            document.querySelector('.produtos-relacionados').style.display = 'none';
        }
    }

    carregarDetalhesProduto();
});
