import CommonModal from "../../../common/components/CommonModal.jsx";

const FacebookModal = ({showFacebookModal, setShowFacebookModal,facebookPageList,setFacebookData,facebookConnectedPages,noPageFoundMessage,socialMediaType,socialMediaAccountInfo}) => {

    return (
        <>
            <CommonModal showModal={showFacebookModal} setShowModal={setShowFacebookModal} allPagesList={facebookPageList} setFacebookData={setFacebookData}  connectedPagesList={facebookConnectedPages} socialMediaType={socialMediaType}  noPageFoundMessage={noPageFoundMessage} socialMediaAccountInfo={socialMediaAccountInfo}/>
        </>
    )
}

export default FacebookModal;