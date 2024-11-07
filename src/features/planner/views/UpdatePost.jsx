import './CreatePost.css'
import jsondata from '../../../locales/data/initialdata.json'
import React, {useEffect, useState} from "react";
import AI_ImageModal from "../../modals/views/ai_image_modal/AI_ImageModal.jsx";
import AiCaptionModal from "../../modals/views/ai_caption_modal/AI_Caption";
import AI_Hashtag from "../../modals/views/ai_hashtag_modal/AI_Hashtag";
import {useDispatch} from "react-redux";
import {Dropdown} from 'react-bootstrap'
import {BiSolidEditAlt, BiUser} from "react-icons/bi";
import {RxCross2} from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview.jsx";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {useNavigate, useParams} from "react-router-dom";
import SocialMediaProviderBadge from "../../common/components/SocialMediaProviderBadge";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import { LuPlusCircle } from "react-icons/lu";

import {
    checkDimensions,
    convertSentenceToHashtags,
    convertToUnixTimestamp,
    convertUnixTimestampToDateTime,
    getEnumValue,
    getFileFromAttachmentSource,
    getVideoDurationById,
    groupByKey,
    isNullOrEmpty,
    isUpdateDraftPostRequestValid,
    isUpdatePostRequestValid,
    urlToFile,
    validateScheduleDateAndTime
} from "../../../utils/commonUtils";
import {showErrorToast} from "../../common/components/Toast";
import default_user_icon from "../../../images/default_user_icon.svg";
import {SocialAccountProvider, enabledSocialMedia} from "../../../utils/contantData";
import Loader from '../../loader/Loader.jsx';
import EditImageModal from '../../common/components/EditImageModal.jsx';
import {useAppContext} from '../../common/components/AppProvider.jsx';
import EditVideoModal from '../../common/components/EditVideoModal.jsx';
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetPostsByIdQuery, useUpdatePostByIdMutation} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import {GoChevronDown} from "react-icons/go";
import PostNowModal from "../../common/components/PostNowModal";
import DefaultFeedPreview from "../../common/components/DefaultFeedPreview";

