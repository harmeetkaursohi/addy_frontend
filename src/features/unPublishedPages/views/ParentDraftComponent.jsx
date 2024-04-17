import {useEffect, useState} from "react";
import { useSelector} from "react-redux";
import DraftComponent from "./DraftComponent";
import {sortByKey} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import noDraftPosts from "../../../images/no_draft_posts.png";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";

export const ParentDraftComponent = ({setDraftPost, reference = ""}) => {
    const {sidebar} = useAppContext()
    const [drafts, setDrafts] = useState(null);
    const [deletedAndPublishedPostIds, setDeletedAndPublishedPostIds] = useState({
        deletedPostIds: [],
        publishedPostIds: [],

    });
    const getAllDraftPostsByCustomerAndPeriodData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);

    useEffect(() => {
        if (drafts !== null && Array.isArray(drafts) && (deletedAndPublishedPostIds.deletedPostIds.length + deletedAndPublishedPostIds.publishedPostIds.length === drafts?.length)) {
            setDrafts([])
        }
    }, [deletedAndPublishedPostIds])

    useEffect(() => {
        if (getAllDraftPostsByCustomerAndPeriodData?.data) {
            setDrafts(Object.values(getAllDraftPostsByCustomerAndPeriodData?.data));
        }
        return () => {
            setDrafts(null)
            setDeletedAndPublishedPostIds({
                deletedPostIds: [],
                publishedPostIds: [],
            })
        }
    }, [getAllDraftPostsByCustomerAndPeriodData]);

    return (

        <div className={"row mt-5"}>
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
                                sortByKey(drafts, "createdAt").map((curDraftObject, key) => {
                                    return (deletedAndPublishedPostIds?.deletedPostIds?.includes(curDraftObject?.id) || deletedAndPublishedPostIds?.publishedPostIds?.includes(curDraftObject?.id)) ? <></> :
                                        <div
                                            className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}
                                            key={key + "curDraftObject"}>
                                            {
                                                <DraftComponent batchIdData={curDraftObject}
                                                                setDraftPost={setDraftPost}
                                                                setDrafts={setDrafts} reference={reference}
                                                                deletedAndPublishedPostIds={deletedAndPublishedPostIds}
                                                                setDeletedAndPublishedPostIds={setDeletedAndPublishedPostIds}
                                                />
                                            }
                                        </div>

                                })
            }
        </div>
    )


}

