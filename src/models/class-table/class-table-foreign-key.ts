export class ClassTableForeignKey {
  private _table: string;
  public get table(): string {
    return this._table;
  }

  private _tableColumn: string;
  public get tableColumn(): string {
    return this._tableColumn;
  }

  private _classProperty: string;
  public get classProperty(): string {
    return this._classProperty;
  }

  constructor(table: string, tableColumn: string, classProperty: string) {
    this._table = table;
    this._tableColumn = tableColumn;
    this._classProperty = classProperty;
  }

  reset() {
    this._table = null;
    this._tableColumn = null;
    this._classProperty = null;
  }

  changeTable(table: string): void {
    if (!table) {
      throw Error('Property table can´t be null.');
    }

    this._table = table;
  }

  changeTableColumn(tableColumn: string): void {
    if (!tableColumn) {
      throw Error('Property table column can´t be null.');
    }

    this._tableColumn = tableColumn;
  }

  changeClassProperty(classProperty: string): void {
    if (!classProperty) {
      throw Error('Property class property can´t be null.');
    }

    this._classProperty = classProperty;
  }

  toJson() {
    if (!this._table) {
      return null;
    }

    return {
      table: this._table,
      tableColumn: this._tableColumn,
      classProperty: this._classProperty
    };
  }
}
