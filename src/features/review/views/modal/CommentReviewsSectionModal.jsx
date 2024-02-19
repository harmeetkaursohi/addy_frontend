import './CommentReviewsSectionModal.css'
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import img from '../../../../images/draft.png'
import {Link} from "react-router-dom";
import {
    computeImageURL,
    getCommentCreationTime,
    handleSeparateCaptionHashtag,
} from "../../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import CommonSlider from "../../../common/components/CommonSlider";
import Comments from "../comments/Comments";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";
import CommentFooter from "../comments/CommentFooter";
import InstagramCommentsSection from "../comments/InstagramCommentsSection";
import LinkedinCommentsSection from "../comments/LinkedinCommentsSection";


const CommentReviewsSectionModal = ({
                                        isOpenCommentReviewsSectionModal,
                                        setOpenCommentReviewsSectionModal,
                                        postData,
                                        postPageInfoData,
                                        isDirty,
                                        setDirty,
                                    }) => {
    const [postPageData, setPostPageData] = useState(null);
    const dispatch = useDispatch();
    const handleClose = () => setOpenCommentReviewsSectionModal(false);

    useEffect(() => {
        if (postData && postPageInfoData) {
            setPostPageData(postData?.socialMediaType === "FACEBOOK" ? postPageInfoData[postData?.id] : postPageInfoData)
        }
    }, [postData, postPageInfoData])



    useEffect(() => {
        return () => {
            dispatch(resetReducers({sliceNames: ["getPostPageInfoReducer"]}))
            dispatch(resetReducers({sliceNames: ["getCommentsOnPostActionReducer"]}))
            dispatch(resetReducers({sliceNames: ["getRepliesOnCommentReducer"]}))
            dispatch(resetReducers({sliceNames: ["replyCommentOnPostActionReducer"]}))
            dispatch(resetReducers({sliceNames: ["updateCommentsOnPostActionReducer"]}))
            // isResetData(true);
        }
    }, [])

    return (
        <>
            <div className='comment_review_container'>
                <Modal   show={isOpenCommentReviewsSectionModal} onHide={handleClose} className={"modal-xl view_profile"}>

                    <Modal.Body>
                        <Row className="m-0">
                            <Col lg="6"  md="6" sm="12" className="p-0">
                                <div className='comment_review_wrapper'>
                                    <div className="comment_header d-flex gap-2">
                                        <Link to={""} className="flex-grow-1 d-flex align-item-center">
                                            <span onClick={() => {
                                                setOpenCommentReviewsSectionModal(false)
                                            }}><i className="fa fa-chevron-left me-2 "></i> Back</span>

                                            <img className={"me-2 ms-2 social-media-icon-cmnt"}
                                                 src={computeImageURL(postData?.socialMediaType)}/>
                                            {/*<i className="fa-brands fa-facebook ms-2"></i>*/}
                                        </Link>
                                    </div>

                                    <CommonSlider files={postData?.attachments}
                                                  selectedFileType={null}
                                                  caption={null}
                                                  hashTag={null}
                                                  showThumbnail={false}
                                                  isPublished={true}
                                                  viewSimilarToSocialMedia={false}/>
                                </div>
                            </Col>
                            <Col lg="6"  md="6" sm="12" className="p-0">
                                <div className="comment_section">
                                    <div className="comments_messages pb-0">
                                        <div className="">
                                            <div className="user_card main_user">
                                                <div className="user_image">
                                                    <img src={postData?.page?.imageUrl} alt=""/>

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
                                            postData?.socialMediaType === "FACEBOOK" && <Comments  isDirty={isDirty} setDirty={setDirty} postData={postData} />
                                        }

                                        {
                                            postData?.socialMediaType === "INSTAGRAM" &&
                                            <InstagramCommentsSection  isDirty={isDirty} setDirty={setDirty} postData={postData} postPageData={postPageData}/>
                                        }
                                        {
                                            postData?.socialMediaType === "LINKEDIN" &&
                                            <LinkedinCommentsSection  isDirty={isDirty} setDirty={setDirty} postData={postData} postPageData={postPageData}/>
                                        }
                                        {
                                            postData?.socialMediaType === "PINTEREST" &&
                                            <div className={"text-center pinterest-comments-section "}>
                                                <div className={"mb-3"}>
                                                    Regrettably, comments for Pinterest are not accessible here. Kindly
                                                    click the link below to explore and engage with comments on
                                                    Pinterest. We appreciate your understanding.
                                                </div>
                                                <a title={"View on Pinterest"} href={`https://in.pinterest.com/pin/${postData?.id}/`} target={"_blank"}>
                                                    View on Pinterest
                                                </a>

                                            </div>
                                        }

                                    </div>

                                    {/*</div>*/}
                                    <CommentFooter
                                        isDirty={isDirty} setDirty={setDirty}
                                        postData={postData} postPageData={postPageData}  />

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