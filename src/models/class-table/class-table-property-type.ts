export class ClassTablePropertyType {
  value: string;
  isClass: boolean;

  constructor(value: string, isClass = false) {
    this.value = value || 'string';
    this.isClass = isClass;
  }

  toJson() {
    return {
      value: this.value,
      isClass: this.isClass
    };
  }
}
