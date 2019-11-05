import { ClassTablePropertyType } from './class-table-property-type';
import { Utils } from '../../app/utils';

export class ClassTableProperty {
  private _key: string;
  public get key(): string {
    return this._key;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }

  private _columnName: string;
  public get columnName(): string {
    return this._columnName;
  }

  private _description: string;
  public get description(): string {
    return this._description;
  }

  private _type: ClassTablePropertyType;
  public get type(): ClassTablePropertyType {
    return this._type;
  }

  private _isForeignKey: boolean;
  public get isForeignKey(): boolean {
    return this._isForeignKey;
  }

  private _isPrimaryKey: boolean;
  public get isPrimaryKey(): boolean {
    return this._isPrimaryKey;
  }

  private _isRequired: boolean;
  public get isRequired(): boolean {
    return this._isRequired;
  }

  private _hasChangeMethod: boolean;
  public get hasChangeMethod(): boolean {
    return this._hasChangeMethod;
  }

  constructor(
    key: string,
    name: string,
    columnName: string,
    description: string,
    type: ClassTablePropertyType,
    isForeignKey: boolean,
    isPrimaryKey: boolean,
    isRequired: boolean,
    hasChangeMethod: boolean
  ) {
    this._key = key || Utils.generateID();
    this._name = Utils.capitalize(name) || '';
    this._columnName = Utils.toLowerCase(columnName) || '';
    this._description = description || '';
    this._isForeignKey = isForeignKey;
    this._isPrimaryKey = isPrimaryKey;
    this._isRequired = isRequired;
    this._hasChangeMethod = hasChangeMethod;

    this.changeType(type);
  }

  public changeName(name: string): void {
    if (!name) {
      throw Error('Property name can´t be null.');
    }

    this._name = name;
  }

  public changeColumnName(columnName: string): void {
    if (!columnName) {
      throw Error('Property column name can´t be null.');
    }

    this._columnName = columnName;
  }

  public changeDescription(description: string): void {
    this._description = description;
  }

  public setIsForeignKey(isForeignKey: boolean): void {
    this._isForeignKey = isForeignKey;
  }

  public setIsPrimaryKey(isPrimaryKey: boolean): void {
    this._isPrimaryKey = isPrimaryKey;
  }

  public setIsRequired(isRequired: boolean): void {
    this._isRequired = isRequired;
  }

  public setHasChangeMethod(hasChangeMethod: boolean): void {
    this._hasChangeMethod = hasChangeMethod;
  }

  public changeType(type: ClassTablePropertyType): void {
    this._type = new ClassTablePropertyType(type.value, type.isClass);

    this._isForeignKey = type.isClass;
  }

  toJson() {
    return {
      key: this._key,
      name: this._name,
      columnName: this._columnName,
      description: this._description,
      type: this._type.toJson(),
      isForeignKey: this._isForeignKey,
      isPrimaryKey: this._isPrimaryKey,
      isRequired: this._isRequired,
      hasChangeMethod: this._hasChangeMethod
    };
  }
}
