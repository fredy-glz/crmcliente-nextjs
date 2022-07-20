import React from 'react';

const Mensaje = ({ mensaje }) => {
  return (
    <div
      class={`bg-${
        mensaje !== 'Autenticando...' ? 'red' : 'blue'
      }-100 rounded-lg py-5 max-w-lg mx-auto px-6 mb-4 text-base text-${
        mensaje !== 'Autenticando...' ? 'red' : 'blue'
      }-700`}
      role="alert"
    >
      {mensaje}
    </div>
    // <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
    // </div>
  );
};

export default Mensaje;
