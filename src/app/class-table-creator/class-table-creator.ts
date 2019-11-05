import { ClassTable } from '../../models/class-table/class-table';
import { Tooltip } from '../tooltip';
import { ClassTableCreatorForm } from './class-table-creator-form';
import { Utils } from '../utils';
import { ClassTableProperty } from '../../models/class-table/class-table-property';
import * as d3 from 'd3';
import { CSharpTypes } from '../../data/csharptypes';
import { ClassTablePropertyType } from '../../models/class-table/class-table-property-type';
import { Toast } from '../toast';
import { ClassTablePosition } from '../../models/class-table/class-table-position';
import { ContextMenu } from '../context-menu/context-menu';

/**
 * Creates the class table element,
 * Has all the rules for class table
 */
export class ClassTableCreator {
  classTable: ClassTable;
  columns: Array<any>;
  selfElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  containerElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  otherClassTable: Array<ClassTable>;

  // Listeners
  private onPropertyChange: Function;
  private onPositionChange: Function;
  private onNameChange: Function;
  private onDelete: Function;

  constructor(
    containerElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    classTable: ClassTable,
    otherClassTables: Array<ClassTable>
  ) {
    this.init(containerElement, classTable, otherClassTables);
  }

  on(
    type: 'property' | 'position' | 'name' | 'delete',
    callback: () => void
  ): void {
    if (type == 'property') {
      this.onPropertyChange = callback;
    } else if (type == 'position') {
      this.onPositionChange = callback;
    } else if (type == 'name') {
      this.onNameChange = callback;
    } else if (type == 'delete') {
      this.onDelete = callback;
    }
  }

  delete(): void {
    if (this.onDelete) {
      this.onDelete();
    }
  }

  update(): void {
    if (this.selfElement) {
      this.selfElement.remove();
    }

    this.selfElement = this.containerElement
      .append('foreignObject')
      .attrs({
        x: this.classTable.position.x,
        y: this.classTable.position.y
      })
      .append('xhtml:table')
      .attrs({
        class: 'class-table'
      })
      .raise();

    this.createHeader(this.selfElement, this.classTable);
    this.createBody(this.selfElement, this.classTable);
    this.createFooter(this.selfElement);
    this.bindDrag(this.selfElement);
  }

  private init(
    containerElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    classTable: ClassTable,
    otherClassTables: Array<ClassTable>
  ): void {
    // Set up
    this.classTable = classTable;
    this.containerElement = containerElement;
    this.otherClassTable = otherClassTables;

    this.columns = [
      {
        label: 'Property name',
        tooltip: 'Name of property class'
      },
      {
        label: 'Type',
        tooltip: 'Type of property Class'
      },
      {
        label: 'Column name',
        tooltip: 'Column name of Table'
      },
      {
        label: 'Required',
        tooltip: 'Is property required?'
      },
      {
        label: 'Has method',
        tooltip: 'Does property has a self change method?'
      },
      {
        label: 'Actions',
        tooltip: 'Actions'
      }
    ];

    this.update();
  }

  private createHeader(
    tableElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    classTable: ClassTable
  ) {
    const self = this;
    const headerTR = tableElement
      .append('thead')
      .append('tr')
      .attrs({
        class: 'caption'
      });

    headerTR
      .append('th')
      .attrs({
        class: 'class-table-name',
        colspan: this.columns.length - 1
      })
      .insert(function() {
        const tooltip = new Tooltip().create(this, 'Class Name / Table Name');

        tooltip.append('span').text(classTable.getClassTableName());

        return tooltip.node() as HTMLElement;
      });

    // Add columns to colspan
    const colspan = this.columns.length;

    headerTR
      .append('th')
      .attrs({
        class: 'table-ops',
        colspan: 1
      })
      .insert(function() {
        const tooltip = new Tooltip().create(this, 'Edit');

        const edit = tooltip.append('img').attrs({
          class: 'edit',
          src: 'assets/table-edit.png'
        });

        edit.on('click', () => {
          // Toggle class open-form
          const headerNode = headerTR.node();
          headerNode.classList.toggle('open-form');

          if (headerNode.classList.contains('open-form')) {
            const formDataTableChanges = {
              className: classTable.name,
              tableName: classTable.tableName
            };

            const form = headerTR.append('th').attrs({
              class: 'class-table-form',
              colspan: colspan
            });

            new ClassTableCreatorForm().createInput({
              form: form,
              initialValue: classTable.name,
              key: Utils.generateID(),
              label: 'Class Name',
              onValueChange: (value, element) => {
                formDataTableChanges.className = value;
              }
            });

            new ClassTableCreatorForm().createInput({
              form: form,
              initialValue: classTable.tableName,
              key: Utils.generateID(),
              label: 'Table Name',
              onValueChange: (value, element) => {
                formDataTableChanges.tableName = value;
              }
            });

            new ClassTableCreatorForm().createCancelSaveButton({
              form: form,
              cancelButtonClass: '',
              saveButtonClass: '',
              cancelButtonLabel: 'Cancel',
              saveButtonLabel: 'Save',
              cancelButtonOnClick: () => {
                form.remove();
                headerNode.classList.remove('open-form');
              },
              saveButtonOnClick: () => {
                try {
                  // Change table name and class values
                  self.classTable.changeName(formDataTableChanges.className);

                  self.classTable.changeTableName(
                    formDataTableChanges.tableName
                  );

                  // Close form
                  form.remove();
                  headerTR.select('class-table-form').remove();

                  if (self.onNameChange) {
                    self.onNameChange();
                  }
                  self.update();
                } catch (error) {
                  new Toast().show(error.message);
                }
              }
            });
          } else {
            headerTR.select('class-table-form').remove();
          }
        });

        return tooltip.node() as HTMLElement;
      });
  }

