import { Diagnosis, Entry } from "../../types";

interface Props {
    entry: Entry;
    diagnoses: Diagnosis[] | undefined;
}

const BasicEntryDetail = ({ entry, diagnoses }: Props) => {
    return (
        <div>
            <div><p><em>{entry.description}</em></p></div>
            <div>Seen by <strong>{entry.specialist}</strong></div>
            <h4>Diagnoses</h4>
            {diagnoses && <ul>
                {diagnoses.map(diagnosis => (<li key={diagnosis.code}>{diagnosis.code} {diagnosis.name}</li>))}
            </ul>}
            {!diagnoses && <div>N/A</div>}
        </div>
    );
};

export default BasicEntryDetail;
