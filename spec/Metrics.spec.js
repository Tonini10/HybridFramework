// ================================================
// Sección 3: Métricas Avanzadas de Calidad
// ================================================
 
var metrics = require('../src/metrics');
 
// ================================================
// 1. COMPLEJIDAD CICLOMÁTICA
// ================================================
describe('1. Complejidad ciclomatica', function () {
 
  it('calcula la complejidad segun las decisiones del codigo', function () {
    var codigo = 'function buscar(arr, x) { if (x > 0) { for (var i = 0; i < arr.length; i++) { if (arr[i] === x) return i; } } return -1; }';
    var complejidad = metrics.calcularComplejidad(codigo);
    expect(complejidad).toBeGreaterThan(1); // tiene decisiones, no puede ser 1
    expect(typeof complejidad).toBe('number');
  });
 
});
 
// ================================================
// 2. DETECCIÓN DE PRUEBAS INESTABLES
// ================================================
describe('2. Deteccion de flaky tests', function () {
 
  it('identifica una prueba estable que siempre pasa', function () {
    var resultado = metrics.detectarFlakyTest('prueba estable', function () {
      // prueba que siempre pasa
      if (2 + 2 !== 4) throw new Error('fallo');
    }, 10);
 
    expect(resultado.esFlaky).toBe(false);
    expect(resultado.pasadas).toBe(10);
    expect(resultado.estabilidad).toBe('100%');
  });
 
});
 
// ================================================
// 3. ANÁLISIS DE TIEMPO DE EJECUCIÓN
// ================================================
describe('3. Analisis de tiempo de ejecucion', function () {
 
  it('mide el tiempo y detecta si la prueba es lenta', function () {
    var resultado = metrics.medirTiempo('prueba rapida', function () {
      var suma = 0;
      for (var i = 0; i < 1000; i++) suma += i;
    });
 
    expect(resultado.exitoso).toBe(true);
    expect(resultado.tiempoMs).toBeGreaterThanOrEqual(0);
    expect(resultado.lento).toBe(false);
  });
 
});
 
// ================================================
// 4. COBERTURA VS DEFECTOS
// ================================================
describe('4. Cobertura vs defectos', function () {
 
  it('relaciona el porcentaje de cobertura con defectos encontrados', function () {
    var resultado = metrics.analizarCobertura(100, 85, 3);
 
    expect(resultado.porcentajeCobertura).toBe('85%');
    expect(resultado.nivelCobertura).toBe('Alta');
    expect(resultado.defectosEncontrados).toBe(3);
    expect(resultado.defectosPorCobertura).not.toBe('N/A');
  });
 
});
 