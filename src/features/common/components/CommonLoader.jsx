import {RotatingLines} from "react-loader-spinner";

const CommonLoader = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
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