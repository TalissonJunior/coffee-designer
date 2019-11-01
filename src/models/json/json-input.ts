import { ClassTable } from '../class-table/class-table';
import { JSONData } from './json-data';

export class JSONInput {
  data: JSONData;

  constructor(classTables?: Array<ClassTable>) {
    this.data = new JSONData(classTables);
  }
}
