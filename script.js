const scoreValue = document.getElementById('score-valor');
const resultadoBox = document.getElementById('resultado-acao');
const resultadoTitulo = document.getElementById('resultado-titulo');
const resultadoTexto = document.getElementById('resultado-texto');
const forecastContainer = document.getElementById('forecast');

const WAZE_MAP_URL = 'https://www.waze.com/pt-BR/live-map/';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

const buttons = {
  carbono: document.getElementById('btn-carbono'),
  previsao: document.getElementById('btn-previsao'),
  mapa: document.getElementById('btn-mapa'),
};

const navHome = document.getElementById('nav-home');
const themeToggleButton = document.getElementById('theme-toggle');

function setTheme(theme) {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark');
    if (themeToggleButton) themeToggleButton.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    if (themeToggleButton) themeToggleButton.textContent = '🌙';
  }
  localStorage.setItem('site-theme', theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function scrollToResultado() {
  if (!resultadoBox) return;
  resultadoBox.hidden = false;
  window.scrollTo({ top: resultadoBox.offsetTop - 20, behavior: 'smooth' });
}

function scrollToInicio() {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return;
  dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const scoreText = document.getElementById('score-text');
const carbonForm = document.getElementById('form-carbono');
const carbonResult = document.getElementById('carbon-result');

const manejoData = {
  'plantio-direto': {
    nome: 'Plantio direto',
    sequestro: 1.9,
    descricao: 'Conserva solo, reduz erosão e aumenta a retenção de carbono no campo.',
  },
  integracao: {
    nome: 'Integração Lavoura-Pecuária',
    sequestro: 2.8,
    descricao: 'Melhora a ciclagem de nutrientes e aumenta o sequestro de carbono no solo.',
  },
  agroflorestal: {
    nome: 'Sistema agroflorestal',
    sequestro: 4.5,
    descricao: 'Gera maior sequestro de carbono e fortalece a biodiversidade da propriedade.',
  },
  convencional: {
    nome: 'Convencional',
    sequestro: 0.8,
    descricao: 'Tem menor capacidade de sequestro e geralmente maior dependência de insumos.',
  },
};

function atualizarScore(novoScore, mensagem) {
  scoreValue.textContent = `${novoScore}/100`;
  scoreText.textContent = mensagem;
  resultadoTexto.textContent = mensagem;
  resultadoTitulo.textContent = 'Resultado do Carbono';
  scrollToResultado();
}

function scrollToCalculator() {
  const calculatorSection = document.getElementById('carbon-calculator');
  if (!calculatorSection) return;
  calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function obterLocalizacao() {
  if (!navigator.geolocation) {
    throw new Error('Geolocalização não suportada pelo navegador.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(new Error('Não foi possível obter sua localização. Verifique as permissões do navegador.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}

function formatTemperature(value) {
  return `${Math.round(value)}°C`;
}

function formatWindSpeed(value) {
  return `${value.toFixed(1)} m/s`;
}

function descricaoCodigoClima(code) {
  const map = {
    0: 'Céu Limpo',
    1: 'Principalmente Ensolarado',
    2: 'Parcialmente Nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com Deposição',
    51: 'Chuvisco Fraco',
    53: 'Chuvisco Moderado',
    55: 'Chuvisco Forte',
    56: 'Chuvisco Congelante',
    57: 'Chuvisco Congelante Forte',
    61: 'Chuva Fraca',
    63: 'Chuva Moderada',
    65: 'Chuva Forte',
    66: 'Chuva Congelante Fraca',
    67: 'Chuva Congelante Forte',
    71: 'Neve Fraca',
    73: 'Neve Moderada',
    75: 'Neve Forte',
    77: 'Granizo',
    80: 'Chuva de Pancadas Fraca',
    81: 'Chuva de Pancadas Moderada',
    82: 'Chuva de Pancadas Forte',
    85: 'Neve em Pancadas Fraca',
    86: 'Neve em Pancadas Forte',
    95: 'Tempestade',
    96: 'Tempestade com Granizo Fraco',
    99: 'Tempestade com Granizo Forte',
  };
  return map[code] || 'Condições variáveis';
}

function renderCarbonResult(data) {
  const { hectares, manejo, cobertura, fertilizantes, sequestrado, emissao, net, novoScore } = data;

  scoreValue.textContent = `${novoScore}/100`;
  scoreText.textContent = net >= 0
    ? 'Seu balanço de carbono está positivo. Continue ampliando práticas regenerativas.'
    : 'Ajuste o manejo para reduzir emissões e virar o saldo de carbono positivo.';

  resultadoTitulo.textContent = 'Calculadora de Carbono';
  resultadoTexto.textContent = `Para ${hectares} hectares com o manejo ${manejo.nome}, estimamos o balanço de carbono abaixo.`;

  forecastContainer.innerHTML = [
    { label: 'Sequestro anual estimado', value: `${sequestrado} tCO₂` },
    { label: 'Emissões estimadas', value: `${emissao} tCO₂e` },
    { label: 'Saldo de carbono', value: `${net >= 0 ? '+' : ''}${net} tCO₂` },
  ]
    .map(card => `
      <article class="forecast-card">
        <strong>${card.value}</strong>
        <span>${card.label}</span>
      </article>
    `)
    .join('');

  resultadoBox.hidden = false;
  carbonResult.innerHTML = `
    <p>${manejo.descricao}</p>
    <p class="result-suggestion">Cobertura do solo: ${cobertura === 1.1 ? 'Alta' : cobertura === 1.0 ? 'Média' : 'Baixa'} • Uso de fertilizantes: ${fertilizantes === 0.7 ? 'Baixo' : fertilizantes === 1.0 ? 'Médio' : 'Alto'}.</p>
  `;
  scrollToResultado();
}

function calcularCarbono(event) {
  event.preventDefault();

  const hectares = Number(document.getElementById('input-hectares').value);
  const manejoKey = document.getElementById('input-manejo').value;
  const cobertura = Number(document.getElementById('input-cobertura').value);
  const fertilizantes = Number(document.getElementById('input-fertilizantes').value);

  if (!hectares || hectares <= 0) {
    alert('Por favor, informe um valor válido de hectares.');
    return;
  }

  const manejo = manejoData[manejoKey] || manejoData['plantio-direto'];
  const sequestrado = Math.round(hectares * manejo.sequestro * cobertura * 10) / 10;
  const emissao = Math.round(hectares * 1.2 * fertilizantes * 10) / 10;
  const net = Math.round((sequestrado - emissao) * 10) / 10;
  const novoScore = Math.min(100, Math.max(0, 85 + Math.round(net * 3)));

  renderCarbonResult({ hectares, manejo, cobertura, fertilizantes, sequestrado, emissao, net, novoScore });
}

async function verPrevisao() {
  resultadoTitulo.textContent = 'Previsão do tempo';
  resultadoTexto.textContent = 'Aguarde enquanto usamos sua localização para trazer a previsão atualizada.';
  if (forecastContainer) forecastContainer.innerHTML = '';
  resultadoBox.hidden = false;
  scrollToResultado();

  try {
    const { latitude, longitude } = await obterLocalizacao();
    const response = await fetch(
      `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${encodeURIComponent(DEFAULT_TIMEZONE)}`
    );

    if (!response.ok) {
      throw new Error('Não foi possível obter a previsão do tempo.');
    }

    const data = await response.json();
    const current = data.current_weather;
    const daily = data.daily;
    const descricao = descricaoCodigoClima(current.weathercode);
    const forecastHtml = `
      <article class="forecast-card">
        <strong>${descricao}</strong>
        <span>Temperatura atual: ${formatTemperature(current.temperature)}</span>
        <span>Vento: ${formatWindSpeed(current.windspeed)}</span>
        <span>Direção do vento: ${current.winddirection}°</span>
      </article>
      <article class="forecast-card">
        <strong>Previsão para hoje</strong>
        <span>Máx: ${formatTemperature(daily.temperature_2m_max[0])}</span>
        <span>Mín: ${formatTemperature(daily.temperature_2m_min[0])}</span>
        <span>Precipitação: ${daily.precipitation_sum[0].toFixed(1)} mm</span>
      </article>
    `;

    resultadoTexto.textContent = `Previsão para sua posição atual (${latitude.toFixed(4)}, ${longitude.toFixed(4)}).`;
    if (forecastContainer) forecastContainer.innerHTML = forecastHtml;
  } catch (error) {
    const message = error.message || 'Falha ao buscar a previsão do tempo.';
    resultadoTexto.textContent = message;
    if (forecastContainer) {
      forecastContainer.innerHTML = `<article class="forecast-card"><strong>Erro</strong><span>${message}</span></article>`;
    }
  }
}

const priceUpdatedText = document.getElementById('price-updated');
const priceLocationText = document.getElementById('price-location');
const stateSelect = document.getElementById('state-select');
const citySelect = document.getElementById('city-select');

function getTodayFormatted() {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const priceDataByState = {
  ac: [
    { name: 'Soja', price: 'R$ 202,80 / sc', change: '+0,5% no último dia' },
    { name: 'Milho', price: 'R$ 85,90 / sc', change: '+0,7% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.390,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 178,00 / sac', change: '+0,1% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,40 / L', change: '-0,1% no último dia' },
  ],
  al: [
    { name: 'Soja', price: 'R$ 203,20 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 86,30 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.400,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 179,00 / sac', change: '+0,2% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,45 / L', change: '-0,1% no último dia' },
  ],
  ap: [
    { name: 'Soja', price: 'R$ 200,70 / sc', change: '+0,4% no último dia' },
    { name: 'Milho', price: 'R$ 84,50 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.380,00 / sac', change: '-0,1% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 176,00 / sac', change: '+0,2% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,35 / L', change: '-0,2% no último dia' },
  ],
  am: [
    { name: 'Soja', price: 'R$ 203,00 / sc', change: '+0,4% no último dia' },
    { name: 'Milho', price: 'R$ 85,60 / sc', change: '+0,6% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.395,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 177,00 / sac', change: '+0,1% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,50 / L', change: '-0,1% no último dia' },
  ],
  ba: [
    { name: 'Soja', price: 'R$ 204,10 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 87,30 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.420,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 181,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,60 / L', change: '-0,1% no último dia' },
  ],
  ce: [
    { name: 'Soja', price: 'R$ 204,50 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 87,80 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.425,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 182,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,62 / L', change: '-0,1% no último dia' },
  ],
  df: [
    { name: 'Soja', price: 'R$ 207,20 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 89,00 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.435,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 186,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,72 / L', change: '-0,1% no último dia' },
  ],
  es: [
    { name: 'Soja', price: 'R$ 207,00 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 88,80 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.430,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 185,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,72 / L', change: '-0,1% no último dia' },
  ],
  go: [
    { name: 'Soja', price: 'R$ 205,70 / sc', change: '+0,5% no último dia' },
    { name: 'Milho', price: 'R$ 87,50 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.420,00 / sac', change: '-0,4% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 184,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,75 / L', change: '-0,2% no último dia' },
  ],
  ma: [
    { name: 'Soja', price: 'R$ 203,80 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 86,90 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.410,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 183,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,65 / L', change: '-0,1% no último dia' },
  ],
  mt: [
    { name: 'Soja', price: 'R$ 206,80 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 88,10 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.430,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 186,00 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,78 / L', change: '-0,2% no último dia' },
  ],
  ms: [
    { name: 'Soja', price: 'R$ 206,20 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 87,80 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.425,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 185,00 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,76 / L', change: '-0,2% no último dia' },
  ],
  mg: [
    { name: 'Soja', price: 'R$ 206,00 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 88,40 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.430,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 185,00 / sac', change: '+0,5% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,70 / L', change: '-0,1% no último dia' },
  ],
  pa: [
    { name: 'Soja', price: 'R$ 205,40 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 87,90 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.425,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 184,50 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,70 / L', change: '-0,2% no último dia' },
  ],
  pb: [
    { name: 'Soja', price: 'R$ 203,90 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 87,00 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.415,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 183,50 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,68 / L', change: '-0,1% no último dia' },
  ],
  pe: [
    { name: 'Soja', price: 'R$ 204,30 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 87,40 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.420,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 184,00 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,69 / L', change: '-0,1% no último dia' },
  ],
  pi: [
    { name: 'Soja', price: 'R$ 203,60 / sc', change: '+0,5% no último dia' },
    { name: 'Milho', price: 'R$ 86,80 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.410,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 183,20 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,66 / L', change: '-0,1% no último dia' },
  ],
  rj: [
    { name: 'Soja', price: 'R$ 207,50 / sc', change: '+0,8% no último dia' },
    { name: 'Milho', price: 'R$ 89,40 / sc', change: '+1,1% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.440,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 186,50 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,74 / L', change: '-0,1% no último dia' },
  ],
  rn: [
    { name: 'Soja', price: 'R$ 204,80 / sc', change: '+0,7% no último dia' },
    { name: 'Milho', price: 'R$ 87,60 / sc', change: '+1,0% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.418,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 183,80 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,67 / L', change: '-0,2% no último dia' },
  ],
  ro: [
    { name: 'Soja', price: 'R$ 204,00 / sc', change: '+0,5% no último dia' },
    { name: 'Milho', price: 'R$ 86,90 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.415,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 182,50 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,60 / L', change: '-0,1% no último dia' },
  ],
  rr: [
    { name: 'Soja', price: 'R$ 204,20 / sc', change: '+0,5% no último dia' },
    { name: 'Milho', price: 'R$ 86,95 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.418,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 182,80 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,62 / L', change: '-0,1% no último dia' },
  ],
  sc: [
    { name: 'Soja', price: 'R$ 209,90 / sc', change: '+0,8% no último dia' },
    { name: 'Milho', price: 'R$ 90,10 / sc', change: '+1,2% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.460,00 / sac', change: '-0,4% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 191,00 / sac', change: '+0,4% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,88 / L', change: '-0,2% no último dia' },
  ],
  sp: [
    { name: 'Soja', price: 'R$ 208,50 / sc', change: '+0,8% no último dia' },
    { name: 'Milho', price: 'R$ 90,20 / sc', change: '+1,1% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.450,00 / sac', change: '-0,4% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 190,00 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,85 / L', change: '-0,2% no último dia' },
  ],
  se: [
    { name: 'Soja', price: 'R$ 203,70 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 86,70 / sc', change: '+0,9% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.413,00 / sac', change: '-0,3% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 183,20 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,67 / L', change: '-0,1% no último dia' },
  ],
  to: [
    { name: 'Soja', price: 'R$ 204,40 / sc', change: '+0,6% no último dia' },
    { name: 'Milho', price: 'R$ 86,80 / sc', change: '+0,8% no último dia' },
    { name: 'Semente híbrida', price: 'R$ 1.415,00 / sac', change: '-0,2% na semana' },
    { name: 'Adubo NPK 20-05-20', price: 'R$ 182,70 / sac', change: '+0,3% no mês' },
    { name: 'Diesel S10', price: 'R$ 6,65 / L', change: '-0,1% no último dia' },
  ],
};

function getCityOptions(state) {
  return citiesByState[state] || citiesByState.sp || [];
}

function getSelectedCity() {
  const selectedState = stateSelect?.value || 'sp';
  const cityValue = citySelect?.value;
  return getCityOptions(selectedState).find(city => city.value === cityValue)
    || getCityOptions(selectedState)[0]
    || { value: '', label: 'Cidade não selecionada' };
}

function updateCitySelectOptions(state) {
  if (!citySelect) return;
  const cities = getCityOptions(state);
  citySelect.innerHTML = cities
    .map(city => `<option value="${city.value}">${city.label}</option>`)
    .join('');
}

function getCurrentPrices() {
  const selectedState = stateSelect?.value || 'sp';
  return priceDataByState[selectedState] || priceDataByState.sp;
}

function updatePriceLocation() {
  const selectedState = stateSelect?.value || 'sp';
  const selectedCity = getSelectedCity();

  if (priceLocationText) {
    priceLocationText.textContent = `Preços para ${selectedCity.label}, ${stateNames[selectedState] || 'Brasil'}`;
  }
}

function renderProductPrices() {
  const priceList = document.getElementById('price-list');
  if (!priceList) return;

  priceList.innerHTML = getCurrentPrices()
    .map(product => `
      <div class="product-card card">
        <h3>${product.name}</h3>
        <p class="price-value">${product.price}</p>
        <p class="price-change">${product.change}</p>
      </div>
    `)
    .join('');

  if (priceUpdatedText) {
    priceUpdatedText.textContent = `Preços atualizados em ${getTodayFormatted()}`;
  }

  updatePriceLocation();
}

async function abrirMapa() {
  resultadoTitulo.textContent = 'Waze';
  resultadoTexto.textContent = 'Buscando sua localização para abrir o Waze no ponto correto.';
  if (forecastContainer) forecastContainer.innerHTML = '';
  resultadoBox.hidden = false;
  scrollToResultado();

  const wazeWindow = window.open(WAZE_MAP_URL, '_blank', 'noopener,noreferrer');

  try {
    const { latitude, longitude } = await obterLocalizacao();
    const wazeUrl = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    if (wazeWindow) {
      wazeWindow.location.href = wazeUrl;
    } else {
      window.open(wazeUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    if (!wazeWindow) {
      window.open(WAZE_MAP_URL, '_blank', 'noopener,noreferrer');
    }
  }
}

if (buttons.carbono) {
  buttons.carbono.addEventListener('click', scrollToCalculator);
}

if (carbonForm) {
  carbonForm.addEventListener('submit', calcularCarbono);
}

if (buttons.previsao) {
  buttons.previsao.addEventListener('click', verPrevisao);
}

if (buttons.mapa) {
  buttons.mapa.addEventListener('click', abrirMapa);
}

if (navHome) {
  navHome.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToInicio();
  });
}

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', toggleTheme);
}

if (stateSelect) {
  stateSelect.addEventListener('change', () => {
    updateCitySelectOptions(stateSelect.value);
    renderProductPrices();
  });
}

if (citySelect) {
  citySelect.addEventListener('change', renderProductPrices);
}

loadTheme();
updateCitySelectOptions(stateSelect?.value || 'sp');
renderProductPrices();
