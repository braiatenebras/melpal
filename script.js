document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const campoBusca = document.getElementById('campo-busca');
    const sugestoesContainer = document.getElementById('sugestoes-busca');
    const formBusca = document.getElementById('form-busca');
    let produtos = [];

    // Carrega os produtos do JSON
    async function carregarProdutos() {
        try {
            const response = await fetch('pages/Detalhes/db.json');
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
                    window.location.href = `pages/Detalhes/detalhes.html?id=${id}`;
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

// Modal Atendimento - 
document.addEventListener('DOMContentLoaded', function () {
    const atendimentoLink = document.getElementById('modal-atendimento');  // ID corrigido
    const modalAtendimento = document.getElementById('modalAtendimento');
    const fecharModalAtendimento = document.querySelector('.fechar-modal-atendimento');  // Seletor único
    const botaoModalAtendimento = document.querySelector('.botao-modal-atendimento');  // Seletor único

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



// Modal Localização - 
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