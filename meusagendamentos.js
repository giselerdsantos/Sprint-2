document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu");
  const menu = document.getElementById("menu-servicos");
  const futurosContainer = document.getElementById("agendamentos-futuros");
  const anterioresContainer = document.getElementById("agendamentos-anteriores");
  const campoBusca = document.getElementById("busca");

  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("menu-aberto");
  });

  let dadosAgendamentos = [];

  fetch("https://raw.githubusercontent.com/giselerdsantos/Sprint-2/main/meusagendamentos.json")
    .then(r => r.json())
    .then(data => {
      dadosAgendamentos = data;
      renderizarLista(data);
    });

  function renderizarLista(lista) {
    futurosContainer.innerHTML = "";
    anterioresContainer.innerHTML = "";
    const agora = new Date();

    lista.forEach(ag => {
      const [hora, minuto] = ag.hora.split(":");
      const [ano, mes, dia] = ag.data.split("-");
      const dataAgendamento = new Date(ano, mes - 1, dia, hora, minuto, 0);
      const card = criarCardAgendamento(ag);

      if (dataAgendamento > agora) {
        futurosContainer.appendChild(card);
      } else {
        anterioresContainer.appendChild(card);
      }
    });
  }

  campoBusca.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();
    const filtrados = dadosAgendamentos.filter(ag =>
      ag.profissional.toLowerCase().includes(termo) ||
      ag.servico.toLowerCase().includes(termo) ||
      ag.status.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
  });
});

function criarCardAgendamento(ag) {
  const card = document.createElement("div");
  card.classList.add("card-agendamento");

  card.innerHTML = `
    <div>
      <h4>${ag.profissional}</h4>
      <p class="data-hora">${ag.data} — ${ag.hora}</p>
      <p>Serviço: ${ag.servico}</p>
    </div>

    <div class="card-row">
      <span class="status ${ag.status.toLowerCase()}">${ag.status}</span>
      <div class="card-actions">
        ${ag.status === "Agendado" || ag.status === "Confirmado" ? `<button class="cancel">Cancelar</button>` : ""}
        ${ag.status === "Concluído" ? `<button>Avaliar</button>` : ""}
      </div>
    </div>
  `;

  const botaoCancelar = card.querySelector(".cancel");

  if (botaoCancelar) {
    botaoCancelar.addEventListener("click", () => {
      ag.status = "Cancelado";
      const status = card.querySelector(".status");
      status.className = "status cancelado";
      status.textContent = "Cancelado";
      botaoCancelar.remove();
    });
  }

  return card;
}
