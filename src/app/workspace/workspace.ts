import * as d3 from 'd3';
import { WorkSpaceOptions } from './workspace-options';
import { ClassTable } from '../../models/class-table/class-table';
import { ClassTableCreator } from '../class-table-creator/class-table-creator';
import { ContextMenu } from '../context-menu/context-menu';
import { mockDefaultClassTable } from '../../mocks/default-class-table';
import { ClassTablePosition } from '../../models/class-table/class-table-position';

/**
 * This class is responsible for creating the entire external environment
 * of the cli designer such as the menu,body container and so on.
 */
export class WorkSpace {
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  options: WorkSpaceOptions;
  creators: Array<ClassTableCreator>;

  constructor(container: string, options: WorkSpaceOptions) {
    this.init(container, options);
  }

  private init(container: string, options: WorkSpaceOptions): void {
    // Set up
    this.options = options;
    this.creators = new Array<ClassTableCreator>();

    this.svg = d3
      .select(container)
      .append('svg')
      .attrs({
        class: 'workspace',
        width: options.width,
        height: options.height
      })
      .on('contextmenu', d => {
        new ContextMenu([
          {
            title: 'Add ClassTable',
            action: () => {
              this.addClassTable(
                mockDefaultClassTable(
                  new ClassTablePosition(d3.event.pageX, d3.event.pageY)
                )
              );
            }
          }
        ]);
      });
  }

  addClassTable(classTable: ClassTable): void {
    const otherClassTables = this.creators
      .filter(creat => creat.classTable.key != classTable.key)
      .map(c => c.classTable);

    const creator = new ClassTableCreator(
      this.svg,
      classTable,
      otherClassTables
    );

    // Add remove option
    creator.selfElement.on('contextmenu', d => {
      new ContextMenu([
        {
          title: `Remove ${classTable.getClassTableName()}`,
          action: () => {
            const index = this.creators.findIndex(
              creat => creat.classTable.key == classTable.key
            );

            d3.select((creator.selfElement.node() as any).parentNode).remove();
            this.creators.splice(index, 1);
          }
        }
      ]);
    });

    this.creators.push(creator);
    this.updateClassTablesTypes();
  }

  updateClassTablesTypes(): void {
    for (let index = 0; index < this.creators.length; index++) {
      const element = this.creators[index];

      const otherClassTables = this.creators
        .filter(creat => creat.classTable.key != element.classTable.key)
        .map(c => c.classTable);

      this.creators[index].otherClassTable = otherClassTables;
    }
  }
}
