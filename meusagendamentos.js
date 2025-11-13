document.addEventListener("DOMContentLoaded", () => {
  const futurosContainer = document.getElementById("agendamentos-futuros");
  const anterioresContainer = document.getElementById("agendamentos-anteriores");

  fetch("meusagendamentos.json")
    .then(response => response.json())
    .then(data => {
      const agora = new Date();

      data.forEach(ag => {
        const dataAgendamento = new Date(ag.data + "T" + ag.hora);
        const card = criarCardAgendamento(ag);

        if (dataAgendamento > agora) {
          futurosContainer.appendChild(card);
        } else {
          anterioresContainer.appendChild(card);
        }
      });
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));
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
        ${ag.status !== "Cancelado" ? `<button class="cancel">Cancelar</button>` : ""}
        ${ag.status === "Concluído" ? `<button>Avaliar</button>` : ""}
      </div>
    </div>
  `;

  return card;
}

