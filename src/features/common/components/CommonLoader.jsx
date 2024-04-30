import {RotatingLines} from "react-loader-spinner";
// cmn_loader_outer
const CommonLoader = ({classname}) => {
    return (
        <div className={` d-flex justify-content-center align-items-center min-vh-100 ${classname}`}>
            <div className="text-center">
                <RotatingLines
                    strokeColor="#F07C33"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </div>
        </div>
    )
}

export default CommonLoader;