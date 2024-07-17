import { useState, useEffect, Fragment } from 'react';
import FormularioProd from './FormularioProductos';
import Busqueda from './Busqueda';
import '../Formulario.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [productos, setProductos] = useState([]);
  const [criterio, setCriterio] = useState('');

  const KEY = 'productos';
  useEffect(() => {
    const storedProductos = JSON.parse(localStorage.getItem(KEY));
    if (storedProductos) setProductos(storedProductos); 
  }, []);

  useEffect(() => {
      localStorage.setItem(KEY, JSON.stringify(productos))
  }, [productos]);

  const agregarProducto = (producto) => {
    const nuevoProducto = {
      id: Date.now(),
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
    };
    setProductos((prevProductos) => {
      const updatedProductos = [...prevProductos, nuevoProducto];
      return updatedProductos;
    });
  };

  const eliminarProducto = (id) => {
    setProductos((prevProductos) => {
      const updatedProductos = prevProductos.filter((producto) => producto.id !== id);
      return updatedProductos;
    });
  };

  const editarProducto = (id, productoActualizado) => {
    setProductos((productosAnteriores) => {
      const updatedProductos = productosAnteriores.map((producto) =>
        producto.id === id ? { ...producto, ...productoActualizado } : producto
      );
      return updatedProductos;
    });
  };

  const productosFiltrados = productos.filter((producto) => {
    const nombre = producto.nombre ? producto.nombre.toLowerCase() : '';
    const categoria = producto.categoria ? producto.categoria.toLowerCase() : '';
    return nombre.includes(criterio.toLowerCase()) || categoria.includes(criterio.toLowerCase());
  });


  return (
    <Fragment>
      <div className="container">
        <div className='row'>
          <div className='offset-9 col-3'>
            <Busqueda criterio={criterio} setCriterio={setCriterio} />
          </div>
        </div>
        <br />
        <h1>Agregue un producto</h1>
        <FormularioProd
          agregarProducto={agregarProducto}
          productos={productosFiltrados}
          eliminarProducto={eliminarProducto}
          editarProducto={editarProducto}
        />
      </div>
    </Fragment>
  );
}

export default App;

