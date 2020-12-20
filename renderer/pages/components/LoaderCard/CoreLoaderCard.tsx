import React, { useEffect, useState } from 'react';
import electron from 'electron';
import { Loader, loadCore } from '../../../loader/modLoader';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from '@material-ui/core';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { useCardStyle } from './style';

const CoreLoaderCard = () => {
  const classes = useCardStyle();
  const [coreLoading, setCoreLoading] = useState(false);

  // update loading
  useEffect(() => {
    // TODO: use webworker to load core, then update progress message
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
  );
};

export default CoreLoaderCard;
