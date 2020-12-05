import { app, ipcMain, dialog, OpenDialogOptions } from 'electron';
import Store from 'electron-store';
import path from 'path';

import { Config } from '../store';

export default function prepareLoaders() {
  const store = new Store<Config>();

  ipcMain.on('@frc/openCore/request', async (e) => {
    // previouly opened path
    const core = store.get('factorioCore');

    const options: OpenDialogOptions = {
      defaultPath:
        core ||
        path.resolve(
          app.getPath('home'),
          'Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents/data'
        ),
      properties: ['openDirectory'],
    };
    const opened = await dialog.showOpenDialog(options);
    const factorioCore = opened.filePaths[0];
    store.set('factorioCore', factorioCore);

    e.reply('@frc/openCore/success', factorioCore);
  });
}
