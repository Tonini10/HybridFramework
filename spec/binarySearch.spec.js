// Sección 2: Extensión del Algoritmo de Búsqueda Binaria
// ================================================
 
var { busquedaBinaria } = require('../src/hybridtest');
 
// ================================================
// 1. PROPERTY-BASED TESTING
// ================================================
describe('1. Property-based testing', function () {
 
  it('siempre encuentra un elemento que existe en el arreglo', function () {
    for (var i = 0; i < 20; i++) {
      var arreglo = generarArregloOrdenado(10);
      var indice = Math.floor(Math.random() * arreglo.length);
      var objetivo = arreglo[indice];
      var resultado = busquedaBinaria(arreglo, objetivo);
      expect(resultado).not.toBe(-1);
      expect(arreglo[resultado]).toBe(objetivo);
    }
  });
 
});
 
// ================================================
// 2. MUTATION TESTING
// ================================================
describe('2. Mutation testing', function () {
 
  it('detecta mutacion en la condicion del while', function () {
    function busquedaMutada(arreglo, objetivo) {
      var inicio = 0;
      var fin = arreglo.length - 1;
      while (inicio > fin) { // BUG: > en vez de <=
        var medio = Math.floor((inicio + fin) / 2);
        if (arreglo[medio] === objetivo) return medio;
        else if (arreglo[medio] < objetivo) inicio = medio + 1;
        else fin = medio - 1;
      }
      return -1;
    }
 
    expect(busquedaBinaria([5], 5)).toBe(0);
    expect(busquedaMutada([5], 5)).toBe(-1);
  });
 
});
 
// ================================================
// 3. CONTRACT TESTING
// ================================================
describe('3. Contract testing', function () {
 
  it('el indice retornado siempre contiene el objetivo buscado', function () {
    var arreglo = [2, 4, 6, 8, 10, 12];
    var resultado = busquedaBinaria(arreglo, 8);
    expect(resultado).not.toBe(-1);
    expect(arreglo[resultado]).toBe(8);
  });
 
});
 
// ================================================
// FUNCIÓN AUXILIAR
// ================================================
function generarArregloOrdenado(tamanio) {
  var arreglo = [];
  var valor = Math.floor(Math.random() * 10);
  for (var i = 0; i < tamanio; i++) {
    arreglo.push(valor);
    valor += Math.floor(Math.random() * 5) + 1;
  }
  return arreglo;
}