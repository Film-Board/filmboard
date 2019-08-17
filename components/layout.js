import React from 'react';
import Head from 'next/head';
import '../styles/main.scss';
import { Container } from 'rbx';
import Navbar from './navbar';

export default ({ children }) => {
  return (
    <div>
      <Head>
        <title>Filmboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <Container>
        <Navbar/>
      </Container>
      {children}
    </div>
  );
};
