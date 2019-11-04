import { ClassTable } from '../class-table/class-table';
import { ClassTablePosition } from '../class-table/class-table-position';

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
                ? new ClassTablePosition(ct.position.x, ct.position.y)
                : new ClassTablePosition(50, 50)
            )
        )
      : new Array<ClassTable>();
  }
}
