import instagram_img from '../../../images/instagram.png'
import download_img from '../../../images/download_icon.svg'
import bg_img from '../../../images/bg_img.png'
import user_profile_img from '../../../images/profile_img.png'
import comment_icon from '../../../images/comment_img.png'
import share_icon from '../../../images/share.svg'
import like_icon from '../../../images/thumbsup.png'
import heart_icon from '../../../images/Like.png'
import smile_img from '../../../images/smile_img.png'
import prev_icon from '../../../images/prev_icon.png'
import './commentPage.css'
import jsondata from "../../../locales/data/initialdata.json"

const CommentPage = () => {
    return (
        <>
            <section>
                <div className="comment_outer">
                    <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-12 p-0">
                            <div className="post_image_outer">
                                <div className="comment_header">
                                    <div className='back_heading_outer'>
                                        <h3 className='cmn_white_text back_heading'> <img src={prev_icon} /> Back</h3>
                                        <img src={instagram_img} className='cmn_width' />
                                    </div>
                                    <img src={download_img} />
                                </div>
                                <div className='post_Image_wrapper'>
                                    <img src={bg_img} className='post_image' />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 p-0">
                            <div className='user_comment_outer'>
                                <div className='user_profile_info cmn_padding'>
                                    <img src={user_profile_img} className='user_img' />
                                    <div className='user_heading'>
                                        <h5 className='cmn_white_text user_name_heading'>Ethan Johnson</h5>
                                        <h6 className='cmn_headings'>1d ago</h6>
                                    </div>
                                </div>
                                <h3 className='discover_hedaing cmn_padding'>Discovering Magic in the Natural World 🌈🍂🌳</h3>
                                <div className='hashtag_text cmn_padding'>
                                    <h3 className='mt-3'>#NatureLovers #OutdoorAdventures #ExploreMore #NaturePhotography  #WildernessWonder</h3>
                                </div>
                                {/* comments ======================== */}
                                <div className='users_comments'>
                                    <div className='user_profile_info cmn_padding'>
                                        <img src={user_profile_img} className='user_img' />
                                        <div className='comments_container'>
                                            <h6 className='cmn_white_text user_name_heading'>Lucas Williams</h6>
                                            <h5 className='cmn_headings mt-2'>Absolutely breathtaking! Nature's beauty never fails to amaze me. 😍🍃</h5>
                                            <div className='all_likes_outer mt-2'>
                                                <h5 className='cmn_headings'>20m</h5>
                                                <h5 className='cmn_headings'>1 Like</h5>
                                                <h5 className='cmn_headings'>Reply</h5>
                                            </div>

                                        </div>
                                    </div>
                                    <h5 className='reply_heading cmn_headings'>Hide replies</h5>
                                    {/* repley section */}
                                    <div className='user_profile_info user_reply_outer '>
                                        <img src={user_profile_img} className='user_img' />
                                        <div className='comments_container'>
                                            <h6 className='cmn_white_text user_name_heading'>Lucas Williams</h6>
                                            <h5 className='cmn_headings mt-2'>Yes</h5>
                                            <div className='all_likes_outer mt-2'>
                                                <h5 className='cmn_headings'>20m</h5>
                                                <h5 className='cmn_headings'>1 Like</h5>
                                                <h5 className='cmn_headings'>Reply</h5>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='post_total_comment_outer'>
                                    {/*  all likes and comments */}
                                    <div className='likes_comment_wrapper cmn_padding'>
                                        <div className='d-flex' style={{ gap: "12px" }}>
                                            <div className='thumbs_up_outer'>
                                                <img src={like_icon} height="18px" width="18px" />
                                            </div>
                                            <h3 className='discover_hedaing'>1k</h3>
                                        </div>
                                        <div className='share_outer'>
                                            <h3 className='discover_hedaing'> 100 <img height="18px" width="18px" src={comment_icon} /></h3>
                                            <h3 className='discover_hedaing'>30 <img height="18px" width="18px" src={share_icon} /></h3>
                                        </div>
                                    </div>
                                    <hr className='hr'></hr>
                                    {/* individual likes===================== */}
                                    <div className='likes_comment_wrapper cmn_padding'>
                                        <h3 className='discover_hedaing'><img className="me-3" src={heart_icon} height="24px" width="24px" />{jsondata.likes}</h3>

                                        <h3 className='discover_hedaing'> <img className="me-3" height="24px" width="24px" src={comment_icon} />{jsondata.comment}</h3>
                                        <h3 className='discover_hedaing'><img className="me-3" height="24px" width="24px" src={share_icon} />{jsondata.share}</h3>

                                    </div>
                                    <hr className='hr'></hr>
                                    {/* likes/comments  notifications=========== */}
                                    <div className='mt-3 likes_container cmn_padding' >
                                        <h3 className='cmn_headings'>Liked by <span style={{ color: "black", fontWeight: "700" }}>Lucas Williams</span> and
                                            <span style={{ color: "black", fontWeight: "700" }}> Others</span></h3>
                                        <h6 className='cmn_headings'> July 31</h6>
                                    </div>
                                </div>
                                {/* add comments =========== */}
                                <form>
                                <div className='post_comment_wrapper cmn_padding'>
                                    <img src={smile_img} height="22px" width="22px" />
                                        <input type='text' className='form-control' placeholder='Add a comment..' />
                                        <button className='cmn_small_heading post_btn'>{jsondata.post} </button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default CommentPage