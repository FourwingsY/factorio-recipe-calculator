import { app, ipcMain, dialog, OpenDialogOptions } from 'electron';
import Store from 'electron-store';
import path from 'path';

import { Config } from '../store';

export default function prepareLoaders() {
  const store = new Store<Config>();

  ipcMain.on('@frc/openCore/request', async (e) => {
    // previouly opened path
    const prev = store.get('factorioCore');
    const defaultPath = path.resolve(
      app.getPath('home'),
      'Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents/data'
    );

    const opened = await dialog.showOpenDialog({
      defaultPath: prev || defaultPath,
      properties: ['openDirectory'],
    });
    const factorioCore = opened.filePaths[0];
    store.set('factorioCore', factorioCore);

    e.reply('@frc/openCore/success', factorioCore);
  });

  ipcMain.on('@frc/openMod/request', async (e) => {
    const prev = store.get('factorioMod');
    const defaultPath = path.resolve(
      app.getPath('home'),
      'Library/Application Support/factorio/mods'
    );

    const opened = await dialog.showOpenDialog({
      defaultPath: prev || defaultPath,
      properties: ['openDirectory'],
    });
    const factorioMod = opened.filePaths[0];
    store.set('factorioMod', factorioMod);

    e.reply('@frc/openMod/success', factorioMod);
  });
}
