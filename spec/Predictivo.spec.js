// ================================================
// Sección 7: Modelo Predictivo Personalizado
// ================================================
 
var {
  crearHistorial,
  calcularIndiceComplejidad,
  calcularPatronUso,
  modeloLogaritmico,
  modeloEstocastico,
  predecirModulo,
  reporteGlobal
} = require('../src/predictivo');
 
// ================================================
// 1. HISTORIAL DE DATOS
// ================================================
describe('1. Historial de datos historicos', function () {
 
  it('registra y recupera entradas por modulo', function () {
    var h = crearHistorial();
    h.registrar('auth', { fallos: 2, tiempo: 10, complejidad: 3 });
    h.registrar('auth', { fallos: 0, tiempo: 8,  complejidad: 3 });
    expect(h.obtener('auth').length).toBe(2);
  });
 
  it('retorna arreglo vacio para modulos sin historial', function () {
    var h = crearHistorial();
    expect(h.obtener('pago').length).toBe(0);
  });
 
});
 
// ================================================
// 2. MÉTRICAS DE COMPLEJIDAD
// ================================================
describe('2. Metricas de complejidad', function () {
 
  it('calcula indice mayor cuando aumenta la complejidad ciclomatica', function () {
    var simple  = calcularIndiceComplejidad(2, 50, 1);
    var complejo = calcularIndiceComplejidad(8, 50, 1);
    expect(complejo).toBeGreaterThan(simple);
  });
 
  it('calcula patron de uso normalizado entre 0 y 1', function () {
    var uso = calcularPatronUso(30, 100);
    expect(uso).toBe(0.3);
    expect(uso).toBeGreaterThanOrEqual(0);
    expect(uso).toBeLessThanOrEqual(1);
  });
 
});
 
// ================================================
// 3. MODELO LOGARÍTMICO
// ================================================
describe('3. Modelo logaritmico', function () {
 
  it('retorna confiabilidad 1 cuando no hay fallos', function () {
    expect(modeloLogaritmico(0, 10)).toBe(1);
  });
 
  it('disminuye la confiabilidad al aumentar los fallos', function () {
    var pocosF  = modeloLogaritmico(2, 20);
    var muchosF = modeloLogaritmico(15, 20);
    expect(muchosF).toBeLessThan(pocosF);
  });
 
});
 
// ================================================
// 4. MODELO ESTOCÁSTICO
// ================================================
describe('4. Modelo estocastico', function () {
 
  it('retorna confiabilidad alta con historial sin fallos', function () {
    var historial = [
      { fallos: 0, tiempo: 5, complejidad: 2 },
      { fallos: 0, tiempo: 6, complejidad: 2 }
    ];
    expect(modeloEstocastico(historial)).toBe(1);
  });
 
  it('reduce la confiabilidad con historial de muchos fallos', function () {
    var historial = [
      { fallos: 3, tiempo: 5, complejidad: 4 },
      { fallos: 4, tiempo: 6, complejidad: 5 }
    ];
    expect(modeloEstocastico(historial)).toBeLessThan(0.5);
  });
 
});
 
// ================================================
// 5. PREDICCIÓN INTEGRADA POR MÓDULO
// ================================================
describe('5. Prediccion integrada por modulo', function () {
 
  it('produce prediccion con nivel Alto para modulo estable', function () {
    var historial = [
      { fallos: 0, tiempo: 5, complejidad: 2 },
      { fallos: 0, tiempo: 4, complejidad: 2 },
      { fallos: 0, tiempo: 6, complejidad: 2 }
    ];
    var metricas = { ciclomatica: 2, lineas: 40, dependencias: 1 };
    var resultado = predecirModulo('auth', historial, metricas);
    expect(resultado.nivel).toBe('Alta');
    expect(resultado.confiabilidad).toBeGreaterThan(0.8);
  });
 
  it('produce prediccion con nivel Bajo para modulo con muchos fallos', function () {
    var historial = [
      { fallos: 5, tiempo: 10, complejidad: 9 },
      { fallos: 4, tiempo: 12, complejidad: 9 },
      { fallos: 5, tiempo: 11, complejidad: 9 }
    ];
    var metricas = { ciclomatica: 10, lineas: 300, dependencias: 8 };
    var resultado = predecirModulo('pagos', historial, metricas);
    expect(resultado.nivel).toBe('Baja');
    expect(resultado.confiabilidad).toBeLessThan(0.5);
  });
 
});
 
// ================================================
// 6. REPORTE GLOBAL DEL SISTEMA
// ================================================
describe('6. Reporte global del sistema', function () {
 
  it('calcula confiabilidad global como producto de modulos', function () {
    var predicciones = [
      { modulo: 'auth',  confiabilidad: 0.95, porcentaje: '95%', nivel: 'Alta' },
      { modulo: 'pagos', confiabilidad: 0.90, porcentaje: '90%', nivel: 'Alta' }
    ];
    var reporte = reporteGlobal(predicciones);
    expect(reporte.confiabilidadGlobal).toBe(0.855);
    expect(reporte.nivel).toBe('Alta');
  });
 
  it('identifica modulos en riesgo dentro del reporte', function () {
    var predicciones = [
      { modulo: 'auth',  confiabilidad: 0.90, porcentaje: '90%', nivel: 'Alta' },
      { modulo: 'pagos', confiabilidad: 0.40, porcentaje: '40%', nivel: 'Baja' }
    ];
    var reporte = reporteGlobal(predicciones);
    expect(reporte.modulosEnRiesgo).toBe(1);
  });
 
});
 