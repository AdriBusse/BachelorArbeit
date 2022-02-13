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
        <PerformanceTest client={client} n={100} query={PERFQUERYFLAT} withCache title="Flat Query query with apollo cache" />
        <PerformanceTest client={client} n={100} query={PERFQUERYNESTED} withCache title="Nested Query query with apollo cache" />
        <PerformanceTest client={client} n={100} query={LISTQUERY} withCache title="List query with apollo cache" />
      </PerformanceTestButton >
    </ApolloProvider>)
}
export default App
