import { Discharge } from "../../types";

interface Props {
    discharge: Discharge;
};

const HospitalEntryDetail = ({ discharge }: Props) => {
    return (
        <div>
            <div>Discharge date: {discharge.date}</div>
            <div>Criteria: <em>{discharge.criteria}</em></div>
        </div>
    );
};

export default HospitalEntryDetail;
