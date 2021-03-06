import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, TextField, Typography, IconButton } from '@material-ui/core';
import { AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon } from '@material-ui/icons';

import { fieldErrorText, fieldHasError, fieldValue } from 'util/form';
import { VolunteerRequirementForm } from './VolunteerRequirementForm';
import { FieldName } from './ProjectFormFields';

const renderVolunteerRequirements = (
  volunteerRequirementRefs,
  classes,
  handleDeleteVolunteerRequirement,
) => {
  const numberOfRows = Math.max(...Object.keys(volunteerRequirementRefs)) + 1;
  return [...Array(numberOfRows).keys()].reduce((rows, rowNum) => {
    if (rowNum in volunteerRequirementRefs) {
      const volunteerRequirementRow = (
        <div key={rowNum} className={classes.volunteerRow}>
          <VolunteerRequirementForm
            ref={volunteerRequirementRefs[rowNum]}
          />
          <IconButton
            onClick={() => handleDeleteVolunteerRequirement(rowNum)}
            className={classes.button}
          >
            <RemoveCircleIcon />
          </IconButton>
        </div>
      );

      return [...rows,volunteerRequirementRow];
    }
    return rows;
  }, []);
};

const _ProjectVolunteerDetails = ({
  volunteerRequirementRefs,
  classes,
  handleDeleteVolunteerRequirement,
  fields,
  handleChange,
  handleAddVolunteerRequirement,
}) => {
  return (
    <React.Fragment>
      <Paper square className={classes.paper}>
        <Typography variant="h5">Volunteer Details</Typography>
        <Grid item xs={12}>
          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Description of Volunteers Needed"
            margin="normal"
            name={FieldName.volunteerRequirementsDescription}
            id={FieldName.volunteerRequirementsDescription}
            key={FieldName.volunteerRequirementsDescription}
            value={fieldValue(fields, FieldName.volunteerRequirementsDescription) || ''}
            error={fieldHasError(fields, FieldName.volunteerRequirementsDescription)}
            helperText={fieldErrorText(fields, FieldName.volunteerRequirementsDescription)}
            onChange={handleChange}
            multiline
            className={classes.textField}
          />

          {Object.keys(volunteerRequirementRefs).length > 0 ? renderVolunteerRequirements(
            volunteerRequirementRefs,
            classes,
            handleDeleteVolunteerRequirement,
          ): ''}

          <IconButton
            onClick={handleAddVolunteerRequirement}
            className={classes.button}
          >
            <AddCircleIcon />
          </IconButton>

          <TextField
            fullWidth
            InputLabelProps={{ shrink: true }}
            label="Volunteer Benefits"
            margin="normal"
            name={FieldName.volunteerBenefitsDescription}
            id={FieldName.volunteerBenefitsDescription}
            key={FieldName.volunteerBenefitsDescription}
            value={fieldValue(fields, FieldName.volunteerBenefitsDescription) || ''}
            error={fieldHasError(fields, FieldName.volunteerBenefitsDescription)}
            helperText={fieldErrorText(fields, FieldName.volunteerBenefitsDescription)}
            onChange={handleChange}
            multiline
          />
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

const styles = theme => ({
  root: {
    display: 'flex',
    margin: '0 auto',
  },
  paper: {
    padding: '30px',
    height: '100%',
  },
  button: {
    color: 'black',
    margin: '0px',
    marginLeft: '5px',
    transform: 'scale(0.8)',
    height: '15px',
    width: '15px',
    marginBottom: '20px',
    marginTop: '5px',
    padding: '5px',
  },
  textField: {
    marginBottom: '25px',
  },
  volunteerRow: {
    display: 'flex',
    marginTop: '20px',
  },
});


export const ProjectVolunteerDetails = withStyles(styles)(_ProjectVolunteerDetails);
