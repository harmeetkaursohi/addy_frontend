import './CommentReviewsSectionModal.css'
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import img from '../../../../images/draft.png'
import default_image from '../../../../images/default_user_icon.svg'
import {
    getCommentCreationTime,
    handleSeparateCaptionHashtag,
} from "../../../../utils/commonUtils";
import {useEffect, useState} from "react";
import CommonSlider from "../../../common/components/CommonSlider";
import Comments from "../comments/Comments";
import CommentFooter from "../comments/CommentFooter";
import InstagramCommentsSection from "../comments/InstagramCommentsSection";
import LinkedinCommentsSection from "../comments/LinkedinCommentsSection";
import { RxCross2 } from "react-icons/rx";

import {useLazyGetPostSocioDataQuery} from "../../../../app/apis/postApi";
import {usePostCommentMutation, usePostReplyMutation} from "../../../../app/apis/commentApi";


const CommentReviewsSectionModal = ({
                                        isOpenCommentReviewsSectionModal,
                                        setOpenCommentReviewsSectionModal,
                                        postData,
                                        setPostData,
                                        isDirty,
                                        setDirty,
                                        className
                                    }) => {

    const [postSocioData, setPostSocioData] = useState(null);
    const [getPostSocioData, getPostSocioDataApi] = useLazyGetPostSocioDataQuery()
    const [postComment, postCommentApi] = usePostCommentMutation()
    const [postReply, postReplyApi] = usePostReplyMutation()

    const handleClose = () => setOpenCommentReviewsSectionModal(false);


    useEffect(() => {
        if (postData) {
            getPostSocioData({
                postId: postData?.id,
                pageAccessToken: postData?.page?.access_token,
                socialMediaType: postData?.socialMediaType,
            })
        }
    }, [postData])

    useEffect(() => {
        if (getPostSocioDataApi?.data && !getPostSocioDataApi?.isLoading) {
            setPostSocioData(postData?.socialMediaType === "FACEBOOK" ? getPostSocioDataApi?.data[postData?.id] : getPostSocioDataApi?.data)
        }
    }, [getPostSocioDataApi])

    useEffect(() => {
        return () => {
            setPostData(null);
        }
    }, [])

    return (
        <>
            <div className='comment_review_container'>
                <Modal centered show={isOpenCommentReviewsSectionModal} onHide={handleClose} className={"modal-lg view_profile"}>

                    <Modal.Body>
                        <Row className="m-0">
                            <div className='md_cancel_outer'>
                                <RxCross2 size={18}  onClick={() => {
                                    setOpenCommentReviewsSectionModal(false)
                                }}/>
                            </div>
                            <Col lg="6" md="12" sm="12" className="p-0">
                                <div className='comment_review_wrapper'>

                                    <CommonSlider files={postData?.attachments}
                                                  selectedFileType={null}
                                                  caption={null}
                                                  hashTag={null}
                                                  showThumbnail={false}
                                                  isPublished={true}
                                                  viewSimilarToSocialMedia={false}
                                                  className={className}/>

                                </div>
                            </Col>
                            <Col lg="6" md="12" sm="12" className="p-0">
                                <div className="comment_section">
                                    <div className="comments_messages pb-0">
                                        <div className="">
                                            <div className="user_card main_user">
                                                <div className="user_image">
                                                    <img src={postData?.page?.imageUrl || default_image} alt=""/>

                                                </div>
                                                <div className="user">
                                                    <p className="user_name">
                                                        {postData?.page?.name}
                                                    </p>
                                                    <p>
                                                        {getCommentCreationTime(postData?.feedPostDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <h4>{handleSeparateCaptionHashtag(postData?.message)?.caption}</h4>

                                        </div>

                                        <p className="post_hashtags">{handleSeparateCaptionHashtag(postData?.message)?.hashtag}</p>


                                        {
                                            postData?.socialMediaType === "FACEBOOK" &&
                                            <Comments
                                                onReply={postReply}
                                                postReplyApi={postReplyApi}
                                                postCommentApi={postCommentApi}
                                                postSocioData={postSocioData}
                                                isDirty={isDirty}
                                                setDirty={setDirty}
                                                postData={postData}
                                            />
                                        }

                                        {
                                            postData?.socialMediaType === "INSTAGRAM" &&
                                            <InstagramCommentsSection
                                                isDirty={isDirty}
                                                setDirty={setDirty}
                                                postData={postData}
                                                postCommentApi={postCommentApi}
                                                postSocioData={postSocioData}
                                                onReply={postReply}
                                                postReplyApi={postReplyApi}
                                            />
                                        }
                                        {
                                            postData?.socialMediaType === "LINKEDIN" &&
                                            <LinkedinCommentsSection
                                                isDirty={isDirty}
                                                setDirty={setDirty}
                                                postData={postData}
                                                postCommentApi={postCommentApi}
                                                postSocioData={postSocioData}
                                                onReply={postReply}
                                                postReplyApi={postReplyApi}
                                            />
                                        }
                                        {
                                            postData?.socialMediaType === "PINTEREST" &&
                                            <div className={"text-center pinterest-comments-section "}>
                                                <div className={"mb-3"}>
                                                    Regrettably, comments for Pinterest are not accessible here. Kindly
                                                    click the link below to explore and engage with comments on
                                                    Pinterest. We appreciate your understanding.
                                                </div>
                                                <a title={"View on Pinterest"}
                                                   href={`https://in.pinterest.com/pin/${postData?.id}/`}
                                                   target={"_blank"}>
                                                    View on Pinterest
                                                </a>

                                            </div>
                                        }

                                    </div>

                                    {/*</div>*/}
                                    <CommentFooter
                                        onPostComment={postComment}
                                        postCommentApi={postCommentApi}
                                        postSocioData={postSocioData}
                                        isDirty={isDirty}
                                        setDirty={setDirty}
                                        postData={postData}
                                    />

                                </div>

                            </Col>
                        </Row>


                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
};

export default CommentReviewsSectionModal;
