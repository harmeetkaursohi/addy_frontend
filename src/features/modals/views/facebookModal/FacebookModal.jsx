import CommonModal from "../../../common/components/CommonModal.jsx";

const FacebookModal = ({showFacebookModal, setShowFacebookModal,facebookPageList,setFacebookData,facebookConnectedPages}) => {

    return (
        <>
            <CommonModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal} facebookPageList={facebookPageList} setFacebookData={setFacebookData}  facebookConnectedPages={facebookConnectedPages}/>
        </>
    )
}

export default FacebookModal;