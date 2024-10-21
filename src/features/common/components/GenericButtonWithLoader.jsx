function GenericButtonWithLoader({
                                     label,
                                     onClick = null,
                                     className,
                                     isLoading = false,
                                     isDisabled = false,
                                     loaderClassName = "",
                                     id = new Date().getTime().toString(),
                                     contentText = "Loading..."
                                 }) {

    return (

        <button className={className} id={id} onClick={onClick} disabled={isLoading || isDisabled}
                style={{
                    // opacity: isDisabled ? "0.6" : "1.0",
                    cursor: isDisabled ? "not-allowed" : "",
                    background: isDisabled ? "#A2A2A2" : "",
                      borderColor: isDisabled ? "#A2A2A2" : ""
                }}>
            {
                isLoading ?
                    <>
                        <span className={loaderClassName ? loaderClassName : "spinner-border spinner-border-sm me-1"}
                              role="status" aria-hidden="true"/>
                        {contentText}
                    </>
                    :
                    label
            }
        </button>
    );
}

export default GenericButtonWithLoader;
