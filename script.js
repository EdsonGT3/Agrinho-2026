// Função para calcular o Score Verde do Agricultor
function calcularScore() {
    // Simulando uma coleta de dados (isso poderia vir de um formulário)
    // No futuro, você pode criar campos <input> no HTML para o usuário preencher
    let praticasSustentaveis = {
        plantioDireto: true, // +30 pontos
        reusoAgua: true,     // +30 pontos
        reservaLegal: true,  // +40 pontos
    };

    let scoreFinal = 0;

    if (praticasSustentaveis.plantioDireto) scoreFinal += 30;
    if (praticasSustentaveis.reusoAgua) scoreFinal += 30;
    if (praticasSustentaveis.reservaLegal) scoreFinal += 40;

    // Atualiza o valor na tela
    const elementoScore = document.querySelector('.score-valor');
    
    if (elementoScore) {
        elementoScore.innerText = `${scoreFinal}/100`;
        
        // Muda a cor baseado no resultado
        if (scoreFinal >= 70) {
            elementoScore.style.color = "#2d6a4f"; // Verde forte
        } else {
            elementoScore.style.color = "#e67e22"; // Laranja
        }
    }

    alert("Cálculo de sustentabilidade atualizado com sucesso!");
}

// Evento para o botão da "Calculadora de Carbono" que já está no seu HTML
document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.querySelector('.btn'); // Pega o primeiro botão do site
    
    if (btnCalcular) {
        btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            calcularScore();
        });
    }
});