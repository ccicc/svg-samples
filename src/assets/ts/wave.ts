// create by lq on 2019/03/20

export class Wave {
  private static _instance: Wave;
  private readonly SVG_NS: string = 'http://www.w3.org/2000/svg';
  private svg: Element | null = null;
  private waveView: Element | null = null;
  private height: number = 200;
  private offset: number = 0;
  private offsetFlag: boolean = true;

  public static getInstance(): Wave {
    if (!this._instance) this._instance = new Wave();
    return this._instance;
  }

  public init(): void {
    this.svg = document.getElementById('waveViewSVG');
    this.waveView = this.createWaveView(200, this.offset, 'lightBlue');
  }

  private createWaveView(width: number, height: number, color: string): Element {
    const wave = document.createElementNS(this.SVG_NS, 'path');
    const d = this.encodePath(width, height);
    wave.setAttribute('x', '0');
    wave.setAttribute('y', '0');
    wave.setAttribute('fill', color);
    wave.setAttribute('stroke', 'lightBlue');
    wave.setAttribute('d', d);
    this.svg!.appendChild(wave);
    return wave;
  }

  private encodePath(width: number, height: number): string {
    const svgWidth = Number.parseInt(this.svg!.getAttribute('width') as string);
    const svgHeight = Number.parseInt(this.svg!.getAttribute('height') as string);
    const num = Math.ceil(svgWidth / width) + 1;
    let d = `M -50 ${svgHeight - this.height} q ${width / 2} ${height}, ${width} 0`;
    for (let i = 0; i < num - 1; ++i) {
      d = d.concat(` t ${width} 0`);
    }
    return d;
  }

  public render(): void {
    if (this.offsetFlag) {
      this.offset += 0.3;
      if (this.offset >= 15) this.offsetFlag = false;
    } else {
      this.offset -= 0.3;
      if (this.offset <= -15) this.offsetFlag = true;
    }
    const d = this.encodePath(100, this.offset);
    this.waveView!.setAttribute('d', d);
  }
}
