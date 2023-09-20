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
import {GoComment} from "react-icons/go"
import {FiThumbsUp} from "react-icons/fi"
import {PiShareFat} from "react-icons/pi"
import {BiUser} from "react-icons/bi";
import {RxCross2} from "react-icons/rx";
import {createFacebookPostAction} from "../../../app/actions/postActions/postActions.js";


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
    const [selectedFileUrl, setSelectedFileUrl] = useState("");
    const dispatch = useDispatch();

    const token = getToken();

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionLabels, setSelectedOptionLabels] = useState([]);
    const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
    const [socialAccountData, setSocialAccountData] = useState([]);

    const socialAccounts = useSelector(state => state.socialAccount.getAllByCustomerIdReducer.data);


    useEffect(() => {
        if (socialAccounts) {
            setSocialAccountData(socialAccounts);
        }
    }, [socialAccounts]);


    useEffect(() => {
        const userInfo = decodeJwtToken(token);
        const requestBody = {
            token: token, customerId: userInfo?.customerId
        }
        dispatch(getAllByCustomerIdAction(requestBody));

    }, [])


    const toggleOption = (option, e) => {
        const optionIndex = selectedOptions.indexOf(option.id);

        console.log(optionIndex);

        if (optionIndex !== -1) {
            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
            setSelectedOptionLabels(selectedOptionLabels.filter((item) => item.label !== option.label));

            socialAccountData.map(el => {
                el.pageAccessToken.map(obj => {
                    if (obj.id === option.id) {
                        obj.selected = false;
                        el.selected = false;
                    }
                })
            });

            setSocialAccountData(socialAccountData);

            if (socialAccountData.filter(el => el.selected === false).length > 0) {
                setSelectAllCheckBox(false);
            }


        } else {
            setSelectedOptions([...selectedOptions, option.id]);
            setSelectedOptionLabels([...selectedOptionLabels, {
                id: option.id,
                label: option.label,
                imageUrl: option.imageUrl
            }]);


            const updatedSocialAccountData = socialAccountData.map((socialAccount) => ({
                ...socialAccount,
                selected: false,
                pageAccessToken: socialAccount?.pageAccessToken?.map((page) => ({
                    ...page,
                    selected: page?.selected === undefined ? page.id === option.id : (page.id === option.id ? true : page.selected)
                })) || [],
            }));

            const updatedSocialAccount = updatedSocialAccountData.map((socialAccount) => ({
                ...socialAccount,
                selected: socialAccount?.pageAccessToken.filter(el => el.selected === false).length === 0
            }));

            setSocialAccountData(updatedSocialAccount);

            if (updatedSocialAccount.filter(el => el.selected === false).length === 0) {
                setSelectAllCheckBox(true);
            }
        }
    };

    const handleUncheck = (option) => {

        const optionIndex = selectedOptions.indexOf(option.id);

        console.log(optionIndex);

        if (optionIndex !== -1) {

            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
            setSelectedOptionLabels(selectedOptionLabels.filter((item) => item.label !== option.label));

            socialAccountData.map(el => {
                el.pageAccessToken.map(obj => {
                    if (obj.id === option.id) {
                        obj.selected = false;
                        el.selected = false;
                    }
                })
            });

            setSocialAccountData(socialAccountData);

            if (socialAccountData.filter(el => el.selected === false).length > 0) {
                setSelectAllCheckBox(false);
            }
        }
    }

    const handlePostSubmit = (e) => {
        e.preventDefault();

        const userInfo = decodeJwtToken(token);
        const combinedDateTimeString = `${scheduleDate}T${scheduleTime}:00`;
        const scheduleDateTime = new Date(combinedDateTimeString);


        const requestBody = {
            token: token,
            customerId: userInfo?.customerId,
            postRequestDto: {
                attachments: [{
                    mediaType: "IMAGE",
                    file: selectedFile,
                    pageId: "115612628302302"
                }],
                hashTag: hashTag,
                caption: caption,
                scheduleDate: scheduleDateTime,
                boostPost: boostPost,
            }

        }

        dispatch(createFacebookPostAction(requestBody));

    }

    const handleSelectAllChange = (e) => {

        const checked = e.target.checked;

        const updatedSocialAccountData = socialAccountData.map((socialAccount) => ({
            ...socialAccount,
            selected: checked,
            pageAccessToken: socialAccount?.pageAccessToken?.map((page) => ({
                ...page,
                selected: checked
            })) || []
        }));

        setSocialAccountData(updatedSocialAccountData);

        if (checked === false) {
            setSelectAllCheckBox(false);
            setSelectedOptionLabels([]);
            setSelectedOptions([]);

        }

        if (checked === true && updatedSocialAccountData.filter(el => el.selected === false).length === 0) {
            setSelectAllCheckBox(true);
            socialAccountData.forEach((el) => {
                if (el.pageAccessToken != null && el.pageAccessToken.length > 0) {
                    el.pageAccessToken.forEach(option => {
                        let obj = {
                            id: option.id,
                            label: option.name,
                            imageUrl: option.imageUrl
                        }
                        selectedOptionLabels.push(obj);
                        selectedOptions.push(option.id);
                        setSelectedOptionLabels(selectedOptionLabels);
                        setSelectedOptions(selectedOptions);
                    })
                }
            });

        }

    };


    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="Container">
                    <div className="create_post_wrapper">
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12">

                                <div className="create_post_content">

                                    <h2 className='creare_post_heading'>{jsondata.createpost}</h2>

                                    <form onSubmit={handlePostSubmit}>

                                        <div className="createPost_outer">
                                            <label className='create_post_label'>{jsondata.mediaPlatform}</label>


                                            {/*    dropdown select platform=====*/}
                                            <Dropdown className='insta_dropdown_btn mt-2'>
                                                <Dropdown.Toggle id="instagram"
                                                                 className="instagram_dropdown tabs_grid">
                                                    {selectedOptionLabels.length > 0 ? (
                                                        selectedOptionLabels.map((data, index) => (
                                                            <div key={index} className="selected-option">
                                                                <img src={data.imageUrl} alt={data.label}/>
                                                                <span>{data.label}</span>
                                                                <RxCross2 onClick={() => {
                                                                    handleUncheck(data);
                                                                }}/>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="social_inner_content">
                                                            <div>
                                                                <BiUser/>
                                                            </div>
                                                            <h6 className="cmn_headings">
                                                                Select platform
                                                            </h6>
                                                        </div>
                                                    )}
                                                </Dropdown.Toggle>


                                                <Dropdown.Menu className='w-100 social_media_list'>
                                                    <div className="dropdown-options">

                                                        <div className='_'>
                                                            <div className="select_platform_outer">
                                                                <input type="checkbox"
                                                                       id="choice1-2"
                                                                       name="choice2"
                                                                       checked={selectAllCheckBox}
                                                                       onChange={(e) => {
                                                                           setSelectAllCheckBox(!selectAllCheckBox);
                                                                           handleSelectAllChange(e);
                                                                       }}
                                                                />
                                                                <h3 className="cmn_headings">Select all Platform</h3>
                                                            </div>

                                                            {
                                                                socialAccountData?.map((socialAccount, index) => {
                                                                    return (

                                                                        <div
                                                                            className='instagram_outer facebook_outer cmn_social_pages_outer'
                                                                            key={index}>

                                                                            <div className="checkbox-button_outer">
                                                                                <input type="checkbox"
                                                                                       className=""
                                                                                       id="choice1-1"
                                                                                       name="choice1"
                                                                                       checked={(socialAccount && socialAccount?.selected) ? socialAccount?.selected : false}
                                                                                       onChange={handleSelectAllChange}
                                                                                />
                                                                                {
                                                                                    socialAccount && socialAccount.provider === "FACEBOOK" &&
                                                                                    <>
                                                                                        <img src={facebook_img}
                                                                                             height="20px"
                                                                                             width="20px"/>
                                                                                        <h3 className="cmn_headings">{socialAccount.provider.toLowerCase()}</h3>
                                                                                    </>
                                                                                }

                                                                                {
                                                                                    socialAccount && socialAccount.provider === "INSTAGRAM" &&
                                                                                    <>
                                                                                        <img src={instagram_img}
                                                                                             height="20px"
                                                                                             width="20px"/>
                                                                                        <h3 className="cmn_headings">{socialAccount.provider.toLowerCase()}</h3>
                                                                                    </>
                                                                                }

                                                                                {
                                                                                    socialAccount && socialAccount.provider === "LINKEDIN" &&
                                                                                    <>
                                                                                        <img src={linkedin_img}
                                                                                             height="20px"
                                                                                             width="20px"/>
                                                                                        <h3 className="cmn_headings">{socialAccount.provider.toLowerCase()}</h3>
                                                                                    </>
                                                                                }

                                                                                {
                                                                                    socialAccount && socialAccount.provider === "TWITTER" &&
                                                                                    <>
                                                                                        <img src={twitter_img}
                                                                                             height="20px"
                                                                                             width="20px"/>
                                                                                        <h3 className="cmn_headings">{socialAccount.provider.toLowerCase()}</h3>
                                                                                    </>


                                                                                }

                                                                            </div>

                                                                            {
                                                                                socialAccount?.pageAccessToken?.map((page, index) => (
                                                                                    <div
                                                                                        className="instagramPages unselectedpages"
                                                                                        key={index}>
                                                                                        <div
                                                                                            className="checkbox-button_outer">
                                                                                            <img
                                                                                                src={page?.imageUrl}/>
                                                                                            <h2 className="cmn_text_style">{page?.name}</h2>
                                                                                        </div>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={page.id}
                                                                                            name={page.name}
                                                                                            checked={page?.selected === true}
                                                                                            onChange={(e) => toggleOption({
                                                                                                id: page.id,
                                                                                                label: page.name,
                                                                                                imageUrl: page?.imageUrl
                                                                                            }, e)
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                ))
                                                                            }


                                                                        </div>
                                                                    )
                                                                })
                                                            }


                                                        </div>

                                                    </div>


                                                </Dropdown.Menu>
                                            </Dropdown>

                                        </div>

                                        {/* add media */
                                        }
                                        <div className="media_outer">
                                            <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                            <h6 className='create_post_text'>{jsondata.sharephoto}</h6>
                                            <div className="file_outer">
                                                <div
                                                    className='cmn_blue_border add_media_outer'>
                                                    <input type="file" id='image'
                                                           className='file'
                                                           name={'file'}
                                                           onChange={(e) => {
                                                               e.preventDefault();
                                                               setSelectedFileUrl(URL.createObjectURL(e.target.files[0]));
                                                               setSelectedFile(e.target.files[0]);
                                                           }}
                                                    />
                                                    <label htmlFor='image'
                                                           className='cmn_headings'> <img
                                                        src={upload_img}/>{selectedFile?.name ? selectedFile.name : "Add Photo"}
                                                    </label>
                                                </div>

                                                <div
                                                    className='cmn_blue_border add_media_outer'>
                                                    <input type="file" id='video'/>
                                                    <label htmlFor='video'
                                                           className='cmn_headings'> <img
                                                        src={upload_video_img}/>Add
                                                        Video</label>
                                                </div>
                                            </div>
                                            <h2 className='cmn_heading'>{jsondata.OR}</h2>
                                            <div className="ai_outer_btn">
                                                <button className="ai_btn cmn_white_text mt-2"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAIGenerateImageModal(true);
                                                        }}><img src={ai_icon}
                                                                className='ai_icon me-2'/>{jsondata.generateAi}
                                                </button>
                                            </div>
                                        </div>

                                        {/* post caption */
                                        }
                                        <div className='post_caption_outer media_outer'>
                                            <div className='caption_header'>
                                                <h5 className='post_heading create_post_text'>Add
                                                    Post Caption</h5>

                                                <button className="ai_btn cmn_white_text"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAIGenerateCaptionModal(true);
                                                        }}>
                                                    <img src={ai_icon}
                                                         className='ai_icon me-2'/>{jsondata.generateCaptionAi}
                                                </button>

                                            </div>
                                            <div className='textarea_outer'>
                                                <h6 className='create_post_text'>{jsondata.addText}</h6>
                                                <textarea className='textarea mt-2' rows={3}
                                                          value={caption}
                                                          onChange={(e) => {
                                                              e.preventDefault()
                                                              setCaption(e.target.value);
                                                          }}></textarea>
                                            </div>
                                            <div className='caption_header hashtag_outer'>
                                                <h5 className='post_heading create_post_text'>Add
                                                    Hashtag</h5>

                                                <button className="ai_btn cmn_white_text"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAIGenerateHashTagModal(true);
                                                        }}>
                                                    <img src={ai_icon}
                                                         className='ai_icon me-2'/>
                                                    {jsondata.generateHashtagAi} </button>

                                            </div>
                                            <div className='textarea_outer'>
                                                <h6 className='create_post_text'>{jsondata.addText}</h6>
                                                <textarea className='textarea mt-2' rows={3}
                                                          value={hashTag}
                                                          onChange={(e) => {
                                                              e.preventDefault();
                                                              setHashTag(e.target.value);
                                                          }}></textarea>
                                            </div>
                                            <div className='textarea get_messages_outer'>
                                                <div className='get_messages'>
                                                    <input type='checkbox'/>
                                                    <label
                                                        className='create_post_text get_measage_heading ps-2'>Get
                                                        more
                                                        messages</label>
                                                    <h6 className='create_post_text send_measage_heading'>Businesses
                                                        like
                                                        your get more messages when they add a
                                                        “send message” button.</h6>
                                                    <h6 className='create_post_text try_it_heading'>Try
                                                        it out</h6>
                                                </div>

                                                <button
                                                    className='cmn_btn_color add_btn'>{jsondata.addbutton}</button>

                                            </div>

                                        </div>

                                        {/* schedule */
                                        }
                                        <div className='schedule_outer media_outer'>
                                            <div className='schedule_btn_outer'>
                                                <h5 className='create_post_text post_heading'>{jsondata.setSchedule}</h5>
                                                <div className='schedule_btn_wrapper'>
                                                    <button
                                                        className='cmn_bg_btn schedule_btn '>{jsondata.schedule}</button>
                                                    <button
                                                        className='save_btn cmn_bg_btn'>{jsondata.saveasdraft}</button>
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

                                        {/* boost post */
                                        }
                                        <div className='publish_post_outer media_outer'>

                                            <div className="form-check form-switch">
                                                <input className="form-check-input"
                                                       type="checkbox"
                                                       id="flexSwitchCheckChecked"
                                                       checked={boostPost}
                                                       onChange={(e) => {
                                                           e.preventDefault();
                                                           setBoostPost(!boostPost);
                                                       }}
                                                />
                                                <label
                                                    className="form-check-label create_post_label boost_post_text"
                                                    htmlFor="flexSwitchCheckChecked">Boost
                                                    Post</label>
                                            </div>

                                            <div className='cancel_publish_btn_outer'>
                                                <button
                                                    className='cancel_btn cmn_bg_btn'>{jsondata.cancel}</button>
                                                <button
                                                    className='publish_btn cmn_bg_btn'>{jsondata.publishnow}</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className='post_preview_outer'>
                                    <div className='preview_wrapper'>
                                        <h2 className='cmn_white_text feed_preview'>Instagram
                                            feed Preview</h2>
                                        <div className='user_profile_info'>
                                            <img src={user_propfile} height="36px"
                                                 width="36px"/>
                                            <div>
                                                <h3 className='create_post_text user_name boost_post_text'>Team
                                                    Musafirrr</h3>
                                                <h6 className='status create_post_text'>just
                                                    now <img src={ellipse_img}/>
                                                </h6>
                                            </div>

                                        </div>
                                        <img src={bg_img} className='post_img'/>
                                        <div className='like_comment_outer'>
                                            <div>
                                                <img src={like_img}
                                                     className='like_img'/>
                                                <img src={comment_img}
                                                     className='like_img'/>
                                                <img src={send_img}
                                                     className='like_img'/>
                                            </div>
                                            <img src={ribbon_img}
                                                 className="ribbon_img"/>
                                        </div>
                                    </div>
                                    {/*   facebook post preview */}
                                    <div className='preview_wrapper'>
                                        <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>Facebook
                                            feed Preview</h2>
                                        <div className='user_profile_info'>
                                            <img src={user_propfile} height="36px"
                                                 width="36px"/>
                                            <div>
                                                <h3 className='create_post_text user_name boost_post_text'>Team
                                                    Musafirrr</h3>
                                                <h6 className='status create_post_text'>just
                                                    now <img src={ellipse_img}/>
                                                </h6>
                                            </div>

                                        </div>
                                        <img src={selectedFileUrl} className='post_img'/>
                                        <div className='like_comment_outer'>
                                            <div className="fb_likes">
                                                <FiThumbsUp/>
                                                <h3 className="cmn_text_style">Likes</h3>
                                            </div>
                                            <div className="fb_likes">
                                                <GoComment/>
                                                <h3 className="cmn_text_style">Comment</h3>
                                            </div>
                                            <div className="fb_likes">
                                                <PiShareFat/>
                                                <h3 className="cmn_text_style">Share</h3>
                                            </div>


                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {
                aiGenerateImageModal && <AI_ImageModal
                    aiGenerateImageModal={aiGenerateImageModal}
                    setAIGenerateImageModal={setAIGenerateImageModal}/>
            }

            {
                aiGenerateCaptionModal && <AiCaptionModal
                    aiGenerateCaptionModal={aiGenerateCaptionModal}
                    setAIGenerateCaptionModal={setAIGenerateCaptionModal}/>
            }

            {
                aiGenerateHashTagModal && <AI_Hashtag
                    aiGenerateHashTagModal={aiGenerateHashTagModal}
                    setAIGenerateHashTagModal={setAIGenerateHashTagModal}/>
            }
        </>)
}
export default CreatePost