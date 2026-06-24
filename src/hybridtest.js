// ================================================
// HybridTest - Mini framework híbrido sobre Jasmine
// ================================================
 
// ------------------------------------------------
// 1. PRUEBAS DE INTEGRACIÓN AUTOMÁTICA
// ------------------------------------------------
function autoWire(modulos) {
  var instancias = {};
  modulos.forEach(function (mod) {
    var deps = mod.deps.map(function (d) { return instancias[d]; });
    instancias[mod.nombre] = new mod.clase(...deps);
  });
  return instancias;
}
 
// ------------------------------------------------
// 2. MOCKING AVANZADO CON ESPÍAS PERSONALIZADOS
// ------------------------------------------------
function crearEspia(nombre) {
  var historial = [];
  var valorRetorno = undefined;
  var errorALanzar = null;
 
  function espia() {
    if (errorALanzar) throw errorALanzar;
    var registro = { args: Array.from(arguments), resultado: valorRetorno };
    historial.push(registro);
    return valorRetorno;
  }
 
  espia.nombre       = nombre;
  espia.historial    = historial;
  espia.vecesLlamado = function () { return historial.length; };
  espia.ultimosArgs  = function () { return historial.length ? historial[historial.length - 1].args : null; };
  espia.retornar     = function (val) { valorRetorno = val; return espia; };
  espia.lanzarError  = function (err) { errorALanzar = err; return espia; };
  espia.reiniciar    = function () { historial.length = 0; };
 
  return espia;
}
 
// ------------------------------------------------
// 3. GENERACIÓN AUTOMÁTICA DE PRUEBAS POR TIPOS
// ------------------------------------------------
function validar(datos, esquema) {
  if (datos === null || datos === undefined) {
    throw new Error('Los datos no pueden ser nulos');
  }
  Object.keys(esquema).forEach(function (campo) {
    var valor = datos[campo];
    var regla = esquema[campo];
 
    if (valor === null || valor === undefined) {
      throw new Error('El campo ' + campo + ' es requerido');
    }
    if (regla.tipo === 'string' && typeof valor !== 'string') {
      throw new Error(campo + ' debe ser texto');
    }
    if (regla.tipo === 'numero' && (typeof valor !== 'number' || isNaN(valor))) {
      throw new Error(campo + ' debe ser número');
    }
    if (regla.tipo === 'numero' && regla.min !== undefined && valor < regla.min) {
      throw new Error(campo + ' es menor al mínimo permitido');
    }
    if (regla.tipo === 'string' && regla.minLen && valor.length < regla.minLen) {
      throw new Error(campo + ' es demasiado corto');
    }
  });
}
 
// ------------------------------------------------
// 4. BÚSQUEDA BINARIA
// ------------------------------------------------
// Busca un valor en un arreglo ordenado.
// Retorna el índice si lo encuentra, o -1 si no está.
function busquedaBinaria(arreglo, objetivo) {
  var inicio = 0;
  var fin = arreglo.length - 1;
 
  while (inicio <= fin) {
    var medio = Math.floor((inicio + fin) / 2);
 
    if (arreglo[medio] === objetivo) {
      return medio;
    } else if (arreglo[medio] < objetivo) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }
 
  return -1;
}
 
module.exports = { autoWire, crearEspia, validar, busquedaBinaria };