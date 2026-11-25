/*
* chamados.js
* camada de interface - tela de listagem (chamados.html)
*
* responsável por exibir os chamados; aplicar filtro por status
* e permitir a alteração de status de cada chamado.
*/

const containerLista = document.getElementById("lista-chamados");
const mensagemVazia = document.getElementById("mensagem-vazia");
const filtroStatus = document.getElementById("filtro-status");

const STATUS_DISPONIVEIS = ["Aberto", "Em andamento", "Resolvido"];

// Renderiza a lista assim que a página carrega
document.addEventListener("DOMContentLoaded", renderizarLista);

// Sempre que o filtro mudar, renderiza a lista de novo
filtroStatus.addEventListener("change", renderizarLista);

/**
 * Busca chamados (já filtrados) e desenha os cartões na tela.
 */
function renderizarLista() {
    const statusSelecionado = filtroStatus.value;
    const chamados = filtrarPorStatus(statusSelecionado);

    containerLista.innerHTML = "";

    if (chamados.length === 0) {
        mensagemVazia.hidden = false;
        return;
    }
    mensagemVazia.hidden = true;

    // Mostra os chamados mais recentes primeiro
    const chamadosOrdenados = [...chamados].reverse();

    chamadosOrdenados.forEach((chamado) => {
        containerLista.appendChild(criarCartaoChamado(chamado));
    });
}

/**
 * Cria o elemento HTML (cartão) que representa um chamado.
 * @param {Object} chamado
 * @returns {HTMLElement}
 */
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
     label class="rotulo-status" for="status-$(chamado.id)">status</label>
     <select class="select-status" id="status-$(chamado.id)" data-id"$(chamado.id)">
     ${STATUS_DISPONIVEIS.map(
        (status) =>
            ` <option value="${status}" ${status ===
                chamado.status ? "selected" : ""}>${status}</option>`
    ).join("")} 
    </select>
        </div>`
        ;

    `
  const seletorStatus=cartao.querySelector(".select-status");
  seletorStatus.addEventListener ("change", aoMudarStatus);

  return cartao;
  `
}

/**
 * Chamado quando o usuario troca o status pelo <select> do cartao.
 * @param {Event} evento
 */

function aoMudarStatus(evento) {
    const id = Number(evento.target.dataset.id);
    const novoStatus = evento.target.valaue;

    const sucesso = atualizacaoStatus(id, novoStatus);

    if (!sucesso) {
        alert("nao foi possivel atualizar o status desse chamado");
        return;
    }
}