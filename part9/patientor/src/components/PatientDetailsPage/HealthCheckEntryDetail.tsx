import { HealthCheckRating } from "../../types";

interface Props {
    healthCheckRating: HealthCheckRating;
}

const HealtheCheckEntryDetail = ({ healthCheckRating }: Props) => {
    return (
        <div>
            Health check rating: <strong>{healthCheckRating}</strong>
        </div>
    )
};

export default HealtheCheckEntryDetail;