import React, {useEffect, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import logo from '/Addy_icon.svg';
import {IoSendSharp} from 'react-icons/io5';
import {MdOutlineMail} from 'react-icons/md';
import {IoLocationOutline} from 'react-icons/io5';
import './NeedHelp.css';
import {getToken} from "../../app/auth/auth";
import {useDispatch} from 'react-redux';
import {useAppContext} from "../common/components/AppProvider";
import {decodeJwtToken} from "../../app/auth/auth";
import Loader from "../loader/Loader";
import default_user_icon from "../../images/default_user_icon.svg";
import {
    isNullOrEmpty,
    isValidCreateMessageRequest
} from "../../utils/commonUtils";
import {ChatOpenMessage} from "../../utils/contantData";
import {useGetUserInfoQuery} from "../../app/apis/userApi";
import SkeletonEffect from "../loader/skeletonEffect/SkletonEffect";
import {PiLinkSimpleBold} from "react-icons/pi";
import {
    useCreateChatMutation,
    useGetChatByInitiatorIdQuery,
    useSearchMessageQuery,
    useSendMessageMutation
} from "../../app/apis/chatApi";
import {handleRTKQuery} from "../../utils/RTKQueryUtils";
import {addyApi} from "../../app/addyApi";
import {Link} from "react-router-dom";

function NeedHelpComponent() {

    const {sidebar} = useAppContext();
    const token = getToken()
    const decodedToken = decodeJwtToken(token);
    const dispatch = useDispatch();

    const timeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };


    const [messageList, setMessageList] = useState([]);
    const [searchMessageQuery, setSearchMessageQuery] = useState({
        offSet: -1,
        pageSize: 2,
        chatId: null
    })
    const [message, setMessage] = useState({
        text: "",
        senderId: decodedToken?.customerId,
        chatId: null,
        attachment: null
    })
    const [chatId, setChatId] = useState(null);
    const [files, setFiles] = useState([]);
    const [activeKey, setActiveKey] = useState(null);

    const userApi = useGetUserInfoQuery("")
    const searchMessageApi = useSearchMessageQuery(searchMessageQuery, {skip: searchMessageQuery?.offSet < 0 || isNullOrEmpty(searchMessageQuery?.chatId)})
    const chatByInitiatorIdApi = useGetChatByInitiatorIdQuery(decodedToken?.customerId)
    const [createChat, createChatApi] = useCreateChatMutation()
    const [sendMessage, sendMessageApi] = useSendMessageMutation()

    useEffect(() => {
        if (Array.isArray(chatByInitiatorIdApi?.data) && isNullOrEmpty(chatByInitiatorIdApi?.data) && !chatByInitiatorIdApi?.isLoading && !chatByInitiatorIdApi?.isFetching) {
            const handleCreateChat = async () => {
                await handleRTKQuery(
                    async () => {
                        return await createChat(decodedToken?.customerId).unwrap()
                    },
                    () => {
                        dispatch(addyApi.util.invalidateTags(["getChatByInitiatorIdApi"]))
                    });
            }
            handleCreateChat();

        }
    }, [chatByInitiatorIdApi]);

    useEffect(() => {
        if (!isNullOrEmpty(chatByInitiatorIdApi?.data)) {
            setChatId(chatByInitiatorIdApi?.data?.[0]?.id)
            setSearchMessageQuery({
                ...searchMessageQuery,
                offSet: 0,
                chatId: chatByInitiatorIdApi?.data?.[0]?.id
            })
        }
    }, [chatByInitiatorIdApi])

    useEffect(() => {
        if (!isNullOrEmpty(searchMessageApi?.data?.data) && !searchMessageApi?.isLoading && !searchMessageApi?.isFetching) {
            const reversedArray = searchMessageApi?.data?.data?.slice()?.reverse()
            const updatedMessageList = [...reversedArray, ...messageList]
            setMessageList(updatedMessageList)
        }
    }, [searchMessageApi])

    const handleToggle = (key) => {
        setActiveKey(key);
    };

    const handleFileChange = (e) => {
        const files = e.target.files
        setFiles(files)
    }
    const handleSendMessage = async () => {
        if (isNullOrEmpty(files)) {
            await sendMessageWithoutAttachments()
        } else {
            await sendMessageWithAttachments();
        }

    }

    const sendMessageWithoutAttachments = async () => {
        const requestBody = {
            ...message,
            chatId: chatId
        }
        if (isValidCreateMessageRequest(requestBody, files)) {
            await handleRTKQuery(
                async () => {
                    return await sendMessage({
                        chunksInfo: {
                            totalFiles: 0,
                        },
                        data: requestBody
                    }).unwrap()
                },
                (res) => {
                    setMessageList([...messageList, {...res}])
                    setMessage({
                        ...message,
                        text: "",
                        senderId: decodedToken?.customerId,
                        attachment: null
                    })
                    setFiles([])
                });
        }


    }

    const sendMessageWithAttachments = async () => {
        const requestBody = {
            ...message,
            chatId: chatId
        }
        if (isValidCreateMessageRequest(requestBody, files)) {
            for (let fileIndex = 0; fileIndex < files?.length; fileIndex++) {
                const file = files[fileIndex]
                const chunkSize = `${import.meta.env.VITE_APP_FILE_CHUNK_SIZE}` * 1024 * 1024
                const totalChunks = Math.ceil(file.size / chunkSize);
                if (totalChunks > 1) {
                    for (let i = 0; i < totalChunks; i++) {
                        const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
                        await uploadFileChunk(file, chunk, i, totalChunks, files?.length, fileIndex);
                    }
                } else {
                    await uploadFile(file, files?.length, fileIndex);
                }
            }
        }

    }
    const uploadFile = async (file, totalFiles, fileIndex) => {
        try {
            const response = await sendMessage({
                chunksInfo: {
                    fileIndex: fileIndex,
                    totalFiles: totalFiles,
                },
                data: {
                    ...message,
                    chatId: chatId,
                    attachment: {
                        file: file,
                        fileName: file.name,
                    },
                },
            }).unwrap();
            if (!isNullOrEmpty(response)) {
                setMessageList([...messageList, {...response}])
                setMessage({
                    ...message,
                    text: "",
                    attachment: null
                })
                setFiles([])
            }
        } catch (error) {
            console.error(`Error uploading file ${fileIndex + 1}/${totalFiles}:`);
            throw error;
        }
    };
    const uploadFileChunk = async (file, chunk, chunkIndex, totalChunks, totalFiles, fileIndex) => {
        try {
            const response = await sendMessage({
                chunksInfo: {
                    totalChunks: totalChunks,
                    chunkIndex: chunkIndex,
                    fileIndex: fileIndex,
                    totalFiles: totalFiles,
                },
                data: {
                    ...message,
                    chatId: chatId,
                    attachment: {
                        file: chunk,
                        fileName: file.name,
                    },
                },
            }).unwrap();
            if (!isNullOrEmpty(response)) {
                setMessageList([...messageList, {...response}])
                setMessage({
                    ...message,
                    text: "",
                    attachment: null
                })
                setFiles([])
            }
        } catch (error) {
            console.error(`Error uploading chunk ${chunkIndex + 1}/${totalChunks}:`);
            throw error;
        }
    };

    return (
        <div className={sidebar ? 'cmn_container' : 'cmn_Padding'}>
            <div className='cmn_outer'>
                <div className='need_help_outer'>
                    <h3 className='needhelp_heading'>Need Help?</h3>
                    <div className='row'>
                        <div className='col-lg-6 col-sm-12 col-md-12'>
                            <div className='needhelp_wrapper'>
                                <h3 className='Frequently_asked_outer text-center cmn_small_style_font'>
                                    Frequently Asked Questions
                                </h3>
                                <div className='accordian_wrapper'>
                                    <Accordion defaultActiveKey='0' activeKey={activeKey} onSelect={handleToggle}>
                                        <Accordion.Item eventKey='0'
                                                        className={activeKey === '0' ? 'active_border' : ''}>
                                            <Accordion.Header>How do I use Addy?</Accordion.Header>
                                            <Accordion.Body>
                                                To get started, create an account with Addy and select a plan that works
                                                for you. While signing up, choose your industry, business type, and
                                                other preferences. You'll also be prompted to connect your
                                                social media profiles to your dashboard. You can access your
                                                published posts, content calendar, ads, analytics, and everything else
                                                in one place.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey='1'
                                                        className={activeKey === '1' ? 'active_border' : ''}>
                                            <Accordion.Header>What can Addy do for my business?</Accordion.Header>
                                            <Accordion.Body>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                culpa qui officia deserunt mollit anim id est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-6 col-sm-12 col-md-12'>
                            <div className='needhelp_wrapper'>
                                <div className='chataddy_outer d-flex justify-content-center gap-3 align-items-center'>
                                    <img src={logo} height={'50px'} width={'50px'} alt='Addy Logo'/>
                                    <h3 className='cmn_small_style_font'>Chat with Addy</h3>
                                </div>
                                <div className='chat_container'>
                                    <div className="chat_scroll">
                                        {
                                            searchMessageApi?.data?.isLast &&
                                            <div className='d-flex gap-3 chat_inner_content'>
                                                <div className='user_profile_image_container'>
                                                    <img src={logo} className='userchat_image'
                                                         alt='User Profile'/>
                                                </div>
                                                <div className='bot_chat_outer mb-3'>
                                                    <div className='chat_inner_text'>
                                                        <h3>{ChatOpenMessage}</h3>
                                                    </div>

                                                </div>
                                            </div>
                                        }

                                        {
                                            (searchMessageApi?.isLoading || searchMessageApi?.isFetching) ?
                                                <div className={"text-center mb-2"}>
                                                    <SkeletonEffect count={1} className={"w-25  mb-2"}></SkeletonEffect>
                                                    <SkeletonEffect count={1} className={"w-50  mb-2"}></SkeletonEffect>
                                                    <SkeletonEffect count={1}
                                                                    className={"w-25  mb-2 ml-auto"}></SkeletonEffect>
                                                    <SkeletonEffect count={1}
                                                                    className={"w-50  mb-2 ml-auto"}></SkeletonEffect>
                                                </div> :
                                                searchMessageApi?.data?.hasNext &&
                                                <div className={"load-more-msg-txt mb-2 cursor-pointer"}
                                                     onClick={() => {
                                                         setSearchMessageQuery({
                                                             ...searchMessageQuery,
                                                             offSet: messageList?.length
                                                         })
                                                     }}>load previous messages...</div>
                                        }
                                        {
                                            messageList?.map((message, index) => {
                                                return <div key={index}>
                                                    {
                                                        message?.senderId === decodedToken.customerId ?
                                                            <div className='d-flex gap-3 justify-content-end'>
                                                                <div>
                                                                    {
                                                                        !isNullOrEmpty(message.attachments) &&
                                                                        message?.attachments?.map(attachment => {
                                                                            return <Link
                                                                                target={"_blank"}
                                                                                to={`${import.meta.env.VITE_APP_API_BASE_URL}/attachments/${attachment?.id}`}
                                                                            > {attachment?.fileName}</Link>
                                                                        })
                                                                    }
                                                                    <div
                                                                        className='chat_inner_text user_chat_inner_text'>

                                                                        {
                                                                            !isNullOrEmpty(message.text) &&
                                                                            <h3 className={"chat-message"}>{message.text}</h3>
                                                                        }

                                                                    </div>
                                                                    <h6 className='chat_time text-end'>
                                                                        {new Date(message.createdAt).toLocaleTimeString(undefined, timeFormatOptions)}
                                                                    </h6>
                                                                </div>
                                                                <div className='user_profile_image_container'>
                                                                    <img
                                                                        src={userApi?.data?.profilePic ? "data:image/jpeg; base64," + userApi?.data?.profilePic : default_user_icon}
                                                                        className='userchat_image'
                                                                        alt='User Profile'/>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='d-flex gap-3 chat_inner_content'>
                                                                <div className='user_profile_image_container'>
                                                                    <img src={logo} className='userchat_image'
                                                                         alt='User Profile'/>
                                                                </div>
                                                                <div className='bot_chat_outer'>
                                                                    {
                                                                        !isNullOrEmpty(message.attachments) &&
                                                                        message?.attachments?.map(attachment => {
                                                                            return <Link
                                                                                target={"_blank"}
                                                                                to={`${import.meta.env.VITE_APP_API_BASE_URL}/attachments/${attachment?.id}`}
                                                                            > {attachment?.fileName}</Link>
                                                                        })
                                                                    }
                                                                    <div className='chat_inner_text'>
                                                                        {
                                                                            !isNullOrEmpty(message.text) &&
                                                                            <h3 className={"chat-message"}>{message.text}</h3>
                                                                        }
                                                                    </div>
                                                                    <h6 className='chat_time'>
                                                                        {new Date(message.createdAt).toLocaleTimeString(undefined, timeFormatOptions)}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                    <input
                                        type="file"
                                        multiple={true}
                                        accept=".jpg, .jpeg, .png, .mp4, .pdf, .txt, .doc, .docx, .csv"
                                        onChange={handleFileChange}
                                    />
                                    <div className='chart_wrapper'>

                                        <div className='attachlink_wrapepr'>

                                            {/*<img src={attach_file} alt='Attach File'/>*/}
                                            <PiLinkSimpleBold className='attachlink_outer'/>
                                        </div>
                                        <div className='input_wrapper'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Write message'
                                                value={message?.text}
                                                onChange={(e) => {
                                                    setMessage({
                                                        ...message,
                                                        text: e.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                        <div className='send_outer' onClick={handleSendMessage}>
                                            {
                                                (createChatApi.isLoading || sendMessageApi.loading) ?
                                                    <Loader/> :
                                                    <IoSendSharp className={"cursor-pointer"}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='Get_in_touch_outer'>
                        <h2 className='Get_in_touch_heading'>Get in Touch!</h2>
                        <div className='Get_in_touch_content_wrapper'>
                            <div className='row'>
                                <div className='col-lg-6 col-sm-12 col-md-6'>
                                    <div className='d-flex getintouch_inner_content align-items-center gap-2'>
                                        <div className='email_wrapper'>
                                            <MdOutlineMail/>
                                        </div>
                                        <h3>kiritgoti007@gmail.com</h3>
                                    </div>
                                </div>
                                <div className='col-lg-6 col-sm-12 col-md-6'>
                                    <div className='d-flex getintouch_inner_content align-items-center gap-2'>
                                        <div className='email_wrapper'>
                                            <IoLocationOutline/>
                                        </div>
                                        <h3>India — 723 17th Street, Office 478 Mumbai, IM 81566</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NeedHelpComponent;
