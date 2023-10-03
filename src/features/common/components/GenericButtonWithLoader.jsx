function GenericButtonWithLoader({label, onClick, className, isLoading, loaderClassName = ""}) {
    return (
        <button className={className} onClick={onClick} disabled={isLoading}>
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
