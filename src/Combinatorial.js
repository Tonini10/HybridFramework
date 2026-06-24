// ================================================
// Sección 4: Orquestación de Pruebas Combinatorias
// ================================================
 
// ------------------------------------------------
// 1. GENERADOR DE CASOS COMBINATORIOS
// Genera todas las combinaciones posibles a partir
// de un objeto de parámetros con sus valores
// ------------------------------------------------
function generarCombinaciones(parametros) {
  var claves = Object.keys(parametros);
 
  if (claves.length === 0) return [{}];
 
  function combinar(indice, actual) {
    if (indice === claves.length) return [Object.assign({}, actual)];
 
    var clave = claves[indice];
    var valores = parametros[clave];
    var resultados = [];
 
    valores.forEach(function (valor) {
      actual[clave] = valor;
      var sub = combinar(indice + 1, actual);
      sub.forEach(function (c) { resultados.push(c); });
    });
 
    return resultados;
  }
 
  return combinar(0, {});
}
 
// ------------------------------------------------
// 2. PRIORIZADOR POR NIVEL DE RIESGO
// Ordena los casos de prueba según su nivel de
// riesgo: alto > medio > bajo
// Cada caso debe tener una propiedad 'riesgo'
// con valor: 'alto', 'medio' o 'bajo'
// ------------------------------------------------
var NIVEL_RIESGO = { alto: 3, medio: 2, bajo: 1 };
 
function priorizarPorRiesgo(casos) {
  return casos.slice().sort(function (a, b) {
    var pesoA = NIVEL_RIESGO[a.riesgo] || 0;
    var pesoB = NIVEL_RIESGO[b.riesgo] || 0;
    return pesoB - pesoA;
  });
}
 
// ------------------------------------------------
// 3. MODELO DE PREDICCIÓN (basado en historial)
// Aprende de ejecuciones previas calculando la
// tasa de fallo de cada caso. Predice si un caso
// es propenso a fallar según su historial.
// ------------------------------------------------
function crearModeloPrediccion() {
  var historial = {}; // { [idCaso]: { pasadas, falladas } }
 
  function _idCaso(caso) {
    return JSON.stringify(caso);
  }
 
  function registrarEjecucion(caso, paso) {
    var id = _idCaso(caso);
    if (!historial[id]) {
      historial[id] = { pasadas: 0, falladas: 0 };
    }
    if (paso) {
      historial[id].pasadas++;
    } else {
      historial[id].falladas++;
    }
  }
 
  function predecir(caso) {
    var id = _idCaso(caso);
    var registro = historial[id];
 
    if (!registro) {
      return {
        caso: caso,
        tasaFallo: 0,
        propensoAFallar: false,
        confianza: 'sin datos'
      };
    }
 
    var total = registro.pasadas + registro.falladas;
    var tasaFallo = registro.falladas / total;
 
    return {
      caso: caso,
      tasaFallo: parseFloat(tasaFallo.toFixed(2)),
      propensoAFallar: tasaFallo >= 0.5,
      confianza: total >= 5 ? 'alta' : 'baja'
    };
  }
 
  function obtenerHistorial() {
    return Object.assign({}, historial);
  }
 
  function reiniciar() {
    historial = {};
  }
 
  return {
    registrarEjecucion: registrarEjecucion,
    predecir: predecir,
    obtenerHistorial: obtenerHistorial,
    reiniciar: reiniciar
  };
}
 
// ------------------------------------------------
// 4. ORQUESTADOR PRINCIPAL
// Combina los tres sistemas: genera combinaciones,
// las prioriza y predice cuáles son riesgosas
// ------------------------------------------------
function orquestar(parametros, historialEjecuciones, opcionesRiesgo) {
  // Generar todos los casos
  var casos = generarCombinaciones(parametros);
 
  // Asignar riesgo si se provee una función evaluadora
  if (typeof opcionesRiesgo === 'function') {
    casos = casos.map(function (caso) {
      return Object.assign({}, caso, { riesgo: opcionesRiesgo(caso) });
    });
  }
 
  // Priorizar por riesgo
  var casosPriorizados = priorizarPorRiesgo(casos);
 
  // Aplicar predicciones del modelo
  var modelo = crearModeloPrediccion();
 
  if (historialEjecuciones && Array.isArray(historialEjecuciones)) {
    historialEjecuciones.forEach(function (entrada) {
      modelo.registrarEjecucion(entrada.caso, entrada.paso);
    });
  }
 
  var resultado = casosPriorizados.map(function (caso) {
    var prediccion = modelo.predecir(caso);
    return {
      caso: caso,
      prediccion: prediccion
    };
  });
 
  return {
    totalCasos: resultado.length,
    casos: resultado
  };
}
 
module.exports = {
  generarCombinaciones,
  priorizarPorRiesgo,
  crearModeloPrediccion,
  orquestar
};
 