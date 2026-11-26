
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

        <div class="rodape-chamado" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dde2d8; padding-top: 12px; margin-top: 12px;">
            <button class="botao-excluir" data-id="${chamado.id}" style="background: #B5502F; color: white; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 13px;">Excluir</button>

            <div style="display: flex; align-items: center; gap: 8px;">
                <label class="rotulo-status" for="status-${chamado.id}">Status:</label>
                <select class="select-status" id="status-${chamado.id}" data-id="${chamado.id}">
                    ${STATUS_DISPONIVEIS.map(
                        (status) => `<option value="${status}" ${status.toLowerCase() === chamado.status.toLowerCase() ? "selected" : ""}>${status}</option>`
                    ).join("")}
                </select>
            </div>
        </div>
    `;

    const seletorStatus = cartao.querySelector(".select-status");
    seletorStatus.addEventListener("change", aoMudarStatus);


    const botaoExcluir = cartao.querySelector(".botao-excluir");
    botaoExcluir.addEventListener("click", aoExcluirChamado);

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

function aoExcluirChamado(evento) {
    const id = Number(evento.target.dataset.id);

    const confirmar = confirm(`Tem certeza que deseja excluir o chamado #${id}?`);
    if (!confirmar) return;

    const sucesso = removerChamado(id);

    if (!sucesso) {
        alert("Não foi possível excluir o chamado.");
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