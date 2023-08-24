import './createPost.css'
import ai_icon from '../../../images/ai_icon.svg'
import bg_img from '../../../images/bg_img.png'
import user_propfile from '../../../images/profile_img.png'
import send_img from '../../../images/send.png'
import like_img from '../../../images/Like.png'
import comment_img from '../../../images/comment_img.png'
import ribbon_img from '../../../images/Ribbon.png'
import ellipse_img from '../../../images/ellipse.svg'
import upload_video_img from '../../../images/video_img.svg'
import upload_img from '../../../images/post_image.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import instagram_img from "../../../images/instagram.png"
import jsondata from '../../../locales/data/initialdata.json'
const CreatePost = () => {
    return (
        <>
        
            <div className="Container">
                <div className="create_post_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="create_post_content">
                                <h2 className='creare_post_heading'>{jsondata.createpost}</h2>
                                <form>
                                    <div className="createPost_outer">
                                        <label className='create_post_label'>{jsondata.mediaPlatform}</label>
                                        {/* <select>
                                            <option>Team Musafiir</option>
                                            <option>Team Musafiir</option>
                                        </select> */}
                                        <Dropdown className="insta_dropdown_btn mt-2">
                                        <Dropdown.Toggle  id="instagram" className="instagram_dropdown">
                                            <img src={instagram_img} className="me-3"/>Instagram
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='w-100'>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    </div>
                                    {/* add media */}
                                    <div className="media_outer">
                                        <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                        <h6 className='create_post_text'>{jsondata.sharephoto}</h6>
                                        <div className="file_outer">
                                            <div className='cmn_blue_border add_media_outer'>
                                                <input type="file" id='image' className='file'/>
                                                <label htmlFor='image' className='cmn_headings'> <img src={upload_img}/>Add Photo</label>
                                            </div>
                                            <div className='cmn_blue_border add_media_outer' >
                                                <input type="file" id='video'/>
                                                <label htmlFor='video' className='cmn_headings'> <img src={upload_video_img}/>Add Video</label>
                                            </div>
                                        </div>
                                        <h2 className='cmn_heading'>{jsondata.OR}</h2>
                                        <div className="ai_outer_btn">
                                            <button className="ai_btn cmn_white_text mt-2">
                                                <img src={ai_icon} className='ai_icon me-2' />
                                                {jsondata.generateAi} </button>
                                        </div>
                                    </div>
                                    {/* post caption */}
                                    <div className='post_caption_outer media_outer'>
                                        <div className='caption_header'>
                                            <h5 className='post_heading create_post_text'>Add Post Caption</h5>

                                            <button className="ai_btn cmn_white_text">
                                                <img src={ai_icon} className='ai_icon me-2' />
                                                {jsondata.generateCaptionAi} </button>

                                        </div>
                                        <div className='textarea_outer'>
                                            <h6 className='create_post_text'>{jsondata.addText}</h6>
                                            <textarea className='textarea mt-2' rows={3}></textarea>
                                        </div>
                                        <div className='caption_header hashtag_outer'>
                                            <h5 className='post_heading create_post_text'>Add Hashtag</h5>

                                            <button className="ai_btn cmn_white_text">
                                                <img src={ai_icon} className='ai_icon me-2' />
                                                {jsondata.generateHashtagAi} </button>

                                        </div>
                                        <div className='textarea_outer'>
                                            <h6 className='create_post_text'>{jsondata.addText}</h6>
                                            <textarea className='textarea mt-2' rows={3}></textarea>
                                        </div>
                                        <div className='textarea get_messages_outer'>
                                            <div className='get_messages'>
                                                <input type='checkbox' />
                                                <label className='create_post_text get_measage_heading ps-2'>Get more messages</label>
                                                <h6 className='create_post_text send_measage_heading'>Businesses like your get more messages when they add a “send message” button.</h6>
                                                <h6 className='create_post_text try_it_heading'>Try it out</h6>
                                            </div>
                                            
                                                <button className='cmn_btn_color add_btn'>{jsondata.addbutton}</button>
                                            
                                        </div>

                                    </div>
                                    {/* schedule */}
                                    <div className='schedule_outer media_outer'>
                                        <div className='schedule_btn_outer'>
                                            <h5 className='create_post_text post_heading'>{jsondata.setSchedule}</h5>
                                            <div className='schedule_btn_wrapper'>
                                                <button className='cmn_bg_btn schedule_btn '>{jsondata.schedule}</button>
                                                <button className='save_btn cmn_bg_btn'>{jsondata.saveasdraft}</button>
                                            </div>
                                        </div>
                                        <div className='schedule_date_outer'>
                                            <div className='date_time_outer'>
                                                <h6 className='create_post_text'>{jsondata.setdate}</h6>
                                               
                                                <input type='date' placeholder='set date' className='form-control mt-2 date_input'/>
                                                
                                            </div>
                                            <div className='date_time_outer'>
                                                <h6 className='create_post_text'>{jsondata.settime}</h6>
                                               <input type='time' placeholder="set time "className='mt-2 form-control time_input'/>
                                                

                                            </div>
                                        </div>
                                    </div>
                                    {/* boost post */}
                                    <div className='publish_post_outer media_outer'>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked"  />
                                            <label className="form-check-label create_post_label boost_post_text" for="flexSwitchCheckChecked">Boost Post</label>
                                        </div>
                                        <div className='cancel_publish_btn_outer'>
                                            <button className='cancel_btn cmn_bg_btn'>{jsondata.cancel}</button>
                                            <button className='publish_btn cmn_bg_btn'>{jsondata.publishnow}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className='post_preview_outer'>
                                <div className='preview_wrapper'>
                                    <h2 className='cmn_white_text feed_preview'>Instagram feed Preview</h2>
                                <div className='user_profile_info'>
                                <img src={user_propfile}   height="36px" width="36px" />
                                    <div>
                                    <h3 className='create_post_text user_name boost_post_text'>Team Musafirrr</h3>
                                    <h6 className='status create_post_text'>just now <img src={ellipse_img}/></h6>
                                    </div>
                                    
                                </div>
                                <img src={bg_img} className='post_img'/>
                                <div className='like_comment_outer'>
                                <div>
                                <img src={like_img} className='like_img'/>
                                <img src={comment_img} className='like_img'/>
                                <img src={send_img} className='like_img'/>
                                </div>
                                <img src={ribbon_img}/>
                                </div>
                                </div>
                            </div>

                           
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreatePost