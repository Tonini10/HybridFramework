// ================================================
// Sección 4: Orquestación de Pruebas Combinatorias
// ================================================
 
var {
  generarCombinaciones,
  priorizarPorRiesgo,
  crearModeloPrediccion,
  orquestar
} = require('../src/combinatorial');
 
// ================================================
// 1. GENERACIÓN DE CASOS COMBINATORIOS
// ================================================
describe('1. Generacion de casos combinatorios', function () {
 
  it('genera todas las combinaciones posibles de parametros', function () {
    var parametros = {
      entrada: [0, -1, 100],
      modo:    ['estricto', 'flexible']
    };
    var casos = generarCombinaciones(parametros);
    expect(casos.length).toBe(6);
  });
 
  it('cada combinacion contiene todas las claves del esquema', function () {
    var parametros = {
      tipo:   ['string', 'numero'],
      valido: [true, false]
    };
    var casos = generarCombinaciones(parametros);
    casos.forEach(function (caso) {
      expect(caso.hasOwnProperty('tipo')).toBe(true);
      expect(caso.hasOwnProperty('valido')).toBe(true);
    });
  });
 
});
 
// ================================================
// 2. PRIORIZACIÓN POR NIVEL DE RIESGO
// ================================================
describe('2. Priorizacion por nivel de riesgo', function () {
 
  it('ordena los casos de mayor a menor riesgo', function () {
    var casos = [
      { nombre: 'C', riesgo: 'bajo'  },
      { nombre: 'A', riesgo: 'alto'  },
      { nombre: 'B', riesgo: 'medio' }
    ];
    var priorizados = priorizarPorRiesgo(casos);
    expect(priorizados[0].riesgo).toBe('alto');
    expect(priorizados[1].riesgo).toBe('medio');
    expect(priorizados[2].riesgo).toBe('bajo');
  });
 
  it('no modifica el arreglo original', function () {
    var casos = [
      { riesgo: 'bajo'  },
      { riesgo: 'alto'  }
    ];
    priorizarPorRiesgo(casos);
    expect(casos[0].riesgo).toBe('bajo');
  });
 
});
 
// ================================================
// 3. MODELO DE PREDICCIÓN
// ================================================
describe('3. Modelo de prediccion basado en historial', function () {
 
  var modelo;
 
  beforeEach(function () {
    modelo = crearModeloPrediccion();
  });
 
  it('retorna sin datos cuando no hay historial previo', function () {
    var prediccion = modelo.predecir({ entrada: 0 });
    expect(prediccion.confianza).toBe('sin datos');
    expect(prediccion.propensoAFallar).toBe(false);
  });
 
  it('detecta un caso propenso a fallar con mayoria de fallos', function () {
    var caso = { entrada: -1 };
    modelo.registrarEjecucion(caso, false);
    modelo.registrarEjecucion(caso, false);
    modelo.registrarEjecucion(caso, false);
    modelo.registrarEjecucion(caso, true);
    var prediccion = modelo.predecir(caso);
    expect(prediccion.propensoAFallar).toBe(true);
  });
 
});
 
// ================================================
// 4. ORQUESTADOR PRINCIPAL
// ================================================
describe('4. Orquestador principal', function () {
 
  it('genera y prioriza combinaciones con evaluador de riesgo', function () {
    var parametros = {
      valor: [-1, 0, 50],
      modo:  ['estricto', 'flexible']
    };
    var resultado = orquestar(parametros, [], function (caso) {
      return caso.valor < 0 ? 'alto' : 'bajo';
    });
    expect(resultado.totalCasos).toBe(6);
    expect(resultado.casos[0].caso.riesgo).toBe('alto');
  });
 
  it('funciona sin historial ni evaluador de riesgo', function () {
    var resultado = orquestar({ x: [1, 2], y: ['a', 'b'] }, [], null);
    expect(resultado.totalCasos).toBe(4);
  });
 
});
 