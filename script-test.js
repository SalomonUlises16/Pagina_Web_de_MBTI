const preguntas = [
    { id: 1, texto: "¿Qué tan rápido notas los cambios a tu alrededor, como ruidos, movimientos o expresiones faciales?", funcion: "SE" },
    { id: 2, texto: "Cuando entras a un lugar nuevo, ¿te das cuenta enseguida de los detalles físicos (colores, sonidos, texturas)?", funcion: "SE" },
    // ... el resto de las preguntas van acá pero no las terminé de colocar porque tengo sueño xd
    { id: 120, texto: "¿Tiendes a explicar las cosas con diagramas, esquemas o estructuras jerárquicas?", funcion: "TI" }
];

let preguntaActual = 0;
let respuestas = new Array(preguntas.length).fill(null);

const instruccionesTest = document.getElementById('instrucciones-test');
const cuestionario = document.getElementById('cuestionario');
const textoPregunta = document.getElementById('texto-pregunta');
const escalaLikert = document.getElementById('escala-likert');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const barraProgreso = document.getElementById('barra-progreso');
const textoProgreso = document.getElementById('texto-progreso');
const btnComenzarTest = document.getElementById('comenzar-test');
const seccionResultados = document.getElementById('seccion-resultados');
const resultadoMbti = document.getElementById('resultado-mbti');
const descripcionTipo = document.getElementById('descripcion-tipo');
const btnRepetirTest = document.getElementById('repetir-test');

function iniciarTest() {
    instruccionesTest.style.display = 'none';
    cuestionario.style.display = 'block';
    cargarPregunta(preguntaActual);
    actualizarProgreso();
}

function cargarPregunta(indice) {
    textoPregunta.textContent = preguntas[indice].texto;
    escalaLikert.innerHTML = '';
    const opciones = ["Muy en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Muy de acuerdo"];
    
    opciones.forEach((opcion, i) => {
        const divOpcion = document.createElement('div');
        divOpcion.className = 'opcion-likert';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'opcion-likert';
        input.value = i + 1;
        input.id = `opcion-${i}`;

        if (respuestas[indice] === i + 1) {
            input.checked = true;
        }

        input.addEventListener('change', () => {
            respuestas[indice] = i + 1;
        });
        
        const etiqueta = document.createElement('label');
        etiqueta.htmlFor = `opcion-${i}`;
        etiqueta.textContent = opcion;
        divOpcion.appendChild(input);
        divOpcion.appendChild(etiqueta);
        escalaLikert.appendChild(divOpcion);
    });
    
    btnAnterior.disabled = indice === 0;
    
    if (indice === preguntas.length - 1) {
        btnSiguiente.textContent = 'Finalizar';
        btnSiguiente.removeEventListener('click', siguientePregunta);
        btnSiguiente.addEventListener('click', finalizarTest);
    } else {
        btnSiguiente.textContent = 'Siguiente';
        btnSiguiente.removeEventListener('click', finalizarTest);
        btnSiguiente.addEventListener('click', siguientePregunta);
    }
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        cargarPregunta(preguntaActual);
        actualizarProgreso();
    }
}

function preguntaAnterior() {
    if (preguntaActual > 0) {
        preguntaActual--;
        cargarPregunta(preguntaActual);
        actualizarProgreso();
    }
}

function actualizarProgreso() {
    const respondidas = respuestas.filter(r => r !== null).length;
    const progreso = (respondidas / preguntas.length) * 100;
    barraProgreso.style.width = `${progreso}%`;
    textoProgreso.textContent = `${Math.round(progreso)}%`;
}

function finalizarTest() {
    const puntuacionesFunciones = {"SE": 0, "SI": 0, "NE": 0, "NI": 0, "FE": 0, "FI": 0, "TE": 0, "TI": 0};
    
    preguntas.forEach((p, i) => {
        if (respuestas[i] !== null) {
            puntuacionesFunciones[p.funcion] += respuestas[i];
        }
    });
    
    const e_i = puntuacionesFunciones.SE + puntuacionesFunciones.NE + puntuacionesFunciones.FE + puntuacionesFunciones.TE > puntuacionesFunciones.SI + puntuacionesFunciones.NI + puntuacionesFunciones.FI + puntuacionesFunciones.TI ? "E" : "I";
    const s_n = puntuacionesFunciones.SE + puntuacionesFunciones.SI > puntuacionesFunciones.NE + puntuacionesFunciones.NI ? "S" : "N";
    const t_f = puntuacionesFunciones.TE + puntuacionesFunciones.TI > puntuacionesFunciones.FE + puntuacionesFunciones.FI ? "T" : "F";
    const j_p = (e_i === "E" ? puntuacionesFunciones.TE + puntuacionesFunciones.FE : puntuacionesFunciones.TI + puntuacionesFunciones.FI) > (e_i === "E" ? puntuacionesFunciones.SE + puntuacionesFunciones.NE : puntuacionesFunciones.SI + puntuacionesFunciones.NI) ? "J" : "P";
    const tipoMbti = e_i + s_n + t_f + j_p;
    resultadoMbti.textContent = tipoMbti;
    descripcionTipo.textContent = `La descripción detallada del tipo ${tipoMbti} aparecerá aquí.`;
    cuestionario.style.display = 'none';
    seccionResultados.style.display = 'block';
    const seccionResultadosContenedor = document.getElementById('resultados');
    seccionResultadosContenedor.scrollIntoView({ behavior: 'smooth' });
}

btnComenzarTest.addEventListener('click', iniciarTest);
btnAnterior.addEventListener('click', preguntaAnterior);
btnSiguiente.addEventListener('click', siguientePregunta);

btnRepetirTest.addEventListener('click', () => {
    respuestas = new Array(preguntas.length).fill(null);
    preguntaActual = 0;
    seccionResultados.style.display = 'none';
    instruccionesTest.style.display = 'block';
});