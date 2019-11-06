import * as d3 from 'd3';
import { WorkSpaceOptions } from './workspace-options';
import { ClassTable } from '../../models/class-table/class-table';
import { ClassTableCreator } from '../class-table-creator/class-table-creator';
import { ContextMenu } from '../context-menu/context-menu';
import { mockDefaultClassTable } from '../../mocks/default-class-table';
import { ClassTablePosition } from '../../models/class-table/class-table-position';
import { ClassTableOnChange } from '../../models/class-table/class-table-on-change';
import { OnChangeType } from '../../enums/on-change-type';
import { Utils } from '../utils';
import { Minimap } from '../minimap/minimap';
import { CoffeeOptions } from '../../models/coffee-options';

/**
 * This class is responsible for creating the entire external environment
 * of the cli designer such as the menu,body container and so on.
 */
export class WorkSpace {
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  options: WorkSpaceOptions;
  creators: Array<ClassTableCreator>;
  callbackChanges: Array<ClassTableOnChange>;

  constructor(container: string, options: WorkSpaceOptions) {
    this.init(container, options);
  }

  private init(container: string, options: WorkSpaceOptions): void {
    // Set up
    this.options = options;
    this.creators = new Array<ClassTableCreator>();
    this.callbackChanges = new Array<ClassTableOnChange>();

    this.createToolbar(container, options.options);
    this.createVerticalToolbar(container);

    this.svg = d3
      .select(container)
      .append('div')
      .attrs({
        class: 'main-content'
      })
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

  createToolbar(container: string, options: CoffeeOptions) {
    const toolbarElement = d3
      .select(container)
      .append('div')
      .attrs({
        class: 'toolbar'
      });

    toolbarElement
      .append('div')
      .attrs({
        class: 'logo'
      })
      .append('img')
      .attrs({
        src: 'assets/logo.png'
      });

    const projectDescriptionElement = toolbarElement.append('div').attrs({
      class: 'project-description'
    });

    projectDescriptionElement
      .append('div')
      .attrs({
        class: 'title'
      })
      .text(options != null ? options.projectName : 'New Project');

    projectDescriptionElement
      .append('div')
      .attrs({
        class: 'description'
      })
      .text('Coffee Designer Creator');
  }

  createVerticalToolbar(container: string) {
    const toolbarVerticalElement = d3
      .select(container)
      .append('ul')
      .attrs({
        class: 'vertical-toolbar'
      });

    toolbarVerticalElement
      .append('li')
      .append('svg')
      .attrs({
        class: 'icon',
        viewBox: '0 0 32 32'
      })
      .append('path')
      .attrs({
        d:
          'M30 8h-3v-3c0-1.105-0.895-2-2-2v0h-22c-1.105 0-2 0.895-2 2v0 16c0 1.105 0.895 2 2 2v0h3v3c0 1.105 0.895 2 2 2v0h22c1.105 0 2-0.895 2-2v0-16c0-1.105-0.895-2-2-2v0zM6 10v11h-3v-16h22v3h-17c-1.105 0-2 0.895-2 2v0zM18 18h-10v-6h10zM8 20h10v6h-10zM30 26h-10v-6h10zM30 18h-10v-6h10z'
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

            creator.delete();
            d3.select((creator.selfElement.node() as any).parentNode).remove();
            this.creators.splice(index, 1);
          }
        }
      ]);
    });

    // on class/table name change
    creator.on('name', () => {
      this.executeOnChangeCallbacks(
        OnChangeType.change,
        creator.classTable.toJson() as any
      );

      this.executeOnChangeCallbacks(
        OnChangeType.changeName,
        creator.classTable.toJson() as any
      );
    });

    // on Class/Table property change
    creator.on('property', () => {
      this.executeOnChangeCallbacks(
        OnChangeType.change,
        creator.classTable.toJson() as any
      );

      this.executeOnChangeCallbacks(
        OnChangeType.changeProperty,
        creator.classTable.toJson() as any
      );
    });

    // on Class/Table property change
    creator.on('position', () => {
      this.executeOnChangeCallbacks(
        OnChangeType.change,
        creator.classTable.toJson() as any
      );

      this.executeOnChangeCallbacks(
        OnChangeType.changePosition,
        creator.classTable.toJson() as any
      );
    });

    // on Class/Table property change
    creator.on('delete', () => {
      this.executeOnChangeCallbacks(
        OnChangeType.change,
        creator.classTable.toJson() as any
      );

      this.executeOnChangeCallbacks(
        OnChangeType.delete,
        creator.classTable.toJson() as any
      );
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

  bindMinimap(minimap: Minimap): void {}

  // Use to execute each callback that matches the type parameter
  private executeOnChangeCallbacks(
    type: OnChangeType,
    output: ClassTable | Array<ClassTable>
  ): void {
    this.callbackChanges.forEach(fn => {
      if (Utils.isArray(fn.type)) {
        const foundMatch = (fn.type as Array<OnChangeType>).find(
          t => t == type
        );

        if (foundMatch) {
          if (Utils.isArray(output)) {
            fn.callback(...(output as Array<ClassTable>));
          } else {
            fn.callback(output as ClassTable);
          }
        }
      } else if (fn.type == type) {
        if (Utils.isArray(output)) {
          fn.callback(...(output as Array<ClassTable>));
        } else {
          fn.callback(output as ClassTable);
        }
      }
    });
  }
}
