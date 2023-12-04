import { Entry, Diagnosis } from "../../types";
import diagnosesService from '../../services/diagnoses';
import { useEffect, useState } from "react";
import BasicEntryDetail from "./BasicEntryDetail";
import HealtheCheckEntryDetail from "./HealthCheckEntryDetail";
import HospitalEntryDetail from "./HospitalEntryDetail";
import OccupationalHealthcareEntryDetail from "./OccupationalHealthcareEntryDetail";

interface Props {
    entries: Array<Entry>;
}

const EntriesList = ({ entries }: Props) => {
    const [allDiagnoses, setAllDiagnoses] = useState<Diagnosis[]>([]);

    const getEntryDiagnoses = (codes: string[]): Diagnosis[] => {
        const diagnosisArray: Diagnosis[] = [];
        codes.forEach(code => {
            const diagnosis = allDiagnoses.find(d => d.code === code);
            if (diagnosis) diagnosisArray.push(diagnosis);
        })

        return diagnosisArray;
    }

    const assertNever = (x: never): never => {
        throw new Error('Unexpected object type: ' + x);
    }

    const getEntryTitleText = (entryType: Entry["type"]): string => {
        switch (entryType) {
            case 'HealthCheck':
                return 'Health Check';
            case 'Hospital':
                return 'Hospital';
            case 'OccupationalHealthcare':
                return 'Occupational Healthcare'
            default:
                assertNever(entryType);
        }
        return '';
    }

    const renderDetailComponenet = (entry: Entry): React.ReactElement => {
        switch (entry.type) {
            case 'HealthCheck':
                return <HealtheCheckEntryDetail healthCheckRating={entry.healthCheckRating} />
            case 'Hospital':
                return <HospitalEntryDetail discharge={entry.discharge} />
            case 'OccupationalHealthcare':
                return <OccupationalHealthcareEntryDetail employerName={entry.employerName} />
            default:
                assertNever(entry);
        }
        return <></>
    }

    useEffect(() => {
        //Create array of unique diagnosis codes present in entries array
        const uniqueCodes: string[] = [];
        const extractUniqueCodes = (): void => {
            if (entries) {
                entries.forEach(entry => {
                    if (entry.diagnosisCodes) {
                        entry.diagnosisCodes.forEach(code => {
                            if (!uniqueCodes.includes(code)) uniqueCodes.push(code);
                        });
                    }
                });
            }
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
            const diagnosisPromises = uniqueCodes.map(code => fetchDiagnosis(code));
            const fetchDiagnoses = await Promise.all(diagnosisPromises);
            setAllDiagnoses(fetchDiagnoses);
        };
        fetchDiagnoses();
    }, [entries]);

    return (
        <>
            <h3>Entries</h3>
            {(entries && entries.length > 0)
                ? <div>
                    {entries.map(entry => (
                        <div key={entry.id}>
                            <div><strong>{entry.date} {getEntryTitleText(entry.type)}</strong></div>
                            <BasicEntryDetail
                                entry={entry}
                                diagnoses={entry.diagnosisCodes
                                    ? getEntryDiagnoses(entry.diagnosisCodes)
                                    : []} />
                            {renderDetailComponenet(entry)}
                        </div>
                    ))}
                </div>
                : <div>No entries to display</div>}
        </>
    );
};

export default EntriesList;
