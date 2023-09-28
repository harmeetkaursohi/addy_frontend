import './CreatePost.css'
import ai_icon from '../../../images/ai_icon.svg'
import instagram_img from '../../../images/instagram.png'
import jsondata from '../../../locales/data/initialdata.json'
import React, {useEffect, useState} from "react";
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
import {BiUser} from "react-icons/bi";
import {RxCross2} from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview.jsx";
import {createFacebookPostAction} from "../../../app/actions/postActions/postActions.js";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {RiDeleteBin5Fill} from "react-icons/ri";

const CreatePost = () => {

    const [aiGenerateImageModal, setAIGenerateImageModal] = useState(false);
    const [aiGenerateCaptionModal, setAIGenerateCaptionModal] = useState(false);
    const [aiGenerateHashTagModal, setAIGenerateHashTagModal] = useState(false);

    const [hashTag, setHashTag] = useState("");
    const [caption, setCaption] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [boostPost, setBoostPost] = useState(false);
    const dispatch = useDispatch();

    const token = getToken();

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionLabels, setSelectedOptionLabels] = useState([]);
    const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
    const [socialAccountData, setSocialAccountData] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFileType, setSelectedFileType] = useState("");
    const [disableFileButton, setDisableFileButton] = useState(false);
    const [disableVideoButton, setDisableVideoButton] = useState(false);

    const socialAccounts = useSelector(state => state.socialAccount.getAllByCustomerIdReducer.data);
    const userData = useSelector(state => state.user.userInfoReducer.data);


    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {
                customerId: decodeJwt.customerId,
                token: token
            }
            dispatch(getUserInfo(requestBody))
        }
    }, [token, dispatch, userData]);

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

        if (optionIndex !== -1) {
            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
            setSelectedOptionLabels(selectedOptionLabels.filter((item) => item.label !== option.label));

            socialAccountData.map(el => {
                el.pageAccessToken.map(obj => {
                    if (obj.pageId === option.id) {
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
                    selected: page?.selected === undefined ? page.pageId === option.id : (page.pageId === option.id ? true : page.selected)
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

        if (optionIndex !== -1) {

            setSelectedOptions(selectedOptions.filter((id) => id !== option.id));
            setSelectedOptionLabels(selectedOptionLabels.filter((item) => item.label !== option.label));

            socialAccountData.map(el => {
                el.pageAccessToken.map(obj => {
                    if (obj.pageId === option.id) {
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
                attachments: files.map((file) => ({mediaType: selectedFileType, file: file})),
                hashTag: hashTag,
                caption: caption,
                scheduleDate: scheduleDateTime,
                boostPost: boostPost,
                pageIds: selectedOptionLabels.map((obj) => obj.id)
            }
        }

        console.log("requestBody", requestBody)

        dispatch(createFacebookPostAction(requestBody));
        // handleReset();
    }

    const handleReset = () => {
        setScheduleTime("");
        setScheduleDate("");
        setBoostPost(false);
        setCaption("");
        setHashTag("");
        setSelectedOptionLabels([]);
        setSelectedOptions([]);
        setFiles([]);
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
                            id: option.pageId,
                            label: option.name,
                            imageUrl: option.imageUrl
                        }
                        selectedOptionLabels.push(obj);
                        selectedOptions.push(option.pageId);
                        setSelectedOptionLabels(selectedOptionLabels);
                        setSelectedOptions(selectedOptions);
                    })
                }
            });

        }

    };

    const handleSelectedFile = (e) => {
        e.preventDefault();
        const uploadedFiles = Array.from(e.target.files);
        setFiles([...files, ...uploadedFiles]);
    }

    // const checkDimensions = (imgUrl) => {
    //     const img = new Image();
    //     img.src = imgUrl;
    //     img.onload = () => {
    //         const width = img.naturalWidth;
    //         const height = img.naturalHeight;
    //
    //         console.log(width, height)
    //
    //         // if (width > 200 || height > 200) {
    //         //     // Image dimensions are larger than the maximum allowed
    //         //     // You can either return false to prevent the image from being uploaded
    //         //     // or display an error message to the user
    //         //     return false;
    //         // }
    //         // return true;
    //     }
    // }


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
                                                                                            <img src={page?.imageUrl}/>
                                                                                            <h2 className="cmn_text_style">{page?.name}</h2>
                                                                                        </div>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id={page.id}
                                                                                            name={page.name}
                                                                                            checked={page?.selected === true}
                                                                                            onChange={(e) => toggleOption({
                                                                                                id: page.pageId,
                                                                                                label: page.name,
                                                                                                imageUrl: page?.imageUrl
                                                                                            }, e)}
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

                                        {/* add media */}
                                        <div className="media_outer">
                                            <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                            <h6 className='create_post_text'>{jsondata.sharephoto}</h6>
                                            <div className="drag_scroll">
                                                {files?.map((file, index) => {
                                                        console.log("file--->",file);
                                                        return (
                                                            <div className="file_outer dragable_files" key={index}>
                                                                <div className="flex-grow-1">
                                                                    <img className={"upload_image"}
                                                                         src={URL.createObjectURL(file)}
                                                                         alt={`Image ${index}`}/>
                                                                </div>
                                                                <button className="delete_upload">
                                                                    <RiDeleteBin5Fill style={{fontSize: '24px'}}/>
                                                                </button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            <div className="darg_navs file_outer">
                                                <div
                                                    className={disableFileButton ? "disable_color add_media_outer" : "cmn_blue_border add_media_outer"}>
                                                    <input type="file" id='image'
                                                           className='file'
                                                           multiple
                                                           name={'file'}
                                                           disabled={disableFileButton}
                                                           onChange={(e) => {
                                                               setSelectedFileType("IMAGE")
                                                               setDisableVideoButton(true);
                                                               handleSelectedFile(e);
                                                           }}
                                                    />
                                                    <label htmlFor='image' className='cmn_headings'>
                                                        <i className="fa fa-image"
                                                           style={{marginTop: "2px"}}/>{"Add Photo"}
                                                    </label>
                                                </div>

                                                {
                                                    !disableVideoButton && <div
                                                        className={`${disableVideoButton ? "disable_color add_media_outer" : 'cmn_blue_border add_media_outer'}`}>
                                                        <input
                                                            type="file"
                                                            id='video'
                                                            disabled={disableVideoButton}
                                                            onChange={(e) => {
                                                                setSelectedFileType("VIDEO");
                                                                setDisableFileButton(true);
                                                                handleSelectedFile(e);
                                                            }}/>
                                                        <label htmlFor='video' className='cmn_headings'>
                                                            <i className="fa fa-video-camera" style={{marginTop: "2px"}}/>Add
                                                            Video
                                                        </label>
                                                    </div>
                                                }
                                            </div>

                                            <h2 className='cmn_heading'>{jsondata.OR}</h2>
                                            <div className="ai_outer_btn">
                                                <button
                                                    className={`${disableFileButton ? 'disabledButton ai_btn' : 'ai_btn cmn_white_text mt-2'}`}
                                                    disabled={disableFileButton}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setDisableVideoButton(true);
                                                        setAIGenerateImageModal(true);
                                                    }}>
                                                    <i className="fa-solid fa-robot ai_icon me-2"
                                                       style={{fontSize: "15px"}}/> {jsondata.generateAi}
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

                                    <CommonFeedPreview previewTitle={`Facebook feed Preview`}
                                                       pageName={`Team Musafirrr`}
                                                       userData={userData}
                                                       files={files}
                                                       selectedFileType={selectedFileType}
                                                       caption={caption}
                                                       hashTag={hashTag}

                                    />
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