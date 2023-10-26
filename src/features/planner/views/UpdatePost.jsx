import './CreatePost.css'
import ai_icon from '../../../images/ai_icon.svg'
import jsondata from '../../../locales/data/initialdata.json'
import React, {useEffect, useState} from "react";
import AI_ImageModal from "../../modals/views/ai_image_modal/AI_ImageModal.jsx";
import AiCaptionModal from "../../modals/views/ai_caption_modal/AI_Caption";
import AI_Hashtag from "../../modals/views/ai_hashtag_modal/AI_Hashtag";
import {decodeJwtToken, getToken} from "../../../app/auth/auth.js";
import {useDispatch, useSelector} from "react-redux";
import {getAllByCustomerIdAction} from "../../../app/actions/socialAccountActions/socialAccountActions.js";
import {Dropdown} from 'react-bootstrap'
import SideBar from "../../sidebar/views/Layout.jsx";
import {BiUser} from "react-icons/bi";
import {RxCross2} from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview.jsx";
import {
    getAllPostsByBatchIdAction,
    updatePostOnSocialMediaAction
} from "../../../app/actions/postActions/postActions.js";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {useNavigate, useParams} from "react-router-dom";
import SocialMediaProviderBadge from "../../common/components/SocialMediaProviderBadge";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {
    convertToUnixTimestamp,
    getImagePostList,
    handleSeparateCaptionHashtag,
    validateScheduleDateAndTime
} from "../../../utils/commonUtils";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";


