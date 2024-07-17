import React, { useState, useRef, Fragment, useMemo } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function FormularioProd({ agregarProducto, productos, eliminarProducto, editarProducto }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [error, setError] = useState('');
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef();
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 3;
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [criterioOrden, setCriterioOrden] = useState('nombre');

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !categoria.trim() || !precio.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const soloLetras = /^[A-Za-z\s]+$/;
    if (!soloLetras.test(nombre)) {
      setError('El nombre solo puede contener letras');
      return;
    }
    if (!soloLetras.test(categoria)) {
      setError('La categoría solo puede contener letras');
      return;
    }

    const validarPrecio = parseInt(precio);
    if (isNaN(validarPrecio) || validarPrecio <= 0 || !Number.isInteger(validarPrecio)) {
      setError('El precio debe ser un número válido entero mayor a cero');
      return;
    }

    const nuevoProducto = { nombre: nombre.trim(), categoria: categoria.trim(), precio: validarPrecio };

    if (productoEnEdicion !== null) {
      editarProducto(productoEnEdicion.id, nuevoProducto);
    } else {
      agregarProducto(nuevoProducto);
    }

    limpiarFormulario();
  };

  const iniciarEdicion = (id) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecio(producto.precio.toString());
      setProductoEnEdicion(producto);
    }
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCategoria('');
    setPrecio('');
    setProductoEnEdicion(null);
    setError('');
    cerrarModal();
  };

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const eliminarProductoConfirmado = () => {
    if (productoEnEdicion !== null) {
      eliminarProducto(productoEnEdicion.id); 
      limpiarFormulario();
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const ordenarProductos = (productos) => {
    const productosOrdenados = [...productos];
    productosOrdenados.sort((a, b) => {
      if (criterioOrden === 'nombre') {
        return ordenAscendente
          ? a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
          : b.nombre.toLowerCase().localeCompare(a.nombre.toLowerCase());
      } else if (criterioOrden === 'categoria') {
        return ordenAscendente
          ? a.categoria.toLowerCase().localeCompare(b.categoria.toLowerCase())
          : b.categoria.toLowerCase().localeCompare(a.categoria.toLowerCase());
      } else if (criterioOrden === 'precio') {
        return ordenAscendente ? a.precio - b.precio : b.precio - a.precio;
      }
      return 0;
    });
    return productosOrdenados;
  };

  const productosOrdenados = useMemo(() => ordenarProductos(productos), [productos, ordenAscendente, criterioOrden]);

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginaActual = productosOrdenados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

  return (
    <Fragment>
      <form onSubmit={manejarSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className='row'>
          <div className='col-12 col-md-4 mt-4'>
            <div className="mb-3">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 mt-4'>
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <input
                type="text"
                className="form-control"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
          </div>
          <div className='col-12 col-md-4 mt-4'>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="text"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
          </div>
          <div className='col-12 mt-4 d-flex justify-content-end'>
            {productoEnEdicion !== null ? (
              <>
                <button type="submit" className="btn btn-success me-2">
                  <i className="bi bi-check"></i>
                </button>
                <button type="button" className="btn btn-danger" onClick={cancelarEdicion}>
                  <i className="bi bi-x"></i>
                </button>
              </>
              ) : (
              <button type="submit" className="btn btn-success">
                <i className="bi bi-bag-plus"></i>
              </button>
            )}
          </div>
        </div>
      </form>

      <div className={`modal fade ${modalVisible ? 'show' : ''}`} ref={modalRef} tabIndex="-1" aria-labelledby="modalEliminarLabel" aria-hidden={!modalVisible} style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEliminarLabel">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={cerrarModal}></button>
            </div>
            <div className="modal-body">
              ¿Estás seguro de que deseas eliminar el producto?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={eliminarProductoConfirmado}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="offset-8 col-4 d-flex justify-content-end mb-3">
          <select
            className="form-select me-2"
            value={criterioOrden}
            onChange={(e) => setCriterioOrden(e.target.value)}
          >
            <option value="nombre">Nombre</option>
            <option value="categoria">Categoría</option>
            <option value="precio">Precio</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={() => setOrdenAscendente(!ordenAscendente)}
          >
            Orden {ordenAscendente ? '▲' : '▼'}
          </button>
        </div>
        {productosPaginaActual.map((producto) => (
          <div className="col-12 col-sm-6 col-md-4 mb-3" key={producto.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">Categoría: {producto.categoria}</p>
                <p className="card-text">Precio: ${producto.precio}</p>
                <button className="btn btn-primary me-2" onClick={() => iniciarEdicion(producto.id)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-danger" onClick={() => { iniciarEdicion(producto.id); abrirModal(); }}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>Anterior</button>
          </li>
          {Array.from({ length: totalPaginas }, (_, index) => (
            <li key={index} className={`page-item ${index + 1 === paginaActual ? 'active' : ''}`}>
              <button className="page-link" onClick={() => cambiarPagina(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>Siguiente</button>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}

export default FormularioProd;
