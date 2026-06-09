const scoreValue = document.getElementById('score-valor');
const resultadoBox = document.getElementById('resultado-acao');
const resultadoTitulo = document.getElementById('resultado-titulo');
const resultadoTexto = document.getElementById('resultado-texto');
const forecastContainer = document.getElementById('forecast');

const WAZE_MAP_URL = 'https://www.waze.com/pt-BR/live-map/';
const CLIMATEMPO_URL = 'https://www.climatempo.com.br/';

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
  resultadoTitulo.textContent = 'Clima Tempo';
  resultadoTexto.textContent = 'Abrindo o site Clima Tempo em nova aba para consultar a previsão detalhada.';
  forecastContainer.innerHTML = '';
  scrollToResultado();

  window.open(CLIMATEMPO_URL, '_blank', 'noopener,noreferrer');
}

function abrirMapa() {
  resultadoTitulo.textContent = 'Waze';
  resultadoTexto.textContent = 'Abrindo o Waze em nova aba para localizar rotas e pontos próximos.';
  forecastContainer.innerHTML = '';
  scrollToResultado();

  window.open(WAZE_MAP_URL, '_blank', 'noopener,noreferrer');
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
