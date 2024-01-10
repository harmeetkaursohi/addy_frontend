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


const CommentReviewsSectionModal = ({
                                        isOpenCommentReviewsSectionModal,
                                        setOpenCommentReviewsSectionModal,
                                        postData,
                                        isResetData,
                                        postPageInfoData
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
            isResetData(true);
        }
    }, [])
    return (
        <>
            <div className='comment_review_container'>
                <Modal   show={isOpenCommentReviewsSectionModal} onHide={handleClose} className={"modal-xl view_profile"}>

                    <Modal.Body>
                        <Row className="m-0">
                            <Col lg="6" className="p-0">
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
                            <Col lg="6" className="p-0">
                                <div className="comment_section">
                                    <div className="comments_messages pb-0">
                                        <div className="main_user">
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
                                            postData?.socialMediaType === "FACEBOOK" && <Comments postData={postData}/>
                                        }

                                        {
                                            postData?.socialMediaType === "INSTAGRAM" &&
                                            <InstagramCommentsSection postData={postData} postPageData={postPageData}/>
                                        }

                                    </div>

                                    {/*</div>*/}
                                    <CommentFooter postData={postData} postPageData={postPageData}/>

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