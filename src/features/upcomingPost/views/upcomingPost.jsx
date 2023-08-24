import user_img from '../../../images/user.png'
import polygon_img from '../../../images/polygon.svg'
import './upcomingPost.css'
import  jsondata  from '../../../locales/data/initialdata.json'
const UpcomingPost = () => {
    return (
        <>
            <div className="upcoming_post_outer">
                <h2>{jsondata.upcomingpost}</h2>
                <form>
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="upcoming_post_container">
                                <div className="post_outer">
                                    <div className="user_outer">
                                        <img src={user_img} />
                                        <h6 className="cmn_white_text">John Doe</h6>
                                    </div>
                                    <button className="cmn_btn_color cmn_white_text Tomorrow_btn">
                                        <img src={polygon_img} className="polygon_img" />
                                        Tomorrow</button>
                                </div>

                            </div>
                            <div className="post_content">
                                <h6 className="cmn_headings">31 September, 2022</h6>
                                <h4>Back-end developer - Remote</h4>
                                <p className="cmn_headings" style={{ fontSize: "14px" }}>Cursus purus, diam, aliquet scelerisque dignissim tellus aenean viverra. In risus elit vel id tincidunt vel. Nunc ac ipsum.</p>
                                <div className="delete_btn_outer">
                                    <button className="delete_post_btn cmn_white_text ">Delete Post</button>
                                    <button className="cmn_blue_bg cmn_white_text change_post_btn ms-2">Change Post</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="upcoming_post_container">
                                <div className="post_outer">
                                    <div className="user_outer">
                                        <img src={user_img} />
                                        <h6 className="cmn_white_text">John Doe</h6>
                                    </div>
                                    <button className="cmn_btn_color cmn_white_text Tomorrow_btn">
                                        <img src={polygon_img} className="polygon_img" />
                                        Tomorrow</button>
                                </div>

                            </div>
                            <div className="post_content">
                                <h6 className="cmn_headings">31 September, 2022</h6>
                                <h4>Back-end developer - Remote</h4>
                                <p className="cmn_headings" style={{ fontSize: "14px" }}>Cursus purus, diam, aliquet scelerisque dignissim tellus aenean viverra. In risus elit vel id tincidunt vel. Nunc ac ipsum.</p>
                                <div className="delete_btn_outer">
                                    <button className="delete_post_btn cmn_white_text  ">{jsondata.deletepost}</button>
                                    <button className="cmn_blue_bg cmn_white_text change_post_btn ms-2">{jsondata.changepost}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div></>
    )
}
export default UpcomingPost