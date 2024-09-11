import {RotatingLines} from "react-loader-spinner";
import { useAppContext } from "./AppProvider";

const CommonLoader = ({classname}) => {
    const {sidebar}=useAppContext()
   
  
    return (
        <div className={` ${sidebar && classname==="fallback_loader_outer" ? "loader_outer_box":classname} d-flex justify-content-center align-items-center min-vh-100`}>
            <div className="text-center">
                <RotatingLines
                    strokeColor="#F07C33"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="60"
                    visible={true}
                />
            </div>
        </div>
    )
}

export default CommonLoader;
