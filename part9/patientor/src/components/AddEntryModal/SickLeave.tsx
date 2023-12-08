import { Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError: boolean;
  endDateError: boolean;
}

const SickLeave = ({
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError
}: Props) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    onStartDateChange(date);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    onEndDateChange(date);
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Sick Leave
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start"
            type="date"
            autoComplete="start date"
            fullWidth
            placeholder="YYYY-MM-DD"
            InputLabelProps={{
              shrink: true
            }}
            value={startDate}
            error={startDateError}
            onChange={({ target }) => handleStartDateChange(target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End"
            type="date"
            autoComplete="end date"
            fullWidth
            placeholder="YYYY-MM-DD"
            InputLabelProps={{
              shrink: true
            }}
            value={endDate}
            error={endDateError}
            onChange={({ target }) => handleEndDateChange(target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SickLeave;
