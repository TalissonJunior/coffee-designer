import * as d3 from 'd3';
import 'd3-selection-multi';
import { WorkSpace } from './workspace/workspace';
import { Minimap } from './minimap/minimap';
import { ClassTable } from '../models/class-table/class-table';
import { ClassTableProperty } from '../models/class-table/class-table-property';
import { ClassTablePosition } from '../models/class-table/class-table-position';
import { ClassTablePropertyType } from '../models/class-table/class-table-property-type';

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

    this.workspace.addClassTable(
      new ClassTable(
        null,
        'Address',
        't_address',
        [
          new ClassTableProperty(
            null,
            'Id',
            'id',
            'Identifier',
            new ClassTablePropertyType('Guid', false),
            false,
            true,
            true,
            true
          )
        ],
        new ClassTablePosition(50, 50)
      )
    );
  }
}

export const init = (containerReference?: string) =>
  new App(containerReference);
