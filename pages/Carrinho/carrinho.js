document.addEventListener('DOMContentLoaded', function () {
    // --- Variáveis carrinho ---
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itensContainer = document.querySelector('.itens-carrinho');
    const resumoSubtotal = document.getElementById('subtotal');
    const resumoFrete = document.getElementById('frete');
    const resumoTotal = document.getElementById('total');
    const btnFinalizar = document.getElementById('finalizar-compra');

    // --- Função para atualizar o carrinho na página ---
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

        resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        const frete = subtotal >= 500 ? 0 : 30;
        resumoFrete.textContent = frete === 0 ? 'Grátis' : `R$ ${frete.toFixed(2).replace('.', ',')}`;
        const total = subtotal + frete;
        resumoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        btnFinalizar.disabled = false;

        // Eventos dos botões de quantidade
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

        // Eventos dos inputs de quantidade
        document.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', function () {
                const index = parseInt(this.dataset.index);
                const novaQuantidade = parseInt(this.value) || 1;
                carrinho[index].quantidade = novaQuantidade;
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarCarrinho();
            });
        });

        // Eventos dos botões de remover
        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarCarrinho();
            });
        });
    }

    // Evento finalizar compra
    btnFinalizar.addEventListener('click', function () {
        alert('Compra finalizada com sucesso! Obrigado por comprar na MelPal Tech.');
        localStorage.removeItem('carrinho');
        carrinho.length = 0;
        atualizarCarrinho();
    });

    // Inicializa o carrinho
    atualizarCarrinho();

    // --- MODAIS ---
    const modalFrete = document.getElementById('modalFrete');
    const modalAtendimento = document.getElementById('modalAtendimento');
    const modalLocalizacao = document.getElementById('modalLocalizacao');

    // Abrir modais
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

    // Fechar modais por botões
    document.querySelectorAll('.fechar-modal, .fechar-modal-atendimento, .fechar-modal-localizacao, .botao-modal, .botao-modal-atendimento, .botao-modal-localizacao')
        .forEach(el => {
            el.addEventListener('click', () => {
                modalFrete.style.display = 'none';
                modalAtendimento.style.display = 'none';
                modalLocalizacao.style.display = 'none';
            });
        });

    // Fechar modais clicando fora
    window.addEventListener('click', e => {
        if (e.target === modalFrete) modalFrete.style.display = 'none';
        if (e.target === modalAtendimento) modalAtendimento.style.display = 'none';
        if (e.target === modalLocalizacao) modalLocalizacao.style.display = 'none';
    });
});


// menu para mobiles 
document.addEventListener('DOMContentLoaded', function () {
    const hamburguer = document.querySelector('.menu-hamburguer');
    const menuNav = document.querySelector('.menu-nav');

    hamburguer.addEventListener('click', function () {
        this.classList.toggle('aberto');
        menuNav.classList.toggle('aberto');
    });
});