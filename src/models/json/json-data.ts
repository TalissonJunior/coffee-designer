import { ClassTable } from '../class-table/class-table';

export class JSONData {
  classTables: Array<ClassTable>;

  constructor(classTables: Array<ClassTable>) {
    this.classTables = classTables
      ? classTables.map(
          ct =>
            new ClassTable(
              ct.key,
              ct.name,
              ct.tableName,
              ct.properties,
              ct.position
            )
        )
      : new Array<ClassTable>();
  }
}
