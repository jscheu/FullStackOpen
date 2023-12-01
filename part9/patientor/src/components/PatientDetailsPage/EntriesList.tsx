import { Entry, Diagnosis } from "../../types";
import diagnosesService from '../../services/diagnoses';
import { useEffect, useState } from "react";
import EntryDetail from "./EntryDetail";
import BasicEntryDetail from "./BasicEntryDetail";

interface Props {
    entries: Array<Entry>;
}

const EntriesList = ({ entries }: Props) => {
    const [allDiagnoses, setAllDiagnoses] = useState<Diagnosis[]>([]);

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
                            <div><strong>{entry.date}</strong></div>
                            <BasicEntryDetail entry={entry} diagnoses={entry.diagnosisCodes?.map(code => allDiagnoses.find(diagnosis => diagnosis.code === code))} />
                        </div>
                    ))}
                </div>
                : <div>No entries to display</div>}
        </>
    );
};

export default EntriesList;
