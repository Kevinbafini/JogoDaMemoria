const cartas = [
    { nome: "bola", img: "img/bola.jpeg" },
    { nome: "carro", img: "img/carro.jpeg" },
    { nome: "girafa", img: "img/girafa.png" },
    { nome: "lapis", img: "img/lapis.png" },
    { nome: "livro", img: "img/livro.png" },
    { nome: "maca", img: "img/maca.png" },
    { nome: "palmeira", img: "img/palmeira.avif" },
    { nome: "pipa", img: "img/pipa.png" },
];

const jogoDaMemoria = document.getElementById('jogo-da-memoria');
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const somAcerto = document.getElementById('som-acerto');
const somErro = document.getElementById('som-erro');

let cartaVirada = false;
let travarTabuleiro = false;
let primeiraCarta, segundaCarta;
let paresEncontrados = 0;

btnIniciar.addEventListener('click', iniciarJogo);
btnReiniciar.addEventListener('click', reiniciarJogo);

function iniciarJogo() {
    telaInicial.classList.add('esconder');
    setTimeout(() => {
        telaInicial.classList.add('escondido');
        telaJogo.classList.add('ativo');
        criarCartas();
    }, 500); // Tempo da transição
}

function reiniciarJogo() {
    window.location.reload();
}


function criarCartas() {
    const duplicarCartas = [...cartas, ...cartas];
    embaralhar(duplicarCartas);
    duplicarCartas.forEach(carta => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('carta-memoria');
        cardElement.dataset.framework = carta.nome;
        
        cardElement.innerHTML = `
            <img class="frente" src="${carta.img}" alt="${carta.nome}">
            <img class="verso" src="img/img_frente.png" alt="Carta de Memória">
        `;
        cardElement.addEventListener('click', virarCarta);
        jogoDaMemoria.appendChild(cardElement);
    });
}

function virarCarta() {
    if (travarTabuleiro) return;
    if (this === primeiraCarta) return;

    this.classList.add('virada');

    if (!cartaVirada) {
        cartaVirada = true;
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    verificarPar();
}

function verificarPar() {
    let ehPar = primeiraCarta.dataset.framework === segundaCarta.dataset.framework;
    ehPar ? desativarCartas() : desvirarCartas();
}

function desativarCartas() {
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);

    somAcerto.play();
    paresEncontrados++;

    if (paresEncontrados === cartas.length) {
        soltarConfetes();
        setTimeout(() => {
            btnReiniciar.classList.remove('escondido');
        }, 3000);
        return;
    }

    resetarTabuleiro();
}

function desvirarCartas() {
    travarTabuleiro = true;

    setTimeout(() => {
        primeiraCarta.classList.remove('virada');
        segundaCarta.classList.remove('virada');

        resetarTabuleiro();
    }, 1500);
}

function resetarTabuleiro() {
    [cartaVirada, travarTabuleiro] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function soltarConfetes() {
    var duration = 15 * 210;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
        }
        var particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
    }, 250);
}