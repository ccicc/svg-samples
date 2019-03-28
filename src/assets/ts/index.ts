// create by lq on 2019/03/20

import { Wave } from './wave';
import { Sine } from './sine';
import './../scss/index.scss';

window.onload = function() {
  App.getInstance().init();
  frame();
};

function frame(): void {
  App.getInstance().render();
  window.requestAnimationFrame(frame);
}

class App {
  private static _instance: App;
  private svgContainer: HTMLElement | null = null;
  private propForm: HTMLFormElement | null = null;
  private selectedId: string = '';

  public static getInstance(): App {
    if (!this._instance) this._instance = new App();
    return this._instance;
  }

  public init(): void {
    this.svgContainer = document.getElementById('container');
    this.propForm = document.getElementById('propForm') as HTMLFormElement;
    Wave.getInstance().init();
    Sine.getInstance().init();
    this.eventBinding();
  }

  public render(): void {
    Wave.getInstance().render();
    Sine.getInstance().render();
  }

  private eventBinding(): void {
    this.svgContainer!.addEventListener('click', this.svgEventHandler.bind(this));
    this.propForm!.addEventListener('input', this.formEventHandler.bind(this));
  }

  private svgEventHandler(event: Event): void {
    const target = event.target as HTMLElement;
    const id = target.parentElement!.id;
    if (!id) return;
    this.selectedId = id;
    switch (id) {
      case 'waveform1':
        Wave.getInstance().updatePropform(this.propForm!);
        break;
    }
  }

  private formEventHandler(event: Event): void {
    const target = event.target as HTMLInputElement;
    const propName = target.name;
    const value = target.value;
    switch (this.selectedId) {
      case 'waveform1':
        Wave.getInstance().updateProperties(propName, value);
        break;
    }
  }
}
