import { Card, CardContent } from '@mui/material';
import { Diagnosis, Entry } from '../../types';

import BasicEntryDetail from './BasicEntryDetail';
import HealtheCheckEntryDetail from './HealthCheckEntryDetail';
import HospitalEntryDetail from './HospitalEntryDetail';
import OccupationalHealthcareEntryDetail from './OccupationalHealthcareEntryDetail';

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetail = ({ entry, diagnoses }: Props) => {
  const renderDetailComponenet = (entry: Entry): React.ReactElement => {
    switch (entry.type) {
      case 'HealthCheck':
        return (
          <HealtheCheckEntryDetail
            healthCheckRating={entry.healthCheckRating}
          />
        );
      case 'Hospital':
        return <HospitalEntryDetail discharge={entry.discharge} />;
      case 'OccupationalHealthcare':
        return (
          <OccupationalHealthcareEntryDetail
            employerName={entry.employerName}
          />
        );
    }
  };

  return (
    <Card variant="outlined" style={{ marginBottom: 12, marginTop: 12 }}>
      <CardContent>
        <BasicEntryDetail entry={entry} diagnoses={diagnoses} />
        {renderDetailComponenet(entry)}
      </CardContent>
    </Card>
  );
};

export default EntryDetail;