const UpdatePost = () => {

        const dispatch = useDispatch();
        const navigate = useNavigate();
        const {id} = useParams();

        const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
        const postsByIdApi = useGetPostsByIdQuery(id, {skip: isNullOrEmpty(id)})
        const [updatePostById, updatePostByIdApi] = useUpdatePostByIdMutation()

        const [aiGenerateImageModal, setAIGenerateImageModal] = useState(false);
        const [aiGenerateCaptionModal, setAIGenerateCaptionModal] = useState(false);
        const [aiGenerateHashTagModal, setAIGenerateHashTagModal] = useState(false);


        const [oldAttachmentsFileObject, setOldAttachmentsFileObject] = useState([]);
        const [hashTag, setHashTag] = useState("");
        const [caption, setCaption] = useState("");
        const [pinTitle, setPinTitle] = useState("");
        const [pinDestinationUrl, setPinDestinationUrl] = useState("");
        const [scheduleDate, setScheduleDate] = useState("");
        const [scheduleTime, setScheduleTime] = useState("");

        const [showScheduleDateAndTimeBox, setShowScheduleDateAndTimeBox] = useState(false);
        const [boostPost, setBoostPost] = useState(false);
        const [socialAccountData, setSocialAccountData] = useState([]);
        const [files, setFiles] = useState([]);
        const [selectedFileType, setSelectedFileType] = useState("");
        const [reference, setReference] = useState("");
        const [disableImage, setDisableImage] = useState(false);
        const [disableVideo, setDisableVideo] = useState(false);
        const [postStatus, setPostStatus] = useState("DRAFT");
        const [showPublishPostConfirmationBox, setShowPublishPostConfirmationBox] = useState(false)


        const [allOptions, setAllOptions] = useState([]);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [selectedGroups, setSelectedGroups] = useState([]);
        const [selectedAllDropdownData, setSelectedAllDropdownData] = useState([]);

        const [videoFile, setVideoFile] = useState(null)
        const [videoBlob, setVideoBlob] = useState(null)
        const [trimmedVideoUrl, setTrimmedVideoUrl] = useState()

        const {sidebar} = useAppContext()

        useEffect(() => {
            if (files && files.length <= 0) {
                setDisableVideo(false);
                setDisableImage(false);
            }

            if (files && files.length > 0) {
                if (files.every(file => file.mediaType === "VIDEO")) {
                    setDisableImage(true);
                } else {
                    setDisableVideo(true);
                }
            }
        }, []);


        useEffect(() => {
            if (getConnectedSocialAccountApi?.data) {
                const filteredSocialMediaData = getConnectedSocialAccountApi?.data.filter((account) => {
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
        }, [getConnectedSocialAccountApi?.data]);

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
            if (socialAccountData) {
                const selectedGroup = [];
                socialAccountData?.forEach((socialAccount) => {
                    const socialMediaAccountPageIds = socialAccount?.pageAccessToken.map((page) => {
                        return page?.pageId
                    })
                    const isEveryPageSelected = socialMediaAccountPageIds.every((id) => selectedOptions.includes(id));
                    if (isEveryPageSelected) {
                        selectedGroup.push(socialAccount.provider);
                    }
                });
                setSelectedGroups(selectedGroup)
            }
        }, [socialAccountData, selectedOptions])


        useEffect(() => {
            if (postsByIdApi?.data && Object.keys(postsByIdApi?.data).length > 0) {
                const postData = postsByIdApi?.data
                if (postData.scheduledPostDate) {
                    setScheduleDate(convertUnixTimestampToDateTime(postData.scheduledPostDate)?.date)
                    setScheduleTime(convertUnixTimestampToDateTime(postData.scheduledPostDate)?.time)
                }
                setSelectedOptions(postData?.postPageInfos?.map(c => c.pageId) || []);

                setCaption(postData?.caption || "");
                setPinTitle(postData?.pinTitle || "");
                setPinDestinationUrl(postData?.pinDestinationUrl || "");
                setHashTag(postData?.hashTag || "");
                setPostStatus(postData?.postStatus)
                setFiles(postData?.attachments || []);
                setShowScheduleDateAndTimeBox(postData?.postStatus === "SCHEDULED")
            }
        }, [allOptions, postsByIdApi?.data]);

        useEffect(() => {
            if (postsByIdApi?.data && Object.keys(postsByIdApi?.data).length > 0 && postsByIdApi?.data?.attachments?.length > 0) {
                if (postsByIdApi?.data?.attachments[0]?.mediaType === "IMAGE") {
                    Promise.all(postsByIdApi?.data?.attachments?.map(attachment => getFileFromAttachmentSource(attachment)))
                        .then((results) => {
                            setOldAttachmentsFileObject(results);
                        })

                }
                if (postsByIdApi?.data?.attachments[0]?.mediaType === "VIDEO") {
                    getVideoDurationById(postsByIdApi?.data?.attachments[0]?.id).then(res => {
                        setOldAttachmentsFileObject([{
                            id: postsByIdApi?.data?.attachments[0]?.id,
                            mediaType: "VIDEO",
                            fileName: postsByIdApi?.data?.attachments[0]?.fileName,
                            duration: res.duration,
                            fileSize: postsByIdApi?.data?.attachments[0]?.fileSize
                        }]);
                    });
                }

            }

        }, [postsByIdApi?.data])


        useEffect(() => {
            if (files && files.length <= 0) {
                setDisableVideo(false);
                setDisableImage(false);
            }
            if (files.length > 0) {
                files.filter((c) => c.mediaType === "IMAGE").length > 0 && setDisableVideo(true);
                files.filter((c) => c.mediaType === "VIDEO").length > 0 && setDisableImage(true);
            }
        }, [files])


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
            // updatedSelectedOptions.push(group);
            // updatedSelectedGroups.push(selectOption);
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
                const index = updatedSelectedGroups.indexOf(group)
                if (index !== -1) {
                    updatedSelectedGroups.splice(index, 1);
                }
            }
            setSelectedOptions(Array.from(new Set(updatedSelectedOptions)));
            setSelectedGroups(Array.from(new Set(updatedSelectedGroups)));
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
            const dimensionPromises = uploadedFiles.map((file) => checkDimensions(file));
            Promise.all(dimensionPromises)
                .then((results) => {
                    setFiles(groupByKey([...files, ...results]))
                })
                .catch((error) => {
                    console.error("Error checking dimensions:", error);
                });
        }

        const handleSelectedVideoFile = (e) => {
            e.preventDefault();
            setOldAttachmentsFileObject([]);
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

        const getRequestBodyToUpdatePost = (postStatus, isScheduledTimeProvided) => {
            return {
                id: id,
                updatePostRequestDTO: {
                    postPageInfos: selectedOptions?.map((obj) => ({
                        pageId: obj,
                        id: postsByIdApi?.data.postPageInfos && postsByIdApi?.data.postPageInfos?.find(c => c.pageId === obj)?.id || null,
                        provider: selectedAllDropdownData?.find(c => c?.selectOption?.pageId === obj)?.group || null
                    })),
                    caption: isNullOrEmpty(caption) ? "" : caption.toString().trim(),
                    hashTag: isNullOrEmpty(hashTag) ? "" : hashTag.toString().trim(),
                    pinTitle: isNullOrEmpty(pinTitle) ? "" : pinTitle.toString().trim(),
                    destinationUrl: isNullOrEmpty(pinDestinationUrl) ? "" : pinDestinationUrl.toString().trim(),
                    attachments: files?.map((file) => ({
                        mediaType: file?.mediaType,
                        file: file?.file || null,
                        fileName: file.fileName,
                        id: file?.id || null,
                        gridFsId: file?.gridFsId || null
                    })),
                    postStatus: postStatus,
                    boostPost: boostPost,
                    scheduledPostDate: (postStatus === 'SCHEDULED' || isScheduledTimeProvided) ? convertToUnixTimestamp(scheduleDate, scheduleTime) : null,
                },
            };
        }

        const updatePost = async (requestBody) => {
            await handleRTKQuery(
                async () => {
                    return await updatePostById(requestBody).unwrap();
                },
                () => {
                    navigate("/planner");
                    setShowPublishPostConfirmationBox(false)
                    dispatch(addyApi.util.invalidateTags("getPostsByIdApi"));
                }
            );
        };

        const handlePostSubmit = () => {
            const requestBody = getRequestBodyToUpdatePost("PUBLISHED", false)
            updatePost(requestBody);
        };

        const handleDraftPost = () => {
            const isScheduledTimeProvided = !isNullOrEmpty(scheduleDate) || !isNullOrEmpty(scheduleTime);
            if (isScheduledTimeProvided) {
                if (!scheduleDate && !scheduleTime) {
                    showErrorToast("Please enter scheduleDate or scheduleTime!!");
                    return;
                }
                if (!validateScheduleDateAndTime(scheduleDate, scheduleTime)) {
                    showErrorToast("Schedule date and time must be at least 10 minutes in the future.");
                    return;
                }
            }
            const requestBody = getRequestBodyToUpdatePost("DRAFT", isScheduledTimeProvided)
            isUpdateDraftPostRequestValid(requestBody) && updatePost(requestBody);
        };

        const handleSchedulePost = () => {
            const isScheduledTimeProvided = !isNullOrEmpty(scheduleDate) || !isNullOrEmpty(scheduleTime);
            if (!scheduleDate && !scheduleTime) {
                showErrorToast("Please enter scheduleDate or scheduleTime!!");
                return;
            }
            if (!validateScheduleDateAndTime(scheduleDate, scheduleTime)) {
                showErrorToast("Schedule date and time must be at least 10 minutes in the future.");
                return;
            }
            const requestBody = getRequestBodyToUpdatePost("SCHEDULED", isScheduledTimeProvided)
            isUpdatePostRequestValid(requestBody?.updatePostRequestDTO, files, oldAttachmentsFileObject) && updatePost(requestBody);

        };

        const handleRemoveSelectFile = (attachmentReferenceNameToRemove, id) => {
            const updatedFiles = files.filter((file) => file.fileName !== attachmentReferenceNameToRemove);
            setFiles(updatedFiles);
            if (id !== undefined && id !== null) {
                const updatedOldAttachments = oldAttachmentsFileObject?.filter(attachment => attachment?.id !== id);
                setOldAttachmentsFileObject(updatedOldAttachments);
            }
        };

        const resetForm = (e) => {
            e.preventDefault();
            setFiles([]);
            setPostStatus(null)
            setSelectedOptions([]);
            setHashTag("");
            setCaption("");
            setScheduleTime("");
            setScheduleDate("");
            setBoostPost(false);
        }

        // edit handler
        const [showEditImageModal, setShowEditImageModal] = useState(false)
        const [cropImgUrl, setCropImgUrl] = useState(null)
        const [editIndex, setEditIndex] = useState(null)
        const [imgFile, setImgFile] = useState(null)
        const [fileSize, setFileSize] = useState(null)

        const [showEditVideoModal, setShowEditVideoModal] = useState(false)
        const editHandler = (index, file) => {

            setImgFile(file)
            setEditIndex(index)

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
                urlToFile(cropImgUrl, imgFile?.fileName, imgFile?.mediaType).then(result => {
                    updatedFiles[editIndex] = {
                        file: result,
                        fileName: imgFile?.fileName,
                        mediaType: imgFile?.mediaType,
                        url: cropImgUrl,
                    };
                    setFiles(updatedFiles);
                })
            }
        }, [cropImgUrl])
        // trimmed video url

        useEffect(() => {
            if (trimmedVideoUrl) {
                const updatedFiles = [...files];
                urlToFile(trimmedVideoUrl, videoFile?.fileName, videoFile?.mediaType).then(result => {
                    updatedFiles[editIndex] = {
                        file: result,
                        fileName: videoFile?.fileName,
                        mediaType: videoFile?.mediaType,
                        url: trimmedVideoUrl,
                    };
                    setFiles(updatedFiles);
                })
                setFiles(updatedFiles);
            }
        }, [trimmedVideoUrl])

        return (
            <>
                {/*<SideBar/>*/}
                <div className={`cmn_container ${sidebar ? "" : "cmn_Padding"}`}>
                    <div className="Container">
                        <div className={`create_post_wrapper `}>

                            <div className="row m-0">
                                <div
                                    className={"col-lg-6 col-md-12 col-sm-12 p-0"}>
                                    <div className=' cmn_outer'>
                                        <h2 className='creare_post_heading'>{jsondata.updatepost}</h2>


                                    </div>

                                    <div
                                        className={`create_post_content  cmn_outer `}>


                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                        }}>
                                            {/* select media pages */}
                                            <div className="createPost_outer">
                                                <div className='d-flex align-items-center '>
                                                    <label
                                                        className='create_post_label flex-grow-1'>{jsondata.mediaPlatform} *</label>

                                                </div>
                                                {/*    dropdown select platform=====*/}
                                                <Dropdown className='insta_dropdown_btn mt-2'>
                                                    <Dropdown.Toggle id="instagram"
                                                                     className="instagram_dropdown tabs_grid">
                                                        <GoChevronDown className='dropdown_chevron'/>
                                                        {selectedAllDropdownData.length > 0 ?
                                                            (
                                                                selectedAllDropdownData.map((data, index) => (
                                                                    <div key={index} className="selected-option">
                                                                        <img
                                                                            src={data?.selectOption?.imageUrl || default_user_icon}
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
                                                                    <h3 className="cmn_headings" onClick={function () {
                                                                        document.getElementById("choice1-2").click()
                                                                    }}>Select all Platform</h3>
                                                                </div>

                                                                {
                                                                    socialAccountData?.map((socialAccount, index) => {
                                                                        return (

                                                                            <>
                                                                                {
                                                                                    socialAccount && socialAccount?.pageAccessToken.length > 0 &&
                                                                                    <div
                                                                                        className={`instagram_outer ${socialAccount.provider == "FACEBOOK" ? "facebook_outer" : socialAccount.provider == "LINKEDIN" ? "linkedin_outer" : socialAccount.provider == "PINTEREST" ? "pinterest_outer" : ""}`}
                                                                                        key={index}>
                                                                                        <div
                                                                                            className="checkbox-button_outer">

                                                                                            {
                                                                                                socialAccount && socialAccount?.pageAccessToken &&
                                                                                                <>
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        className=""
                                                                                                        id={socialAccount.provider + "-checkbox"}
                                                                                                        name="choice1"
                                                                                                        checked={selectedGroups.includes(socialAccount?.provider)}
                                                                                                        onChange={() => handleGroupCheckboxChange(socialAccount?.provider)}
                                                                                                    />

                                                                                                    <SocialMediaProviderBadge
                                                                                                        provider={socialAccount.provider}/>

                                                                                                </>
                                                                                            }

                                                                                        </div>

                                                                                        {
                                                                                            socialAccount?.pageAccessToken?.map((page, index) => (
                                                                                                <div
                                                                                                    className="instagramPages unselectedpages"
                                                                                                    key={index}
                                                                                                    style={{
                                                                                                        background: selectedOptions.includes(page.pageId) === true ? "rgb(215 244 215)" : "",
                                                                                                        border: selectedOptions.includes(page.pageId) === true ? "1px solid #048709" : ""
                                                                                                    }}
                                                                                                    onClick={(e) =>
                                                                                                        handleCheckboxChange({
                                                                                                            group: socialAccount?.provider,
                                                                                                            selectOption: {
                                                                                                                ...page,
                                                                                                                socialMediaType: socialAccount?.provider
                                                                                                            }
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
                                            <div
                                                className={`media_outer `}>
                                                <div className="col-12">
                                                    <h5 className='post_heading create_post_text'>{jsondata.media}</h5>
                                                    <h6 className='create_post_text'>{jsondata.sharephoto}</h6>
                                                </div>
                                                <div
                                                    className={""}>

                                                    <div className="post_content_wrapper">


                                                        {
                                                            (postsByIdApi?.isLoading || postsByIdApi?.isFetching) &&
                                                            <div className='text-center mt-4'><Loader/></div>
                                                        }

                                                        <div className="drag_scroll ">
                                                            {files?.map((file, index) => {

                                                                return (
                                                                    <div
                                                                        className="file_outer dragable_files"
                                                                        key={index}
                                                                    >
                                                                        <div
                                                                            className="flex-grow-1 d-flex align-items-center">
                                                                            {/* <i className="fas fa-grip-vertical me-2"></i> */}
                                                                            {
                                                                                file.mediaType === "IMAGE" &&
                                                                                <img  onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    editHandler(index, file);
                                                                                }} className={"upload_image"}
                                                                                     src={file?.url || "data:image/jpeg; base64," + file?.attachmentSource}
                                                                                     alt={`Image ${index}`}/>
                                                                            }
                                                                            {
                                                                                file.mediaType === "VIDEO" &&
                                                                                <video className={"upload_image"}
                                                                                       src={file?.url || `${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + file?.id}
                                                                                       alt={`Videos ${index}`}
                                                                                       autoPlay={true}
                                                                                       muted={true}
                                                                                />
                                                                            }
                                                                        </div>

                                                                        {/* {
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
                                                                        } */}
                                                                        <button className="delete_upload"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleRemoveSelectFile(file?.fileName, file?.id);
                                                                                }}>
                                                                            <RxCross2
                                                                                style={{fontSize: '24px'}}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            })}
                                                             <div className="darg_navs file_outer d-flex gap-2">

                                                                {disableImage === false &&
                                                                    <div
                                                                        className={""}>
                                                                        <input type="file" id='image'
                                                                            className='file'
                                                                            multiple
                                                                            name={'file'}
                                                                            onClick={e => (e.target.value = null)}
                                                                            accept={"image/png, image/jpeg"}
                                                                            onChange={(e) => {
                                                                                setSelectedFileType("IMAGE");
                                                                                setDisableVideo(true);
                                                                                handleSelectedImageFile(e);
                                                                            }}
                                                                        />
                                                                        <label htmlFor='image'
                                                                            className='cmn_headings d-flex align-items-center justify-content-center'>
                                                                            <i className="fa fa-image"/>
                                                                            <LuPlusCircle size={24} className='add_media'/>


                                                                        </label>
                                                                    </div>
                                                                }

                                                                {disableVideo === false &&
                                                                    <div className=" ">
                                                                        <input
                                                                            type="file"
                                                                            id='video'
                                                                            onClick={e => (e.target.value = null)}
                                                                            accept={"video/mp4,video/x-m4v,video/*"}
                                                                            onChange={(e) => {
                                                                                setSelectedFileType("VIDEO");
                                                                                setDisableImage(true);
                                                                                handleSelectedVideoFile(e);
                                                                            }}/>
                                                                        <label htmlFor='video'
                                                                            className='cmn_headings d-flex align-items-center justify-content-center'>
                                                                            <i className="fa fa-video-camera"/>
                                                                            <LuPlusCircle size={24} className='add_media'/>


                                                                            {/* {files?.length > 0 ? "Change Video" : "Add Video"} */}
                                                                        </label>
                                                                    </div>
                                                                }

                                                                </div>
                                                        </div>
                                                    </div>

                                                </div>





                                            </div>


                                            {/* Pinterest Options*/}

                                            {
                                                selectedAllDropdownData?.some(selectedPage => selectedPage.group === SocialAccountProvider.PINTEREST.toUpperCase()) &&
                                                <div className=' media_outer'>
                                                    <div className='caption_header mt-2'>
                                                        <h5 className='post_heading create_post_text mb-2'>Pinterest
                                                            Only *</h5>
                                                    </div>
                                                    <div className={""}>
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
                                                            className={`textarea_outer  mt-2`}>
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

                                            <div className={`media_outer `}>
                                                <div className='flex-grow-1'>
                                                    <div className='caption_header'>
                                                        <h5 className='post_heading create_post_text'>Add
                                                            Post Caption </h5>

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
                                                        className={`caption_header hashtag_outer `}>
                                                        <h5 className='post_heading create_post_text'>Add
                                                            Hashtag * </h5>

                                                        {/*<button className="ai_btn cmn_white_text"*/}
                                                        {/*        onClick={(e) => {*/}
                                                        {/*            e.preventDefault();*/}
                                                        {/*            setAIGenerateHashTagModal(true);*/}
                                                        {/*        }}>*/}
                                                        {/*    <img src={ai_icon}*/}
                                                        {/*         className='ai_icon me-2'/>*/}
                                                        {/*    {jsondata.generateHashtagAi} */}
                                                        {/*</button>*/}

                                                    </div>
                                                    <div className='textarea_outer'>
                                                        <h6 className='create_post_text'>{jsondata.addText}</h6>
                                                        <textarea className='textarea mt-2' rows={3}
                                                                  value={hashTag}
                                                                  onChange={(e) => {
                                                                      e.preventDefault();
                                                                      const inputValue = e.target.value;
                                                                      const hashtags = convertSentenceToHashtags(inputValue);
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
                                                        {/* <div className="form-check form-switch"> */}
                                                            {/* <input className="form-check-input"
                                                                   type="checkbox"
                                                                   id="flexSwitchCheckChecked"
                                                                   checked={showScheduleDateAndTimeBox}
                                                                   onChange={() => {
                                                                       setShowScheduleDateAndTimeBox(!showScheduleDateAndTimeBox);
                                                                   }}
                                                            /> */}
                                                             <i
                                                                className={`fa ${showScheduleDateAndTimeBox ? "fa-toggle-on" : "fa-toggle-off"}`}
                                                                // style={{fontSize: "24px", color: "#0d6efd"}}
                                                                onClick={() => {
                                                                    setShowScheduleDateAndTimeBox(!showScheduleDateAndTimeBox);
                                                                }}
                                                                aria-hidden="true"
                                                            />
                                                        {/* </div> */}
                                                        {/* <GenericButtonWithLoader label={jsondata.saveasdraft}
                                                                                 onClick={(e) => {
                                                                                     setReference("Draft")
                                                                                     handleDraftPost(e);
                                                                                 }}

                                                                                 className={"save_btn cmn_bg_btn loading"}
                                                                                 isLoading={reference === "Draft" && updatePostByIdApi?.isLoading}/> */}
                                                    </div>
                                                </div>


                                                {
                                                    showScheduleDateAndTimeBox &&
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
                                                }
                                            </div>

                                            {/* boost post */}
                                            {/* <div className='publish_post_outer media_outer'>

                                            <div className="d-flex align-items-center gap-2 ps-0 form-switch">

                                                <i
                                                    className={`fa ${boostPost ? "fa-toggle-on" : "fa-toggle-off"}`}
                                                    // style={{fontSize: "24px", color: "#0d6efd"}}
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
                                                    }}>{jsondata.reset}</button>
                                                </div>
                                            </div> */}

                                        </form>
                                        <div className='draft_publish_outer mt-3'>

                                            <div className={"flex-grow-1"}>
                                                <GenericButtonWithLoader label={jsondata.saveasdraft}
                                                                         onClick={(e) => {
                                                                             setReference("Draft")
                                                                             handleDraftPost(e);
                                                                         }}

                                                                         className={"save_btn cmn_bg_btn loading"}
                                                                         isLoading={reference === "Draft" && updatePostByIdApi?.isLoading}/>
                                            </div>


                                            <GenericButtonWithLoader label={jsondata.publishnow}
                                                                     onClick={(e) => {
                                                                         const requestBody = getRequestBodyToUpdatePost("PUBLISHED", false)
                                                                         if (!isUpdatePostRequestValid(requestBody?.updatePostRequestDTO, files, oldAttachmentsFileObject)) return
                                                                         setShowPublishPostConfirmationBox(true)
                                                                     }}
                                                                     isDisabled={false}
                                                                     className={"publish_btn cmn_bg_btn loading"}/>
                                            <GenericButtonWithLoader
                                                label={jsondata.schedule}
                                                onClick={(e) => {
                                                    setReference("Scheduled")
                                                    handleSchedulePost(e);
                                                }}
                                                isDisabled={!showScheduleDateAndTimeBox}
                                                className={"cmn_bg_btn schedule_btn loading"}
                                                isLoading={reference === "Scheduled" && updatePostByIdApi?.isLoading}/>
                                        </div>
                                    </div>
                                </div>
                                {

                                    <div className="col-lg-6 col-md-12 col-sm-12 post_preview_container p-0">
                                        <div className='cmn_outer create_post_container post_preview_outer'>
                                            {
                                                isNullOrEmpty(selectedOptions) &&
                                                <DefaultFeedPreview
                                                    caption={caption}
                                                    hashTag={hashTag}
                                                    files={files}
                                                    selectedFileType={selectedFileType}
                                                />
                                            }
                                            {/* <h3 className='Post_Preview_heading'>Post Preview</h3> */}
                                            <div className='CommonFeedPreview_container'>
                                                {
                                                    allOptions && Array.isArray(allOptions) && allOptions?.length > 0 && allOptions?.map((option, index) => {

                                                        let selectedPageData = option?.allOptions.find(c => selectedOptions.includes(c.pageId));

                                                        return (<div key={index} className='perview_outer'>
                                                        {
                                                            selectedPageData &&
                                                            <CommonFeedPreview
                                                                reference={"UPDATE_POST"}
                                                                socialMediaType={option.group}
                                                                previewTitle={`${getEnumValue(option.group)} feed Preview`}
                                                                pageName={selectedPageData?.name}
                                                                pageImageUrl={selectedPageData?.imageUrl}
                                                                files={files || []}
                                                                selectedFileType={selectedFileType}
                                                                caption={caption}
                                                                hashTag={hashTag}
                                                                destinationUrl={pinDestinationUrl}
                                                                pinTitle={pinTitle}
                                                            />
                                                        }
                                                    </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                    </div>
                                }
                            </div>


                        </div>
                    </div>

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
                        setAIGenerateHashTagModal={setAIGenerateHashTagModal}
                        parentHashTag={hashTag}
                        setParentHashTag={setHashTag}
                    />
                }

                {

                    showEditImageModal && <EditImageModal
                        showEditImageModal={showEditImageModal}
                        setShowEditImageModal={setShowEditImageModal}
                        file={imgFile}
                        setFileSize={setFileSize}
                        setCropImgUrl={setCropImgUrl}
                    />

                }

                {
                    showEditVideoModal &&
                    <EditVideoModal
                        isReuired={true}
                        showEditVideoModal={showEditVideoModal}
                        setTrimmedVideoUrl={setTrimmedVideoUrl}
                        setShowEditVideoModal={setShowEditVideoModal}
                        videoInfo={videoFile}
                        setVideoBlob={setVideoBlob}
                    />
                }
                {
                    showPublishPostConfirmationBox &&
                    <PostNowModal
                        show={showPublishPostConfirmationBox}
                        setShow={setShowPublishPostConfirmationBox}
                        onSubmit={(e) => {
                            setReference("Published")
                            handlePostSubmit(e);
                        }}
                        isOnSubmitRunning={reference === "Published" && updatePostByIdApi?.isLoading}
                    />
                }
            </>)
    }
;
export default UpdatePost

