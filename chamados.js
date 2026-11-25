/**
 * chamados.js - Camada de interface (chamados.html)
 */

const containerLista = document.getElementById("lista-chamados");
const mensagemVazia = document.getElementById("mensagem-vazia");
const filtroStatus = document.getElementById("filtro-status");

const STATUS_DISPONIVEIS = ["Aberto", "Em andamento", "Resolvido"];

document.addEventListener("DOMContentLoaded", renderizarLista);
filtroStatus.addEventListener("change", renderizarLista);

function renderizarLista() {
    const statusSelecionado = filtroStatus.value;
    const chamados = filtrarPorStatus(statusSelecionado);

    containerLista.innerHTML = "";

    if (chamados.length === 0) {
        mensagemVazia.hidden = false;
        mensagemVazia.textContent = "Nenhum chamado encontrado.";
        return;
    }
    mensagemVazia.hidden = true;

    const chamadosOrdenados = [...chamados].reverse();

    chamadosOrdenados.forEach((chamado) => {
        containerLista.appendChild(criarCartaoChamado(chamado));
    });
}

function criarCartaoChamado(chamado) {
    const cartao = document.createElement("article");
    cartao.className = "cartao-chamado";

    const dataFormatada = formatarData(chamado.dataCriacao);
    const classePrioridade = "prioridade " + chamado.prioridade.toLowerCase();

    cartao.innerHTML = `
        <div class="cartao-chamado-topo">
            <span class="numero-chamado">#${chamado.id}</span>
            <span class="badge-prioridade ${classePrioridade}">${chamado.prioridade}</span>
        </div>

        <h2 class="titulo-chamado">${chamado.categoria}</h2>
        <p class="descricao-chamado">${chamado.descricao}</p>

        <div class="detalhes-chamado">
            <span><strong>Solicitante:</strong> ${chamado.nome}</span>
            <span><strong>Setor:</strong> ${chamado.setor}</span>
            <span><strong>Aberto em:</strong> ${dataFormatada}</span>
        </div>
    
        <div class="rodape-chamado">
            <label class="rotulo-status" for="status-${chamado.id}">Status:</label>
            <select class="select-status" id="status-${chamado.id}" data-id="${chamado.id}">
                ${STATUS_DISPONIVEIS.map(
                    (status) => `<option value="${status}" ${status.toLowerCase() === chamado.status.toLowerCase() ? "selected" : ""}>${status}</option>`
                ).join("")}
            </select>
        </div>
    `;

    const seletorStatus = cartao.querySelector(".select-status");
    seletorStatus.addEventListener("change", aoMudarStatus);

    return cartao;
}

function aoMudarStatus(evento) {
    const id = Number(evento.target.dataset.id);
    const novoStatus = evento.target.value;

    const sucesso = atualizarStatus(id, novoStatus);

    if (!sucesso) {
        alert("Não foi possível atualizar o status desse chamado.");
        return;
    }
    renderizarLista();
}

function formatarData(dataIso) {
    if (!dataIso) return "--/--/---- --:--";
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}