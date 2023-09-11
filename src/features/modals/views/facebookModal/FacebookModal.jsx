import CommonModal from "../../../common/components/CommonModal.jsx";

const FacebookModal = ({showFacebookModal, setShowFacebookModal,facebookPageList,setFacebookData,facebookConnectedPages ,setHandleClick }) => {

    return (
        <>
            <CommonModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal} facebookPageList={facebookPageList} setFacebookData={setFacebookData} facebookConnectedPages={facebookConnectedPages} setHandleClick={setHandleClick}/>
        </>
    )
}

export default FacebookModal;