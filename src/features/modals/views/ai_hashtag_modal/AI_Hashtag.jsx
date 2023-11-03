import Modal from 'react-bootstrap/Modal';
import "./AI_Hashtag.css"
import cross_icon from '../../../../images/cross_icon.svg'
import {useDispatch, useSelector} from "react-redux";
import {generateAIHashTagAction} from "../../../../app/actions/postActions/postActions.js";
import {useEffect, useState} from "react";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";
import {showInfoToast} from "../../../common/components/Toast";
import {isNullOrEmpty} from "../../../../utils/commonUtils";
import Loader from "../../../loader/Loader";


const AiHashTagModal = ({aiGenerateHashTagModal, setAIGenerateHashTagModal, parentHashTag, setParentHashTag}) => {

    const handleClose = () => setAIGenerateHashTagModal(false);
    const dispatch = useDispatch();
    const [aiGeneratedHashTag, setAiGeneratedHashTag] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchContent, setSearchContent] = useState(null);
    const generateAIHashTagData = useSelector((state) => state.post.generateAIHashTagReducer)


    useEffect(() => {
        return () => {
            dispatch(resetReducers({sliceNames: ["generateAIHashTagReducer"]}));
            setAiGeneratedHashTag([]);
        }
    }, []);

    useEffect(() => {
        if (generateAIHashTagData?.data) {
            const choices = generateAIHashTagData?.data.choices;

            // Initialize a Set to accumulate the tags and ensure uniqueness
            let accumulatedTagsSet = new Set();

            choices.forEach(choice => {
                const hashTagContent = choice.message.content;
                const tagsArray = hashTagContent.split(/\s+|\n+/);
                const updatedTags = tagsArray.map(tag => {
                    if (tag.startsWith("#")) {
                        return tag;
                    } else {
                        return `#${tag}`;
                    }
                });

                // Add the updated tags to the Set
                updatedTags.forEach(tag => accumulatedTagsSet.add(tag));

            });

            // Convert the Set back to an array to maintain the array structure
            const accumulatedTagsArray = Array.from(accumulatedTagsSet);

            // Set aiGeneratedHashTag with the accumulated unique tags, limited to 25
            setAiGeneratedHashTag(accumulatedTagsArray.slice(0, 25));
        }
    }, [generateAIHashTagData]);


    const handleHashTagSubmit = (e) => {
        e.preventDefault();
        if (searchContent !== null && searchContent !== "") {
            const requestBody = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "user", "content": "provide hashtags about " + searchContent}
                ]
            }
            dispatch(generateAIHashTagAction(requestBody))
        } else {
            showInfoToast("Describe the hashtag you want to generate!")
        }

    }


    console.log("selectedTags--->", selectedTags);
    const addOrRemoveHashTag = (e, type, currentValue) => {
        e.preventDefault();
        if (aiGeneratedHashTag !== null && Array.isArray(aiGeneratedHashTag) && aiGeneratedHashTag.length > 0) {
            switch (type.trim().toUpperCase()) {
                case "UPSERT_SINGLE": {
                    const valueToAdd = e.target.value || currentValue;
                    if(Array.isArray(selectedTags) && selectedTags.length>25){
                        return showInfoToast("maximum limit reached!");
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
                    }
                    break;
                }
                case "ADD_TO_PARENT" : {
                    setParentHashTag(selectedTags.slice(0, 25).join(" "));
                    break;
                }
                case "REMOVE_ALL": {
                    setParentHashTag("");
                    setAiGeneratedHashTag([]);
                    setSelectedTags([]);
                    dispatch(resetReducers({sliceNames: ["generateAIHashTagReducer"]}));
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
                <Modal show={aiGenerateHashTagModal} onHide={handleClose}>

                    <Modal.Header closeButton>
                        <Modal.Title>Generate Hashtag with AI </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='generate_image_wrapper_box'>
                            <form>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the hashtag you want to generate'
                                           value={searchContent}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setSearchContent(e.target.value);
                                           }}
                                    />


                                    <button disabled={isNullOrEmpty(searchContent) || generateAIHashTagData?.loading}
                                            className={'generate_btn cmn_white_text ' + (isNullOrEmpty(searchContent) ? " opacity-50" : "")}
                                            onClick={(e) => {
                                                handleHashTagSubmit(e)
                                            }}>
                                        {generateAIHashTagData?.loading ?
                                            <div className={"loading_txt"}><Loader className={"me-2"}/> Loading
                                            </div> : aiGeneratedHashTag?.length === 0 ? "Generate" : "Regenerate"
                                        }
                                    </button>


                                </div>
                                <div className='hashtag_outer '>
                                    {Array.isArray(aiGeneratedHashTag) && aiGeneratedHashTag.length > 0 &&
                                        <h6 className='cmn_white_text caption_heading'>Of course! Here are some hashtags
                                            (#) for your post:</h6>}

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
                                        <button className='add_caption_btn cmn_bg_btn' id={"Add"}
                                                onClick={(e) => addOrRemoveHashTag(e, "ADD_TO_PARENT")}
                                                value={"ADD_TO_PARENT"}>Add
                                        </button>
                                        <button className='add_caption_btn cmn_bg_btn' id={"Add_All"}
                                                onClick={(e) => addOrRemoveHashTag(e, "SELECT_ALL")}
                                                value={"Add_all"}>Select All
                                        </button>
                                        <button className='regenerate_btn cmn_bg_btn'
                                                onClick={(e) => addOrRemoveHashTag(e, "REMOVE_ALL")}>Remove All
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