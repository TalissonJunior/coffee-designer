export class ClassTablePropertyEnumType {
  value: string;
  type: string;

  constructor(value: string, type = 'string') {
    this.value = value;

    if (value && !type) {
      const splitted = value.split(',');

      if (splitted[0].length == 1) {
        this.type = 'char';
      } else {
        this.type = 'string';
      }
    } else {
      this.type = type;
    }
  }

  toJson() {
    return {
      value: this.value,
      type: this.type
    };
  }
}
