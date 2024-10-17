import notConnected_img from "../../../images/no_acc_connect_img.svg";
import {useNavigate} from "react-router";
import { Image } from "react-bootstrap";
const ConnectSocialMediaAccount = ({image, message}) => {
    const navigate = useNavigate();
    return (
        <div className="acc_not_connected_outer text-center">
            <Image className={"acc_not_connected_img mt-0"} src={image ? image : notConnected_img}
                 alt="notConnected_img"/>
            <pre className="acc_not_connected_heading mt-4">{message}</pre>
            <button onClick={() => {
                navigate("/dashboard")
            }} className={"connection-error-close-btn mt-3"}>Connect Now
            </button>
        </div>
    );
}
export default ConnectSocialMediaAccount