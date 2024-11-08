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
                    color: isDisabled ? "#fff" : "",
                      borderColor: isDisabled ? "#A2A2A2" : ""
                }}>
            {
              isLoading ?
                    <>
                        {contentText}
                        <span className={loaderClassName ? loaderClassName : "spinner-border spinner-border-sm ms-1"}
                              role="status" aria-hidden="true"/>
                    </>
                    :
                    label
            }
        </button>
    );
}

export default GenericButtonWithLoader;
