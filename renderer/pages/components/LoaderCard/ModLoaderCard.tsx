import React, { useEffect, useState } from 'react';
import electron from 'electron';
import { Loader, loadMod } from '../../../loader/modLoader';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from '@material-ui/core';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { useCardStyle } from './style';

const ModLoaderCard = () => {
  const classes = useCardStyle();
  const [modLoading, setModLoading] = useState(false);

  // update loading
  useEffect(() => {
    // TODO: use webworker to load mod, then update progress message
    const logger = (module: string) => {
      console.log(module);
    };

    Loader.on('@frc/loadMod/progress', logger);
    return () => void Loader.off('@frc/loadMod/progress', logger);
  }, []);

  useEffect(() => {
    electron.ipcRenderer.on('@frc/openMod/success', async (event, modPath) => {
      // set cookie to pass modPath to lua loader
      document.cookie = `modPath=${modPath};`;

      // TODO: use webworker to load core
      setModLoading(true);
      const data = await loadMod(modPath);
      setModLoading(false);

      console.log(data);
    });
  }, []);

  function openMod() {
    electron.ipcRenderer.send('@frc/openMod/request');
  }

  return (
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
        <LoadingButton
          variant='contained'
          color='primary'
          onClick={openMod}
          pending={modLoading}
        >
          Load
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default ModLoaderCard;
