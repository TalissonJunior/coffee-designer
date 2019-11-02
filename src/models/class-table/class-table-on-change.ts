import { ClassTable } from './class-table';
import { OnChangeType } from '../../enums/on-change-type';

export class ClassTableOnChange {
  type: OnChangeType | Array<OnChangeType>;
  callback: (...uml: ClassTable[]) => void;

  constructor(onChange: ClassTableOnChange) {
    if (onChange) {
      this.type = onChange.type;
      this.callback = onChange.callback;
    }
  }
}
