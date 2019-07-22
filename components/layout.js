import Head from 'next/head';
import '../styles/main.scss';

export default ({children}) => {
  return (
    <div>
      <Head>
        <title>Filmboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <div className="container">
        {children}
      </div>
    </div>
  );
};
