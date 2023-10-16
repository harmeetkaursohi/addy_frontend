import './CommentReviewsSectionModal.css'
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import img from '../../../../images/draft.png'
import {Link} from "react-router-dom";
import user from '../../../../images/user.png'


const CommentReviewsSectionModal = ({isOpenCommentReviewsSectionModal,setOpenCommentReviewsSectionModal,postId}) => {

    const handleClose = () => setOpenCommentReviewsSectionModal(false);

    return (
        <>
            <div className='comment_review_container'>
                <Modal show={isOpenCommentReviewsSectionModal} onHide={handleClose} className={"modal-lg view_profile"}>

                    <Modal.Body>
                        <Row className="m-0">
                            <Col lg="7" className="p-0">
                                <div className='comment_review_wrapper'>
                                    <div className="comment_header d-flex">
                                        <Link to={""} className="flex-grow-1">
                                            <i className="fa fa-chevron-left me-2"></i> Back <i className="fa-brands fa-instagram ms-2"></i>
                                        </Link>
                                        <i className="fa fa-download"></i>

                                    </div>
                                    <img src={img} alt={"image"} className="img-fluid"/>
                                </div>
                            </Col>
                            <Col lg="5" className="p-0">
                                <div className="">
                                <div className="comments_messages pb-0">
                                    <div className="user_card main_user">
                                        <div className="user_image">
                                            <img src={user} alt=""/>

                                        </div>
                                        <div className="user">
                                            <p className="user_name">
                                                Eathan johnsan
                                            </p>
                                            <p>
                                                1 day ago
                                            </p>
                                        </div>
                                    </div>
                                    <h4>Discovering Magic in the Natural World 🌈🍂🌳</h4>
                                    <p className="post_hashtags">#NatureLovers #OutdoorAdventures #ExploreMore #NaturePhotography  #WildernessWonder</p>

                                    <div className="comment_wrap">
                                        <div className="user_card">
                                            <div className="user_image">
                                                <img src={user} alt=""/>

                                            </div>
                                            <div className="user">
                                                <p className="user_name">
                                                    Eathan johnsan
                                                </p>
                                                <p>
                                                    Absolutely breathtaking! Nature's beauty never fails to amaze me. 😍🍃
                                                </p>
                                                <div className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                    <p>20 min</p>
                                                    <p>1 Like</p>
                                                    <p>Reply</p>
                                                </div>
                                                <div className="reply_wrap">
                                                    <input type="text" placeholder="reply" className="form-control"/> <button className="view_post_btn cmn_bg_btn">Submit</button>
                                                </div>
                                                <p className="reply_toggle">Hide replies</p>
                                                <div className="comment_wrap mt-2">
                                                    <div className="user_card">
                                                        <div className="user_image">
                                                            <img src={user} alt=""/>

                                                        </div>
                                                        <div className="user">
                                                            <p className="user_name">
                                                                Pento
                                                            </p>
                                                            <p>
                                                                yes
                                                            </p>
                                                            <div className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                                <p>20 min</p>
                                                                <p>1 Like</p>
                                                                <p>Reply</p>
                                                            </div>
                                                            <p className="reply_toggle">Hide replies</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    <div className="comments_footer">
                                        <div className="footer_media d-flex gap-3 mt-2">
                                            <p><i className={"fa fa-thumbs-up me-2"}></i> 1k</p>
                                            <p><i className={"fa fa-comment me-2"}></i> 1k</p>
                                            <p><i className={"fa fa-share-alt me-2"}></i> 1k</p>


                                        </div>
                                        <ul className="d-flex">
                                            <li className="w-100"><i className="fa fa-heart me-2"></i> Like</li>
                                            <li className="w-100"><i className="fa fa-comment me-2"></i> Like</li>
                                        </ul>
                                        <p className="liked_by">
                                            Liked by <strong>Lucas Williams</strong> and <strong>Others</strong>
                                        </p>
                                        <p className="comment_date">July 31</p>
                                        <div className="comment_msg">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                <path d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z" fill="#323232"/>
                                                <path d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z" fill="#323232"/>
                                                <path d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z" fill="#323232"/>
                                            </svg>    <input type="text" className="form-control" placeholder="Add comment..."/> <button>Post</button>
                                        </div>
                                    </div>
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