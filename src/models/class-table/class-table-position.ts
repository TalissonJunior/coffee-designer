export class ClassTablePosition {
  private _x: number;
  public get x(): number {
    return this._x;
  }

  private _y: number;
  public get y(): number {
    return this._y;
  }

  constructor(x?: number, y?: number) {
    this._x = x;
    this._y = y;
  }

  changeX(x: number): void {
    this._x = x;
  }

  changeY(y: number): void {
    this._y = y;
  }
}
