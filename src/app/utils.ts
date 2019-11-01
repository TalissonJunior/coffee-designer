export class Utils {
  static noop() {}

  static isFn(value: any): boolean {
    return typeof value === 'function';
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  static generateID(): string {
    return (
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  static convertToUnderscore(str: string): string {
    var filterUpperCase = str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    var filterSpace = filterUpperCase.replace(/\s/g, '_').toLowerCase();

    return filterSpace;
  }

  static capitalize(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }

  static convertToBoolean(value: any): boolean {
    return /true/i.test(value);
  }
}
