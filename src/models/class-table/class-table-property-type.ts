export class ClassTablePropertyType {
  value: string;
  isClass: boolean;

  constructor(value: string, isClass = false) {
    this.value = value;
    this.isClass = isClass;
  }
}
