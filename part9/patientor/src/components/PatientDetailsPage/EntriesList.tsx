import { useEffect, useState } from 'react';

import { Entry, Diagnosis } from '../../types';
import diagnosesService from '../../services/diagnoses';

import EntryDetail from './EntryDetail';
import { Card, CardContent } from '@mui/material';

interface Props {
  entries: Array<Entry>;
}

const EntriesList = ({ entries }: Props) => {
  const [allDiagnoses, setAllDiagnoses] = useState<Diagnosis[]>([]);

  const getEntryDiagnoses = (codes: string[]): Diagnosis[] => {
    const diagnosisArray: Diagnosis[] = [];
    codes.forEach((code) => {
      const diagnosis = allDiagnoses.find((d) => d.code === code);
      if (diagnosis) diagnosisArray.push(diagnosis);
    });

    return diagnosisArray;
  };

  useEffect(() => {
    //Create array of unique diagnosis codes present in entries array
    const uniqueCodes: string[] = [];
    const extractUniqueCodes = (): void => {
      entries?.forEach((entry) => {
        entry.diagnosisCodes?.forEach((code) => {
          if (!uniqueCodes.includes(code)) uniqueCodes.push(code);
        });
      });
    };
    extractUniqueCodes();

    //Create array of Diagnosis objects for each unique code
    const fetchDiagnosis = async (code: string): Promise<Diagnosis> => {
      try {
        return await diagnosesService.getDiagnosisByCode(code);
      } catch (_error) {
        return {
          code,
          name: 'Unable to retrieve diagnosis name'
        };
      }
    };
    const fetchDiagnoses = async (): Promise<void> => {
      const diagnosisPromises = uniqueCodes.map((code) => fetchDiagnosis(code));
      const fetchDiagnoses = await Promise.all(diagnosisPromises);
      setAllDiagnoses(fetchDiagnoses);
    };
    fetchDiagnoses();
  }, [entries]);

  return (
    <>
      {entries && entries.length > 0 ? (
        <div>
          {entries.map((entry, index) => (
            <EntryDetail
              key={index}
              entry={entry}
              diagnoses={
                entry.diagnosisCodes
                  ? getEntryDiagnoses(entry.diagnosisCodes)
                  : []
              }
            />
          ))}
        </div>
      ) : (
        <Card variant="outlined" style={{ marginBottom: 12, marginTop: 12 }}>
          <CardContent>No entries to display</CardContent>
        </Card>
      )}
    </>
  );
};

export default EntriesList;
