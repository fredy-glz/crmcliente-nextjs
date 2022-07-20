import { ApolloProvider } from '@apollo/client';

import PedidoState from '../context/pedidos/PedidoState';
import client from '../config/apollo';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <PedidoState>
        <Component {...pageProps} />
      </PedidoState>
    </ApolloProvider>
  );
};

export default MyApp;
