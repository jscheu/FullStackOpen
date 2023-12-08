import {
  Alert,
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
import { Entry, EntryTypeStringLiterals, NewEntry } from '../../types';
import DiagnosisCodes from './DiagnosisCodes';
import SickLeave from './SickLeave';
import EntryErrorMessage from './EntryErrorMessage';
import { isDate, isHealthCheckRating, isNumber, toNewEntry } from '../../utils';
import pateintsService from '../../services/patients';
import { useParams } from 'react-router-dom';

interface Props {
  onCancel: () => void;
  onCreateEntry: (data: Entry) => void;
  patientId?: string;
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

const AddEntryForm = ({ onCancel, onCreateEntry, patientId }: Props) => {
  const [entryType, setEntryType] = useState<string>('');
  const [date, setDate] = useState<string | null>('');
  const [description, setDescription] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');

  const [rating, setRating] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');

  const [errorMessageTitle, setErrorMessageTitle] = useState<string>('');
  const [errorMessageMain, setErrorMessageMain] = useState<string[]>([]);
  const [errorMessageType, setErrorMessageType] = useState<string>('');
  const [errorMessageRequired, setErrorMessageRequired] = useState<string>('');
  const [errorMessageOptional, setErrorMessageOptional] = useState<string>('');
  const [error, setError] = useState<ErrorState>(errorStateFalse);

  const paramsId = useParams().id;

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

  const getMissingFields = (): ErrorState => {
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

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();

    setErrorMessageTitle('');
    setErrorMessageType('');
    setErrorMessageRequired('');
    setErrorMessageOptional('');

    const id = patientId ? patientId : paramsId;

    if (!id) {
      setErrorMessageTitle('Unable to create entry');
      setErrorMessageMain(['Unknown patient id']);
      return;
    }

    /* initially set errors to missing required fields */
    /*-------------------------------------------------*/
    const newError = getMissingFields();

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

    if (newError.sickLeaveStart)
      setErrorMessageOptional('Sick leave start date required');
    if (newError.sickLeaveEnd)
      setErrorMessageOptional('Sick leave end date required');

    /* validate user inputs and construct array of error messages */
    /*------------------------------------------------------------*/

    const newErrorMessage: string[] = [];

    if (date && !isDate(date)) {
      newErrorMessage.push('Incorrect date format');
      newError.date = true;
    }

    if (entryType) {
      switch (entryType) {
        case 'HealthCheck':
          if (
            !newError.rating &&
            (!isNumber(Number.parseInt(rating)) ||
              !isHealthCheckRating(Number.parseInt(rating)))
          ) {
            newErrorMessage.push('Incorrect HealthCheck rating');
            newError.rating = true;
          }
          break;
        case 'Hospital':
          if (!newError.dischargeDate && !isDate(dischargeDate)) {
            newErrorMessage.push('Incorrect discharge date format');
            newError.dischargeDate = true;
          }
          break;
        default:
          break;
      }
    }

    if (sickLeaveStart && !isDate(sickLeaveStart)) {
      newErrorMessage.push('Incorrect sick leave start date');
      newError.sickLeaveStart = true;
    }

    if (sickLeaveEnd && !isDate(sickLeaveEnd)) {
      newErrorMessage.push('Incorrect sick leave end date');
      newError.sickLeaveEnd = true;
    }

    setError(newError);
    setErrorMessageMain(newErrorMessage);

    /* attempt to send if no errors */
    /*------------------------------*/
    if (!hasError(newError)) {
      const sickLeave =
        sickLeaveStart && sickLeaveEnd
          ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
          : null;

      const discharge =
        dischargeDate && criteria ? { date: dischargeDate, criteria } : null;
      try {
        const newEntry: NewEntry = toNewEntry({
          type: entryType,
          date,
          description,
          specialist,
          diagnosisCodes,
          sickLeave,
          healthCheckRating: Number.parseInt(rating),
          employerName,
          discharge
        });

        const createdEntry = await pateintsService.addEntry(id, newEntry);
        onCreateEntry(createdEntry);
      } catch (e) {
        setErrorMessageTitle('An unexpected error occurred');
        if (e instanceof Error) {
          setErrorMessageMain([e.message]);
        }
      }
    } else setErrorMessageTitle('Please correct the following errors');
  };

  const renderTypeDetails = () => {
    switch (entryType) {
      case 'HealthCheck':
        return (
          <TextField
            label="HealthCheck Rating"
            autoComplete="healthcheck rating"
            placeholder="Number 0 - 3"
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
            autoComplete="employer name"
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
              type="date"
              autoComplete="discharge date"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              value={dischargeDate}
              error={error.dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Criteria"
              autoComplete="criteria"
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
      {(hasError(error) || errorMessageMain.length > 0) && (
        <>
          <Alert severity="error">
            <Typography variant="subtitle1" gutterBottom>
              {errorMessageTitle}
            </Typography>
            <ul>
              {errorMessageMain.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Alert>
          <Divider style={{ marginBottom: 12 }} />
        </>
      )}
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
                type="date"
                autoComplete="date"
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                value={date}
                error={error.date}
                onChange={({ target }) => setDate(target.value)}
              />
              <TextField
                label="Description"
                autoComplete="description"
                fullWidth
                value={description}
                error={error.description}
                onChange={({ target }) => setDescription(target.value)}
              />
              <TextField
                label="Specialist"
                autoComplete="specialist"
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
