import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron';
import modLoader from '../loader/modLoader';

const Home = () => {
  useEffect(() => {
    electron.ipcRenderer.on('@frc/root_dir', async (event, arg) => {
      const factorioRoot = arg as string;
      modLoader.loadBase();
    });
  }, []);
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href='/next'>
            <a>Go to next page</a>
          </Link>
        </p>
        <img src='/images/logo.png' />
      </div>
    </React.Fragment>
  );
};

export default Home;
