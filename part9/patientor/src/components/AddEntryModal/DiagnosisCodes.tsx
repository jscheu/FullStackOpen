import {
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import EntryErrorMessage from './EntryErrorMessage';

interface Props {
  onDiagnosisCodesChange: (codes: string[]) => void;
}

const DiagnosisCodes = ({ onDiagnosisCodesChange }: Props) => {
  const [codes, setCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const addCode = () => {
    if (!codes.includes(code)) {
      setCodes(codes.concat(code));
      setCode('');
      setErrorMessage('');
      setError(false);
    } else {
      setErrorMessage('Cannot add duplicate codes');
      setError(true);
    }
  };

  const removeCode = (codeToRemove: string) => {
    setCodes(codes.filter((c) => c !== codeToRemove));
  };

  useEffect(() => {
    onDiagnosisCodesChange(codes);
  }, [codes, onDiagnosisCodesChange]);

  return (
    <>
      <FormControl fullWidth>
        <Typography variant="subtitle1" gutterBottom>
          Diagnosis Codes
        </Typography>
        {errorMessage && <EntryErrorMessage message={errorMessage} />}
        {codes.length > 0 ? (
          <List>
            {codes.map((c, index) => (
              <ListItem key={index}>
                <ListItemText primary={c} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeCode(c)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="subtitle2" gutterBottom>
            No diagnosis codes added
          </Typography>
        )}
        <TextField
          label="Add Code"
          fullWidth={true}
          value={code}
          error={error}
          onChange={({ target }) => setCode(target.value)}
        />
      </FormControl>
      <Button variant="contained" onClick={addCode}>
        Add Code
      </Button>
    </>
  );
};

export default DiagnosisCodes;
