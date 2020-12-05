import React, { useEffect } from 'react';
import Head from 'next/head';
import electron, { Cookies, ipcRenderer } from 'electron';
import modLoader from '../loader/modLoader';
import { load } from 'fengari-web';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

  useEffect(() => {
    electron.ipcRenderer.on(
      '@frc/openCore/success',
      async (event, corePath) => {
        document.cookie = `corePath=${corePath};`;
        const data = modLoader.loadBase();
        console.log(
          data['underground-belt']['express-underground-belt']['icon']
        );
      }
    );
  }, []);

  function loadCore() {
    ipcRenderer.send('@frc/openCore/request');
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
              <Button variant='contained' color='primary' onClick={loadCore}>
                Load
              </Button>
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
