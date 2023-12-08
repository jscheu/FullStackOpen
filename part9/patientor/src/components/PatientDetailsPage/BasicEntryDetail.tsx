import { Divider, Grid, List, ListItem, Typography } from '@mui/material';
import { Diagnosis, Entry } from '../../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[] | undefined;
}

const BasicEntryDetail = ({ entry, diagnoses }: Props) => {
  const getEntryTitleText = (entryType: Entry['type']): string => {
    switch (entryType) {
      case 'HealthCheck':
        return 'Health Check';
      case 'Hospital':
        return 'Hospital';
      case 'OccupationalHealthcare':
        return 'Occupational Healthcare';
    }
  };

  return (
    <div>
      <div>
        <Typography variant="h6" gutterBottom>
          {entry.date} {getEntryTitleText(entry.type)}
        </Typography>
      </div>
      <div>
        <p>
          <em>{entry.description}</em>
        </p>
      </div>
      <div>
        Seen by <strong>{entry.specialist}</strong>
      </div>
      <Divider style={{ marginBottom: 12 }} />

      {diagnoses && diagnoses.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Diagnoses
          </Typography>
          <List>
            {diagnoses.map((diagnosis, index) => (
              <ListItem key={index}>
                {diagnosis.code} {diagnosis.name}
              </ListItem>
            ))}
          </List>
          <Divider style={{ marginBottom: 12 }} />
        </>
      )}

      {entry.sickLeave && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Sick Leave
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <p>
                Start: <strong>{entry.sickLeave.startDate}</strong>
              </p>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <p>
                End: <strong>{entry.sickLeave.endDate}</strong>
              </p>
            </Grid>
          </Grid>
          <Divider style={{ marginBottom: 12 }} />
        </>
      )}
    </div>
  );
};

export default BasicEntryDetail;
