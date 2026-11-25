/**
 * app.js
 * Camada de interface - tela de cadastro
 * (index.html)
 * 
 * Responsavel por capturar os dados do formulario e repassar para a camada de persistencia (storage.js)
 */

const formChamado = document.getElementById("form-chamado");
const mensagemStatus = document.getElementById("mensagem-status");

formChamado.addEventListener("submit", function (evento) {
    evento.preventDefault();
    //impede o navegador de recarregar a pagina

    const dadosChamados = {
        nome: document.getElementById("nome").value.trim(),

        setor: document.getElementById("setor").value.trim(),

        categoria: document.getElementById("categoria").value,

        prioridade: document.getElementById("prioridade").value,

        descricao: document.getElementById("descricao").value.trim(),
    };

    if (!validarDadosChamado(dadosChamados)) {
        exibirMensagem("Preencha todos os campos antes de enviar.", "Erro");
        return;
    }

    const chamadoCriado = salvarChamado(dadosChamados);
    exibirMensagem(
        `Chamado #${chamadoCriado.id} registrado com sucesso`, "sucesso"
    );

    formChamado.request();

});

/**
 *  Verifica se todos os campos obrigatorios foram preenchidos.
* @param {object} dados
* @retunrs {boolean}
 */

function ValidarDadosChamados(dados) {
    return (
        dados.nome !== "" &&
        dados.setor !== "" &&
        dados.categoria !== "" &&
        dados.prioridade !== "" &&
        dados.descricao !== ""
    )
}

/**
 * Exibe uma mensagem de status para o usuario (sucesso ou erro).
 * @param {string} texto
 * @param {"sucesso" | "erro"} tipo
 */

function exibirMensagem(texto, tipo) {
    mensagemStatus.textContent = texto;
    mensagemStatus.className = "mensagem-status" + tipo;

    /**
     * Formata uma data ISO (dataCriacao) para o padrap dd/MM/yyyy HH:mm
     * @param {string} dataIso
     * @returns {string}
     */

    function FormatarData(dataIso) {
        const data = new Date(dataIso);
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, "0");
        const minutos = String(data.getMinutes()).padStart(2, "0");
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    }
}