document.addEventListener('DOMContentLoaded', function () {
    // ==================== CONFIGURAÇÃO DO FIREBASE ====================
    const firebaseConfig = {
        apiKey: "AIzaSyDhAYCiRFLHWV79jfjM1YBP0cgOpZFf11c",
        authDomain: "melpal.firebaseapp.com",
        projectId: "melpal",
        storageBucket: "melpal.firebasestorage.app",
        messagingSenderId: "1044309712631",
        appId: "1:1044309712631:web:3370112f3055bc20c23df2"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ==================== ELEMENTOS DOM ====================
    // Elementos da conta
    const nomeUsuario = document.getElementById('nome-usuario');
    const emailUsuario = document.getElementById('email-usuario');
    const nomeCompletoInput = document.getElementById('nome-completo');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const logoutBtn = document.getElementById('logout-btn');
    const menuOpcoes = document.querySelectorAll('.menu-opcao');
    const conteudoSecoes = document.querySelectorAll('.conta-secao');
    const formDados = document.getElementById('form-dados');
    const formSenha = document.getElementById('form-senha');
    const adicionarEnderecoBtn = document.getElementById('adicionar-endereco');
    const listaEnderecos = document.querySelector('.lista-enderecos');

    // Elementos de busca
    const campoBusca = document.getElementById('campo-busca');
    const sugestoesContainer = document.getElementById('sugestoes-busca');
    const formBusca = document.getElementById('form-busca');
    let produtos = [];

    // Elementos do menu hamburguer
    const hamburguer = document.querySelector('.menu-hamburguer');
    const menuNav = document.querySelector('.menu-nav');

    // Elementos dos modais
    const modais = {
        frete: {
            link: document.getElementById('frete-gratis-link'),
            modal: document.getElementById('modalFrete'),
            fechar: document.querySelector('.fechar-modal'),
            botao: document.querySelector('.botao-modal')
        },
        atendimento: {
            link: document.getElementById('modal-atendimento'),
            modal: document.getElementById('modalAtendimento'),
            fechar: document.querySelector('.fechar-modal-atendimento'),
            botao: document.querySelector('.botao-modal-atendimento')
        },
        localizacao: {
            link: document.getElementById('modal-localizacao'),
            modal: document.getElementById('modalLocalizacao'),
            fechar: document.querySelector('.fechar-modal-localizacao'),
            botao: document.querySelector('.botao-modal-localizacao')
        }
    };

    // ==================== FUNÇÕES DA CONTA ====================
    // Carrega e exibe os dados do usuário
    auth.onAuthStateChanged(async user => {
        if (user) {
            const userRef = db.collection('users').doc(user.uid);

            try {
                const doc = await userRef.get();

                if (doc.exists) {
                    updateUIWithUserData(user, doc.data());
                } else {
                    await userRef.set({
                        nome: user.displayName || '',
                        email: user.email,
                        telefone: '',
                        enderecos: [],
                        dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    updateUIWithUserData(user);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Erro ao carregar dados do usuário");
            }
        } else {
            window.location.href = '../Login/login.html';
        }
    });

    function updateUIWithUserData(user, userData = null) {
        const displayName = userData?.nome || user.displayName || 'Usuário';
        const email = userData?.email || user.email;
        const telefone = userData?.telefone || '';

        nomeUsuario.textContent = displayName;
        emailUsuario.textContent = email;
        nomeCompletoInput.value = displayName;
        emailInput.value = email;
        telefoneInput.value = telefone;

        if (userData?.enderecos?.length > 0) {
            renderEnderecos(userData.enderecos);
        }
    }

    function renderEnderecos(enderecos) {
        listaEnderecos.innerHTML = enderecos.length === 0 ? `
            <div class="sem-enderecos">
                <i class="fas fa-map-marker-alt"></i>
                <p>Você ainda não cadastrou nenhum endereço</p>
            </div>
        ` : enderecos.map((endereco, index) => `
            <div class="endereco-item">
                <p><strong>Endereço ${index + 1}:</strong></p>
                <p>${endereco.endereco}, ${endereco.numero}</p>
                <p>CEP: ${endereco.cep}</p>
                ${endereco.complemento ? `<p>Complemento: ${endereco.complemento}</p>` : ''}
                <button class="remover-endereco" data-index="${index}">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.remover-endereco').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                await removerEndereco(e.target.getAttribute('data-index'));
            });
        });
    }

    async function removerEndereco(index) {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            const enderecos = userDoc.data().enderecos;

            enderecos.splice(index, 1);
            await userRef.update({ enderecos });
            renderEnderecos(enderecos);
        } catch (error) {
            console.error("Erro ao remover endereço:", error);
            alert("Erro ao remover endereço");
        }
    }

    // ==================== EVENT LISTENERS DA CONTA ====================
    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut()
            .then(() => window.location.href = '../Login/login.html')
            .catch(error => alert('Erro ao fazer logout: ' + error.message));
    });

    // Alternar entre seções
    menuOpcoes.forEach(opcao => {
        opcao.addEventListener('click', function () {
            const section = this.getAttribute('data-section');

            menuOpcoes.forEach(op => op.classList.remove('active'));
            this.classList.add('active');

            conteudoSecoes.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${section}-secao`).classList.add('active');
        });
    });

    // Salvar dados do usuário
    formDados.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).update({
                nome: nomeCompletoInput.value,
                email: emailInput.value,
                telefone: telefoneInput.value
            });

            if (nomeCompletoInput.value !== user.displayName) {
                await user.updateProfile({ displayName: nomeCompletoInput.value });
            }

            if (emailInput.value !== user.email) {
                await user.updateEmail(emailInput.value);
            }

            alert('Dados atualizados com sucesso!');
            nomeUsuario.textContent = nomeCompletoInput.value;
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
            alert("Erro ao atualizar dados: " + error.message);
        }
    });

    // Adicionar endereço
    adicionarEnderecoBtn.addEventListener('click', () => {
        const novoEndereco = {
            cep: prompt("Digite o CEP:"),
            endereco: prompt("Digite o endereço:"),
            numero: prompt("Digite o número:"),
            complemento: prompt("Digite o complemento (opcional):") || ''
        };

        if (novoEndereco.cep && novoEndereco.endereco && novoEndereco.numero) {
            adicionarEndereco(novoEndereco);
        } else {
            alert("Preencha pelo menos CEP, endereço e número");
        }
    });

    async function adicionarEndereco(novoEndereco) {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).update({
                enderecos: firebase.firestore.FieldValue.arrayUnion(novoEndereco)
            });

            const userDoc = await db.collection('users').doc(user.uid).get();
            renderEnderecos(userDoc.data().enderecos);
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            alert("Erro ao adicionar endereço");
        }
    }

    // Alterar senha
    formSenha.addEventListener('submit', (e) => {
        e.preventDefault();

        const senhaAtual = document.getElementById('senha-atual').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, senhaAtual);

        user.reauthenticateWithCredential(credential)
            .then(() => user.updatePassword(novaSenha))
            .then(() => {
                alert('Senha alterada com sucesso!');
                formSenha.reset();
            })
            .catch(error => alert('Erro ao alterar senha: ' + error.message));
    });

    // ==================== FUNÇÕES DE BUSCA ====================
    async function carregarProdutos() {
        try {
            const response = await fetch('../Detalhes/db.json');
            if (!response.ok) throw new Error('Erro ao carregar produtos');
            produtos = (await response.json()).produtos;
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function mostrarSugestoes(termo) {
        if (!termo || termo.length < 2) {
            sugestoesContainer.style.display = 'none';
            return;
        }

        const termoLower = termo.toLowerCase();
        const sugestoes = produtos.filter(p =>
            p.nome.toLowerCase().includes(termoLower)
        ).slice(0, 5);

        sugestoesContainer.innerHTML = sugestoes.length > 0 ?
            sugestoes.map(p => `
                <div class="sugestao-item" data-id="${p.id}">
                    <img src="${p.imagem}" alt="${p.nome}">
                    <div>
                        <div class="sugestao-nome">${p.nome}</div>
                        <div class="sugestao-preco">${formatarPreco(p.preco)}</div>
                    </div>
                </div>
            `).join('') : '';

        sugestoesContainer.style.display = sugestoes.length > 0 ? 'block' : 'none';

        document.querySelectorAll('.sugestao-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = `../Detalhes/detalhes.html?id=${item.getAttribute('data-id')}`;
            });
        });
    }

    function formatarPreco(preco) {
        return 'R$ ' + preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }

    // ==================== EVENT LISTENERS DE BUSCA ====================
    campoBusca.addEventListener('input', () => mostrarSugestoes(campoBusca.value));
    campoBusca.addEventListener('focus', () => {
        if (campoBusca.value.length >= 2) mostrarSugestoes(campoBusca.value);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.barra-busca')) sugestoesContainer.style.display = 'none';
    });
    formBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        if (campoBusca.value.trim()) console.log('Buscar por:', campoBusca.value.trim());
    });

    // ==================== MENU HAMBURGUER ====================
    hamburguer.addEventListener('click', function () {
        this.classList.toggle('aberto');
        menuNav.classList.toggle('aberto');
    });

    // ==================== MODAIS ====================
    Object.values(modais).forEach(({ link, modal, fechar, botao }) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        const fecharModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        fechar.addEventListener('click', fecharModal);
        botao.addEventListener('click', fecharModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });
    });

    // ==================== INICIALIZAÇÃO ====================
    carregarProdutos();
});