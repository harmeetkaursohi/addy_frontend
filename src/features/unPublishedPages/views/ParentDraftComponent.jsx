import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../../app/auth/auth";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import DraftComponent from "./DraftComponent";
import {sortByKey} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import noDraftPosts from "../../../images/no_draft_posts.png";
import {useLocation} from "react-router-dom";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";

export const ParentDraftComponent = ({setDraftPost, reference = "", resetData = null}) => {

    const [drafts, setDrafts] = useState(null);
    const getAllDraftPostsByCustomerAndPeriodData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);

    useEffect(() => {
        if (getAllDraftPostsByCustomerAndPeriodData?.data) {
            setDrafts(Object.values(getAllDraftPostsByCustomerAndPeriodData?.data));
        }
        return ()=>{
            setDrafts(null)
        }
    }, [getAllDraftPostsByCustomerAndPeriodData]);

    return (

        <div className={"row m-0"}>
            {
                (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading || getAllDraftPostsByCustomerAndPeriodData.loading) ?
                    <CommonLoader classname={"cmn_loader_outer"}/> :
                    getAllConnectedSocialAccountData?.data?.length === 0 ?
                        <ConnectSocialMediaAccount messageFor={"ACCOUNT"}/> :
                        getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length === 0 ?
                            <ConnectSocialMediaAccount messageFor={"PAGE"}/> :
                            (drafts !== null && Array.isArray(drafts) && drafts?.length === 0) ?
                                <div className="noDraftPosts_outer p-5 text-center mt-3">
                                    <img src={noDraftPosts} alt={"No Drafts"} className=" no-draft-img"/>
                                    <h2 className="acc_not_connected_heading">Oops!
                                        It seems there are no posts to display at the
                                        moment.</h2>
                                </div>
                                :
                                drafts !== null && Array.isArray(drafts) && drafts?.length > 0 &&
                                sortByKey(drafts, "createdAt").map((curDraftObject, key) => (
                                    <div className={"col-lg-4 col-md-6 col-sm-12"} key={key + "curDraftObject"}>
                                        {
                                            <DraftComponent resetData={resetData} batchIdData={curDraftObject}
                                                            setDraftPost={setDraftPost}
                                                            setDrafts={setDrafts} reference={reference}/>
                                        }
                                    </div>
                                ))
            }
        </div>
    )


}

