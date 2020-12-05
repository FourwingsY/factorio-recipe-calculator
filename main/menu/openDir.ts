import { BrowserWindow, dialog, OpenDialogOptions } from 'electron';

import { app } from 'electron';
import path from 'path';

export async function openFactorioRootDir(win: BrowserWindow) {
  // This is for macOS
  // TODO: path for windows
  const options: OpenDialogOptions = {
    defaultPath: path.resolve(
      app.getPath('home'),
      'Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents/data'
    ),
    properties: ['openDirectory'],
  };
  const opened = await dialog.showOpenDialog(options);
  const factorioRoot = opened.filePaths[0];

  // TODO: check base / core exists
  const factorioBase = path.join(factorioRoot, 'base');
  const factorioCore = path.join(factorioRoot, 'core');

  // const relativePath = path.relative(app.getPath('userData'), factorioRoot);
  win.webContents.send('@frc/root_dir', factorioRoot);
  return;
}
