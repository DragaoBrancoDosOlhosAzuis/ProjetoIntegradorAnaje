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
        listarClientes();
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
        listarPousadas();
    })
    .catch(error => console.error('Erro:', error));
}

// Função para reservar uma pousada
function reservarPousada() {
    const cpf_cnpj = document.getElementById('cpf_reserva').value;
    const pousada_id = document.getElementById('id_pousada_reserva').value;
    const data_fim = document.getElementById('data_fim_reserva').value;

    fetch('/reservar_pousada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'cpf_cnpj': cpf_cnpj,
            'pousada_id': pousada_id,
            'data_fim': data_fim
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultado').innerText = data.message;
        listarPousadasReservadas();
    })
    .catch(error => console.error('Erro:', error));
}

// Função para listar clientes com filtro de busca por nome
function listarClientes() {
    fetch('/listar_clientes')
    .then(response => response.json())
    .then(data => {
        // Filtra clientes com base na pesquisa
        const pesquisa = document.getElementById('pesquisa_cliente').value.toLowerCase();
        const lista = document.getElementById('lista_clientes');
        lista.innerHTML = '';

        data.forEach(cliente => {
            if (cliente.nome.toLowerCase().includes(pesquisa)) {
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
            }
        });
        lista.style.display = 'block';
    });
}

// Função para listar pousadas com filtro de busca por nome e status (livre/reservada)
function listarPousadas() {
    fetch('/listar_pousadas')
    .then(response => response.json())
    .then(pousadas => {
        const lista = document.getElementById('lista_pousadas');
        const filtroStatus = document.getElementById('filtro_pousada').value;
        const pesquisa = document.getElementById('pesquisa_pousada').value.toLowerCase();
        lista.innerHTML = '';

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
        lista.style.display = 'block';
    });
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
        listarClientes();
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
        listarPousadas();
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
        listarClientes();
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
        listarPousadas();
    })
    .catch(error => console.error('Erro:', error));
}

// Função para exibir o formulário de edição com o status atual da pousada
function exibirFormularioEdicaoPousada(pousada) {
    document.getElementById('form_editar_pousada').style.display = 'block';
    document.getElementById('editar_id_pousada').value = pousada.id;
    document.getElementById('editar_nome_pousada').value = pousada.nome;
    document.getElementById('editar_valor_pousada').value = pousada.valor;
    document.getElementById('editar_status_pousada').value = pousada.status || 'livre'; // Define o status atual ou "livre" por padrão
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
}

// Função para formatar o valor da pousada
function formatCurrencyMachineInput(input) {
    let value = input.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    value = (parseInt(value) / 100).toFixed(2); // Divide por 100 para adicionar a vírgula
    input.value = value.replace(".", ","); // Substitui ponto por vírgula para formato brasileiro
}

// Função para ocultar e exibir listas
function ocultarTabela(idTabela) {
    const lista = document.getElementById(idTabela);
    lista.style.display = (lista.style.display === 'none') ? 'block' : 'none';
}
