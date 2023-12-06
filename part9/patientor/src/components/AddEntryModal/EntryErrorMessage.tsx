import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  message: string;
}

const EntryErrorMessage = ({ message }: Props) => (
  <Box display="flex" alignItems="center" color="error.main">
    <ErrorIcon style={{ marginRight: 8 }} />
    <Typography variant="body2">{message}</Typography>
  </Box>
);

export default EntryErrorMessage;
