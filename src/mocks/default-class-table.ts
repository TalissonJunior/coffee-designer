import { ClassTable } from '../models/class-table/class-table';
import { ClassTablePosition } from '../models/class-table/class-table-position';

export const mockDefaultClassTable = (
  position: ClassTablePosition
): ClassTable => {
  return new ClassTable(null, 'ClassName', 'tableName', [], position);
};
