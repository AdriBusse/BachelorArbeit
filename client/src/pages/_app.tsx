import '../styles/tailwind.css';
import '../styles/icons.css';
import { Navbar } from '../components/Navbar';
import { AuthProvider } from '../context/auth';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import client from '../apollo-client';
import { ApolloProvider } from '@apollo/client';

import { PerformanceTest, PerformanceTestModal } from 'apollo_client_performance_test';
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
      <PerformanceTestModal >
        <PerformanceTest client={client} n={100} fileName="SWFlatQuery.json" withCache query={PERFQUERYFLAT} title="flat query with SW" />
        <PerformanceTest client={client} n={100} fileName="SWNestedtQuery.json" query={PERFQUERYNESTED} title="nested query with SW" />
        <PerformanceTest client={client} n={100} fileName="SWListQuery.json" query={LISTQUERY} title="List Query with SW" />
      </PerformanceTestModal >
    </ApolloProvider>)
}
export default App
