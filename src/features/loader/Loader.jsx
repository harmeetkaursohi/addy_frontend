import "./loader.css"
import laoderImg from "../../images/loading-gif.gif"
const Loader = () => {

    return (
        <>
        {/* <div className="loader_outers">
            <div className="loader_inner_Content">
                <img src={laoderImg} height="40px" width="40px"/>
            </div>
        </div> */}
            <span className="spinner-border spinner-border-sm loader" role="status" aria-hidden="true"></span>
        </>
    )
}
export default Loader