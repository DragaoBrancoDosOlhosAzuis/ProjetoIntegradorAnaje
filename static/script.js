// Função para cadastrar um cliente
function cadastrarCliente() {
    const nome = document.getElementById('nome_cliente').value;
    const cpf_cnpj = document.getElementById('cpf_cnpj').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    fetch('/cadastrar_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'nome': nome,
            'cpf_cnpj': cpf_cnpj,
            'telefone': telefone,
            'email': email
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        listarClientes(); // Chama listar para atualizar a lista após cadastro
    })
    .catch(error => console.error('Erro:', error));
}

// Função para cadastrar uma pousada
function cadastrarPousada() {
    const id_pousada = document.getElementById('id_pousada').value;
    const nome = document.getElementById('nome_pousada').value;
    const valor = document.getElementById('valor_pousada').value;

    fetch('/cadastrar_pousada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'id_pousada': id_pousada,
            'nome': nome,
            'valor': valor
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        listarPousadas(); // Chama listar para atualizar a lista após cadastro
    })
    .catch(error => console.error('Erro:', error));
}

// Função para alternar o texto do botão entre "Listar" e "Ocultar"
function alternarTextoBotao(botao, textoListar, textoOcultar, lista) {
    if (lista.style.display === 'none' || lista.style.display === '') {
        lista.style.display = 'block';
        botao.textContent = textoOcultar;
    } else {
        lista.style.display = 'none';
        botao.textContent = textoListar;
    }
}

// Função para exibir a lista explicitamente
function exibirLista(lista, botao, textoOcultar) {
    lista.style.display = 'block';
    botao.textContent = textoOcultar;
}

// Função para listar clientes com alternância de exibição e texto do botão
function listarClientes() {
    const lista = document.getElementById('lista_clientes');
    const botao = document.getElementById('botaoListarClientes');
    
    fetch('/listar_clientes')
        .then(response => response.json())
        .then(data => {
            lista.innerHTML = '';
            data.forEach(cliente => {
                const li = document.createElement('li');
                li.textContent = `${cliente.nome} - CPF/CNPJ: ${cliente.cpf_cnpj}`;

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.onclick = () => exibirFormularioEdicaoCliente(cliente);

                const btnRemover = document.createElement('button');
                btnRemover.textContent = 'Remover';
                btnRemover.onclick = () => confirmarRemoverCliente(cliente);

                li.appendChild(btnEditar);
                li.appendChild(btnRemover);
                lista.appendChild(li);
            });
            // Exibe a lista e define o texto para "Ocultar Clientes"
            exibirLista(lista, botao, 'Ocultar Clientes');
        });
}

// Função para listar pousadas com alternância de exibição e texto do botão
function listarPousadas() {
    const lista = document.getElementById('lista_pousadas');
    const botao = document.getElementById('botaoListarPousadas');

    if (lista.style.display === 'block') {
        lista.style.display = 'none';
        botao.textContent = 'Listar Todas as Pousadas';
    } else {
        lista.style.display = 'block';
        botao.textContent = 'Ocultar Pousadas';
        aplicarFiltroPousadas(); // Aplica o filtro ao listar todas as pousadas
    }
}
// Funções para filtrar clientes e pousadas conforme o usuário digita
function filtrarClientes() {
    listarClientes();
}

function filtrarPousadas() {
    listarPousadas();
}

// Funções de edição e remoção
function confirmarRemoverCliente(cliente) {
    if (confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)) {
        removerCliente(cliente.cpf_cnpj);
    }
}

function removerCliente(cpf_cnpj) {
    fetch('/remover_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'cpf_cnpj': cpf_cnpj
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        listarClientes(); // Atualiza a lista após remoção
    })
    .catch(error => console.error('Erro:', error));
}

function confirmarRemoverPousada(pousada) {
    if (confirm(`Tem certeza que deseja excluir a pousada ${pousada.nome}?`)) {
        removerPousada(pousada.id);
    }
}

function removerPousada(id_pousada) {
    fetch('/remover_pousada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'id_pousada': id_pousada
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        listarPousadas(); // Atualiza a lista após remoção
    })
    .catch(error => console.error('Erro:', error));
}

