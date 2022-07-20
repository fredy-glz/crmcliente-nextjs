import React, { useContext, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useReducer, useRouter } from 'next/router';
import Swal from 'sweetalert2';

import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';

// Context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';
import Mensaje from '../components/Mensaje';

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      pedido {
        id
        nombre
        cantidad
      }
      cliente {
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        nombre
        cantidad
      }
      cliente {
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const NuevoPedido = () => {
  const [mensaje, setMensaje] = useState(null);

  const router = useRouter();

  //   Utilizar context y extraer sus funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;

  // Mutation para crear un nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      // Reescribimos el cache (el cache nunca se debe modificar)
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  });

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? ' opacity-50 cursor-not-allowed'
      : '';
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    // Remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, existencia, ...producto }) => producto
    );
    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            pedido,
            cliente: id,
            total,
          },
        },
      });

      // Mostrar alerta
      Swal.fire('Correcto', 'El pedido se registró correctamente', 'success');

      // routing
      router.push('/pedidos');
    } catch (error) {
      setMensaje(error.message);
      setTimeout(() => {
        setMensaje(null);
      }, 2000);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
      {mensaje && <Mensaje mensaje={mensaje} />}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
            onClick={() => crearNuevoPedido()}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
