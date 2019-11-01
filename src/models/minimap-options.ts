export class MinimapOptions {
  container;
  minimapMargin?: number;
  minimapWidth?: number;
  minimapHeight?: number;

  constructor(
    container: any,
    minimapMargin: number,
    minimapWidth: number,
    minimapHeight: number
  ) {
    this.container = container;
    this.minimapMargin = minimapMargin;
    this.minimapWidth = minimapWidth;
    this.minimapHeight = minimapHeight;
  }
}