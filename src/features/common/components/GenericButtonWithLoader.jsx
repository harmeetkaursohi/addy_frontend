function GenericButtonWithLoader({label, onClick = null, className, isLoading = false, loaderClassName = "",id=new Date().getTime().toString()}) {
    return (
        <button className={className} id={id} onClick={onClick} disabled={isLoading}>
            {isLoading ? (
                    <>
                        <span className={loaderClassName ? loaderClassName : "spinner-border spinner-border-sm me-1"}
                              role="status" aria-hidden="true"/>
                        Loading...
                    </>
                ) :
                (
                    label
                )}
        </button>
    );
}

export default GenericButtonWithLoader;
