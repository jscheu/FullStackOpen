import { List, ListItem, Typography } from '@mui/material';
import { Discharge } from '../../types';

interface Props {
  discharge: Discharge;
}

const HospitalEntryDetail = ({ discharge }: Props) => {
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Discharge
      </Typography>
      <List>
        <ListItem key={0}>Date: {discharge.date}</ListItem>
        <ListItem key={1}>
          Criteria: <em>{discharge.criteria}</em>
        </ListItem>
      </List>
    </>
  );
};

export default HospitalEntryDetail;