// Funções para salvar alterações de cliente
function salvarEdicaoCliente() {
    const nome = document.getElementById('editar_nome_cliente').value;
    const cpf_cnpj = document.getElementById('editar_cpf_cnpj_cliente').value;
    const telefone = document.getElementById('editar_telefone_cliente').value;
    const email = document.getElementById('editar_email_cliente').value;

    fetch('/editar_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'nome': nome,
            'cpf_cnpj': cpf_cnpj,
            'telefone': telefone,
            'email': email
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        document.getElementById('form_editar_cliente').style.display = 'none';
        listarClientes(); // Atualiza a lista após edição
    })
    .catch(error => console.error('Erro:', error));
}

// Função para salvar alterações de pousada, incluindo o status
function salvarEdicaoPousada() {
    const id_pousada = document.getElementById('editar_id_pousada').value;
    const nome = document.getElementById('editar_nome_pousada').value;
    const valor = document.getElementById('editar_valor_pousada').value;
    const status = document.getElementById('editar_status_pousada').value;

    fetch('/editar_pousada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'id_pousada': id_pousada,
            'nome': nome,
            'valor': valor,
            'status': status
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        document.getElementById('form_editar_pousada').style.display = 'none';
        listarPousadas(); // Atualiza a lista após edição
    })
    .catch(error => console.error('Erro:', error));
}

// Funções para exibir formulários de edição
function exibirFormularioEdicaoCliente(cliente) {
    document.getElementById('form_editar_cliente').style.display = 'block';
    document.getElementById('editar_nome_cliente').value = cliente.nome;
    document.getElementById('editar_cpf_cnpj_cliente').value = cliente.cpf_cnpj;
    document.getElementById('editar_telefone_cliente').value = cliente.telefone;
    document.getElementById('editar_email_cliente').value = cliente.email;
}

function exibirFormularioEdicaoPousada(pousada) {
    document.getElementById('form_editar_pousada').style.display = 'block';
    document.getElementById('editar_id_pousada').value = pousada.id;
    document.getElementById('editar_nome_pousada').value = pousada.nome;
    document.getElementById('editar_valor_pousada').value = pousada.valor;
    document.getElementById('editar_status_pousada').value = pousada.status || 'livre';
}

// Função para aplicar o filtro de pousadas sem alternar a visibilidade
function aplicarFiltroPousadas() {
    const lista = document.getElementById('lista_pousadas');
    const filtroStatus = document.getElementById('filtro_pousada').value;
    const pesquisa = document.getElementById('pesquisa_pousada').value.toLowerCase();

    // Limpa a lista antes de aplicar o filtro
    lista.innerHTML = '';

    fetch('/listar_pousadas')
        .then(response => response.json())
        .then(pousadas => {
            pousadas.forEach(pousada => {
                // Aplica o filtro de status e pesquisa
                const mostrarPousada = 
                    (filtroStatus === 'todas' ||
                     (filtroStatus === 'livres' && pousada.status === 'livre') ||
                     (filtroStatus === 'reservadas' && pousada.status === 'reservada')) &&
                    pousada.nome.toLowerCase().includes(pesquisa);

                if (mostrarPousada) {
                    const li = document.createElement('li');
                    li.textContent = `${pousada.nome} - ID: ${pousada.id} - Valor: R$${pousada.valor}`;

                    const btnEditar = document.createElement('button');
                    btnEditar.textContent = 'Editar';
                    btnEditar.onclick = () => exibirFormularioEdicaoPousada(pousada);

                    const btnRemover = document.createElement('button');
                    btnRemover.textContent = 'Remover';
                    btnRemover.onclick = () => confirmarRemoverPousada(pousada);

                    li.appendChild(btnEditar);
                    li.appendChild(btnRemover);
                    lista.appendChild(li);
                }
            });

            // Exibe a lista após aplicar o filtro
            lista.style.display = 'block';
        });
}


// Função para formatar o valor da pousada
function formatCurrencyMachineInput(input) {
    let value = input.value.replace(/\D/g, "");
    value = (parseInt(value) / 100).toFixed(2);
    input.value = value.replace(".", ",");
}
