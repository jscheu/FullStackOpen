import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useEffect, useState } from 'react';
import EntryErrorMessage from './EntryErrorMessage';
import diagnosisService from '../../services/diagnoses';
import { Diagnosis } from '../../types';

interface Props {
  onDiagnosisCodesChange: (codes: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const DiagnosisCodes = ({ onDiagnosisCodesChange }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [codes, setCodes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (event: SelectChangeEvent<typeof codes>) => {
    const {
      target: { value }
    } = event;
    setCodes(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    onDiagnosisCodesChange(codes);
  }, [codes, onDiagnosisCodesChange]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setDiagnoses(await diagnosisService.getDiagnoses());
        setErrorMessage('');
      } catch (e) {
        setErrorMessage('Unable to load diagnosis codes');
      }
    };
    fetchDiagnoses();
  }, []);

  return (
    <>
      {errorMessage && <EntryErrorMessage message={errorMessage} />}
      <FormControl fullWidth>
        <InputLabel id="diagnosis-code-multiple-checkbox-label">
          Diagnosis Codes
        </InputLabel>
        <Select
          labelId="diagnosis-code-multiple-checkbox-label"
          id="diagnosis-code-multiple-checkbox"
          multiple
          value={codes}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {diagnoses.map((diagnosis, index) => (
            <MenuItem key={index} value={diagnosis.code}>
              <Checkbox checked={codes.indexOf(diagnosis.code) > -1} />
              <ListItemText primary={`${diagnosis.code} ${diagnosis.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default DiagnosisCodes;
