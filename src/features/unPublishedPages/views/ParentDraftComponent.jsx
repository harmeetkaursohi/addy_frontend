import React, {useEffect, useState} from "react";
import DraftComponent from "./DraftComponent";
import NotConnected_img from "../../../images/noaccount_draft.svg?react";
import Arrow_up_icon from "../../../images/arrow_up_icon.svg?react";
import {
    formatMessage, getEmptyArrayOfSize,
    isNullOrEmpty,
    sortByKey
} from "../../../utils/commonUtils";
import noDraftPosts from "../../../images/no_draft_posts.png";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {NoPostInDraft, NotConnected} from "../../../utils/contantData";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {useGetSocialMediaPostsByCriteriaQuery} from "../../../app/apis/postApi";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";

export const ParentDraftComponent = ({searchQuery}) => {

    const [drafts, setDrafts] = useState(null);
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")
    const draftPostsApi = useGetSocialMediaPostsByCriteriaQuery({
        ...searchQuery,
        plannerCardDate: searchQuery?.plannerCardDate?.toISOString() || null
    }, {skip: isNullOrEmpty(searchQuery)})

    const isAccountInfoLoading = getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.isLoading

    useEffect(() => {
        if (draftPostsApi?.data) {
            setDrafts(Object.values(draftPostsApi?.data));
        }
    }, [draftPostsApi]);

    return (

        <div className={""}>
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
            <div className="row draft_container_wrapper">

            {
                (isAccountInfoLoading || draftPostsApi?.isLoading || draftPostsApi?.isFetching) ?
                    getEmptyArrayOfSize(4).map((_, i) => {
                        return <div className={"col-lg-3 col-sm-12 col-md-12"} key={i}>
                            <div
                                className={"draft_wrapper_box"}>
                                <div className={"draft_img_wrapper cursor-pointer"}>
                                    <SkeletonEffect count={1} className={"draft-post-img-skeleton"}/>
                                </div>

                                <div className={"draft_page_outer mt-2"}>
                                    <div className={"caption_outer_containter"}>
                                        <h3>Caption:</h3>
                                        <h4 className={`caption `}><SkeletonEffect count={1} className={"w-75"}/></h4>
                                    </div>
                                    <div className="social_media_page_outer w-100">
                                        <SkeletonEffect count={1} className={"draft-post-social-media-skeleton"}/>
                                        <SkeletonEffect count={1} className={"mt-2"}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })

                    :
                    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 &&
                    (drafts !== null && Array.isArray(drafts) && drafts?.length === 0) ?
                        <div className="review_wrapper cmn_height_outer no_account_bg white_bg_color noDraftPosts_outer text-center mt-3">
                            <div className="no-post-review acc_not_connected_heading  text-center ">

                            <NotConnected_img alt={"No Drafts"} className=" no-draft-img"/>
                            <h3 className="mt-4 position-relative" ><div dangerouslySetInnerHTML={{ __html: NoPostInDraft }}/><Arrow_up_icon className="arrow_up_icon"/></h3>
                           
                            </div>
                        </div>
                        :
                        drafts !== null && Array.isArray(drafts) && drafts?.length > 0 &&
                        sortByKey(drafts, "createdAt").map((curDraftPost, index) => {
                            return <DraftComponent postData={curDraftPost}/>
                        })
            }
            </div>
          
        </div>
    )


}

