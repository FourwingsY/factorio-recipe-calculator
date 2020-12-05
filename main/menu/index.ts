import {
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import { openFactorioRootDir } from './openDir';

const isMac = process.platform === 'darwin';

const template: MenuItemConstructorOptions[] = [
  { role: 'appMenu' },
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  { role: 'editMenu' },
  { role: 'viewMenu' },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
];

export function createMenu(win: BrowserWindow) {
  const menu = Menu.buildFromTemplate(template);
  const menuItem = new MenuItem({
    label: 'Data',
    submenu: [{ label: 'Load Base', click: () => openFactorioRootDir(win) }],
  });
  menu.append(menuItem);
  return menu;
}
