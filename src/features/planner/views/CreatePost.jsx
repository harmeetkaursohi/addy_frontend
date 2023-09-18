import './CreatePost.css'
import ai_icon from '../../../images/ai_icon.svg'
import bg_img from '../../../images/bg_img.png'
import user_propfile from '../../../images/profile_img.png'
import send_img from '../../../images/send.png'
import like_img from '../../../images/Like.png'
import comment_img from '../../../images/comment_img.png'
import instagram_img from '../../../images/instagram.png'
import ribbon_img from '../../../images/Ribbon.png'
import ellipse_img from '../../../images/ellipse.svg'
import upload_video_img from '../../../images/video_img.svg'
import upload_img from '../../../images/post_image.svg'
import jsondata from '../../../locales/data/initialdata.json'
import {useEffect, useState} from "react";
import AI_ImageModal from "../../modals/views/ai_image_modal/AI_ImageModal.jsx";
import AiCaptionModal from "../../modals/views/ai_caption_modal/AI_Caption";
import AI_Hashtag from "../../modals/views/ai_hashtag_modal/AI_Hashtag";
import {decodeJwtToken, getToken} from "../../../app/auth/auth.js";
import {useDispatch, useSelector} from "react-redux";
import {getAllByCustomerIdAction} from "../../../app/actions/socialAccountActions/socialAccountActions.js";
import {Dropdown} from 'react-bootstrap'
import facebook_img from '../../../images/fb.svg'
import linkedin_img from '../../../images/linkedin.svg'
import twitter_img from '../../../images/twitter.svg'
import SideBar from "../../sidebar/views/Layout.jsx";


const CreatePost = () => {

    const [aiGenerateImageModal, setAIGenerateImageModal] = useState(false);
    const [aiGenerateCaptionModal, setAIGenerateCaptionModal] = useState(false);
    const [aiGenerateHashTagModal, setAIGenerateHashTagModal] = useState(false);

    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [hashTag, setHashTag] = useState("");
    const [caption, setCaption] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [boostPost, setBoostPost] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    const token = getToken();

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionLabels, setSelectedOptionLabels] = useState([]);
    const [check, setCheck] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);

    // const socialAccount = useSelector(state => state.socialAccount.findSocialAccountByProviderAndCustomerIdReducer);
    const socialAccountData = useSelector(state => state.socialAccount.getAllByCustomerIdReducer.data);

    console.log("socialAccountData", socialAccountData)

    useEffect(() => {
        const userInfo = decodeJwtToken(token);
        const requestBody = {
            token: token, customerId: userInfo?.customerId, // provider: selectedPlatform?.toUpperCase()
        }
        //dispatch(findSocialAccountByProviderAndCustomerIdAction(requestBody))
        dispatch(getAllByCustomerIdAction(requestBody));

    }, [])


    const toggleOption = (option, e) => {

        console.log(option)

        if (selectedOptions.includes(option.id)) {
            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
            setSelectedOptionLabels(selectedOptionLabels.filter((label) => label !== option.label));
        } else {
            setSelectedOptions([...selectedOptions, option.id]);
            setSelectedOptionLabels([...selectedOptionLabels, option.label]);
        }
    };

    console.log(selectedItem);


    const handlePostSubmit = (e) => {
        e.preventDefault();

        const userInfo = decodeJwtToken(token);
        const combinedDateTimeString = `${scheduleDate}T${scheduleTime}:00`;
        const scheduleDateTime = new Date(combinedDateTimeString);


        const requestBody = {
            token: token,
            customerId: userInfo?.customerId,
            postRequestDto: {
                plateForm: selectedPlatform,
                attachments: [{
                    "mediaType": "IMAGE", "file": selectedFile
                }],
                hashTag: hashTag,
                caption: caption,
                scheduleDate: scheduleDateTime,
                boostPost: boostPost,
                pageId: "115612628302302"
            }

        }


        const formData = new FormData();
        formData.append("file", JSON.stringify(selectedFile));

        console.log("@@@ formData ", formData)

        console.log("@@@ selectedFile ::: ", selectedFile);

        console.log("@@@ requestBody ::: ", requestBody);

        dispatch(createFacebookPostAction(requestBody));

    }


    return (<>
        {/*<SideBar/>*/}
        <div className="Container">
            <div className="create_post_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">

                        <div className="create_post_content">

                            <h2 className='creare_post_heading'>{jsondata.createpost}</h2>

                            <form onSubmit={handlePostSubmit}>

                                <div className="createPost_outer">
                                    <label className='create_post_label'>{jsondata.mediaPlatform}</label>
                                    <Dropdown className='insta_dropdown_btn mt-2'>
                                        <Dropdown.Toggle id="instagram" className="instagram_dropdown"
                                                         title={selectedOptionLabels.join(',')}>
                                            {selectedOptionLabels.length > 0 ?

                                                selectedOptionLabels.join(',') :

                                                <div className="social_inner_content">
                                                    <div>
                                                        <img className="instaImg" src={instagram_img} height="20px"
                                                             width="20px"/>
                                                        <img className="linkedinImg" src={linkedin_img} height="20px"
                                                             width="20px"/>
                                                    </div>
                                                    <h6>
                                                        Select platform
                                                    </h6>
                                                </div>
                                            }
                                        </Dropdown.Toggle>


                                        <Dropdown.Menu className='w-100 social_menu'>
                                            <div className="dropdown-options">

                                                {socialAccountData?.map((socialAccount) => (<>

                                                        <div className='social_list' key={socialAccount.id}>

                                                            <div className='user_Details social_details'>

                                                                {
                                                                    socialAccount.provider === "FACEBOOK" &&
                                                                    <img src={facebook_img} height="20px" width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "INSTAGRAM" &&
                                                                    <img src={instagram_img} height="20px"
                                                                         width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "LINKEDIN" &&
                                                                    <img src={linkedin_img} height="20px" width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "TWITTER" &&
                                                                    <img src={twitter_img} height="20px" width="20px"/>
                                                                }

                                                                <h2 className='cmn_white_text'>{socialAccount.provider}</h2>
                                                            </div>
                                                            {
                                                                socialAccount?.pageAccessToken?.map((page) => (
                                                                    <div className='user_Details social_details'
                                                                         key={page.id}>

                                                                        <label className="checkbox-button">
                                                                            <input type="checkbox"
                                                                                   checked={selectedOptions.includes(page.id)}
                                                                                   onChange={(e) => toggleOption({
                                                                                       id: page.id,
                                                                                       label: page.name
                                                                                   }, e)}
                                                                                   className="checkbox-button__input"
                                                                                   id="choice1-1" name="choice1"/>
                                                                            <span
                                                                                className="checkbox-button__control"></span>
                                                                        </label>

                                                                        {/*<input*/}
                                                                        {/*    type="checkbox"*/}
                                                                        {/*    checked={selectedOptions.includes(page.id)}*/}
                                                                        {/*    onChange={(e) => toggleOption({*/}
                                                                        {/*        id: page.id,*/}
                                                                        {/*        label: page.name*/}
                                                                        {/*    }, e)}*/}
                                                                        {/*/>*/}
                                                                        <img src={page.imageUrl} height="20px"
                                                                             width="20px"/>
                                                                        <h4 className="cmn_text_style">{page.name}</h4>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                    </>

                                                ))}
                                                {/*    */}

                                                {socialAccountData?.map((socialAccount) => (<>

                                                        <div className='social_list' key={socialAccount.id}>

                                                            <div className='user_Details social_details'>

                                                                {
                                                                    socialAccount.provider === "FACEBOOK" &&
                                                                    <img src={instagram_img} height="20px" width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "INSTAGRAM" &&
                                                                    <img src={instagram_img} height="20px"
                                                                         width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "LINKEDIN" &&
                                                                    <img src={linkedin_img} height="20px" width="20px"/>
                                                                }

                                                                {
                                                                    socialAccount.provider === "TWITTER" &&
                                                                    <img src={twitter_img} height="20px" width="20px"/>
                                                                }

                                                                <h2 className='cmn_white_text'>{socialAccount.provider}</h2>
                                                            </div>
                                                            {
                                                                socialAccount?.pageAccessToken?.map((page) => (
                                                                    <div className='user_Details social_details'
                                                                         key={page.id}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedOptions.includes(page.id)}
                                                                            onChange={(e) => toggleOption({
                                                                                id: page.id,
                                                                                label: page.name
                                                                            }, e)}
                                                                        />
                                                                        <img src={page.imageUrl} height="20px"
                                                                             width="20px"/>
                                                                        <h4 className="cmn_text_style">{page.name}</h4>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                    </>

                                                ))}
                                            </div>


                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                                {/* add media */}
                                <div className="media_outer">
                                    <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                    <h6 className='create_post_text'>{jsondata.sharephoto}</h6>
                                    <div className="file_outer">
                                        <div className='cmn_blue_border add_media_outer'>
                                            <input type="file" id='image' className='file' name={'file'}
                                                   onChange={(e) => {
                                                       e.preventDefault();
                                                       setSelectedFile(e.target.files[0]);
                                                   }}
                                            />
                                            <label htmlFor='image' className='cmn_headings'> <img
                                                src={upload_img}/>{selectedFile?.name ? selectedFile.name : "Add Photo"}
                                            </label>
                                        </div>

                                        <div className='cmn_blue_border add_media_outer'>
                                            <input type="file" id='video'/>
                                            <label htmlFor='video' className='cmn_headings'> <img
                                                src={upload_video_img}/>Add Video</label>
                                        </div>
                                    </div>
                                    <h2 className='cmn_heading'>{jsondata.OR}</h2>
                                    <div className="ai_outer_btn">
                                        <button className="ai_btn cmn_white_text mt-2" onClick={(e) => {
                                            e.preventDefault();
                                            setAIGenerateImageModal(true);
                                        }}><img src={ai_icon} className='ai_icon me-2'/>{jsondata.generateAi}
                                        </button>
                                    </div>
                                </div>

                                {/* post caption */}
                                <div className='post_caption_outer media_outer'>
                                    <div className='caption_header'>
                                        <h5 className='post_heading create_post_text'>Add Post Caption</h5>

                                        <button className="ai_btn cmn_white_text" onClick={(e) => {
                                            e.preventDefault();
                                            setAIGenerateCaptionModal(true);
                                        }}>
                                            <img src={ai_icon}
                                                 className='ai_icon me-2'/>{jsondata.generateCaptionAi}
                                        </button>

                                    </div>
                                    <div className='textarea_outer'>
                                        <h6 className='create_post_text'>{jsondata.addText}</h6>
                                        <textarea className='textarea mt-2' rows={3} value={caption}
                                                  onChange={(e) => {
                                                      e.preventDefault()
                                                      setCaption(e.target.value);
                                                  }}></textarea>
                                    </div>
                                    <div className='caption_header hashtag_outer'>
                                        <h5 className='post_heading create_post_text'>Add Hashtag</h5>

                                        <button className="ai_btn cmn_white_text" onClick={(e) => {
                                            e.preventDefault();
                                            setAIGenerateHashTagModal(true);
                                        }}>
                                            <img src={ai_icon} className='ai_icon me-2'/>
                                            {jsondata.generateHashtagAi} </button>

                                    </div>
                                    <div className='textarea_outer'>
                                        <h6 className='create_post_text'>{jsondata.addText}</h6>
                                        <textarea className='textarea mt-2' rows={3} value={hashTag}
                                                  onChange={(e) => {
                                                      e.preventDefault();
                                                      setHashTag(e.target.value);
                                                  }}></textarea>
                                    </div>
                                    <div className='textarea get_messages_outer'>
                                        <div className='get_messages'>
                                            <input type='checkbox'/>
                                            <label className='create_post_text get_measage_heading ps-2'>Get more
                                                messages</label>
                                            <h6 className='create_post_text send_measage_heading'>Businesses like
                                                your get more messages when they add a “send message” button.</h6>
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
                                            <button
                                                className='cmn_bg_btn schedule_btn '>{jsondata.schedule}</button>
                                            <button className='save_btn cmn_bg_btn'>{jsondata.saveasdraft}</button>
                                        </div>
                                    </div>
                                    <div className='schedule_date_outer'>

                                        <div className='date_time_outer'>
                                            <h6 className='create_post_text'>{jsondata.setdate}</h6>
                                            <input type='date' placeholder='set date'
                                                   className='form-control mt-2 date_input'
                                                   value={scheduleDate}
                                                   onChange={(e) => {
                                                       e.preventDefault();
                                                       setScheduleDate(e.target.value);
                                                   }}
                                            />
                                        </div>

                                        <div className='date_time_outer'>
                                            <h6 className='create_post_text'>{jsondata.settime}</h6>
                                            <input type='time' placeholder="set time"
                                                   className='mt-2 form-control time_input'
                                                   value={scheduleTime}
                                                   onChange={(e) => {
                                                       e.preventDefault();
                                                       setScheduleTime(e.target.value);
                                                   }}
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* boost post */}
                                <div className='publish_post_outer media_outer'>

                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox"
                                               id="flexSwitchCheckChecked"
                                               checked={boostPost}
                                               onChange={(e) => {
                                                   e.preventDefault();
                                                   setBoostPost(!boostPost);
                                               }}
                                        />
                                        <label className="form-check-label create_post_label boost_post_text"
                                               htmlFor="flexSwitchCheckChecked">Boost Post</label>
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
                                    <img src={user_propfile} height="36px" width="36px"/>
                                    <div>
                                        <h3 className='create_post_text user_name boost_post_text'>Team
                                            Musafirrr</h3>
                                        <h6 className='status create_post_text'>just now <img src={ellipse_img}/>
                                        </h6>
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

        {aiGenerateImageModal && <AI_ImageModal aiGenerateImageModal={aiGenerateImageModal}
                                                setAIGenerateImageModal={setAIGenerateImageModal}/>}

        {aiGenerateCaptionModal && <AiCaptionModal aiGenerateCaptionModal={aiGenerateCaptionModal}
                                                   setAIGenerateCaptionModal={setAIGenerateCaptionModal}/>}

        {aiGenerateHashTagModal && <AI_Hashtag aiGenerateHashTagModal={aiGenerateHashTagModal}
                                               setAIGenerateHashTagModal={setAIGenerateHashTagModal}/>}
    </>)
}
export default CreatePost