import { getFieldNameObject } from 'util/form';
import { ProjectType } from 'components/shared/enums/ProjectType';

export const FieldName = getFieldNameObject([
  'title',
  'description',
  'volunteerSignupUrl',

  'volunteerRequirementsDescription',
  'volunteerBenefitsDescription',

  'projectType',
  'startDate',
  'endDate',
  'frequency',
  'time',
  'region',
  'address',
  'issuesAddressed',
]);

export const constraints = {
  [FieldName.title]: {
    presence: { allowEmpty: false },
    length: { maximum: 50 },
  },
  [FieldName.description]: {
    presence: { allowEmpty: false },
    length: { maximum: 5000 },
  },
  [FieldName.volunteerSignupUrl]: {
    isUrl: { allowEmpty: true },
  },

  [FieldName.volunteerRequirementsDescription]: {
    length: { maximum: 500 },
  },
  [FieldName.volunteerBenefitsDescription]: {
    length: { maximum: 500 },
  },

  [FieldName.projectType]: {
    presence: { allowEmpty: false },
  },
  [FieldName.startDate]: (value, attributes) => {
    if (attributes.projectType === ProjectType.RECURRING) return null;

    return {
      datetime: {
        latest: attributes.endDate,
      },
      presence: { allowEmpty: false },
    };
  },
  [FieldName.endDate]: (value, attributes) => {
    if (attributes.projectType === ProjectType.RECURRING) return null;

    return {
      datetime: {
        earliest: attributes.startDate,
      },
      presence: { allowEmpty: false },
    };
  },
  [FieldName.frequency]: (_value, attributes) => {
    if (attributes.projectType === ProjectType.EVENT) return null;

    return {
      presence: { allowEmpty: false },
    };
  },
};

export const validateGroupsMap = {
  fields: {
    [FieldName.startDate]: 'eventDates',
    [FieldName.endDate]: 'eventDates',
  },
  validateGroups: {
    eventDates: [FieldName.startDate, FieldName.endDate],
  },
};
