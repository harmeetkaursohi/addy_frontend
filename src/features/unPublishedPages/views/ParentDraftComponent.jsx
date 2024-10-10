import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import DraftComponent from "./DraftComponent";
import notConnected_img from "../../../images/no_acc_connect_img.svg";
import fb_img from "../../../images/fb.svg";
import instagram_img from "../../../images/instagram.png";
import linkedin_img from "../../../images/linkedin.svg";

import nature_img from "../../../images/download.jpg";

import {formatMessage, isNullOrEmpty, sortByKey} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import noDraftPosts from "../../../images/no_draft_posts.png";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {NoPostInDraft, NotConnected} from "../../../utils/contantData";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {useGetSocialMediaPostsByCriteriaQuery} from "../../../app/apis/postApi";

export const ParentDraftComponent = ({searchQuery}) => {

    const [drafts, setDrafts] = useState(null);
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")
    const draftPostsApi = useGetSocialMediaPostsByCriteriaQuery({
        ...searchQuery,
        plannerCardDate: searchQuery?.plannerCardDate?.toISOString() || null
    }, {skip: isNullOrEmpty(searchQuery)})


    useEffect(() => {
        if (draftPostsApi?.data) {
            setDrafts(Object.values(draftPostsApi?.data));
        }
    }, [draftPostsApi]);

    return (

        <div className={"row draft_container_wrapper"}>
            {/*{draftModal && <DraftModal show={draftModal} setShow={setDraftModal}/>}*/}
            {/*<div className={"col-lg-3 col-sm-12 col-md-12"}>*/}
            {/*    <div className={"draft_wrapper_box"} onClick={()=>{setDraftModal(true)}}>*/}

            {/*        <div className={"draft_img_wrapper"}>*/}
            {/*            <div className={"posted_date_outer"}>*/}
            {/*                <h3>Posted on: <span>12/15/2024</span></h3>*/}
            {/*            </div>*/}
            {/*            <img src={nature_img}/>*/}
            {/*        </div>*/}

            {/*        <div className={"draft_page_outer"}>*/}
            {/*            <div className={"caption_outer_containter"}>*/}
            {/*                <h3>Caption:</h3>*/}
            {/*                <h4>"Embracing the beauty .....</h4>*/}
            {/*            </div>*/}

            {/*            <div className={"social_media_page_outer"}>*/}
            {/*                <div className={"text-center"}>*/}
            {/*                    <img src={instagram_img} className={"insta_page_icon"}/>*/}
            {/*                    <img src={fb_img} className={"fb_page_icon"}/>*/}
            {/*                    <img src={linkedin_img} className={"linkedin_page_icon"}/>*/}
            {/*                </div>*/}
            {/*                <h4>Posting on 4 pages.</h4>*/}

            {/*            </div>*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {
                (getConnectedSocialAccountApi?.isLoading ||getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching || draftPostsApi?.isLoading || draftPostsApi?.isFetching) ?
                    <CommonLoader classname={"cmn_loader_outer"}/> :
                    getConnectedSocialAccountApi?.data?.length === 0 ?
                        <ConnectSocialMediaAccount image={notConnected_img}
                                                   message={formatMessage(NotConnected, ["posts", "social media"])}/> :
                        getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 ?
                            <ConnectSocialMediaAccount image={notConnected_img}
                                                       message={formatMessage(NotConnected, ["posts", "social media pages"])}/> :
                            (drafts !== null && Array.isArray(drafts) && drafts?.length === 0) ?
                                <div className="noDraftPosts_outer p-5 text-center mt-3">
                                    <img src={noDraftPosts} alt={"No Drafts"} className=" no-draft-img"/>
                                    <h2 className="acc_not_connected_heading">{NoPostInDraft}</h2>
                                </div>
                                :
                                drafts !== null && Array.isArray(drafts) && drafts?.length > 0 &&
                                sortByKey(drafts, "createdAt").map((curDraftPost, index) => {
                                    return  <DraftComponent postData={curDraftPost}/>

                                })
            }
        </div>
    )


}

