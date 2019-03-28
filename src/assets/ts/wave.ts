// create by lq on 2019/03/20

import * as debug from 'debug';

const waveDebug = debug('svgSamples::wave');

export class Wave {
  private static _instance: Wave;
  private readonly SVG_NS: string = 'http://www.w3.org/2000/svg';
  private svg: Element | null = null;
  private svgWidth: number = 400;
  private svgHeight: number = 400;
  private wavePath: Element | null = null;
  private horiPath: Element | null = null;
  private formEle: HTMLFormElement | null = null;
  private depth: number = 200; // 深度
  private semicycle: number = 100; // 半周期长度
  private amplitude: number = 15; // 振幅
  private speed: number = 0.3; // 振幅速率
  private offset: number = 0;
  private offsetFlag: boolean = true;

  public static getInstance(): Wave {
    if (!this._instance) this._instance = new Wave();
    return this._instance;
  }

  private constructor() {}

  public init(): void {
    this.svg = document.getElementById('waveform1');
    this.svgWidth = Number.parseInt(this.svg!.getAttribute('width') as string);
    this.svgHeight = Number.parseInt(this.svg!.getAttribute('height') as string);
    this.createPath('lightBlue', '#529BB3');
  }

  public updatePropform(form: HTMLFormElement): void {
    this.formEle = form;
    this.formEle.innerHTML = '';
    const paths = this.svg!.querySelectorAll('path');
    const propd = this.decodePath(paths[2].getAttribute('d')!);
    this.createInputElement('input', 'depth', {
      type: 'range',
      name: 'depth',
      min: 0,
      max: 400,
      value: propd.depth
    });
    this.createInputElement('input', 'semicycle', {
      type: 'range',
      name: 'semicycle',
      min: 50,
      max: 400,
      value: propd.semicycle
    });
    this.createInputElement('input', 'amplitude', {
      type: 'range',
      name: 'amplitude',
      min: 5,
      max: 400,
      value: this.amplitude
    });
    this.createInputElement('input', 'speed', {
      type: 'range',
      name: 'speed',
      min: 0.1,
      max: 5,
      step: 0.1,
      value: this.speed
    });
  }

  public updateProperties(propName: string, val: string): void {
    waveDebug('target name: %s, value: %s', propName, val);
    switch (propName) {
      case 'depth':
        this.depth = Number.parseInt(val, 10);
        break;
      case 'semicycle':
        this.semicycle = Number.parseInt(val, 10);
        break;
      case 'amplitude':
        this.amplitude = Number.parseInt(val, 10);
        break;
      case 'speed':
        this.speed = Number.parseFloat(val);
        break;
      default:
        return;
    }
    this.formEle![propName].setAttribute('value', val);
    this.formEle![propName].nextElementSibling.textContent = val;
  }

  public render(): void {
    if (this.offsetFlag) {
      this.offset += this.speed;
      if (this.offset >= this.amplitude) this.offsetFlag = false;
    } else {
      this.offset -= this.speed;
      if (this.offset <= -this.amplitude) this.offsetFlag = true;
    }
    this.updatePath(this.offset);
  }

  private createPath(color1: string, color2: string): void {
    this.svgWidth = Number.parseInt(this.svg!.getAttribute('width') as string);
    this.svgHeight = Number.parseInt(this.svg!.getAttribute('height') as string);
    const height = this.svgHeight - this.depth;
    this.wavePath = document.createElementNS(this.SVG_NS, 'path');
    this.horiPath = document.createElementNS(this.SVG_NS, 'path');
    this.horiPath.setAttribute('fill', color2);
    this.horiPath.setAttribute('d', `M 0 ${height} h ${this.svgWidth} v ${height} h ${-this.svgWidth} z`);
    this.wavePath.setAttribute('x', '0');
    this.wavePath.setAttribute('y', '0');
    this.wavePath.setAttribute('fill', color1);
    this.wavePath.setAttribute('stroke', 'lightBlue');
    this.updatePath(0);
    this.svg!.appendChild(this.horiPath);
    this.svg!.appendChild(this.wavePath);
  }

  private createInputElement(type: string, label: string, options: { [prop: string]: any }): void {
    const wrapEle = document.createElement('div');
    const labelEle = document.createElement('label');
    const inputEle = document.createElement(type);
    const spanEle = document.createElement('span');
    labelEle.textContent = label;
    spanEle.textContent = options.value;
    for (let prop of Object.keys(options)) {
      inputEle.setAttribute(prop, options[prop]);
    }
    wrapEle!.appendChild(labelEle);
    wrapEle!.appendChild(inputEle);
    wrapEle!.appendChild(spanEle);
    this.formEle!.appendChild(wrapEle);
  }

  private updatePath(amplitude: number): void {
    const num = Math.ceil(this.svgWidth / this.semicycle) + 1;
    const d1 = `M 0 ${this.svgHeight - this.depth} h ${this.svgWidth} v ${this.depth} h ${-this.svgWidth} z`;
    let d2 = `M -50 ${this.svgHeight - this.depth} q ${this.semicycle / 2} ${amplitude}, ${this.semicycle} 0`;
    for (let i = 0; i < num - 1; ++i) {
      d2 = d2.concat(` t ${this.semicycle} 0`);
    }
    this.horiPath!.setAttribute('d', d1);
    this.wavePath!.setAttribute('d', d2);
  }

  private decodePath(d: string): { [propName: string]: number } {
    waveDebug('wavePath: %s', d);
    const exp = /^M.*\s(\d*)\sq\s(\d*).*/i;
    const result = exp.exec(d);
    const depth = this.svgHeight - Number.parseInt(result![1]);
    const semicycle = Number.parseInt(result![2]) * 2;
    return { depth, semicycle };
  }
}
