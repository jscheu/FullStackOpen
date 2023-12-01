import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import patients from "../../services/patients";
import { Patient } from "../../types";

import PatientInfo from "./PatientInfo";
import EntriesList from "./EntriesList";

const PatientDetailsPage = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { id } = useParams();

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
            {patient && <EntriesList entries={patient.entries} />}
        </div>
    );
};

export default PatientDetailsPage;
