import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { Entry, EntryTypeStringLiterals } from '../../types';
import patientsService from '../../services/patients';
import DiagnosisCodes from './DiagnosisCodes';
import SickLeave from './SickLeave';
import EntryErrorMessage from './EntryErrorMessage';

interface Props {
  patientId: string;
  onCancel: () => void;
  onCreateEntry: (data: Entry) => void;
}

interface ErrorState {
  entryType: boolean;
  date: boolean;
  description: boolean;
  specialist: boolean;
  rating: boolean;
  employerName: boolean;
  dischargeDate: boolean;
  criteria: boolean;
  sickLeaveStart: boolean;
  sickLeaveEnd: boolean;
}

const errorStateFalse: ErrorState = {
  entryType: false,
  date: false,
  description: false,
  specialist: false,
  rating: false,
  employerName: false,
  dischargeDate: false,
  criteria: false,
  sickLeaveStart: false,
  sickLeaveEnd: false
};

const AddEntryForm = ({ patientId, onCancel, onCreateEntry }: Props) => {
  const [entryType, setEntryType] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');

  const [rating, setRating] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');

  const [errorMessageType, setErrorMessageType] = useState<string>('');
  const [errorMessageRequired, setErrorMessageRequired] = useState<string>('');
  const [errorMessageOptional, setErrorMessageOptional] = useState<string>('');
  const [error, setError] = useState<ErrorState>(errorStateFalse);

  const hasError = (e: ErrorState) => {
    return (
      e.entryType ||
      e.date ||
      e.description ||
      e.specialist ||
      e.rating ||
      e.employerName ||
      e.dischargeDate ||
      e.criteria ||
      e.sickLeaveStart ||
      e.sickLeaveEnd
    );
  };

  const validateFields = (): ErrorState => {
    const e = { ...errorStateFalse };

    if (!date) e.date = true;
    if (!description) e.description = true;
    if (!specialist) e.specialist = true;

    switch (entryType) {
      case 'HealthCheck':
        if (!rating) e.rating = true;
        break;
      case 'OccupationalHealthcare':
        if (!employerName) e.employerName = true;
        break;
      case 'Hospital':
        if (!dischargeDate) e.dischargeDate = true;
        if (!criteria) e.criteria = true;
        break;
      default:
        e.entryType = true;
    }

    if (sickLeaveStart && !sickLeaveEnd) e.sickLeaveEnd = true;
    if (!sickLeaveStart && sickLeaveEnd) e.sickLeaveStart = true;

    return e;
  };

  const constructNewEntry = (): object => {
    const baseProperties = {
      type: entryType,
      date,
      description,
      specialist,
      sickLeave:
        sickLeaveStart && sickLeaveEnd
          ? { sickLeaveStart, sickLeaveEnd }
          : undefined,
      diagnosisCodes: diagnosisCodes ? diagnosisCodes : undefined
    };

    switch (entryType) {
      case 'HealthCheck':
        return {
          ...baseProperties,
          healthCheckRating: rating
        };
      case 'OccupationalHealthcare':
        return {
          ...baseProperties,
          employerName
        };
      case 'Hospital':
        return {
          ...baseProperties,
          discharge: { dischargeDate, criteria }
        };
      default:
        throw new Error('Invalid entry type: ' + entryType);
    }
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();

    setErrorMessageType('');
    setErrorMessageRequired('');
    setErrorMessageOptional('');

    const newError = validateFields();

    if (newError.entryType) setErrorMessageType('Please select entry type');

    if (
      newError.date ||
      newError.description ||
      newError.specialist ||
      newError.rating ||
      newError.employerName ||
      newError.dischargeDate ||
      newError.criteria
    ) {
      setErrorMessageRequired('All fields are required');
    }

    if (newError.sickLeaveStart || newError.sickLeaveEnd) {
      setErrorMessageOptional('Sick leave requires start date and end date');
    }

    setError(newError);

    if (!hasError(newError)) {
      try {
        const values = constructNewEntry();
        const newEntry = await patientsService.addEntry(patientId, values);
        onCreateEntry(newEntry);
      } catch (error) {
        //
      }
    }
  };

  const renderTypeDetails = () => {
    switch (entryType) {
      case 'HealthCheck':
        return (
          <TextField
            label="HealthCheck Rating"
            fullWidth
            value={rating}
            error={error.rating}
            onChange={({ target }) => setRating(target.value)}
          />
        );
      case 'OccupationalHealthcare':
        return (
          <TextField
            label="Employer Name"
            fullWidth
            value={employerName}
            error={error.employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
        );
      case 'Hospital':
        return (
          <>
            <Divider style={{ marginTop: 12 }} />
            <Typography variant="subtitle1" gutterBottom>
              Discharge
            </Typography>
            <TextField
              label="Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={dischargeDate}
              error={error.dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={criteria}
              error={error.criteria}
              onChange={({ target }) => setCriteria(target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <form onSubmit={addEntry}>
        {errorMessageType && <EntryErrorMessage message={errorMessageType} />}
        <FormControl fullWidth>
          <InputLabel id="entry-type-select-label">Select Type</InputLabel>
          <Select
            labelId="entry-type-select-label"
            id="entry-type-select"
            label="Select Type"
            fullWidth
            value={entryType}
            error={error.entryType}
            onChange={({ target }) => setEntryType(target.value)}
          >
            {EntryTypeStringLiterals.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          <Card variant="outlined" style={{ marginBottom: 12, marginTop: 12 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Required Fields
              </Typography>
              {errorMessageRequired && (
                <EntryErrorMessage message={errorMessageRequired} />
              )}
              <TextField
                label="Date"
                placeholder="YYYY-MM-DD"
                fullWidth
                value={date}
                error={error.date}
                onChange={({ target }) => setDate(target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                value={description}
                error={error.description}
                onChange={({ target }) => setDescription(target.value)}
              />
              <TextField
                label="Specialist"
                fullWidth
                value={specialist}
                error={error.specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />
              {renderTypeDetails()}
            </CardContent>
          </Card>
          <Card variant="outlined" style={{ marginBottom: 12 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optional
              </Typography>
              {errorMessageOptional && (
                <EntryErrorMessage message={errorMessageOptional} />
              )}
              <Divider />
              <DiagnosisCodes onDiagnosisCodesChange={setDiagnosisCodes} />
              <Divider style={{ marginTop: 12 }} />
              <SickLeave
                onStartDateChange={setSickLeaveStart}
                onEndDateChange={setSickLeaveEnd}
                startDateError={error.sickLeaveStart}
                endDateError={error.sickLeaveEnd}
              />
            </CardContent>
          </Card>
        </FormControl>
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right'
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
