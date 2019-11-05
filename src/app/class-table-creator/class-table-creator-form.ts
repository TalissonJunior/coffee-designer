import {
  InputForm,
  CancelSaveButtonForm,
  SelectForm,
  CheckboxForm
} from '../../models/class-table-form';

export class ClassTableCreatorForm {
  constructor() {}

  createInput(inputForm: InputForm): void {
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
  }

  createCheckboxInput(checkboxForm: CheckboxForm): void {
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
  }

  createSelectInput(inputForm: SelectForm): void {
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
  }

  createCancelSaveButton(buttonsForm: CancelSaveButtonForm): void {
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
  }
}
