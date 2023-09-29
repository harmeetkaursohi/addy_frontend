// GenericButton component with loader
function GenericButtonWithLoader({label, onClick, className, isLoading}) {
    return (
        <button  className={className} onClick={onClick} disabled={isLoading}>
            {isLoading ? (
                    <>
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"/>
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
