import CommonModal from "../../../common/components/CommonModal.jsx";

const FacebookModal = ({showFacebookModal, setShowFacebookModal,facebookPageList,setFacebookData,connectedPagesList,noPageFoundMessage,socialMediaType,socialMediaAccountInfo}) => {

    return (
        <>
            <CommonModal showModal={showFacebookModal} setShowModal={setShowFacebookModal} allPagesList={facebookPageList} setFacebookData={setFacebookData}  connectedPagesList={connectedPagesList} socialMediaType={socialMediaType}  noPageFoundMessage={noPageFoundMessage} socialMediaAccountInfo={socialMediaAccountInfo}/>
        </>
    )
}

export default FacebookModal;