const UpdatePost = () => {

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const token = getToken();
        const {batchId} = useParams();

        const [aiGenerateImageModal, setAIGenerateImageModal] = useState(false);
        const [aiGenerateCaptionModal, setAIGenerateCaptionModal] = useState(false);
        const [aiGenerateHashTagModal, setAIGenerateHashTagModal] = useState(false);

        const [hashTag, setHashTag] = useState("");
        const [caption, setCaption] = useState("");
        const [scheduleDate, setScheduleDate] = useState("");
        const [scheduleTime, setScheduleTime] = useState("");
        const [boostPost, setBoostPost] = useState(false);
        const [socialAccountData, setSocialAccountData] = useState([]);
        const [files, setFiles] = useState([]);
        const [selectedFileType, setSelectedFileType] = useState("");
        const [reference, setReference] = useState("");

        const [allOptions, setAllOptions] = useState([]);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [selectedGroups, setSelectedGroups] = useState([]);
        const [selectedAllDropdownData, setSelectedAllDropdownData] = useState([]);

        const socialAccounts = useSelector(state => state.socialAccount.getAllByCustomerIdReducer.data);
        const userData = useSelector(state => state.user.userInfoReducer.data);
        const loadingCreateFacebookPost = useSelector(state => state.post.createFacebookPostActionReducer.loading)
        const getPostsByBatchIdList = useSelector(state => state.post.getAllPostsByBatchIdReducer.data);


        console.log("--->getPostsByBatchIdList", getPostsByBatchIdList);

        useEffect(() => {

            if (getPostsByBatchIdList && Object.keys(getPostsByBatchIdList).length > 0) {
                setSelectedOptions(Object.values(getPostsByBatchIdList).flatMap((batch) => batch.map((post) => post.page.pageId)));
                const postData = Object.values(getPostsByBatchIdList).flatMap((batch) => batch.map((post) => post));
                const {caption, hashtag} = handleSeparateCaptionHashtag(postData[0].message);
                setCaption(caption);
                setHashTag(hashtag);
                const imagePostList = getImagePostList(postData);
                setFiles(imagePostList);
            }
        }, [allOptions, getPostsByBatchIdList]);


        useEffect(() => {
            if (socialAccounts) {
                setSocialAccountData(socialAccounts);
            }
        }, [socialAccounts]);


        useEffect(() => {
            if (batchId) {
                dispatch(getAllPostsByBatchIdAction({batchId: batchId, token: token}))
            }
        }, [batchId]);


        useEffect(() => {
            const userInfo = decodeJwtToken(token);
            dispatch(getAllByCustomerIdAction({token: token, customerId: userInfo?.customerId}));

        }, []);


        // Create all Options
        useEffect(() => {
            if (socialAccountData) {
                const optionList = socialAccountData.map((socialAccount) => {
                    return {
                        group: socialAccount?.provider,
                        allOptions: socialAccount?.pageAccessToken
                    }
                });
                setAllOptions(optionList);
            }
        }, [socialAccountData]);

        useEffect(() => {
            //select dropdown label
            const selectedAllDropdownList = allOptions?.flatMap((groupOption) => groupOption.allOptions)
                .filter((option) => selectedOptions.includes(option.pageId)).map((option) => {
                    const group = allOptions.find((data) => data.allOptions.some((cur) => cur.pageId === option.pageId))?.group;
                    return {group: group, selectOption: option};
                });
            setSelectedAllDropdownData(selectedAllDropdownList);
        }, [allOptions, selectedOptions]);


        // handle Group selector
        const handleGroupCheckboxChange = (group) => {
            const updatedSelectedGroups = new Set(selectedGroups);
            const updatedSelectedOptions = new Set(selectedOptions);

            if (selectedGroups.includes(group)) {
                updatedSelectedGroups.delete(group);
                allOptions.find((groupItem) => groupItem.group === group).allOptions.forEach((opt) => updatedSelectedOptions.delete(opt.pageId));
            } else {
                updatedSelectedGroups.add(group);
                allOptions.find((groupItem) => groupItem.group === group).allOptions.forEach((opt) => updatedSelectedOptions.add(opt.pageId));
            }

            setSelectedGroups(Array.from(updatedSelectedGroups));
            setSelectedOptions(Array.from(updatedSelectedOptions));
        };


        //handle single selector
        const handleCheckboxChange = (option) => {
            const {group, selectOption} = option;

            const updatedSelectedOptions = [...selectedOptions];
            const updatedSelectedGroups = [...selectedGroups];

            const groupOptionIds = allOptions.find((cur) => cur.group === group).allOptions.map((opt) => opt.pageId);

            if (selectedOptions.includes(selectOption.pageId)) {
                updatedSelectedOptions.splice(updatedSelectedOptions.indexOf(selectOption.pageId), 1);
            } else {
                updatedSelectedOptions.push(selectOption.pageId);
            }

            const isGroupFullySelected = groupOptionIds.every((id) => updatedSelectedOptions.includes(id));

            if (isGroupFullySelected) {
                if (!updatedSelectedGroups.includes(group)) {
                    updatedSelectedGroups.push(group);
                }
            } else {
                updatedSelectedGroups.splice(updatedSelectedGroups.indexOf(group), 1);
            }

            setSelectedOptions(updatedSelectedOptions);
            setSelectedGroups(updatedSelectedGroups);
        };


        // Handle Select All Method
        const handleSelectAll = () => {
            const allOptionIds = allOptions.flatMap((group) => group.allOptions.map((option) => option.pageId));
            setSelectedOptions(allOptionIds);
            setSelectedGroups(allOptions.map((group) => group.group));
        };

        // Handle UnSelect All Method
        const handleUnselectAll = () => {
            setSelectedOptions([]);
            setSelectedGroups([]);
        };

        const areAllOptionsSelected = allOptions.flatMap((group) => group.allOptions).every((option) => selectedOptions.includes(option.pageId));

        const handleSelectedImageFile = (e) => {
            e.preventDefault();
            const uploadedFiles = Array.from(e.target.files);
            const imageObjects = uploadedFiles.map((file) => {
                return {
                    file: file,
                    imageUrl: URL.createObjectURL(file),
                    attachmentReferenceId: null,
                    mediaType: file?.type.includes("image") ? "IMAGE" : "VIDEO",
                    attachmentReferenceURL:null
                };
            });

            setFiles([...files, ...imageObjects]);
            console.log("dimensionPromises", imageObjects)

        }

        const handleSelectedVideoFile = (e) => {
            e.preventDefault();
            const uploadedVideoFiles = Array.from(e.target.files);
            const videoImage = uploadedVideoFiles.map((file) => {
                return {
                    file: file,
                    imageUrl: URL.createObjectURL(file),
                    attachmentReferenceId: null,
                    mediaType: file?.type.includes("image") ? "IMAGE" : "VIDEO"
                }
            });

            console.log("dimensionPromises Videos", videoImage);
        }

        const updatePost = (e, postStatus, scheduleDate, scheduleTime) => {
                e.preventDefault();
                const userInfo = decodeJwtToken(token);

                if (postStatus === 'SCHEDULED') {
                    validateScheduleDateAndTime('SCHEDULED', scheduleDate, scheduleTime);
                }


                const updatePostAttachments = files.map((curFile) => {
                    return {
                        file: curFile?.file || null,
                        mediaType: curFile?.mediaType,
                        attachmentReferenceId: curFile?.attachmentReferenceId,
                        attachmentReferenceURL:curFile?.attachmentReferenceURL
                    }
                });

                const requestBody = {
                    token: token,
                    customerId: userInfo?.customerId,
                    batchId: batchId,
                    updatePostRequestDTO: {
                        updatePostAttachments: updatePostAttachments,
                        hashTag: hashTag,
                        caption: caption,
                        postStatus: postStatus,
                        boostPost: boostPost,
                        pageIds: selectedOptions,
                        scheduleDate: postStatus === 'SCHEDULED' ? convertToUnixTimestamp(scheduleDate, scheduleTime) : null,
                    },
                };

                console.log("@@@ RequestBody ", requestBody);

                dispatch(updatePostOnSocialMediaAction(requestBody)).then((response) => {
                    if (response.meta.requestStatus === "fulfilled") {
                        showSuccessToast("Post has uploaded successfully");
                        navigate("/planner");
                    }
                }).catch((error) => {
                    showErrorToast(error.response.data.message);
                });

            }
        ;

        const handlePostSubmit = (e) => {
            updatePost(e, 'PUBLISHED');
        };

        const handleDraftPost = (e) => {
            updatePost(e, 'DRAFT');
        };

        const handleSchedulePost = (e) => {
            updatePost(e, 'SCHEDULED', scheduleDate, scheduleTime);
        };

        const handleRemoveSelectFile = (indexToRemove) => {
            const updatedFiles = files.filter((_, index) => index !== indexToRemove);
            setFiles(updatedFiles);
        };

        const resetForm = (e) => {
            e.preventDefault();
            setFiles([]);
            setSelectedOptions([]);
            setHashTag("");
            setCaption("");
            setScheduleTime("");
            setScheduleDate("");
            setBoostPost(false);
        }


        return (
            <>
                <SideBar/>
                <div className="cmn_container">
                    <div className="Container">
                        <div className="create_post_wrapper">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-sm-12">

                                    <div className="create_post_content">

                                        <h2 className='creare_post_heading'>{jsondata.updatepost}</h2>

                                        <form onSubmit={null}>

                                            <div className="createPost_outer">
                                                <label className='create_post_label'>{jsondata.mediaPlatform} *</label>


                                                {/*    dropdown select platform=====*/}
                                                <Dropdown className='insta_dropdown_btn mt-2'>
                                                    <Dropdown.Toggle id="instagram"
                                                                     className="instagram_dropdown tabs_grid">
                                                        {selectedAllDropdownData.length > 0 ?
                                                            (
                                                                selectedAllDropdownData.map((data, index) => (
                                                                    <div key={index} className="selected-option">
                                                                        <img src={data?.selectOption?.imageUrl}
                                                                             alt={data?.selectOption?.name}/>
                                                                        <span>{data?.selectOption?.name}</span>
                                                                        <RxCross2 onClick={(e) => {
                                                                            handleCheckboxChange(data)
                                                                        }}/>
                                                                    </div>
                                                                ))
                                                            )
                                                            :
                                                            (
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
                                                                           checked={areAllOptionsSelected}
                                                                           onChange={areAllOptionsSelected ? handleUnselectAll : handleSelectAll}
                                                                    />
                                                                    <h3 className="cmn_headings">Select all
                                                                        Platform</h3>
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
                                                                                           checked={selectedGroups.includes(socialAccount?.provider)}
                                                                                           onChange={() => handleGroupCheckboxChange(socialAccount?.provider)}
                                                                                    />

                                                                                    {socialAccount &&
                                                                                        <SocialMediaProviderBadge
                                                                                            provider={socialAccount.provider}/>}

                                                                                </div>

                                                                                {
                                                                                    socialAccount?.pageAccessToken?.map((page, index) => (
                                                                                        <div
                                                                                            className="instagramPages unselectedpages"
                                                                                            key={index}
                                                                                            style={{background: page?.selected === true ? "rgb(215 244 215)" : ""}}
                                                                                            onClick={(e) =>
                                                                                                handleCheckboxChange({
                                                                                                    group: socialAccount?.provider,
                                                                                                    selectOption: page
                                                                                                })}
                                                                                        >
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
                                                                                                value={page.id}
                                                                                                checked={selectedOptions.includes(page.pageId)}
                                                                                                onChange={() =>
                                                                                                    handleCheckboxChange({
                                                                                                        group: socialAccount?.provider,
                                                                                                        selectOption: page
                                                                                                    })}
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
                                                        return (
                                                            <div
                                                                className="file_outer dragable_files"
                                                                key={index}
                                                            >
                                                                <div className="flex-grow-1 d-flex align-items-center">
                                                                    <i className="fas fa-grip-vertical me-2"></i>
                                                                    {
                                                                        file.mediaType === "IMAGE" &&
                                                                        <img className={"upload_image me-3"}
                                                                             src={file.imageUrl}
                                                                             alt={`Image ${index}`}/>
                                                                    }
                                                                    {
                                                                        file.mediaType === "VIDEO" &&
                                                                        <video className={"upload_image me-3"}
                                                                               src={file.imageUrl} alt={`Videos ${index}`}
                                                                               autoPlay={true}/>
                                                                    }
                                                                </div>
                                                                <button className="delete_upload" disabled={file?.mediaType==="VIDEO"}>
                                                                    <RiDeleteBin5Fill
                                                                        style={{fontSize: '24px'}}
                                                                                      onClick={(e) => {
                                                                                          e.preventDefault();
                                                                                          handleRemoveSelectFile(index);
                                                                                      }} />
                                                                </button>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>

                                                <div className="darg_navs file_outer">
                                                    <div
                                                        className={"cmn_blue_border add_media_outer"}>
                                                        <input type="file" id='image'
                                                               className='file'
                                                               multiple
                                                               name={'file'}
                                                               onClick={e => (e.target.value = null)}
                                                               accept={"image/png, image/jpeg"}
                                                               onChange={(e) => {
                                                                   setSelectedFileType("IMAGE");
                                                                   handleSelectedImageFile(e);
                                                               }}
                                                        />
                                                        <label htmlFor='image' className='cmn_headings'>
                                                            <i className="fa fa-image"
                                                               style={{marginTop: "2px"}}/>{"Add Photo"}
                                                        </label>
                                                    </div>

                                                    <div className="cmn_blue_border add_media_outer">
                                                        <input
                                                            type="file"
                                                            id='video'
                                                            onClick={e => (e.target.value = null)}
                                                            accept={"video/mp4,video/x-m4v,video/*"}
                                                            onChange={(e) => {
                                                                setSelectedFileType("VIDEO");
                                                                handleSelectedVideoFile(e);
                                                            }}/>
                                                        <label htmlFor='video' className='cmn_headings'>
                                                            <i className="fa fa-video-camera"
                                                               style={{marginTop: "2px"}}/>Add
                                                            Video
                                                        </label>
                                                    </div>
                                                </div>

                                                <h2 className='cmn_heading'>{jsondata.OR}</h2>
                                                <div className="ai_outer_btn">
                                                    <button
                                                        className={`ai_btn cmn_white_text mt-2`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
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
                                                        Post Caption *</h5>

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
                                                        Hashtag *</h5>

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

                                            {/* schedule */}
                                            <div className='schedule_outer media_outer'>

                                                <div className='schedule_btn_outer'>
                                                    <h5 className='create_post_text post_heading'>{jsondata.setSchedule}</h5>
                                                    <div className='schedule_btn_wrapper d-flex'>

                                                        <GenericButtonWithLoader label={jsondata.schedule}
                                                                                 onClick={(e) => {
                                                                                     setReference("Scheduled")
                                                                                     handleSchedulePost(e);
                                                                                 }}
                                                                                 className={"cmn_bg_btn schedule_btn loading"}
                                                                                 isLoading={reference === "Scheduled" && loadingCreateFacebookPost}/>

                                                        <GenericButtonWithLoader label={jsondata.saveasdraft}
                                                                                 onClick={(e) => {
                                                                                     setReference("Draft")
                                                                                     handleDraftPost(e);
                                                                                 }}
                                                                                 className={"save_btn cmn_bg_btn loading"}
                                                                                 isLoading={reference === "Draft" && loadingCreateFacebookPost}/>
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
                                                        htmlFor="flexSwitchCheckChecked">Boost Post</label>
                                                </div>

                                                <div className='cancel_publish_btn_outer d-flex'>
                                                    <button className='cancel_btn cmn_bg_btn' onClick={(e) => {
                                                        e.preventDefault();
                                                        resetForm(e);
                                                    }}>{jsondata.cancel}</button>

                                                    <GenericButtonWithLoader label={jsondata.publishnow}
                                                                             onClick={(e) => {
                                                                                 setReference("Published")
                                                                                 handlePostSubmit(e);
                                                                             }}
                                                                             className={"publish_btn cmn_bg_btn loading"}
                                                                             isLoading={reference === "Published" && loadingCreateFacebookPost}/>
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
                                                           selectedFileType={null}
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
;
export default UpdatePost
