import '../styles/tailwind.css';
import '../styles/icons.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../context/auth';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import client from '../apollo-client';
import { ApolloProvider } from '@apollo/client';
import axios from 'axios';
import { event } from '../utils/sw';

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);




  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {!authRoute ? <Navbar /> : null}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider >
    </ApolloProvider>)
}
export default App
