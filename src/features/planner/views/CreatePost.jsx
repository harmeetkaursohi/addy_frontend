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
import {BiSolidEditAlt, BiUser} from "react-icons/bi";
import {RxCross2} from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview.jsx";
import {createFacebookPostAction} from "../../../app/actions/postActions/postActions.js";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {showErrorToast} from "../../common/components/Toast";
import {useNavigate} from "react-router-dom";
import {
    blobToFile,
    checkDimensions, convertSentenceToHashtags,
    convertToUnixTimestamp, getEnumValue, isCreatePostRequestValid, isNullOrEmpty,
    validateScheduleDateAndTime
} from "../../../utils/commonUtils";
import SocialMediaProviderBadge from "../../common/components/SocialMediaProviderBadge";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import default_user_icon from "../../../images/default_user_icon.svg";
import {SocialAccountProvider, enabledSocialMedia} from "../../../utils/contantData";
import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
import CommonLoader from "../../common/components/CommonLoader";
import EditImageModal from '../../common/components/EditImageModal.jsx';
import EditVideoModal from '../../common/components/EditVideoModal.jsx';
import {useAppContext} from '../../common/components/AppProvider.jsx';
import {AiOutlineEye} from 'react-icons/ai';

const CreatePost = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = getToken();

    const [aiGenerateImageModal, setAIGenerateImageModal] = useState(false);
    const [aiGenerateCaptionModal, setAIGenerateCaptionModal] = useState(false);
    const [aiGenerateHashTagModal, setAIGenerateHashTagModal] = useState(false);
    const [hashTag, setHashTag] = useState("");
    const [caption, setCaption] = useState("");
    const [pinTitle, setPinTitle] = useState("");
    const [pinDestinationUrl, setPinDestinationUrl] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [boostPost, setBoostPost] = useState(false);
    const [socialAccountData, setSocialAccountData] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFileType, setSelectedFileType] = useState("");
    const [reference, setReference] = useState("");
    const [disableImage, setDisableImage] = useState(false);
    const [disableVideo, setDisableVideo] = useState(false);
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const socialAccounts = useSelector(state => state.socialAccount.getAllByCustomerIdReducer.data);
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const loadingCreateFacebookPost = useSelector(state => state.post.createFacebookPostActionReducer.loading);


    const [trimmedVideoUrl, setTrimmedVideoUrl] = useState()
    const [allOptions, setAllOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedAllDropdownData, setSelectedAllDropdownData] = useState([]);
    const [showPreview, setShowPreview] = useState(false)


    useEffect(() => {
        if (connectedPagesData.loading) {
            setShowConnectAccountModal(false)
        } else {
            const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length > 0
            const isAnyAccountConnected = getAllConnectedSocialAccountData?.data?.length > 0
            if (isAnyPageConnected && isAnyAccountConnected) {
                setShowConnectAccountModal(false)
            } else {
                setShowConnectAccountModal(true)
            }
        }
    }, [connectedPagesData, getAllConnectedSocialAccountData])

    useEffect(() => {
        if (files && files.length <= 0) {
            setDisableVideo(false);
            setDisableImage(false);
        }
    }, [files])


    useEffect(() => {
        if (socialAccounts) {
            const filteredSocialMediaData = socialAccounts.filter((account) => {
                switch (account.provider) {
                    case "FACEBOOK":
                        return enabledSocialMedia?.isFacebookEnabled;
                    case "INSTAGRAM":
                        return enabledSocialMedia?.isInstagramEnabled;
                    case "LINKEDIN":
                        return enabledSocialMedia?.isLinkedinEnabled;
                    case "PINTEREST":
                        return enabledSocialMedia?.isPinterestEnabled;
                    default:
                        return true;
                }
            });
            setSocialAccountData(filteredSocialMediaData);
        }
    }, [socialAccounts]);


    // Create all Options
    useEffect(() => {
        if (socialAccountData) {
            const optionList = socialAccountData.map((socialAccount) => {
                return {
                    group: socialAccount?.provider, allOptions: socialAccount?.pageAccessToken
                }
            });

            setAllOptions(optionList);
        }
    }, [socialAccountData]);


    useEffect(() => {
        //select dropdown label
        const selectedAllDropdownList = allOptions?.flatMap((groupOption) => groupOption.allOptions)
            .filter((option) => selectedOptions.includes(option.pageId))
            .map((option) => {
                const group = allOptions.find((data) => data.allOptions.some((cur) => cur.pageId === option.pageId))?.group;
                return {group: group, selectOption: option};
            });
        setSelectedAllDropdownData(selectedAllDropdownList);
    }, [allOptions, selectedOptions]);


    //handle single selector
    const handleCheckboxChange = (option) => {

        const {group, selectOption} = option;
        const updatedSelectedOptions = [...selectedOptions];
        const updatedSelectedGroups = [...selectedGroups];

        updatedSelectedOptions.push(group);
        updatedSelectedGroups.push(selectOption);


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

    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {customerId: decodeJwt.customerId, token: token}
            dispatch(getUserInfo(requestBody))
        }
    }, [token, dispatch, userData]);


    useEffect(() => {
        const userInfo = decodeJwtToken(token);
        const requestBody = {token: token, customerId: userInfo?.customerId}
        dispatch(getAllByCustomerIdAction(requestBody));
    }, []);

    const handleSelectedFile = (e) => {
        e.preventDefault();
        const uploadedFiles = Array.from(e.target.files);
        const dimensionPromises = uploadedFiles.map((file) => checkDimensions(file));

        Promise.all(dimensionPromises)
            .then((results) => {
                setFiles([...files, ...results]);
            })
            .catch((error) => {
                console.error("Error checking dimensions:", error);
            });
    }


    const handleSelectedVideoFile = (e) => {
        e.preventDefault();
        const uploadedVideoFiles = Array.from(e.target.files);
        const dimensionPromises = uploadedVideoFiles.map((file) => checkDimensions(file));

        Promise.all(dimensionPromises)
            .then((results) => {
                setFiles([...results]);
            })
            .catch((error) => {
                console.error("Error checking dimensions:", error);
            });
    }

    const handleRemoveSelectFile = (fileToRemove) => {
        const updatedFiles = files.filter((file) => file.url !== fileToRemove.url);
        setFiles(updatedFiles);
    };

    const createPost = (e, postStatus, scheduleDate, scheduleTime) => {

        e.preventDefault();
        const userInfo = decodeJwtToken(token);
        const isScheduledTimeProvided = !isNullOrEmpty(scheduleDate) || !isNullOrEmpty(scheduleTime);
        if (postStatus === 'SCHEDULED' || isScheduledTimeProvided) {

            if (!scheduleDate && !scheduleTime) {
                showErrorToast("Please enter scheduleDate and scheduleTime!!");
                return;
            }

            if (!validateScheduleDateAndTime(scheduleDate, scheduleTime)) {
                showErrorToast("Schedule date and time must be at least 10 minutes in the future.");
                return;
            }
        }

        const requestBody = {
            token: token,
            customerId: userInfo?.customerId,
            postRequestDto: {
                postPageInfos: allOptions?.flatMap(obj => {
                    const provider = obj.group;
                    const selectedOptionsData = obj.allOptions
                        .filter(option => selectedOptions.includes(option.pageId))
                        .map(option => ({pageId: option.pageId, provider}));
                    return selectedOptionsData;
                }) || [],
                caption: caption ? caption : "",
                hashTag: hashTag ? hashTag : "",
                pinTitle: pinTitle ? pinTitle : "",
                destinationUrl: pinDestinationUrl ? pinDestinationUrl : "",
                attachments: files?.map((file) => ({mediaType: selectedFileType, file: file?.file})),
                postStatus: postStatus,
                boostPost: boostPost,
                scheduledPostDate: (postStatus === 'SCHEDULED' || isScheduledTimeProvided) ? convertToUnixTimestamp(scheduleDate, scheduleTime) : null,
            },
        };


        isCreatePostRequestValid(requestBody?.postRequestDto, files) && dispatch(createFacebookPostAction(requestBody)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
                navigate("/planner");
            }
        }).catch((error) => {
            showErrorToast(error.response.data.message);
        });

    };

    const handlePostSubmit = (e) => {
        createPost(e, 'PUBLISHED');
    };

    const handleDraftPost = (e) => {
        createPost(e, 'DRAFT', scheduleDate, scheduleTime);
    };

    const handleSchedulePost = (e) => {
        createPost(e, 'SCHEDULED', scheduleDate, scheduleTime);
    };


    const resetForm = (e) => {
        e.preventDefault();
        setFiles([]);
        setHashTag("");
        setCaption("");
        setScheduleTime("");
        setScheduleDate("");
        setBoostPost(false);
        setSelectedOptions([]);
        setSelectedGroups([]);
        setSocialAccountData(socialAccountData);
    }


    // edit handler
    const [showEditImageModal, setShowEditImageModal] = useState()
    const [cropImgUrl, setCropImgUrl] = useState(null)
    const [editImgIndex, setEditImgIndex] = useState(null)
    const [imgFile, setImgFile] = useState(null)
    const [videoFile, setVideoFile] = useState(null)
    const [fileSize, setFileSize] = useState(null)

    const [blobVideo, setBlobVideo] = useState(null)

    const [showEditVideoModal, setShowEditVideoModal] = useState(false)

    const editHandler = (index, file) => {

        setImgFile(file)
        setEditImgIndex(index)

        if (file.mediaType === 'VIDEO') {
            setShowEditVideoModal(true)
            setVideoFile(file)
        } else {
            setShowEditImageModal(true)
        }

    }

    useEffect(() => {
        if (cropImgUrl) {
            const updatedFiles = [...files];
            updatedFiles[editImgIndex] = {
                file: blobToFile(fileSize, imgFile?.fileName, imgFile?.file?.type),
                url: cropImgUrl,
                fileName: imgFile?.fileName,
                mediaType: imgFile?.mediaType
            };

            setFiles(updatedFiles);

        }
    }, [cropImgUrl])
    // trimmed video url
    useEffect(() => {
        if (trimmedVideoUrl) {
            const updatedFiles = [...files];

            updatedFiles[editImgIndex] = {
                file: blobVideo,
                url: trimmedVideoUrl,
                fileName: videoFile?.fileName,
                mediaType: videoFile?.mediaType
            };

            setFiles(updatedFiles);

        }
    }, [trimmedVideoUrl])


    const {sidebar} = useAppContext()


    return (
        <>
            <div className={`cmn_container ${sidebar ? "" : "cmn_Padding"}`}>
                {
                    (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                        <CommonLoader></CommonLoader> :
                        <div className="Container">
                            <div className={`create_post_wrapper ${showPreview ? "" : "width_class"}`}>
                                <div className='preview_btn_outer cmn_border cmn_outer'>
                                    <h2 className='creare_post_heading'>{jsondata.createpost}</h2>
                                    {
                                        (selectedAllDropdownData?.length > 0 && (files?.length > 0 || !isNullOrEmpty(caption) || !isNullOrEmpty(hashTag)) && showPreview) ?
                                            <button className='preview_btn' onClick={() => {
                                                setShowPreview(false)
                                            }}><RxCross2/></button> :

                                            (selectedAllDropdownData?.length > 0 && (files?.length > 0 || !isNullOrEmpty(caption) || !isNullOrEmpty(hashTag))) &&
                                            <button className='preview_btn' onClick={() => {
                                                setShowPreview(true)
                                            }}><AiOutlineEye/></button>
                                    }

                                </div>
                                <div className="row">
                                    <div className={showPreview ? "col-lg-6 col-md-12 col-sm-12" : "col-lg-12 col-md-12 col-sm-12"}>
                                        <div className={`create_post_content  ${showPreview ? "cmn_outer" : "animation"} `}>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                handlePostSubmit(e);
                                            }}>

                                                {/* select platform */}
                                                <div className="createPost_outer media_outer">
                                                    <label className='create_post_label'>{jsondata.mediaPlatform} *</label>

                                                    <Dropdown className='insta_dropdown_btn mt-2'>
                                                        <Dropdown.Toggle id="instagram"
                                                                         className="instagram_dropdown tabs_grid"
                                                                         disabled={allOptions.flatMap((group) => group.allOptions).length <= 0}>
                                                            {selectedAllDropdownData.length > 0 ?
                                                                (
                                                                    selectedAllDropdownData.map((data, index) => (
                                                                        <div key={index} className="selected-option">
                                                                            <img
                                                                                src={data?.selectOption?.imageUrl || default_user_icon}
                                                                                alt={data?.selectOption?.name}/>
                                                                            <span>{data?.selectOption?.name}</span>
                                                                            <RxCross2 onClick={(e) => {
                                                                                handleCheckboxChange(data);
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
                                                                        <h3 className="cmn_headings"
                                                                            onClick={function () {
                                                                                document.getElementById("choice1-2").click()
                                                                            }}>Select all Platform</h3>
                                                                    </div>

                                                                    {
                                                                        socialAccountData?.map((socialAccount, index) => {
                                                                            return (

                                                                                <>
                                                                                    {socialAccount && socialAccount?.pageAccessToken.length > 0 &&
                                                                                        <div
                                                                                            className={`instagram_outer ${socialAccount.provider=="FACEBOOK"?"facebook_outer":socialAccount.provider=="LINKEDIN"?"linkedin_outer":socialAccount.provider=="PINTEREST"?"pinterest_outer":""}`}
                                                                                            key={index}>
                                                                                            <div
                                                                                                className="checkbox-button_outer">
                                                                                                <input type="checkbox"
                                                                                                       className=""
                                                                                                       id={socialAccount.provider + "-checkbox"}
                                                                                                       name="choice1"
                                                                                                       checked={selectedGroups.includes(socialAccount?.provider)}
                                                                                                       onChange={() => handleGroupCheckboxChange(socialAccount?.provider)}
                                                                                                />
                                                                                                <SocialMediaProviderBadge
                                                                                                    provider={socialAccount.provider}/>

                                                                                            </div>

                                                                                            {
                                                                                                socialAccount?.pageAccessToken?.map((page, index) => (
                                                                                                    <div
                                                                                                        className="instagramPages unselectedpages"
                                                                                                        key={index}
                                                                                                        style={{background: selectedOptions.includes(page.pageId) === true ? "rgb(215 244 215)" : "",border:selectedOptions.includes(page.pageId) === true ? "1px solid #048709" : ""}}
                                                                                                        onClick={(e) =>
                                                                                                            handleCheckboxChange({
                                                                                                                group: socialAccount?.provider,
                                                                                                                selectOption: page
                                                                                                            })}
                                                                                                    >
                                                                                                        <div
                                                                                                            className="checkbox-button_outer">
                                                                                                            <img
                                                                                                                src={page?.imageUrl || default_user_icon}/>
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
                                                                                    }
                                                                                </>
                                                                            )
                                                                        })
                                                                    }


                                                                </div>

                                                            </div>


                                                        </Dropdown.Menu>
                                                    </Dropdown>

                                                </div>

                                                {/* add media */}
                                                <div className={`media_outer dashed_border ${showPreview ? "" : "row align-items-center mt-4 mx-0 "} `}>
                                                    <div
                                                        className={showPreview ? "" : 'media_inner_content col-lg-6 col-md-12 col-sm-12'}>
                                                        <div className="post_content_wrapper">

                                                            <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                                            <h6 className='create_post_text'>{jsondata.sharephoto}</h6>

                                                            <div className={`drag_scroll`}>

                                                                {files?.length > 0 && files?.map((file, index) => {

                                                                    return (
                                                                        <div
                                                                            className={`file_outer dragable_files`}
                                                                            key={index}
                                                                        >
                                                                            <div
                                                                                className="flex-grow-1 d-flex align-items-center">
                                                                                {/* <i className="fas fa-grip-vertical me-2"></i> */}
                                                                                {
                                                                                    file?.file?.type.startsWith('image/') &&
                                                                                    <img className={"upload_image me-3"}
                                                                                         src={file.url}
                                                                                         alt={`Image ${index}`}/>
                                                                                }
                                                                                {
                                                                                    file?.file?.type.startsWith('video/') &&
                                                                                    <video
                                                                                        className={"upload_image me-3"}
                                                                                        src={file.url}
                                                                                        alt={`Videos ${index}`}
                                                                                        autoPlay={false}
                                                                                    />
                                                                                }

                                                                            </div>
                                                                            {
                                                                                file?.mediaType === "IMAGE" &&
                                                                                <button
                                                                                    className="edit_upload delete_upload me-2"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        editHandler(index, file);
                                                                                    }}>
                                                                                    <BiSolidEditAlt
                                                                                        style={{fontSize: '24px'}}
                                                                                    />
                                                                                </button>
                                                                            }
                                                                            <button className="delete_upload"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleRemoveSelectFile(file);
                                                                                    }}>
                                                                                <RiDeleteBin5Fill
                                                                                    style={{fontSize: '24px'}}
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                })
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div
                                                        className={showPreview ? "" : "col-lg-6 col-sm-12 col-md-12 p-0"}>

                                                        <div className="darg_navs file_outer">
                                                            {
                                                                disableImage === false && <div
                                                                    className={" add_media_outer"}>
                                                                    <input type="file" id='image'
                                                                           className='file'
                                                                           multiple
                                                                           name={'file'}
                                                                           onClick={e => (e.target.value = null)}
                                                                           accept={"image/png, image/jpeg"}
                                                                           onChange={(e) => {
                                                                               setDisableVideo(true);
                                                                               setSelectedFileType("IMAGE")
                                                                               handleSelectedFile(e);
                                                                           }}
                                                                    />
                                                                    <label htmlFor='image'
                                                                           className='cmn_headings cmn_blue_border'>
                                                                        <i className="fa fa-image"
                                                                           style={{marginTop: "2px"}}/>{"Add Photo"}
                                                                    </label>
                                                                </div>
                                                            }

                                                            {
                                                                disableVideo === false &&
                                                                <div className=" add_media_outer">
                                                                    <input
                                                                        type="file"
                                                                        id='video'
                                                                        onClick={e => (e.target.value = null)}
                                                                        accept={"video/mp4,video/x-m4v,video/*"}
                                                                        onChange={(e) => {
                                                                            setDisableImage(true);
                                                                            setSelectedFileType("VIDEO");
                                                                            handleSelectedVideoFile(e);
                                                                        }}/>
                                                                    <label htmlFor='video'
                                                                           className='cmn_headings cmn_blue_border'>
                                                                        <i className="fa fa-video-camera"
                                                                           style={{marginTop: "2px"}}/>{files?.length > 0 ? "Change Video" : "Add Video"}
                                                                    </label>
                                                                </div>
                                                            }
                                                        </div>

                                                        {/*{*/}
                                                        {/*    disableImage === false && <>*/}
                                                        {/*        <h2 className='cmn_heading or_heading'>{jsondata.OR}</h2>*/}
                                                        {/*        <div className="ai_outer_btn">*/}
                                                        {/*            <button*/}
                                                        {/*                className={`ai_btn cmn_white_text mt-2`}*/}
                                                        {/*                onClick={(e) => {*/}
                                                        {/*                    e.preventDefault();*/}
                                                        {/*                    setAIGenerateImageModal(true);*/}
                                                        {/*                }}>*/}
                                                        {/*                <i className="fa-solid fa-robot ai_icon me-2"*/}
                                                        {/*                   style={{fontSize: "15px"}}/> {jsondata.generateAi}*/}
                                                        {/*            </button>*/}
                                                        {/*        </div>*/}
                                                        {/*    </>*/}
                                                        {/*}*/}
                                                    </div>

                                                </div>


                                                {/* Pinterest Options*/}

                                                {
                                                    selectedAllDropdownData?.some(selectedPage => selectedPage.group === SocialAccountProvider.PINTEREST.toUpperCase()) &&
                                                    <div className=' media_outer'>
                                                        <div className='caption_header mt-2'>
                                                            <h5 className='post_heading create_post_text mb-2'>Pinterest
                                                                Only
                                                                *</h5>


                                                        </div>
                                                        <div className={showPreview ? "" : 'post_caption_outer'}>
                                                            <div className='textarea_outer flex-grow-1'>
                                                                <h6 className='create_post_text'>Pin Title*</h6>
                                                                <input type={"text"} className='textarea mt-2'
                                                                       value={pinTitle}
                                                                       onChange={(e) => {
                                                                           e.preventDefault()
                                                                           setPinTitle(e.target.value);
                                                                       }}/>
                                                            </div>

                                                            <div
                                                                className={`textarea_outer  ${showPreview ? "mt-2" : "flex-grow-1"}`}>
                                                                <h6 className='create_post_text'>Destination Url*</h6>
                                                                <input type={"text"} className='textarea mt-2'
                                                                       value={pinDestinationUrl}
                                                                       onChange={(e) => {
                                                                           e.preventDefault();
                                                                           setPinDestinationUrl(e.target.value);
                                                                       }}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {/* post caption */}

                                                <div
                                                    className={`media_outer ${showPreview ? "" : "post_caption_outer"}`}>
                                                    <div className='flex-grow-1'>
                                                        <div className='caption_header'>
                                                            <h5 className='post_heading create_post_text'>Add Caption </h5>

                                                            {/*<button className="ai_btn cmn_white_text"*/}
                                                            {/*        onClick={(e) => {*/}
                                                            {/*            e.preventDefault();*/}
                                                            {/*            setAIGenerateCaptionModal(true);*/}
                                                            {/*        }}>*/}
                                                            {/*    <img src={ai_icon}*/}
                                                            {/*         className='ai_icon me-2'/>{jsondata.generateCaptionAi}*/}
                                                            {/*</button>*/}

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
                                                    </div>
                                                    <div className='flex-grow-1'>
                                                        <div
                                                            className={`caption_header ${showPreview ? "hashtag_outer" : ""} `}>
                                                            <h5 className='post_heading create_post_text'>Add Hashtag </h5>

                                                            {/*<button className="ai_btn cmn_white_text"*/}
                                                            {/*        onClick={(e) => {*/}
                                                            {/*            e.preventDefault();*/}
                                                            {/*            setAIGenerateHashTagModal(true);*/}
                                                            {/*        }}>*/}
                                                            {/*    <img src={ai_icon}*/}
                                                            {/*         className='ai_icon me-2'/>*/}
                                                            {/*    {jsondata.generateHashtagAi}*/}
                                                            {/*</button>*/}

                                                        </div>
                                                        <div className='textarea_outer'>
                                                            <h6 className='create_post_text'>{jsondata.addText}</h6>
                                                            <textarea className='textarea mt-2' rows={3}
                                                                      value={hashTag}
                                                                      onChange={(e) => {
                                                                          e.preventDefault();
                                                                          const inputValue = e.target.value;
                                                                          const hashtags = convertSentenceToHashtags(inputValue, e.key);
                                                                          setHashTag(hashtags);
                                                                      }}></textarea>
                                                        </div>
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
                                                                                     isDisabled={loadingCreateFacebookPost && reference !== "Scheduled"} // Disable if not null and not "Scheduled"
                                                                                     className={"cmn_bg_btn schedule_btn loading"}
                                                                                     isLoading={reference === "Scheduled" && loadingCreateFacebookPost}

                                                            />
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
                                                <div className='publish_post_outer media_outer '>
                                                    <div className="d-flex align-items-center gap-2 ps-0 form-switch">

                                                        <i
                                                            className={`fa ${boostPost ? "fa-toggle-on" : "fa-toggle-off"}`}
                                                            style={{fontSize: "24px", color: "#0d6efd"}}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setBoostPost(!boostPost);
                                                            }}
                                                            aria-hidden="true"
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

                                                        {/* <GenericButtonWithLoader label={jsondata.publishnow}
                                                                                 onClick={(e) => {
                                                                                     setReference("Published")
                                                                                     handlePostSubmit(e);
                                                                                 }}
                                                            //  isDisabled={false}
                                                                                 isDisabled={loadingCreateFacebookPost && reference !== "Published"}
                                                                                 className={"publish_btn cmn_bg_btn loading"}
                                                                                 isLoading={reference === "Published" && loadingCreateFacebookPost}/> */}
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                    {
                                        showPreview && files.length>0 &&
                                        <div className="col-lg-6 col-md-12 col-sm-12 post_preview_container">
                                            <div className='cmn_outer create_post_container'>
                                                <div className='post_preview_outer'>
                                                    <h3 className='Post_Preview_heading'>Post Preview</h3>
                                                    <div className='CommonFeedPreview_container'>
                                                    {
                                                        allOptions && Array.isArray(allOptions) && allOptions.length > 0 && allOptions.map((option, index) => {
                                                            let selectedPageData = option?.allOptions.find(c => selectedOptions.includes(c.pageId));

                                                            return (<span key={index}>
                                                    {selectedPageData &&
                                                        <CommonFeedPreview
                                                            socialMediaType={option.group}
                                                            previewTitle={`${getEnumValue(option.group)} feed Preview`}
                                                            pageName={selectedPageData?.name}
                                                            pageImageUrl={selectedPageData?.imageUrl}
                                                            userData={userData}
                                                            cropImage={cropImgUrl !== null ? cropImgUrl : ""}
                                                            files={files}
                                                            selectedFileType={selectedFileType}
                                                            caption={caption}
                                                            hashTag={hashTag}
                                                            destinationUrl={pinDestinationUrl}
                                                            pinTitle={pinTitle}
                                                        />
                                                    }

                                                </span>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    }
                                </div>

                                {/* draft and publish now section  */}
                                <div className='draft_publish_outer cmn_outer'>
                                    <GenericButtonWithLoader label={jsondata.saveasdraft}
                                                             onClick={(e) => {
                                                                 setReference("Draft")
                                                                 handleDraftPost(e);
                                                             }}
                                                             isDisabled={loadingCreateFacebookPost && reference !== "Draft"} // Disable if not null and not "Scheduled"
                                                             className={"save_btn cmn_bg_btn loading"}
                                                             isLoading={reference === "Draft" && loadingCreateFacebookPost}/>
                                    <GenericButtonWithLoader label={jsondata.publishnow}
                                                             onClick={(e) => {
                                                                 setReference("Published")
                                                                 handlePostSubmit(e);
                                                             }}
                                                             isDisabled={loadingCreateFacebookPost && reference !== "Published"}
                                                             className={"publish_btn cmn_bg_btn loading"}
                                                             isLoading={reference === "Published" && loadingCreateFacebookPost}/>

                                </div>
                            </div>
                        </div>
                }
            </div>


            {
                aiGenerateImageModal && <AI_ImageModal
                    aiGenerateImageModal={aiGenerateImageModal}
                    setAIGenerateImageModal={setAIGenerateImageModal} files={files} setFiles={setFiles}/>
            }

            {
                aiGenerateCaptionModal && <AiCaptionModal
                    aiGenerateCaptionModal={aiGenerateCaptionModal}
                    setAIGenerateCaptionModal={setAIGenerateCaptionModal} addCaption={setCaption}/>
            }

            {
                aiGenerateHashTagModal && <AI_Hashtag
                    aiGenerateHashTagModal={aiGenerateHashTagModal}
                    parentHashTag={hashTag}
                    setParentHashTag={setHashTag}
                    setAIGenerateHashTagModal={setAIGenerateHashTagModal}/>
            }
            {
                showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
                                                                      setShowModal={setShowConnectAccountModal}></ConnectSocialAccountModal>
            }

            {showEditImageModal &&
                <EditImageModal
                    showEditImageModal={showEditImageModal}
                    setShowEditImageModal={setShowEditImageModal}
                    file={imgFile}
                    setFileSize={setFileSize}
                    setCropImgUrl={setCropImgUrl}
                />}

            {showEditVideoModal &&
                <EditVideoModal
                    showEditVideoModal={showEditVideoModal}
                    setTrimmedVideoUrl={setTrimmedVideoUrl}
                    setShowEditVideoModal={setShowEditVideoModal}
                    videoInfo={videoFile}
                    setBlobVideo={setBlobVideo}
                />}
        </>)
}
export default CreatePost