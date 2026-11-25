/**
 * app.js - Camada de interface (index.html)
 */

const formChamado = document.getElementById("form-chamado");
const mensagemStatus = document.getElementById("mensagem-status");

formChamado.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dadosChamados = {
        nome: document.getElementById("nome").value.trim(),
        setor: document.getElementById("setor").value.trim(),
        categoria: document.getElementById("categoria").value,
        prioridade: document.getElementById("prioridade").value,
        descricao: document.getElementById("descricao").value.trim(),
    };

    if (!validarDadosChamados(dadosChamados)) {
        exibirMensagem("Preencha todos os campos antes de enviar.", "erro");
        return;
    }

    const chamadoCriado = salvarChamado(dadosChamados);
    exibirMensagem(`Chamado #${chamadoCriado.id} registrado com sucesso!`, "sucesso");

    formChamado.reset();
});

function validarDadosChamados(dados) {
    return (
        dados.nome !== "" &&
        dados.setor !== "" &&
        dados.categoria !== "" &&
        dados.prioridade !== "" &&
        dados.descricao !== ""
    );
}

function exibirMensagem(texto, tipo) {
    mensagemStatus.textContent = texto;
    mensagemStatus.className = "mensagem-status " + tipo;
}