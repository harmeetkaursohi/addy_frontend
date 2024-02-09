import CommonModal from "../../../common/components/CommonModal.jsx";

const ConnectPagesModal = ({showModal, setShowModal,allPagesList,setFacebookData,connectedPagesList,noPageFoundMessage,socialMediaType,socialMediaAccountInfo}) => {

    return (
        <>
            <CommonModal showModal={showModal} setShowModal={setShowModal} allPagesList={allPagesList} setFacebookData={setFacebookData}  connectedPagesList={connectedPagesList} socialMediaType={socialMediaType}  noPageFoundMessage={noPageFoundMessage} socialMediaAccountInfo={socialMediaAccountInfo}/>
        </>
    )
}

export default ConnectPagesModal;