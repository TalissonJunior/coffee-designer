import { ClassTable } from '../class-table/class-table';
import { JSONDataOutput } from './json-data-output';

export class JSONOutput {
  data: JSONDataOutput;

  constructor(classTables: Array<ClassTable>) {
    this.data = new JSONDataOutput(classTables);
  }
}
