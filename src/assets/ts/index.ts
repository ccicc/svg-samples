// create by lq on 2019/03/20

import './../scss/index.scss';
import { Wave } from './wave';

window.onload = function() {
  App.getInstance().init();
  frame();
};

function frame(): void {
  Wave.getInstance().render();
  window.requestAnimationFrame(frame);
}

class App {
  private static _instance: App;

  public static getInstance(): App {
    if (!this._instance) this._instance = new App();
    return this._instance;
  }

  public init(): void {
    Wave.getInstance().init();
  }
}
