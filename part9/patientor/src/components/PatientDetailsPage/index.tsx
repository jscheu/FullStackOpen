import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import patientService from '../../services/patients';
import { Entry, Patient } from '../../types';

import PatientInfo from './PatientInfo';
import EntriesList from './EntriesList';
import { Box, Button, Typography } from '@mui/material';
import AddEntryModal from '../AddEntryModal';

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { id } = useParams();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchPatient = async (patientId: string): Promise<void> => {
    setLoading(true);
    try {
      setPatient(await patientService.getPatientById(patientId));
    } catch (error) {
      setErrorMessage(`Something went wrong: ${error}`);
    }
    setLoading(false);
  };

  const onCreateEntry = (newEntry: Entry) => {
    closeModal();

    if (patient) {
      const updatedEntries = patient?.entries.concat(newEntry);

      const updatedPatient = {
        ...patient,
        entries: updatedEntries
      };

      setPatient(updatedPatient);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  return (
    <div className="App">
      {errorMessage && <h2>{errorMessage}</h2>}
      {loading && <h2>Loading patient info...</h2>}
      {patient && <PatientInfo patient={patient} />}
      {patient && (
        <>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" gutterBottom>
              Entries
            </Typography>
            <Button variant="contained" onClick={() => openModal()}>
              Add Entry
            </Button>
          </Box>
        </>
      )}
      {patient && (
        <AddEntryModal
          modalOpen={modalOpen}
          onClose={closeModal}
          onCreateEntry={onCreateEntry}
        />
      )}
      {patient && <EntriesList entries={patient.entries} />}
    </div>
  );
};

export default PatientDetailsPage;