  private createBody(
    tableElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    classTable: ClassTable
  ) {
    const self = this;
    const tbody = tableElement.append('tbody');

    // Create columns elements
    tbody
      .append('tr')
      .attrs({
        class: 'property-header'
      })
      .selectAll('headers')
      .data(this.columns)
      .enter()
      .append('td')
      .insert(function(column) {
        const tooltip = new Tooltip().create(this, column.tooltip);

        tooltip.append('strong').text(column.label);

        return tooltip.node() as HTMLElement;
      });

    tbody
      .selectAll('columns')
      .data(classTable.properties)
      .enter()
      .append('tr')
      .selectAll('td')
      .data(function(property: ClassTableProperty) {
        d3.select(this).attr('key', property.key);

        return [
          {
            label: property.name,
            value: property.name
          },
          {
            label: property.type.value,
            value: property.type.value
          },
          {
            label: property.columnName,
            value: property.isPrimaryKey ? 'primary' : property.columnName
          },
          {
            label: property.isRequired,
            value: property.isRequired
          },
          {
            label: property.hasChangeMethod,
            value: property.hasChangeMethod
          },
          {
            label: property.key,
            value: 'actions'
          }
        ];
      })
      .enter()
      .append('td')
      .html((labelValue: any, e) => {
        if (labelValue.value == 'actions') {
          return `<div class="actions-table"> 
          <div class="tooltip"> 
            <img class="edit-property" key="${labelValue.label}" src="assets/edit.png">
            <span class="tooltiptext tooltip-top" style="margin-left:-18px;">Edit</span>
          </div>

          <div class="tooltip">
            <img  class="sort-property" key="${labelValue.label}" src="assets/sort.png">
            <span class="tooltiptext tooltip-top" style="margin-left:-18px;">Sort</span>
          </div>
           
           </div>
          `;
        } else if (labelValue.value == 'primary') {
          return `<div class="table-primary"> 
            <span>${labelValue.label}</span>
            <div class="tooltip">
              <img src="assets/key.png">
              <span class="tooltiptext tooltip-top" style="margin-left:-38px;">Primary Key</span>
            </div>
           </div>
          `;
        }

        return labelValue.label;
      });

    // Add listeners to edit properties
    tbody
      .selectAll('.edit-property')
      .each(function() {
        return this;
      })
      .on('click', function() {
        const currentEditElement = d3.select(this);
        const key = currentEditElement.attr('key');

        const parentTr = tbody.select(`[key="${key}"]`);

        const property = classTable.properties.find(prop => prop.key == key);
        self.createFormProperty(parentTr, property);
      });
  }

  private createFooter(
    tableElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
  ) {
    const footerTR = tableElement.append('tfoot').append('tr');

    const operationsElement = footerTR
      .append('td')
      .attrs({
        colspan: this.columns.length
      })
      .append('div')
      .attrs({
        class: 'operations'
      })
      .append('div')
      .attrs({
        class: 'operations-action'
      });

    operationsElement.append('img').attrs({
      src: 'assets/table-row-add.png'
    });

    operationsElement
      .append('span')
      .attrs({
        class: 'action'
      })
      .text('Add property');

    operationsElement.on('click', () => {
      this.createFormProperty(
        footerTR,
        new ClassTableProperty(
          null,
          null,
          null,
          null,
          new ClassTablePropertyType('string', false),
          false,
          false,
          true,
          true
        )
      );
    });
  }

