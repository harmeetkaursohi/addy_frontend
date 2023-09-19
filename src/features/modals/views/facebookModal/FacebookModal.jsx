import CommonModal from "../../../common/components/CommonModal.jsx";
import {SocialAccountProvider} from "../../../../utils/contantData.js";

const FacebookModal = ({showFacebookModal, setShowFacebookModal,facebookPageList,setFacebookData,facebookConnectedPages}) => {

    return (
        <>
            <CommonModal showModal={showFacebookModal} setShowModal={setShowFacebookModal} allPagesList={facebookPageList} setFacebookData={setFacebookData}  connectedPagesList={facebookConnectedPages} socialMediaType={SocialAccountProvider.FACEBOOK} />
        </>
    )
}

export default FacebookModal;