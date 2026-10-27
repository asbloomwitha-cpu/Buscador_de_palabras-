import './style.css';
import Swal from 'sweetalert2';



let formulario = document.getElementById('form-busqueda');
let cajaTexto = document.getElementById('texto');
let cajaPalabra = document.getElementById('termino');
let botonLimpiar = document.getElementById('limpiar');
let resultadoConteo = document.getElementById('conteo');
let textoResultado = document.getElementById('texto-procesado');
let botonReemplazar = document.getElementById('reemplazar');
let cajaReemplazo = document.getElementById('termino-reemplazo');

function hacerBusqueda(evento) {
    evento.preventDefault();

    let texto = cajaTexto.value;
    let palabra = quitarEspacios(cajaPalabra.value);
    let textoVacio = quitarEspacios(texto);

    if (textoVacio === '' || palabra === '') {
        Swal.fire('¡Faltan datos!', 'Escribe el texto y la palabra que quieres buscar.', 'warning');
        return;
    }

    let cantidad = marcarCoincidencias(texto, palabra);

    if (cantidad === 1) {
        resultadoConteo.textContent = '¡Encontré la palabra 1 vez!';
    } else {
        resultadoConteo.textContent = '¡Encontré la palabra ' + cantidad + ' veces!';
    }
}

function quitarEspacios(texto) {
    let inicio = 0;
    let final = texto.length;

    while (inicio < final && esEspacio(texto[inicio])) {
        inicio = inicio + 1;
    }

    while (final > inicio && esEspacio(texto[final - 1])) {
        final = final - 1;
    }

    return texto.substring(inicio, final);
}

function esEspacio(caracter) {
    return caracter === ' ' || caracter === '\n' || caracter === '\r' || caracter === '\t';
}

function marcarCoincidencias(texto, palabra) {
    let textoHTML = '';
    let cantidad = 0;
    let posicion = 0;
    let letrasTexto = texto.split('');
    let letrasPalabra = palabra.toLowerCase().split('');

    while (posicion <= letrasTexto.length - letrasPalabra.length) {
        let parteTexto = letrasTexto.slice(posicion, posicion + letrasPalabra.length);

        let coincide = parteTexto.every(function (letra, indice) {
            return letra.toLowerCase() === letrasPalabra[indice];
        });

        if (coincide) {
            let palabraResaltada = '';

            for (let indice = 0; indice < parteTexto.length; indice = indice + 1) {
                palabraResaltada = palabraResaltada + parteTexto[indice];
            }

            textoHTML = textoHTML + '<mark>' + textoSeguro(palabraResaltada) + '</mark>';
            cantidad = cantidad + 1;
            posicion = posicion + letrasPalabra.length;
        } else {
            textoHTML = textoHTML + textoSeguro(letrasTexto[posicion]);
            posicion = posicion + 1;
        }
    }

    while (posicion < letrasTexto.length) {
        textoHTML = textoHTML + textoSeguro(letrasTexto[posicion]);
        posicion = posicion + 1;
    }

    textoResultado.innerHTML = textoHTML;
    return cantidad;
}

function textoSeguro(texto) {
    let textoHTML = '';

    for (let posicion = 0; posicion < texto.length; posicion = posicion + 1) {
        if (texto[posicion] === '&') {
            textoHTML = textoHTML + '&amp;';
        } else if (texto[posicion] === '<') {
            textoHTML = textoHTML + '&lt;';
        } else if (texto[posicion] === '>') {
            textoHTML = textoHTML + '&gt;';
        } else {
            textoHTML = textoHTML + texto[posicion];
        }
    }

    return textoHTML;
}

function limpiarPantalla() {
    cajaTexto.value = '';
    cajaPalabra.value = '';
    cajaReemplazo.value = '';
    textoResultado.textContent = '';
    resultadoConteo.textContent = '¡Listo! Aquí aparecerá tu búsqueda.';
}

function reemplazarPalabras() {
    let palabra = cajaPalabra.value.trim();
    if (!palabra) {
        Swal.fire('¡Faltan datos!', 'Escribe la palabra a buscar para poder reemplazarla.', 'warning');
        return;
    }
    cajaTexto.value = cajaTexto.value.replaceAll(
        palabra, 
        cajaReemplazo.value
    );
}

formulario.addEventListener('submit', hacerBusqueda);
botonLimpiar.addEventListener('click', limpiarPantalla);
botonReemplazar.addEventListener('click', reemplazarPalabras);
