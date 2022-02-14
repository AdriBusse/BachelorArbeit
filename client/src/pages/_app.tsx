import '../styles/tailwind.css';
import '../styles/icons.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../context/auth';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import client from '../apollo-client';
import { ApolloProvider } from '@apollo/client';

import PerformanceTestButton from '../components/PerformanceTestButton';
import PerformanceTest from '../components/TestingComponents/PerformanceTest';
import { GETSUB } from '../querys/getSub';
import { PERFQUERYFLAT } from '../querys/PerformanceTestQueries/FlatQuery';
import { PERFQUERYNESTED } from '../querys/PerformanceTestQueries/NestedQuery';
import { LISTQUERY } from '../querys/PerformanceTestQueries/ListQuery';

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
      <PerformanceTestButton >
        <PerformanceTest client={client} fileName="noCacheFlatQuery" n={100} query={PERFQUERYFLAT} title="Flat Query no cache" />
        <PerformanceTest client={client} fileName="noCacheNestedQuery" n={100} query={PERFQUERYNESTED} title="Nested Query no cache" />
        <PerformanceTest client={client} fileName="noCacheListQuery" n={100} query={LISTQUERY} title="List Query" />
      </PerformanceTestButton>
    </ApolloProvider>)
}
export default App
