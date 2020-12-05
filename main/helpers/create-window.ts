import {
  screen,
  Rectangle,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from 'electron';
import Store from 'electron-store';

interface StoreData {
  'window-state': Rectangle;
  name: string;
}
export default (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store<StoreData>({ name });
  const defaultRect: Rectangle = {
    x: 0,
    y: 0,
    width: options.width!,
    height: options.height!,
  };

  let state = {} as Rectangle;
  let win: BrowserWindow;

  const restore = () => store.get(key, defaultRect);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState: Rectangle, bounds: Rectangle) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultRect, {
      x: (bounds.width - defaultRect.width) / 2,
      y: (bounds.height - defaultRect.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState: Rectangle) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);
  win.on('close', saveState);

  return win;
};
