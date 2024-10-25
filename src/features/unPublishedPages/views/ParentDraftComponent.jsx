import React, {useEffect, useState} from "react";
import DraftComponent from "./DraftComponent";
import notConnected_img from "../../../images/no_acc_connect_img.svg";
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
                        <div className="noDraftPosts_outer p-5 text-center mt-3">
                            <img src={noDraftPosts} alt={"No Drafts"} className=" no-draft-img"/>
                            <h2 className="acc_not_connected_heading">{NoPostInDraft}</h2>
                        </div>
                        :
                        drafts !== null && Array.isArray(drafts) && drafts?.length > 0 &&
                        sortByKey(drafts, "createdAt").map((curDraftPost, index) => {
                            return <DraftComponent postData={curDraftPost}/>
                        })
            }
            {
                getConnectedSocialAccountApi?.data?.length === 0 &&
                <ConnectSocialMediaAccount image={notConnected_img}
                                           message={formatMessage(NotConnected, ["posts", "social media"])}/>

            }
            {
                getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 &&
                <ConnectSocialMediaAccount image={notConnected_img}
                                           message={formatMessage(NotConnected, ["posts", "social media pages"])}/>
            }
        </div>
    )


}

