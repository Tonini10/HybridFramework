// REPORTE GLOBAL DEL SISTEMA
// ================================================
// Sección 7: Modelo Predictivo Personalizado
// ================================================
 
// ------------------------------------------------
// 1. DATOS HISTÓRICOS
// Registra ejecuciones pasadas por módulo:
// fallos, tiempo de prueba y complejidad
// ------------------------------------------------
function crearHistorial() {
  var registros = {}; // { [modulo]: [{ fallos, tiempo, complejidad }] }
 
  function registrar(modulo, entrada) {
    if (!registros[modulo]) registros[modulo] = [];
    registros[modulo].push(entrada);
  }
 
  function obtener(modulo) {
    return registros[modulo] || [];
  }
 
  function todos() {
    return Object.assign({}, registros);
  }
 
  return { registrar, obtener, todos };
}
 
// ------------------------------------------------
// 2. MÉTRICAS DE COMPLEJIDAD
// Calcula un índice de complejidad del módulo
// combinando complejidad ciclomática, líneas de
// código y número de dependencias
// ------------------------------------------------
function calcularIndiceComplejidad(ciclomatica, lineas, dependencias) {
  // Pesos: ciclomática tiene más impacto que dependencias
  var indice = (ciclomatica * 0.5) + (lineas / 100 * 0.3) + (dependencias * 0.2);
  return parseFloat(indice.toFixed(4));
}
 
// ------------------------------------------------
// 3. PATRONES DE USO
// Analiza con qué frecuencia se ejecuta un módulo
// y calcula su tasa de uso normalizada (0 a 1)
// ------------------------------------------------
function calcularPatronUso(ejecuciones, totalEjecuciones) {
  if (totalEjecuciones === 0) return 0;
  return parseFloat((ejecuciones / totalEjecuciones).toFixed(4));
}
 
// ------------------------------------------------
// 4. ENFOQUE LOGARÍTMICO (modelo Musa-Okumoto)
// Estima la confiabilidad usando decrecimiento
// logarítmico de la tasa de fallos con el tiempo
// R(t) = exp(-λ₀ / θ * (e^(θt) - 1))
// Simplificado: R = 1 - ln(1 + fallos) / ln(1 + maxFallos)
// ------------------------------------------------
function modeloLogaritmico(fallosAcumulados, maxFallosEsperados) {
  if (maxFallosEsperados <= 0) return 1;
  var confiabilidad = 1 - Math.log(1 + fallosAcumulados) / Math.log(1 + maxFallosEsperados);
  return parseFloat(Math.max(0, Math.min(1, confiabilidad)).toFixed(4));
}
 
// ------------------------------------------------
// 5. ENFOQUE ESTOCÁSTICO (cadena de Markov simple)
// Modela la confiabilidad como una probabilidad
// de transición entre estados: OK → FALLO
// basada en la tasa histórica de fallos
// ------------------------------------------------
function modeloEstocastico(historial) {
  if (!historial || historial.length === 0) return 1;
 
  var totalEjecuciones = historial.length;
  var totalFallos = historial.reduce(function(acc, h) { return acc + h.fallos; }, 0);
 
  // Probabilidad de NO fallar en la próxima ejecución
  var tasaFallo = totalFallos / totalEjecuciones;
  var confiabilidad = Math.exp(-tasaFallo);
  return parseFloat(Math.max(0, Math.min(1, confiabilidad)).toFixed(4));
}
 
// ------------------------------------------------
// 6. PREDICCIÓN INTEGRADA POR MÓDULO
// Combina los tres enfoques con pesos configurables
// para producir una predicción final por módulo
// ------------------------------------------------
function predecirModulo(modulo, historial, metricas, pesos) {
  pesos = pesos || { logaritmico: 0.4, estocastico: 0.4, complejidad: 0.2 };
 
  // Calcular componentes
  var fallosAcumulados = historial.reduce(function(a, h) { return a + h.fallos; }, 0);
  var maxEsperados     = historial.length * 5; // máximo teórico: 5 fallos por ejecución
 
  var rLog  = modeloLogaritmico(fallosAcumulados, maxEsperados);
  var rEsto = modeloEstocastico(historial);
 
  // Índice de complejidad convertido a factor de confiabilidad (inverso normalizado)
  var indice   = calcularIndiceComplejidad(metricas.ciclomatica, metricas.lineas, metricas.dependencias);
  var rComplej = parseFloat(Math.max(0, 1 - indice / 10).toFixed(4));
 
  // Predicción combinada ponderada
  var prediccion = (rLog * pesos.logaritmico) + (rEsto * pesos.estocastico) + (rComplej * pesos.complejidad);
  prediccion = parseFloat(Math.min(1, Math.max(0, prediccion)).toFixed(4));
 
  var nivel;
  if (prediccion >= 0.85)      nivel = 'Alta';
  else if (prediccion >= 0.65) nivel = 'Media';
  else                          nivel = 'Baja';
 
  return {
    modulo:          modulo,
    confiabilidad:   prediccion,
    porcentaje:      Math.round(prediccion * 100) + '%',
    nivel:           nivel,
    componentes: {
      logaritmico:  rLog,
      estocastico:  rEsto,
      complejidad:  rComplej
    }
  };
}
 
// ------------------------------------------------
// 7. REPORTE GLOBAL DEL SISTEMA
// Agrega las predicciones de todos los módulos
// y calcula la confiabilidad global del sistema
// ------------------------------------------------
function reporteGlobal(predicciones) {
  var total = predicciones.length;
  if (total === 0) return { confiabilidadGlobal: 0, nivel: 'Sin datos', modulos: [] };
 
  // Confiabilidad del sistema = producto de confiabilidades individuales
  var global = predicciones.reduce(function(acc, p) { return acc * p.confiabilidad; }, 1);
  global = parseFloat(global.toFixed(4));
 
  var nivel;
  if (global >= 0.85)      nivel = 'Alta';
  else if (global >= 0.65) nivel = 'Media';
  else                      nivel = 'Baja';
 
  return {
    confiabilidadGlobal: global,
    porcentajeGlobal:    Math.round(global * 100) + '%',
    nivel:               nivel,
    totalModulos:        total,
    modulosEnRiesgo:     predicciones.filter(function(p) { return p.nivel === 'Baja'; }).length,
    modulos:             predicciones
  };
}
 
module.exports = {
  crearHistorial,
  calcularIndiceComplejidad,
  calcularPatronUso,
  modeloLogaritmico,
  modeloEstocastico,
  predecirModulo,
  reporteGlobal
};
 