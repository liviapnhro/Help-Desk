
const CHAVE_STORAGE = "chamados";


function listaChamados() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
}


function salvarListaCompleta(chamados) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(chamados));
}


function gerarNovoId() {
    const chamados = listaChamados();
    if (chamados.length === 0) return 1;
    const maiorId = Math.max(...chamados.map((c) => c.id));
    return maiorId + 1;
}


function salvarChamado(dadosChamado) {
    const chamados = listaChamados();
    const novoChamado = {
        id: gerarNovoId(),
        nome: dadosChamado.nome,
        setor: dadosChamado.setor,
        categoria: dadosChamado.categoria,
        descricao: dadosChamado.descricao,
        prioridade: dadosChamado.prioridade,
        status: "aberto",
        dataCriacao: new Date().toISOString(),
    };

    chamados.push(novoChamado);
    salvarListaCompleta(chamados);

    return novoChamado;
}


function atualizarStatus(id, novoStatus) {
    const chamados = listaChamados();
    const chamado = chamados.find((c) => c.id === id);

    if (!chamado) {
        console.warn(`Chamado com id ${id} não encontrado`);
        return false;
    }

    chamado.status = novoStatus;
    salvarListaCompleta(chamados);
    return true;
}


function filtrarPorStatus(status) {
    const chamados = listaChamados();

    if (!status || status.toLowerCase() === "todos") {
        return chamados;
    }

    return chamados.filter((c) => c.status.toLowerCase() === status.toLowerCase());
}


function removerChamado(id) {
    const chamados = listaChamados();
    const listaAtualizada = chamados.filter((c) => c.id !== id);

    if (listaAtualizada.length === chamados.length) {
        console.warn(`Chamado com id ${id} não encontrado para exclusão`);
        return false;
    }

    salvarListaCompleta(listaAtualizada);
    return true;
}


function limparTodosChamados() {
    localStorage.removeItem(CHAVE_STORAGE);
}