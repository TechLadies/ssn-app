import { Paper, TextField, Typography, MenuItem, Grid, Checkbox, ListItemText, Chip, Select, Input, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { fieldErrorText, fieldHasError, fieldValue } from 'util/form';

import { ProjectType } from 'components/shared/enums/ProjectType';
import { ProjectTypeDisplayMapping } from 'components/shared/display_mappings/ProjectTypeDisplayMapping';
import { ProjectFrequency } from 'components/shared/enums/ProjectFrequency';
import { ProjectRegion } from 'components/shared/enums/ProjectRegion';
import { ProjectRegionDisplayMapping } from 'components/shared/display_mappings/ProjectRegionDisplayMapping';
import { ProjectFrequencyDisplayMapping } from 'components/shared/display_mappings/ProjectFrequencyDisplayMapping';
import { IssueAddressed } from 'components/shared/enums/IssueAddressed';
import { IssueAddressedDisplayMapping } from 'components/shared/display_mappings/IssueAddressedDisplayMapping';
import { FieldName } from './ProjectFormFields';

const isSelectedBefore = (issuesAddressed = [], data) => !!issuesAddressed.find(issue => issue === data);

const renderFrequency = (handleChange, fields) => {
  return fields[FieldName.projectType].value === ProjectType.RECURRING &&
    <TextField
      required
      select
      label="Frequency"
      value={fieldValue(fields, FieldName.frequency) || ''}
      error={fieldHasError(fields, FieldName.frequency)}
      helperText={fieldErrorText(fields, FieldName.frequency)}
      onChange={handleChange}
      name={FieldName.frequency}
      InputLabelProps={{ shrink: true }}
      fullWidth
    >
      <MenuItem value={ProjectFrequency.EVERY_DAY}>{ProjectFrequencyDisplayMapping[ProjectFrequency.EVERY_DAY]}</MenuItem>
      <MenuItem value={ProjectFrequency.A_FEW_TIMES_A_WEEK}>{ProjectFrequencyDisplayMapping[ProjectFrequency.A_FEW_TIMES_A_WEEK]}</MenuItem>
      <MenuItem value={ProjectFrequency.ONCE_A_WEEK}>{ProjectFrequencyDisplayMapping[ProjectFrequency.ONCE_A_WEEK]}</MenuItem>
      <MenuItem value={ProjectFrequency.FORTNIGHTLY}>{ProjectFrequencyDisplayMapping[ProjectFrequency.FORTNIGHTLY]}</MenuItem>
      <MenuItem value={ProjectFrequency.A_FEW_TIMES_A_MONTH}>{ProjectFrequencyDisplayMapping[ProjectFrequency.A_FEW_TIMES_A_MONTH]}</MenuItem>
      <MenuItem value={ProjectFrequency.ONCE_A_MONTH}>{ProjectFrequencyDisplayMapping[ProjectFrequency.ONCE_A_MONTH]}</MenuItem>
      <MenuItem value={ProjectFrequency.A_FEW_TIMES_A_YEAR}>{ProjectFrequencyDisplayMapping[ProjectFrequency.A_FEW_TIMES_A_YEAR]}</MenuItem>
      <MenuItem value={ProjectFrequency.ONCE_A_YEAR}>{ProjectFrequencyDisplayMapping[ProjectFrequency.ONCE_A_YEAR]}</MenuItem>
    </TextField>;
};

const renderStartEndDate = (classes, handleChange, fields) => {
  return fields[FieldName.projectType].value === ProjectType.EVENT &&
    <div className={classes.sharedRow}>
      <TextField
        type="date"
        name={FieldName.startDate}
        id={FieldName.startDate}
        label="Start Date"
        onChange={handleChange}
        value={fieldValue(fields, FieldName.startDate) || ''}
        InputLabelProps={{ shrink: true }}
        error={fieldHasError(fields, FieldName.startDate)}
        helperText={fieldErrorText(fields, FieldName.startDate)}
        required
        fullWidth
        className={classes.columnInRow}
      />
      <TextField
        type="date"
        name={FieldName.endDate}
        id={FieldName.endDate}
        label="End Date"
        onChange={handleChange}
        value={fieldValue(fields, FieldName.endDate) || ''}
        InputLabelProps={{ shrink: true }}
        error={fieldHasError(fields, FieldName.endDate)}
        helperText={fieldErrorText(fields, FieldName.endDate)}
        required
        fullWidth
      />
    </div>;
};

const handleProjectTypeChange = (event, handleChange, resetField, FieldName) => {
  if (event.target.value === ProjectType.RECURRING) {
    resetField(FieldName.startDate);
    resetField(FieldName.endDate);
  } else {
    resetField(FieldName.frequency);
  }
  handleChange(event);
};

export const _ProjectDetails = ({ classes, fields, handleChange, resetField }) => {

  return (
    <React.Fragment>
      <Paper square className={classes.paper}>
        <Typography variant="headline">Project Details</Typography>
        <Grid item xs={12}>
          <div className={classes.sharedRow}>
            <TextField
              required
              select
              label="Project Type"
              fullWidth
              value={fieldValue(fields, FieldName.projectType) || ''}
              onChange={event => handleProjectTypeChange(event, handleChange, resetField, FieldName)}
              name={FieldName.projectType}
              className={classes.columnInRow}
              InputLabelProps={{ shrink: true }}
              error={fieldHasError(fields, FieldName.projectType)}
              helperText={fieldErrorText(fields, FieldName.projectType)}
            >
              <MenuItem value={ProjectType.EVENT}>
                {ProjectTypeDisplayMapping[ProjectType.EVENT]}
              </MenuItem>
              <MenuItem value={ProjectType.RECURRING}>
                {ProjectTypeDisplayMapping[ProjectType.RECURRING]}
              </MenuItem>
            </TextField>
            {renderFrequency(handleChange, fields)}
          </div>
          {renderStartEndDate(classes, handleChange, fields)}
          <TextField
            type="time"
            name={FieldName.time}
            className={classes.sharedRowTextField}
            id={FieldName.time}
            label="Time"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={fieldValue(fields, FieldName.time) || ''}

            inputProps={{
              step: 1800, // 30mins
            }}
          />
          <TextField
            select
            label="Region"
            className={classes.sharedRowTextField}
            value={fieldValue(fields, FieldName.region) || ''}
            onChange={handleChange}
            name={FieldName.region}
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="">
              <em>Undecided</em>
            </MenuItem>
            <MenuItem value={ProjectRegion.CENTRAL}>{ProjectRegionDisplayMapping[ProjectRegion.CENTRAL]}</MenuItem>
            <MenuItem value={ProjectRegion.NORTH}>{ProjectRegionDisplayMapping[ProjectRegion.NORTH]}</MenuItem>
            <MenuItem value={ProjectRegion.SOUTH}>{ProjectRegionDisplayMapping[ProjectRegion.SOUTH]}</MenuItem>
            <MenuItem value={ProjectRegion.EAST}>{ProjectRegionDisplayMapping[ProjectRegion.EAST]}</MenuItem>
            <MenuItem value={ProjectRegion.WEST}>{ProjectRegionDisplayMapping[ProjectRegion.WEST]}</MenuItem>
          </TextField>
          <div>
            <TextField
              name={FieldName.address}
              className={classes.textField}
              id={FieldName.address}
              label="Address"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              value={fieldValue(fields, FieldName.address) || ''}
              fullWidth
            />
          </div>
          <div className={classes.textField}>
            <InputLabel htmlFor="issues-addressed-select" style={{ fontSize: 12 }}>Issues Addressed</InputLabel>
            <Select
              multiple
              value={fieldValue(fields, FieldName.issuesAddressed) || []}
              onChange={handleChange}
              name={FieldName.issuesAddressed}
              input={<Input id="issues-addressed-select" />}
              fullWidth
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip
                      key={value}
                      label={IssueAddressedDisplayMapping[value]}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
            >
              {Object.keys(IssueAddressed).map(data => {
                return (
                  <MenuItem value={data} key={data}>
                    <Checkbox checked={isSelectedBefore(fields.issuesAddressed.value, data)} />
                    <ListItemText primary={IssueAddressedDisplayMapping[data]} />
                  </MenuItem>
                );
              })}
            </Select>
          </div>
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
  textField: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  sharedRowTextField: {
    margin: '20px',
    marginLeft: '0px',
    width: '150px',
  },
  sharedRow: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  columnInRow: {
    marginRight: theme.spacing.unit,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

export const ProjectDetails = withStyles(styles)(_ProjectDetails);

// export const TestProjectOwnerNewProjectForm = withForm(
//   FieldName,
// )(_ProjectOwnerNewProjectForm);
