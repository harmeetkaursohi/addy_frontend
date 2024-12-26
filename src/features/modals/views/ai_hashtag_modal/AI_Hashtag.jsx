import Modal from 'react-bootstrap/Modal';
import "./AI_Hashtag.css"
import cross_icon from '../../../../images/cross_icon.svg'
import {useEffect, useState} from "react";
import {showInfoToast} from "../../../common/components/Toast";
import {isNullOrEmpty} from "../../../../utils/commonUtils";
import Loader from "../../../loader/Loader";
import {RxCross2} from 'react-icons/rx';
import robot_img from "../../../../images/ai_robot.svg"
import {useGenerateHashtagMutation} from "../../../../app/apis/aiApi";

const AiHashTagModal = ({aiGenerateHashTagModal, setAIGenerateHashTagModal, parentHashTag, setParentHashTag}) => {

    const handleClose = () => setAIGenerateHashTagModal(false);
    const [aiGeneratedHashTag, setAiGeneratedHashTag] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchContent, setSearchContent] = useState("");

    const [generateHashtag, generateCaptionApi] = useGenerateHashtagMutation();

    console.log("selectedTags====>",selectedTags)

    useEffect(() => {
        if (generateCaptionApi?.data !== null && generateCaptionApi?.data !== undefined && !generateCaptionApi?.isLoading && !generateCaptionApi?.isLoading) {
            setAiGeneratedHashTag(generateCaptionApi?.data?.hashtags || [])
        }
    }, [generateCaptionApi]);

    const handleHashTagSubmit = (e) => {
        e.preventDefault();
        const requestBody = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": `You are a social media expert who generates popular, trending, and relevant hashtags for the given topic. Return the hashtags in the format: { "hashtags": ["hash1", "hash2", ...] }.`
                },
                {
                    "role": "user",
                    "content": "Generate 25 trending hashtags that are popular on social media platforms currently about " + searchContent
                }
            ]
        }
        !isNullOrEmpty(searchContent) && generateHashtag(requestBody)
    }

    const addOrRemoveHashTag = (e, type, currentValue) => {
        e.preventDefault();
        if (aiGeneratedHashTag !== null && Array.isArray(aiGeneratedHashTag) && aiGeneratedHashTag.length > 0) {
            switch (type.trim().toUpperCase()) {
                case "UPSERT_SINGLE": {
                    const valueToAdd = e.target.value || currentValue;
                    if (Array.isArray(selectedTags) && selectedTags.length > 25) {
                        showInfoToast("maximum limit reached!");
                        return ;
                    }
                    if (selectedTags.some(tag => tag.trim() === valueToAdd.trim())) {
                        setSelectedTags(selectedTags.filter(tag => tag.trim() !== valueToAdd.trim()));
                    } else {
                        setSelectedTags([...selectedTags, valueToAdd]);
                    }
                    break;
                }
                case "SELECT_ALL": {
                    if (Array.isArray(selectedTags) && selectedTags.length > 25) {
                        showInfoToast("Maximum limit reached!");
                    } else {
                        setSelectedTags(aiGeneratedHashTag.slice(0, 25));
                        setParentHashTag(aiGeneratedHashTag.slice(0, 25).join(" "));
                        handleClose()
                    }
                    break;
                }
                case "ADD_TO_PARENT" : {
                    setParentHashTag(selectedTags.slice(0, 25).join(" "));
                    handleClose()
                    break;
                }
                case "REMOVE_ALL": {
                    setParentHashTag("");
                    setSelectedTags([]);
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            showInfoToast("Please generate hashTags first!")
        }
    }


    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={aiGenerateHashTagModal} onHide={handleClose} className='generate_ai_container'>


                    <Modal.Body className='pt-0'>
                        <div className='pop_up_cross_icon_outer text-end cursor-pointer mt-2' onClick={() => {
                            handleClose()
                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                        <div className='robot_img_outer text-center'>
                            <img src={robot_img}/>
                            <h3 className='cmn_heading_class mt-4'>Generate Hashtag with AI </h3>

                        </div>
                        <div className='generate_image_wrapper_box'>
                            <form>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Enter topic to generate hashtags'
                                           value={searchContent}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setSearchContent(e.target.value);
                                           }}
                                    />


                                    <button disabled={isNullOrEmpty(searchContent) || generateCaptionApi?.isLoading}
                                            className={'generate_btn cmn_white_text ' + (isNullOrEmpty(searchContent) ? " opacity-50" : "")}
                                            onClick={(e) => {
                                                handleHashTagSubmit(e)
                                            }}>
                                        {
                                            generateCaptionApi?.isLoading ?
                                                <div className={"loading_txt"}><Loader
                                                    className={"me-2 ai_caption_loading_btn"}/> Loading
                                                </div> : aiGeneratedHashTag?.length === 0 ? "Generate" : "Regenerate"
                                        }
                                    </button>


                                </div>
                                <div className='hashtag_outer '>
                                    {
                                        Array.isArray(aiGeneratedHashTag) && aiGeneratedHashTag.length > 0 &&
                                        <h6 className='cmn_white_text caption_heading'>Of course! Here are some hashtags
                                            (#) for your post:</h6>
                                    }

                                    {Array.isArray(aiGeneratedHashTag) && aiGeneratedHashTag.length > 0 &&
                                        <div className='hashtag_btn_outer mt-3'>

                                            {aiGeneratedHashTag.map((cur, index) => {
                                                return (<button
                                                    className={selectedTags.includes(cur.trim()) ? "hashtag_btn selected_hashtag_btn" : "hashtag_btn unselected_hashtag_btn"}
                                                    value={cur.trim()}
                                                    onClick={(e) => addOrRemoveHashTag(e, "UPSERT_SINGLE")}>{cur}</button>)
                                            })
                                            }
                                        </div>
                                    }


                                    {Array.isArray(selectedTags) && selectedTags.length > 0 &&
                                        < div className='selected_hashtag_outer mt-2'>

                                            {selectedTags.map((c, index) => {
                                                return (
                                                    <button type={"button"}
                                                            className=' hashtag_btn selected_hashtag_btn'
                                                            id={"select_tag"} value={c}
                                                    >{c}
                                                        <img className={"ms-2"}
                                                             src={cross_icon}
                                                             onClick={(e) => addOrRemoveHashTag(e, "UPSERT_SINGLE", c)}/>
                                                    </button>)
                                            })}
                                        </div>
                                    }

                                    <div className='regenerate_btn_outer mt-4'>
                                        <button className={`regenerate_btn cmn_modal_cancelbtn ${isNullOrEmpty(selectedTags) ?" opacity-50":""}`}
                                                disabled={isNullOrEmpty(selectedTags)}
                                                onClick={(e) => addOrRemoveHashTag(e, "REMOVE_ALL")}>Remove All
                                        </button>
                                        <button className={`add_caption_btn cmn_bg_btn ${isNullOrEmpty(selectedTags) ?" opacity-50":""}`} id={"Add"}
                                                disabled={isNullOrEmpty(selectedTags)}
                                                onClick={(e) => addOrRemoveHashTag(e, "ADD_TO_PARENT")}
                                                value={"ADD_TO_PARENT"}>Add
                                        </button>
                                        <button className={`add_caption_btn cmn_bg_btn ${isNullOrEmpty(aiGeneratedHashTag) ?" opacity-50":""}`} id={"Add_All"}
                                                disabled={isNullOrEmpty(aiGeneratedHashTag)}
                                                onClick={(e) => addOrRemoveHashTag(e, "SELECT_ALL")}
                                                value={"Add_all"}>Select All
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}
export default AiHashTagModal