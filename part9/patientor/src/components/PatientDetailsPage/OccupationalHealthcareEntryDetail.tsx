interface Props {
  employerName: string;
}

const OccupationalHealthcareEntryDetail = ({ employerName }: Props) => {
  return (
    <div>
      Employer Name: <strong>{employerName}</strong>
    </div>
  );
};

export default OccupationalHealthcareEntryDetail;
