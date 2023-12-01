import { Patient } from "../../types";

interface Props {
    patient: Patient;
}

const PatientInfo = ({ patient }: Props) => {
    return (
        <>
            <h2>{patient.name}</h2>
            <div>SSN: {patient.ssn}</div>
            <div>Gender: {patient.gender}</div>
            <div>DOB: {patient.dateOfBirth}</div>
            <div>Occupation: {patient.occupation}</div>
        </>
    );
};

export default PatientInfo;
