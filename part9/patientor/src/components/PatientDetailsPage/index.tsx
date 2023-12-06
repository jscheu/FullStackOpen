import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import patients from '../../services/patients';
import { Entry, Patient } from '../../types';

import PatientInfo from './PatientInfo';
import EntriesList from './EntriesList';
import { Button } from '@mui/material';
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
      setPatient(await patients.getPatientById(patientId));
    } catch (error) {
      setErrorMessage(`Something went wrong: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  return (
    <div>
      {errorMessage && <h2>{errorMessage}</h2>}
      {loading && <h2>Loading patient info...</h2>}
      {patient && <PatientInfo patient={patient} />}
      {patient && (
        <Button variant="contained" onClick={() => openModal()}>
          Add Entry
        </Button>
      )}
      {patient && (
        <AddEntryModal
          modalOpen={modalOpen}
          onClose={closeModal}
          onSubmit={function (): Entry {
            throw new Error('Function not implemented.');
          }}
        />
      )}
      {patient && <EntriesList entries={patient.entries} />}
    </div>
  );
};

export default PatientDetailsPage;
