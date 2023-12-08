import { HealthCheckRating } from '../../types';
import HealthRatingBar from '../HealthRatingBar';

interface Props {
  healthCheckRating: HealthCheckRating;
}

const HealtheCheckEntryDetail = ({ healthCheckRating }: Props) => {
  return <HealthRatingBar rating={healthCheckRating} showText={true} />;
};

export default HealtheCheckEntryDetail;
