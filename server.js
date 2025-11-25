const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/agendamentos", (req, res) => {
  const data = JSON.parse(fs.readFileSync("meusagendamentos.json"));
  res.json(data);
});

app.post("/cancelar", (req, res) => {
  const { profissional, data, hora } = req.body;

  let lista = JSON.parse(fs.readFileSync("meusagendamentos.json"));

  lista = lista.map(a => {
    if (a.profissional === profissional && a.data === data && a.hora === hora) {
      return { ...a, status: "Cancelado" };
    }
    return a;
  });

  fs.writeFileSync("meusagendamentos.json", JSON.stringify(lista, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
