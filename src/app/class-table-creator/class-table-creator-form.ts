import {
  InputForm,
  CancelSaveButtonForm,
  SelectForm,
  CheckboxForm,
  SelectFormAfter
} from '../../models/class-table-form';
import * as d3 from 'd3';
import { InputFormAfter } from '../../models/class-table-form/input-form-after';

export class ClassTableCreatorForm {
  constructor() {}

  createInput(inputForm: InputForm) {
    const formGroup = inputForm.form.append('div').attrs({
      class: 'class-table-form-group'
    });

    const label = formGroup.append('label');
    const input = formGroup.append('input');

    label.text(inputForm.label);
    input.attrs({
      type: 'text',
      value: inputForm.initialValue
    });

    input.on('input', function() {
      if (inputForm.onValueChange) {
        inputForm.onValueChange(this.value, this);
      }
    });

    return formGroup;
  }

  createInputAfter(inputForm: InputFormAfter) {
    const newElement = document.createElement('div');
    inputForm.after
      .node()
      .parentNode.insertBefore(newElement, inputForm.after.node().nextSibling);

    const formGroup = d3
      .select(newElement)
      .attr('key', inputForm.key)
      .append('div')
      .attrs({
        class: 'class-table-form-group'
      });

    const label = formGroup.append('label');
    const input = formGroup.append('input');

    label.text(inputForm.label);
    input.attrs({
      type: 'text',
      value: inputForm.initialValue
    });

    input.on('input', function() {
      if (inputForm.onValueChange) {
        inputForm.onValueChange(this.value, this);
      }
    });

    return formGroup;
  }

  createCheckboxInput(checkboxForm: CheckboxForm) {
    const formGroup = checkboxForm.form.append('div').attrs({
      class: 'class-table-form-group'
    });

    const label = formGroup.append('label');
    const input = formGroup.append('input');

    label.text(checkboxForm.label);
    input.attrs({
      type: 'checkbox'
    });

    if (checkboxForm.initialValueChecked) {
      input.attr('checked', true);
    }

    input.on('input', function() {
      if (checkboxForm.onValueChange) {
        checkboxForm.onValueChange(this.checked, this);
      }
    });

    return formGroup;
  }

  createSelectInput(inputForm: SelectForm) {
    const formGroup = inputForm.form.append('div').attrs({
      class: 'class-table-form-group'
    });

    const label = formGroup.append('label');
    const select = formGroup.append('select');

    label.text(inputForm.label);
    const options = select.selectAll('options');

    inputForm.options(options);

    select.on('change', function() {
      if (inputForm.onValueChange) {
        inputForm.onValueChange(this.value, this.options[
          this.selectedIndex
        ] as any);
      }
    });

    select.node().value = inputForm.initialValue;

    return formGroup;
  }

  createSelectInputAfter(inputForm: SelectFormAfter) {
    const newElement = document.createElement('div');
    inputForm.after
      .node()
      .parentNode.insertBefore(newElement, inputForm.after.node().nextSibling);

    const formGroup = d3
      .select(newElement)
      .attr('key', inputForm.key)
      .append('div')
      .attrs({
        class: 'class-table-form-group'
      });

    const label = formGroup.append('label');
    const select = formGroup.append('select');

    label.text(inputForm.label);
    const options = select.selectAll('options');

    inputForm.options(options);

    select.on('change', function() {
      if (inputForm.onValueChange) {
        inputForm.onValueChange(this.value, this.options[
          this.selectedIndex
        ] as any);
      }
    });

    select.node().value = inputForm.initialValue;

    return formGroup;
  }

  createCancelSaveButton(buttonsForm: CancelSaveButtonForm) {
    const formGroup = buttonsForm.form.append('div').attrs({
      class: 'class-table-form-group-btn'
    });

    const btnCancel = formGroup.append('btn');
    const btnSave = formGroup.append('btn');

    btnCancel
      .attrs({
        type: 'button',
        class: 'btn btn-cancel ' + buttonsForm.cancelButtonClass || ''
      })
      .text(buttonsForm.cancelButtonLabel);

    btnSave
      .attrs({
        type: 'button',
        class: 'btn btn-save ' + buttonsForm.saveButtonClass || ''
      })
      .text(buttonsForm.saveButtonLabel);

    btnCancel.on('click', function() {
      buttonsForm.cancelButtonOnClick();
    });

    btnSave.on('click', function() {
      buttonsForm.saveButtonOnClick();
    });

    return formGroup;
  }
}