  private createFormProperty(
    parentTr: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    property: ClassTableProperty
  ): void {
    // Holds property values on change
    var formDataChanges = {
      name: property.name,
      type: property.type,
      columnName: property.columnName,
      isPrimaryKey: property.isPrimaryKey,
      isRequired: property.isRequired,
      hasChangeMethod: property.hasChangeMethod
    };

    parentTr.attr('class', 'editing');

    const form = parentTr.append('td').attrs({
      class: 'property-form class-table-form',
      colspan: this.columns.length
    });

    new ClassTableCreatorForm().createInput({
      form: form,
      initialValue: property.name,
      label: 'Property Name',
      onValueChange: (value, element) => {
        formDataChanges.name = value;
      }
    });

    new ClassTableCreatorForm().createSelectInput({
      form: form,
      initialValue: property.type.value,
      label: 'Type',
      options: selectOptions => {
        let availableTypes = CSharpTypes.map(
          val => new ClassTablePropertyType(val, false)
        );
        availableTypes = availableTypes.concat(
          this.otherClassTable.map(
            ct => new ClassTablePropertyType(ct.name, true)
          )
        );

        selectOptions
          .data(availableTypes)
          .enter()
          .append('option')
          .attr('isClass', value => {
            return value.isClass;
          })
          .text(type => type.value);
      },
      onValueChange: (value, element) => {
        const isClass = Utils.convertToBoolean(
          d3.select(element).attr('isClass')
        );

        formDataChanges.type = new ClassTablePropertyType(
          value,
          isClass ? true : false
        );
      }
    });

    new ClassTableCreatorForm().createInput({
      form: form,
      initialValue: property.columnName,
      label: 'Column Name',
      onValueChange: (value, element) => {
        formDataChanges.columnName = value;
      }
    });

    new ClassTableCreatorForm().createCheckboxInput({
      form: form,
      initialValueChecked: property.isPrimaryKey,
      label: 'Primary Key',
      onValueChange: (value, element) => {
        formDataChanges.isPrimaryKey = value;
      }
    });

    new ClassTableCreatorForm().createCheckboxInput({
      form: form,
      initialValueChecked: property.isRequired,
      label: 'Required',
      onValueChange: (value, element) => {
        formDataChanges.isRequired = value;
      }
    });

    new ClassTableCreatorForm().createCheckboxInput({
      form: form,
      initialValueChecked: property.hasChangeMethod,
      label: 'Has method',
      onValueChange: (value, element) => {
        formDataChanges.hasChangeMethod = value;
      }
    });

    new ClassTableCreatorForm().createCancelSaveButton({
      form: form,
      cancelButtonClass: '',
      saveButtonClass: '',
      cancelButtonLabel: 'Cancel',
      saveButtonLabel: 'Save',
      cancelButtonOnClick: () => {
        form.remove();
        (parentTr.node() as HTMLElement).classList.remove('editing');
      },
      saveButtonOnClick: () => {
        try {
          let propertyIndex = this.classTable.properties.findIndex(
            prop => prop.key == property.key
          );

          // If didn´t found then add it to properties, because is creating a new property
          if (propertyIndex < 0) {
            this.classTable.addProperty(property);
            propertyIndex = this.classTable.properties.findIndex(
              prop => prop.key == property.key
            );
          }

          // Change property values
          this.classTable.properties[propertyIndex].changeName(
            formDataChanges.name
          );
          this.classTable.properties[propertyIndex].changeColumnName(
            formDataChanges.columnName
          );
          this.classTable.properties[propertyIndex].changeType(
            formDataChanges.type
          );
          this.classTable.properties[propertyIndex].setIsPrimaryKey(
            formDataChanges.isPrimaryKey
          );
          this.classTable.properties[propertyIndex].setIsRequired(
            formDataChanges.isRequired
          );
          this.classTable.properties[propertyIndex].setHasChangeMethod(
            formDataChanges.hasChangeMethod
          );

          // Close form
          form.remove();
          (parentTr.node() as HTMLElement).classList.remove('editing');

          if (this.onPropertyChange) {
            this.onPropertyChange();
          }
          this.update();
        } catch (error) {
          new Toast().show(error.message);
        }
      }
    });
  }

  private bindDrag(
    element: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
  ): void {
    let x, y;
    let hasDrag = false;
    element = d3.select((element.node() as any).parentNode);

    const drag = d3
      .drag()
      .on('start', () => {
        // Close context menu if it is open
        new ContextMenu('close');

        x = parseInt(element.attr('x'));
        y = parseInt(element.attr('y'));
      })
      .on('drag', () => {
        hasDrag = true;
        x += d3.event.dx;
        y += d3.event.dy;

        // Close context menu if it is open
        new ContextMenu('close');

        element.attr('x', x).attr('y', y);

        this.classTable.changePosition(new ClassTablePosition(x, y));
      })
      .on('end', () => {
        if (this.onPositionChange && hasDrag) {
          hasDrag = false;
          this.onPositionChange();
        }
      });

    element.call(drag);
  }
}
