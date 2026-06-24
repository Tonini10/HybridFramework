// ================================================
// Pruebas del mini framework
// ================================================
 
var HybridTest = require('../src/hybridtest');
 
// Clases de ejemplo para las pruebas
class BaseDeDatos {
  constructor() {
    this.registros = {};
    this.activa = false;
  }
  conectar()    { this.activa = true; }
  desconectar() { this.activa = false; }
  guardar(id, datos) { this.registros[id] = datos; return { id: id, ...datos }; }
  buscar(id)    { return this.registros[id] || null; }
}
 
class ServicioUsuarios {
  constructor(db) {
    this.db = db;
    this.contador = 1;
  }
  crear(nombre) { return this.db.guardar(this.contador++, { nombre: nombre }); }
  obtener(id)   { return this.db.buscar(id); }
}
 
// ================================================
// SECCIÓN 1: Pruebas de integración automática
// ================================================
describe('1. Integracion automatica', function () {
 
  it('conecta los modulos con sus dependencias correctamente', function () {
    var instancias = HybridTest.autoWire([
      { nombre: 'db',       clase: BaseDeDatos,      deps: [] },
      { nombre: 'usuarios', clase: ServicioUsuarios, deps: ['db'] }
    ]);
    expect(instancias.usuarios.db).toBe(instancias.db);
  });
 
  it('permite usar los modulos ya conectados', function () {
    var instancias = HybridTest.autoWire([
      { nombre: 'db',       clase: BaseDeDatos,      deps: [] },
      { nombre: 'usuarios', clase: ServicioUsuarios, deps: ['db'] }
    ]);
    instancias.db.conectar();
    var usuario = instancias.usuarios.crear('Carlos');
    expect(usuario.nombre).toBe('Carlos');
    instancias.db.desconectar();
  });
 
});
 
// ================================================
// SECCIÓN 2: Mocking avanzado con espías
// ================================================
describe('2. Mocking avanzado con espias', function () {
 
  it('registra cuantas veces se llamo y con que argumentos', function () {
    var espia = HybridTest.crearEspia('buscar');
    espia(10, 'activo');
    espia(20, 'inactivo');
    expect(espia.vecesLlamado()).toBe(2);
    expect(espia.ultimosArgs()).toEqual([20, 'inactivo']);
  });
 
  it('retornar y lanzarError configuran el comportamiento', function () {
    var espia = HybridTest.crearEspia('api');
    espia.retornar({ ok: true });
    expect(espia()).toEqual({ ok: true });
 
    espia.lanzarError(new Error('Sin conexion'));
    expect(function () { espia(); }).toThrow();
  });
 
});
 
// ================================================
// SECCIÓN 3: Generación automática por tipos
// ================================================
describe('3. Generacion automatica por tipos', function () {
 
  var esquema = {
    nombre: { tipo: 'string', minLen: 2 },
    edad:   { tipo: 'numero', min: 0 }
  };
 
  it('acepta datos que cumplen el esquema', function () {
    expect(function () {
      HybridTest.validar({ nombre: 'Ana', edad: 25 }, esquema);
    }).not.toThrow();
  });
 
  it('rechaza datos invalidos o fuera de rango', function () {
    expect(function () {
      HybridTest.validar(null, esquema);
    }).toThrow();
 
    expect(function () {
      HybridTest.validar({ nombre: 'A', edad: -5 }, esquema);
    }).toThrow();
  });
 
});
 