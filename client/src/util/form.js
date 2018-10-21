import React, { Component } from 'react';
import * as _ from 'lodash';
import validate from 'validate.js';
import moment from 'moment';

// takes an array of fieldsNames and returns a field name object like
// {
//  'fieldName1': 'fieldName1',
//  'fieldName2': 'fieldName2'
// }
// to emulate an enum value
export function getFieldNameObject(fieldNames) {
  return fieldNames.reduce((fieldNameObject, fieldName) => {
    fieldNameObject[fieldName] = fieldName;
    return fieldNameObject;
  }, {});
}

// Takes an Object whose keys are taken to be the field names
// or an array of field names
function initializeFormFields(names) {
  if (!(names instanceof Array)) {
    names = Object.keys(names);
  }

  return names.reduce((fields, name) => {
    fields[name] = {
      value: undefined,
      errors: [],
    };

    return fields;
  }, {});
};

function updateFormField(fields, fieldName, value, errors = []) {
  console.log('feilds', fields);
  console.log('value', value);
  console.log('errors', errors);
  return {
    ...fields,
    [fieldName]: {
      value,
      errors,
    },
  };
};

function updateFormErrors(fields, fieldsWithErrors) {
  return Object.keys(fields).reduce((newFields, fieldName) => {
    newFields[fieldName] = {
      value: fields[fieldName].value,
      errors: fieldsWithErrors[fieldName] || [],
    };

    return newFields;
  }, {});
};

export function fieldValue(fields, fieldName) {
  return fields[fieldName].value;
};

function fieldErrors(fields, fieldName) {
  return fields[fieldName].errors;
};

export function fieldHasError(fields, fieldName) {
  return fieldErrors(fields, fieldName).length > 0;
};

export function fieldErrorText(fields, fieldName) {
  return fieldErrors(fields, fieldName).join('. ');
};

function valuesForFields(fields, fieldNames) {
  return fieldNames.reduce((values, name) => {
    values[name] = fields[name].value;
    return values;
  }, {});
};

// Custom validators

// validate that this field has the same value as another field,
// with `other` passed to options
validate.validators.sameValueAs = (value, options, key, attributes) => {
  const otherValue = attributes[options.other];
  if (value !== otherValue) {
    return `should be the same as ${options.other}`;
  }
};

validate.validators.isUrl = (value, options) => {
  if (!options.allowEmpty && value === '') {
    return 'cannot be empty';
  }

  if (value === '') return null;

  return validate.single(value, { format: {
    // eslint-disable-next-line no-useless-escape
    pattern: /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/i,
  }});
};

validate.extend(validate.validators.datetime, {
  parse: (value) => +moment.utc(value),
  format: (value, options) => {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

// Validations

// Cross-validate a single field with other field values
function validateField(fieldName, value, values, constraints) {
  values = {
    ...values,
    [fieldName]: value,
  };
  const errors = validate(values, _.pick(constraints, fieldName));
  if (errors) {
    return errors[fieldName];
  }
}

// HOC
// Takes a field name object
// along with a constraints object for validation
// and returns a HOC with the form state like
// {
//  fieldName1: { value: '', errors: [] },
//  fieldName2: { value: '', errors: [] },
//  ...
// }

export const withForm = (fieldNames, constraints)  => (FormComponent) => {
  return class Form extends Component {
    constructor(props) {
      super(props);

      this.state = initializeFormFields(fieldNames);
    }

    valuesForAllFields = () => {
      return valuesForFields(
        this.state,
        Object.keys(fieldNames),
      );
    }

    validateAllFields = () => {
      const values = this.valuesForAllFields();
      const errors = validate(values, constraints);

      if (errors) {
        this.setState({
          ...updateFormErrors(this.state, errors),
        });
        return false;
      }

      return true;
    }

    setField = (name, value) => {
      const values = this.valuesForAllFields();
      const errors = validateField(name, value, values, constraints);
      console.log('error', errors);
      this.setState({
        ...updateFormField(this.state, name, value, errors),
      });
      console.log('state', this.state);
    }

    handleChange = (event) => {
      let { value } = event.target;

      if (!value) {
        value = undefined;
      }
      this.setField(event.target.name, value);
    }

    resetField = (name) => {
      this.setState({
        ...updateFormField(this.state, name, undefined, []),
      });
    }

    resetAllFields = () => {
      const updatedFields = Object.keys(fieldNames).reduce((fields, name) => {
        return updateFormField(fields, name, undefined, []);
      }, this.state);

      this.setState({
        ...updatedFields,
      });
    }

    render() {
      return (
        <FormComponent
          fields={this.state}
          handleChange={this.handleChange}
          validateAllFields={this.validateAllFields}
          valuesForAllFields={this.valuesForAllFields}
          setField={this.setField}
          resetField={this.resetField}
          resetAllFields={this.resetAllFields}
          {...this.props}
        />
      );
    }
  };
};
