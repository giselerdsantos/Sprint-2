document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu");
  const menu = document.getElementById("menu-servicos");

  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("menu-aberto");
  });

  const futurosContainer = document.getElementById("agendamentos-futuros");
  const anterioresContainer = document.getElementById("agendamentos-anteriores");

  fetch("meusagendamentos.json")
    .then(r => r.json())
    .then(data => {
      const agora = new Date();

      data.forEach(ag => {
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

  

  return card;
}
