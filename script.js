const scoreValue = document.getElementById('score-valor');
const resultadoBox = document.getElementById('resultado-acao');
const resultadoTitulo = document.getElementById('resultado-titulo');
const resultadoTexto = document.getElementById('resultado-texto');
const forecastContainer = document.getElementById('forecast');

const buttons = {
  carbono: document.getElementById('btn-carbono'),
  previsao: document.getElementById('btn-previsao'),
  mapa: document.getElementById('btn-mapa'),
};

function scrollToResultado() {
  if (!resultadoBox) return;
  resultadoBox.hidden = false;
  window.scrollTo({ top: resultadoBox.offsetTop - 20, behavior: 'smooth' });
}

function atualizarScore(novoScore, mensagem) {
  scoreValue.textContent = `${novoScore}/100`;
  resultadoTexto.textContent = mensagem;
  resultadoTitulo.textContent = 'Score Atualizado';
  forecastContainer.innerHTML = '';
  scrollToResultado();
}

function calcularCarbono() {
  const hectares = Number(prompt('Quantos hectares de área com manejo sustentável você quer calcular?', '10'));
  if (!hectares || hectares <= 0) {
    alert('Por favor, informe um valor válido de hectares.');
    return;
  }

  const sequestrado = Math.round(hectares * 1.9 * 10) / 10;
  const bonusScore = Math.min(100, 85 + Math.round(hectares * 0.4));
  const mensagem = `Em ${hectares} hectares de plantio direto, sua propriedade pode sequestrar cerca de ${sequestrado} toneladas de CO₂ por ano. Seu score sustentável subiu para ${bonusScore}/100.`;

  atualizarScore(bonusScore, mensagem);
}

function verPrevisao() {
  const previsoes = [
    { dia: 'Hoje', temp: '27°C', condicao: 'Parcialmente nublado', chuva: '10%' },
    { dia: 'Amanhã', temp: '25°C', condicao: 'Chuvas leves', chuva: '40%' },
    { dia: 'Depois de amanhã', temp: '23°C', condicao: 'Sol com nuvens', chuva: '20%' },
  ];

  resultadoTitulo.textContent = 'Previsão Climática Local';
  resultadoTexto.textContent = 'Use esses dados para ajustar a irrigação e reduzir desperdícios de água.';
  forecastContainer.innerHTML = previsoes
    .map((item) => `
      <article class="forecast-card">
        <strong>${item.dia}</strong>
        <p>${item.condicao}</p>
        <p>Temperatura: ${item.temp}</p>
        <p>Chance de chuva: ${item.chuva}</p>
      </article>
    `)
    .join('');

  scrollToResultado();
}

function abrirMapa() {
  resultadoTitulo.textContent = 'Pontos de Descarte Próximos';
  resultadoTexto.textContent = 'Abrindo o mapa de logística reversa em nova aba. Encontre o ponto de descarte mais próximo para embalagens e resíduos agrícolas.';
  forecastContainer.innerHTML = '';
  scrollToResultado();

  window.open(
    'https://www.google.com/maps/search/pontos+de+descarte+de+embalagens+agro+próximo/',
    '_blank',
  );
}

if (buttons.carbono) {
  buttons.carbono.addEventListener('click', calcularCarbono);
}

if (buttons.previsao) {
  buttons.previsao.addEventListener('click', verPrevisao);
}

if (buttons.mapa) {
  buttons.mapa.addEventListener('click', abrirMapa);
}
