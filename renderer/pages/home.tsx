import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import electron from 'electron';
import { Loader, loadCore } from '../loader/modLoader';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  card: {
    maxWidth: 300,
    margin: 5,
  },
  media: {
    height: 140,
  },
  actions: {
    justifyContent: 'flex-end',
  },
});

const Home = () => {
  const classes = useStyles();
  const [coreLoading, setCoreLoading] = useState(false);

  // update loading
  useEffect(() => {
    const logger = (module: string) => {
      console.log(module);
    };
    Loader.on('@frc/loadCore/progress', logger);
    return () => void Loader.off('@frc/loadCore/progress', logger);
  }, []);

  useEffect(() => {
    electron.ipcRenderer.on(
      '@frc/openCore/success',
      async (event, corePath) => {
        // set cookie to pass corePath to lua loader
        document.cookie = `corePath=${corePath};`;

        // TODO: use webworker to load core
        setCoreLoading(true);
        const data = await loadCore();
        setCoreLoading(false);

        console.log(data.recipe);
      }
    );
  }, []);

  function openCore() {
    electron.ipcRenderer.send('@frc/openCore/request');
  }

  return (
    <React.Fragment>
      <Head>
        <title>Factorio Recipe Calculator</title>
      </Head>
      <div id='root'>
        <div className={classes.layout}>
          <Card className={classes.card}>
            <CardMedia
              component='img'
              alt='Base Mod'
              image='/images/base.jpg'
              title='Base Mod'
              className={classes.media}
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Core system
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Load Factorio core and base recipies
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <LoadingButton
                variant='contained'
                color='primary'
                onClick={openCore}
                pending={coreLoading}
              >
                Load
              </LoadingButton>
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardMedia
              component='img'
              alt='Base Mod'
              image='/images/moded.webp'
              title='Base Mod'
              className={classes.media}
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Mods
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Load Installed Mods
              </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button variant='contained' color='primary'>
                Load
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
