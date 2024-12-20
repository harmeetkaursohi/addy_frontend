import notConnected_img from "../../../images/no_acc_connect_img.svg";
import {useNavigate} from "react-router";
import { Image } from "react-bootstrap";
const ConnectSocialMediaAccount = ({image, message}) => {
    const navigate = useNavigate();
    return (
        <div className="acc_not_connected_outer text-center">
            {/* <Image className={"acc_not_connected_img mt-0"} src={image ? image : notConnected_img}
                 alt="notConnected_img"/> */}
              {image}
            <h3 className="mb-3 mt-4">{message}</h3>
            <button onClick={() => {
                navigate("/dashboard")
            }} className={"connection-error-close-btn"}>Connect</button>
        </div>
    );
}
export default ConnectSocialMediaAccount