import notConnected_img from "../../../images/no_acc_connect_img.svg";
import {useNavigate} from "react-router";
import {getInitialLetterCap} from "../../../utils/commonUtils";

const ConnectSocialMediaAccount=({messageFor=""})=>{
    const navigate=useNavigate();
    return (
            <div className="acc_not_connected_outer text-center">
                <img className={"acc_not_connected_img mt-0"} src={notConnected_img}
                     alt="notConnected_img"/>
                <h2 className="acc_not_connected_heading">No {getInitialLetterCap(messageFor.toLowerCase())} is connected Yet! Please
                    connect an {messageFor.toLowerCase()}.</h2>
                <button onClick={() => {
                    navigate("/dashboard")
                }} className={"connection-error-close-btn mt-3"}>Connect Now
                </button>
            </div>
    );
}
export default ConnectSocialMediaAccount