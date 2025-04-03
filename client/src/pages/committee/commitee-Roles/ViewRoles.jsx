import Title from "../../../components/committeeRO/Title";
import ROtable from "../../../components/committeeRO/ROtable";
import { useState } from "react";

const ViewRoles = () => {
  const [selectedClubId, setSelectedClubId] = useState(null);
  return (
    <div>
        <Title setSelectedClubId={setSelectedClubId} />
        <ROtable selectedClubId={selectedClubId} />
    </div>
    );
};
  
export default ViewRoles;