import "./Loader.css"

const Loader = ({className=""}) => {

    return (
        <>
            <span className={"spinner-border spinner-border-sm loader "+className } role="status" aria-hidden="true"></span>
        </>
    )
}
export default Loader
