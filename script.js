/* ---------- Tema claro / escuro ---------- */
const btnTema = document.getElementById("tema");
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  btnTema.textContent = tema === "dark" ? "Modo claro" : "Modo escuro";
}
let temaInicial = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
try {
  temaInicial = localStorage.getItem("ecobike-tema") || temaInicial;
} catch (e) {}
aplicarTema(temaInicial);
btnTema.addEventListener("click", function () {
  const novo =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  aplicarTema(novo);
  try {
    localStorage.setItem("ecobike-tema", novo);
  } catch (e) {}
});

/* ---------- Simulador de preço ---------- */
const selectTipo = document.getElementById("tipo");
const inputHoras = document.getElementById("horas");
const resultado = document.getElementById("resultado");
const erroHoras = document.getElementById("erro-horas");

function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularPreco() {
  const precoHora = Number(selectTipo.value);
  const horas = Number(inputHoras.value);

  if (!Number.isInteger(horas) || horas < 1) {
    erroHoras.textContent =
      "Informe uma quantidade de horas válida (número inteiro a partir de 1).";
    resultado.innerHTML = '<p class="detail">O valor total aparecerá aqui.</p>';
    return;
  }
  erroHoras.textContent = "";

  let total = precoHora * horas;
  let detalhe = horas + " h × " + formatarReal(precoHora) + " (sem desconto)";
  if (horas > 5) {
    total = total * 0.9;
    detalhe =
      horas + " h × " + formatarReal(precoHora) + " com 10% de desconto";
  }
  const nome = selectTipo.options[selectTipo.selectedIndex].text;
  resultado.innerHTML =
    "<strong>" +
    formatarReal(total) +
    '</strong><p class="detail">' +
    nome +
    ": " +
    detalhe +
    "</p>";
}
document.getElementById("calcular").addEventListener("click", calcularPreco);

/* ---------- Lista de pré-reservas ---------- */
const reservas = []; // Array que guarda os nomes
const inputNome = document.getElementById("nome");
const lista = document.getElementById("lista");
const total = document.getElementById("total");
const erroNome = document.getElementById("erro-nome");

function renderizarLista() {
  lista.innerHTML = "";
  if (reservas.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "empty";
    vazio.textContent = "Nenhuma reserva ainda.";
    lista.appendChild(vazio);
  }
  reservas.forEach(function (nome, indice) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = nome;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove";
    btn.textContent = "Remover";
    btn.setAttribute("aria-label", "Remover " + nome);
    btn.addEventListener("click", function () {
      removerReserva(indice);
    });
    li.appendChild(span);
    li.appendChild(btn);
    lista.appendChild(li);
  });
  total.textContent = "Total de reservas: " + reservas.length;
}

function adicionarReserva() {
  const nome = inputNome.value.trim();
  if (nome === "") {
    erroNome.textContent = "Digite um nome antes de adicionar.";
    inputNome.focus();
    return;
  }
  erroNome.textContent = "";
  reservas.push(nome);
  inputNome.value = "";
  inputNome.focus();
  renderizarLista();
}

function removerReserva(indice) {
  reservas.splice(indice, 1);
  renderizarLista();
}

document
  .getElementById("adicionar")
  .addEventListener("click", adicionarReserva);
inputNome.addEventListener("keydown", function (e) {
  if (e.key === "Enter") adicionarReserva();
});
renderizarLista();
