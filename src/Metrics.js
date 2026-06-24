// ================================================
// Sección 3: Métricas Avanzadas de Calidad
// ================================================
 
// ------------------------------------------------
// 1. COMPLEJIDAD CICLOMÁTICA
// Cuenta cuántas decisiones tiene una función
// (if, for, while, case, &&, ||)
// ------------------------------------------------
function calcularComplejidad(codigoFuente) {
  var decisiones = [/\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\bcase\b/g, /&&/g, /\|\|/g];
  var total = 1; // base siempre es 1
  decisiones.forEach(function (patron) {
    var encontrados = codigoFuente.match(patron);
    if (encontrados) total += encontrados.length;
  });
  return total;
}
 
// ------------------------------------------------
// 2. DETECCIÓN DE PRUEBAS INESTABLES (FLAKY TESTS)
// Ejecuta una prueba varias veces y detecta si
// los resultados son inconsistentes
// ------------------------------------------------
function detectarFlakyTest(nombrePrueba, funcionPrueba, repeticiones) {
  repeticiones = repeticiones || 10;
  var resultados = [];
 
  for (var i = 0; i < repeticiones; i++) {
    try {
      funcionPrueba();
      resultados.push(true);
    } catch (e) {
      resultados.push(false);
    }
  }
 
  var pasadas  = resultados.filter(function (r) { return r === true; }).length;
  var falladas = repeticiones - pasadas;
  var esFlaky  = pasadas > 0 && falladas > 0;
 
  return {
    nombre:      nombrePrueba,
    repeticiones: repeticiones,
    pasadas:     pasadas,
    falladas:    falladas,
    esFlaky:     esFlaky,
    estabilidad: Math.round((pasadas / repeticiones) * 100) + '%'
  };
}
 
// ------------------------------------------------
// 3. ANÁLISIS DE TIEMPO DE EJECUCIÓN
// Mide cuánto tarda en ejecutarse una función
// ------------------------------------------------
function medirTiempo(nombrePrueba, funcionPrueba) {
  var inicio  = Date.now();
  var error   = null;
  var exitoso = true;
 
  try {
    funcionPrueba();
  } catch (e) {
    error   = e.message;
    exitoso = false;
  }
 
  var fin = Date.now();
 
  return {
    nombre:   nombrePrueba,
    tiempoMs: fin - inicio,
    exitoso:  exitoso,
    error:    error,
    lento:    (fin - inicio) > 100 // más de 100ms se considera lento
  };
}
 
// ------------------------------------------------
// 4. COBERTURA VS DEFECTOS
// Relaciona el porcentaje de cobertura con los
// defectos encontrados en las pruebas
// ------------------------------------------------
function analizarCobertura(totalLineas, lineasProbadas, defectosEncontrados) {
  var porcentaje = Math.round((lineasProbadas / totalLineas) * 100);
 
  var nivel;
  if (porcentaje >= 80) nivel = 'Alta';
  else if (porcentaje >= 50) nivel = 'Media';
  else nivel = 'Baja';
 
  return {
    totalLineas:          totalLineas,
    lineasProbadas:       lineasProbadas,
    porcentajeCobertura:  porcentaje + '%',
    nivelCobertura:       nivel,
    defectosEncontrados:  defectosEncontrados,
    defectosPorCobertura: defectosEncontrados > 0
      ? (porcentaje / defectosEncontrados).toFixed(2)
      : 'N/A'
  };
}
 
module.exports = { calcularComplejidad, detectarFlakyTest, medirTiempo, analizarCobertura };
 