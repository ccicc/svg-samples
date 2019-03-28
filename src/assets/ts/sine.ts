// create by lq on 2019/03/28

export class Sine {
  private static _instance: Sine;
  private readonly SVG_NS: string = 'http://www.w3.org/2000/svg';
  private svgEle: Element | null = null;
  private textEle: Element | null = null;
  private textLen: number = 0;
  private offset: number = 0;
  private dx: number[] = [];
  private dy: number[] = [];

  public static getInstance(): Sine {
    if (!this._instance) this._instance = new Sine();
    return this._instance;
  }

  private contructor() {}

  public init(): void {
    this.svgEle = document.getElementById('SineView') as Element;
    this.createText('hello,world');
  }

  private createText(text: string): void {
    this.textLen = text.length;
    this.textEle = document.createElementNS(this.SVG_NS, 'text');

    for (let i = 0; i < this.textLen; ++i) {
      this.dx.push(20);
      const tspan = document.createElementNS(this.SVG_NS, 'tspan');
      const hue = (Math.random() * 360) | 0;
      tspan.setAttribute('fill', `hsl(${hue}, 80%, 70%)`);
      tspan.textContent = text[i];
      this.textEle.appendChild(tspan);
    }
    this.textEle.setAttribute('x', '0');
    this.textEle.setAttribute('y', '200');
    this.textEle.setAttribute('font-size', '30px');
    this.svgEle!.appendChild(this.textEle);
  }

  public render(): void {
    let oldY = 0;
    this.offset += 0.05;
    this.dy = [];
    for (let i = 0; i < this.textLen; ++i) {
      const y = 80 * Math.sin(0.5 * i + this.offset);
      this.dy.push(y - oldY);
      oldY = y;
    }
    this.textEle!.setAttribute('dx', this.dx.join(' '));
    this.textEle!.setAttribute('dy', this.dy.join(' '));
  }
}
