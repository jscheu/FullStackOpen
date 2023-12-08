import { Box, Typography } from '@mui/material';
import { Patient } from '../../types';

interface Props {
  patient: Patient;
}

const PatientInfo = ({ patient }: Props) => {
  return (
    <Box mt={2} mb={2}>
      <Typography variant="h4" gutterBottom>
        {patient.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        SSN: {patient.ssn}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Gender: {patient.gender}
      </Typography>
      <Typography variant="body1" gutterBottom>
        DOB: {patient.dateOfBirth}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Occupation: {patient.occupation}
      </Typography>
    </Box>
  );
};

export default PatientInfo;
