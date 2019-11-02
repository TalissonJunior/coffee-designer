import * as d3 from 'd3';
import 'd3-selection-multi';
import { WorkSpace } from './workspace/workspace';
import { Minimap } from './minimap/minimap';
import { JSONInput } from '../models/json';
import { Utils } from './utils';
import { JSONOutput } from '../models/json/json-output';
import { ClassTable } from '../models/class-table/class-table';
import { OnChangeType } from '../enums/on-change-type';
import { ClassTableOnChange } from '../models/class-table/class-table-on-change';

class App {
  height = 2400;
  width = 3840;
  workspace: WorkSpace;
  minimap: Minimap;

  constructor(container: string) {
    this.init(container);
  }

  private init(container: string) {
    this.workspace = new WorkSpace(container, {
      height: this.height,
      width: this.width
    });

    this.minimap = new Minimap(container, this.workspace, {
      heigth: this.height / 16,
      width: this.width / 16,
      scale: 16
    });
  }

  public fromJson(json: JSONInput): void {
    if (!json.data) {
      throw 'Json must have a data property, ex. data: { classTables:[] }';
    } else if (!Utils.isArray(json.data.classTables)) {
      throw "Json property 'data.classTables' must be of type array, ex. data: { classTables:[] }";
    }

    json = new JSONInput(json.data.classTables);

    if (json.data.classTables && json.data.classTables.length > 0) {
      for (let index = 0; index < json.data.classTables.length; index++) {
        const classTable = json.data.classTables[index];
        this.workspace.addClassTable(classTable);
      }
    }
  }

  public toJson(): JSONOutput {
    if (!this.workspace.creators) {
      return new JSONOutput([]);
    }

    const classTables = this.workspace.creators.map(creator => {
      return creator.classTable.toJson();
    });

    return new JSONOutput(classTables as any);
  }

  public on(
    type: OnChangeType | Array<OnChangeType>,
    changeCallback: () => ClassTable
  ): void {
    const callback = new ClassTableOnChange({
      type: type,
      callback: changeCallback
    });
    this.workspace.callbackChanges.push(callback);
  }
}

export const init = (containerReference?: string) =>
  new App(containerReference);
