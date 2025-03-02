import "./EditRole.css"
import LeftBoxCreate from "../../../components/committeeRO/LeftBoxCreate";
import RightBoxCreate from "../../../components/committeeRO/RightBoxCreate";

const CreateRole = () => {
    return (
        <div className="edit-role-opening">
            <LeftBoxCreate />
            <RightBoxCreate />
        </div>
    ); 
};

export default CreateRole;