import { ClassTable } from '../class-table/class-table';

export class JSONDataOutput {
  classTables: Array<ClassTable>;

  constructor(classTables: Array<ClassTable>) {
    this.classTables = classTables;
  }
}
