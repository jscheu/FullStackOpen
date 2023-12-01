import { Entry } from "../../types";

interface Props {
    entry: Entry;
    
}

const EntryDetail = ({ entry }: Props) => {

    const assertNever = (x: never): never => {
        throw new Error('Unexpected object: ' + x);
    };

    switch (entry.type) {
        case 'HealthCheck':
            return (
                <div>health check</div>
            );
        case 'Hospital':
            return (
                <div>hospital</div>
            );
        case 'OccupationalHealthcare':
            return (
                <div>occupational healthcare</div>
            );
        default:
            return assertNever(entry);
    }
};

export default EntryDetail;
