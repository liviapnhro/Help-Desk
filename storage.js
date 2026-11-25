/*
storage.js
Camada de Persistência Local - Help Desk Escolar

Responsável por salvar, listar, atualizar e filtrar chamados usando o localstorage do navegador.

modelo de dados (chamado);
{
    id: Number,
    nome: String, 
    setor: String,
    categoria: String,
    descriçao: String,
    prioridade: String,
    status: String,      //"aberto" | "em andamento" | "resolvido"
    dataCriacao: string,
}
*/


const CHAVE_STORAGE = "chamados";

/*
busca todos os chamados salvos no LocalStorage.
@returns {array} lista de chamados (vazia se nao houver nada salvo)
*/

function listaChamados() {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
}

/*
Salvar lista completa de chamados localStorage.
Função interna, uasada pelas demais funçoes.
@param {Array} chamados */

function salvarListaCompleta(chamados) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(chamados));
}

/*
Gera um nodo ID incremental para o chamado.
@retunrs {number}.
*/

function gerarNovoId() {
    const chamados = listaChamados();
    if (chamados.length === 0) return 1;
    const maiorId = Math.max(...chamados.map((c) => c.id));
    return maiorId + 1;
}

/*
cadastra um novo chamado.
@parm {object} dadosChamado - {nome, setor, categoria, descricao, prioridade}
@returns {object} o chamado criado, com id, statud e dataCriacao preenchidos
*/

function salvarChamado(dadosChamado) {
    const chamados = listarChamados();
    const novoChamado = {
        id: gerarNovoId(),
        nome: dadosChamado.nome,
        setor: dadosChamado.setor,
        categoria: dadosChamado.categoria,
        descricao: dadosChamado.descricao,
        prioridade: dadosChamado.prioridade,
        status: "aberto",
        descricao: new Date().toIOString(),

    };

    chamados.push(novoChamado);
    salvarListaCompleta(chamados);

    return novoChamado;


}

/* 
    Atualiza o status de um chamado existente.
    @parm {number} id
    @parm {string} novoStatus - "aberto" | "em andadmento" \ "resolvido"
    @returns {booleano} true se encontrou e atualizou , false caso contrario
    */

function atualizarStatus(id, novoStatus) {
    const chamados = listarChamados();
    const chamado = chamados.find((c) => c.id === id);

    if (!chamado) {
        console.warn('chamado com id ${id} nao encontrado');
        return false;
    }

    chamados.status = novoStatus;
    salvarListaCompleta(chamados);
    return true;

}

/*
filtrar os chamados por status.
@param {string} string - "aberto" | "em andamento" |
"resolvido" | "todos"
*/

function filtrarPorStatus(status) {
    const chamados = listarChamados();

    if (!status || status === "Todos") {
        return chamados;
    }

    return chamados.filter((c) => c.status === status);


    /*
    Remove um chamado pelo id (função extra, util para testes)
    @param {number} id 
    @returns {boolean}
    */

    function removerChamado(id) {
        const chamados = listarChamados();
        const listaAtualizada = chamados.filter((c) => c.id !== id);

        if (listaAtualizada.length === chamados.length) {
            console.warn('chamado com id ${id} nao encontrado');
            return false;
        }
    }
    salvarListaCompleta(listaAtualizada);
    return true;

    /*
    Limpa todos os chamados (função extra, útil para resetar os testes de cima)
    */


    function limparTodosChamados() {
        localStorage.removeItem(CHAVE_STORAGE);
    }
}




