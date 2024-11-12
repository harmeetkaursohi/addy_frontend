import {useAppContext} from "../common/components/AppProvider";
import "./Notification.css"
import ReactDOMServer from 'react-dom/server'; 
import React, {useEffect, useState} from "react";
import ConnectSocialMediaAccount from "../common/components/ConnectSocialMediaAccount";
import {
    getCommentCreationTime,
    getEmptyArrayOfSize,
    isNullOrEmpty,
    removeObjectFromArray
} from "../../utils/commonUtils";
import SkeletonEffect from "../loader/skeletonEffect/SkletonEffect";
import jsondata from "../../locales/data/initialdata.json"
import NotConnected_img from "../../images/no_notification_bg.svg?react";
import Swal from "sweetalert2";
import Notification_img from "../../images/clear_notification.svg?react"
import {EmptyNotificationGridMessage} from "../../utils/contantData";
import No_notification_img from "../../images/no_notification_bg.svg?react"
import {useGetConnectedSocialAccountQuery} from "../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../app/apis/pageAccessTokenApi";
import {
    useClearAllNotificationMutation,
    useDeleteNotificationByIdMutation,
    useGetUnseenNotificationsQuery, useLazySearchNotificationsQuery,
     useSetNotificationsToSeenByCustomerIdMutation,
    useSetNotificationsToSeenMutation
} from "../../app/apis/notificationApi";
import {handleRTKQuery} from "../../utils/RTKQueryUtils";
import { RxCross2 } from "react-icons/rx";


const Notification = () => {

    const {sidebar} = useAppContext()

    const [baseSearchQuery, setBaseSearchQuery] = useState({
        offSet: -1,
        pageSize: 10,
        isSeen: true
    });

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")
    const unseenNotificationsApi = useGetUnseenNotificationsQuery("", {skip: isNullOrEmpty(getConnectedSocialAccountApi?.data) || isNullOrEmpty(getAllConnectedPagesApi?.data)})
    const [searchNotifications, searchNotificationsApi] = useLazySearchNotificationsQuery()

    const [setNotificationToSeen, setNotificationsToSeenApi] = useSetNotificationsToSeenMutation()
    const [setNotificationsToSeenByCustomerId, notificationsToSeenByCustomerIdApi] = useSetNotificationsToSeenByCustomerIdMutation()
    const [deleteNotificationById, deleteNotificationByIdApi] = useDeleteNotificationByIdMutation()
    const [clearNotification, clearNotificationApi] = useClearAllNotificationMutation()

    const [notificationsList, setNotificationsList] = useState([]);
    const [unSeenNotificationsList, setUnSeenNotificationsList] = useState([]);

    const [isAllNotificationsCleared, setIsAllNotificationsCleared] = useState(false)

    const isAccountInfoLoading = getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.isLoading

    useEffect(() => {
        if (!isNullOrEmpty(getConnectedSocialAccountApi?.data) && !isNullOrEmpty(getAllConnectedPagesApi?.data)) {
            setBaseSearchQuery({
                ...baseSearchQuery,
                offSet: 0
            })
        }
    }, [getConnectedSocialAccountApi,getAllConnectedPagesApi]);
    useEffect(() => {
        if (notificationsList?.length===0 && unSeenNotificationsList?.length===0 && baseSearchQuery?.offSet>=0) {
            setBaseSearchQuery({
                ...baseSearchQuery,
                offSet: 0
            })
        }
    }, [notificationsList,unSeenNotificationsList]);

    useEffect(() => {
        if (baseSearchQuery?.offSet >= 0) {
            searchNotifications(baseSearchQuery)
        }
    }, [baseSearchQuery]);

    useEffect(() => {
        return () => {
            if (unseenNotificationsApi?.data?.length > 0) {
                setNotificationsToSeenByCustomerId()
            }
        }
    }, [unseenNotificationsApi]);
    useEffect(() => {
        if (unseenNotificationsApi?.data?.length > 0 && !unseenNotificationsApi?.isLoading && !unseenNotificationsApi?.isFetching) {
            setUnSeenNotificationsList([...unSeenNotificationsList, ...unseenNotificationsApi?.data])
        }
    }, [unseenNotificationsApi]);
    useEffect(() => {
        if (searchNotificationsApi?.data?.data?.length > 0 && !searchNotificationsApi?.isLoading && !searchNotificationsApi?.isFetching) {
            setNotificationsList([...notificationsList, ...searchNotificationsApi?.data?.data])
        }
    }, [searchNotificationsApi]);

    const handleClearAllNotifications = (e) => {
        e.preventDefault();
        const svgMarkup = ReactDOMServer.renderToStaticMarkup(<Notification_img />);
        Swal.fire({
            html: `
             <div class="swal-content mt-2">
                    <div class="swal-images">
                      <img src="data:image/svg+xml;base64,${btoa(svgMarkup)}" alt="Delete Icon" class="delete-img" />
                    </div>
                    <h2 class="swal2-title mt-2" id="swal2-title" style="display: block;">Clear Notifications</h2>
                    <p class="modal_heading">Are you sure you want to clear notifications?</p>
                </div>`,
            showCancelButton: true,
            confirmButtonText: 'Clear',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class',
                popup: 'small_swal_popup cmnpopupWrapper',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleRTKQuery(
                    async () => {
                        return await clearNotification().unwrap()
                    },
                    () => {
                        setIsAllNotificationsCleared(true)
                    })
            }
        });


    }

    return (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding"}>
                    <div className="cmn_outer">

                            <div className="notification_header align-items-center gap-3">
                               <div className="flex-grow-1">
                               <h2 className="cmn_text_heading">{jsondata.notification}</h2>

                         {  !isAllNotificationsCleared &&
                                    (!isNullOrEmpty(searchNotificationsApi?.data?.data) || !isNullOrEmpty(unseenNotificationsApi?.data)) &&
                                       <h6 className={"cmn_small_heading"}>{jsondata.notification_heading}</h6>}
                               </div>

                                {
                                    !isAllNotificationsCleared &&
                                    (!isNullOrEmpty(searchNotificationsApi?.data?.data) || !isNullOrEmpty(unseenNotificationsApi?.data)) &&
                                    <button
                                        className={"text-end clear-all-notifications  cursor-pointer  clear_all_button_outer " + (clearNotificationApi?.isLoading ? "disable_btn" : "")}
                                        onClick={handleClearAllNotifications}
                                    >Clear all</button>
                                }
                            </div>
                       
                           
                        
                            {
                                    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 &&
                                <div className=" align-items-center">
                                    {
                                        (isAllNotificationsCleared ||
                                            (Array.isArray(searchNotificationsApi?.data?.data) && isNullOrEmpty(searchNotificationsApi?.data?.data) && Array.isArray(unseenNotificationsApi?.data) && isNullOrEmpty(unseenNotificationsApi?.data))) &&
                                        <div className="W-100 text-center no_post_review_outer no_account_bg white_bg_color">
                                            <div>
                                                <No_notification_img className="w-100 h-auto" />
                                                <h4 className="no-notifications-text text-center mt-3 text-black">{EmptyNotificationGridMessage}</h4>
                                            </div>
                                        </div>
                                    }
                                    <div className="notification_wrapper">
                                    {
                                        !isAllNotificationsCleared && unSeenNotificationsList?.length > 0 &&
                                        unSeenNotificationsList?.map((notification, index) => {
                                            return (
                                                <span key={index}>
                                                             <NotificationComponent notification={notification}
                                                                                    notificationsList={notificationsList}
                                                                                    setNotificationsList={setNotificationsList}
                                                                                    unSeenNotificationsList={unSeenNotificationsList}
                                                                                    setUnSeenNotificationsList={setUnSeenNotificationsList}/>
                                                        </span>
                                            )
                                        })
                                    }


                                    {
                                        !isAllNotificationsCleared && notificationsList?.length > 0 &&
                                        notificationsList?.map((notification, index) => {
                                            return (
                                                <span key={index}>
                                                             <NotificationComponent notification={notification}
                                                                                    notificationsList={notificationsList}
                                                                                    setNotificationsList={setNotificationsList}
                                                                                    unSeenNotificationsList={unSeenNotificationsList}
                                                                                    setUnSeenNotificationsList={setUnSeenNotificationsList}/>
                                                        </span>
                                            )
                                        })
                                    }
                                         </div>

                                </div>
                            }
                            {
                                (isAccountInfoLoading || searchNotificationsApi?.isLoading || searchNotificationsApi?.isFetching || unseenNotificationsApi?.isLoading || unseenNotificationsApi?.isFetching) &&
                                <>
                                    {
                                        getEmptyArrayOfSize(4).map((_, i) => {
                                            return <div className={"notifications_layout"}>
                                                <SkeletonEffect count={1}/>
                                                <SkeletonEffect count={1} className={"w-25 mt-2"}/>
                                            </div>
                                        })
                                    }
                                </>
                            }
                            {
                                getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 && searchNotificationsApi?.data?.hasNext &&
                                <div
                                    className={" load-more-not-btn-outer " + ((searchNotificationsApi?.isLoading || searchNotificationsApi?.isFetching || deleteNotificationByIdApi?.isFetching || setNotificationsToSeenApi?.isLoading) ? "disable_btn" : "")}>
                                    <div className={"load-more-notification-btn  cursor-pointer"}
                                         onClick={() => {
                                             setBaseSearchQuery({
                                                 ...baseSearchQuery,
                                                 offSet: notificationsList?.length
                                             })
                                         }}
                                    > Load more...
                                    </div>
                                </div>
                            }
                            
                            {
                                (getConnectedSocialAccountApi?.data?.length === 0 || getAllConnectedPagesApi?.data?.length === 0) &&
                                <div className="W-100 text-center no_post_review_outer no_account_bg white_bg_color">
                                <div>
                                    <No_notification_img className="w-100 h-auto" />
                                    <h4 className="no-notifications-text text-center mt-3 text-black">{EmptyNotificationGridMessage}</h4>
                                </div>
                            </div>
                            }


                   

                    </div>
                </div>
            </section>
        </>

    );
}
export default Notification;

const NotificationComponent = ({
                                   notification,
                                   notificationsList,
                                   setNotificationsList,
                                   unSeenNotificationsList,
                                   setUnSeenNotificationsList,
                               }) => {


    const [showNotificationErrorDetails, setShowNotificationErrorDetails] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);

    const [deleteNotificationById, deleteNotificationByIdApi] = useDeleteNotificationByIdMutation()

    useEffect(() => {
        if (notificationToDelete !== null) {
            handleDeleteNotification()
        }
    }, [notificationToDelete])

    const handleDeleteNotification = async () => {
        await handleRTKQuery(
            async () => {
                return await deleteNotificationById(notificationToDelete?.id).unwrap()
            },
            () => {
                let updatedNotificationsList;
                if (notificationToDelete?.seen) {
                    updatedNotificationsList = removeObjectFromArray(notificationsList, notificationToDelete, "id")
                    setNotificationsList(updatedNotificationsList)
                } else {
                    updatedNotificationsList = removeObjectFromArray(unSeenNotificationsList, notificationToDelete, "id")
                    setUnSeenNotificationsList(updatedNotificationsList)
                }
            },
            null,
            () => {
                setNotificationToDelete(null)
            })
    }

    let errorInfo;
    if (notification?.additionalInfo?.hasOwnProperty('postPageInfo')) {
        errorInfo = Object.values(notification?.additionalInfo?.postPageInfo).filter(obj => obj.postState === "ERROR");
    }
    return (

        <div
            className={" notifications_layout " + (notification?.id === notificationToDelete?.id ? "" : " notifications_outer")}>
            {
                notification?.id === notificationToDelete?.id ?
                    <SkeletonEffect count={1}></SkeletonEffect> : <>
                        <div className="notification_message_outer">
                            <p
                                className={(notification?.isSeen ? "" : "unseen_notifications")}>{
                                notification?.message
                            }
                            </p>
                            {
                                errorInfo && errorInfo?.length > 0 && showNotificationErrorDetails &&
                                errorInfo?.map(error => {
                                    return <div
                                        className={"error-message-outer mb-2"}><span
                                        className={"error-pagename"}> {error.pageName} - </span><span
                                        className={"error-detail"}>{error?.logErrorMessage}</span>
                                    </div>
                                })

                            }
                            {
                                errorInfo && errorInfo?.length > 0 &&
                                <div
                                    className={"show-notification-details cursor-pointer"}
                                    onClick={() => {
                                        setShowNotificationErrorDetails(!showNotificationErrorDetails)
                                    }}
                                >{showNotificationErrorDetails ? "Hide" : "Show"} error
                                    details</div>
                            }
                            <div
                                className={"notification-creation-date"}>{getCommentCreationTime(notification.createdAt)}</div>
                        </div>
                        <div>
                        <RxCross2  onClick={() => {
                                            !deleteNotificationByIdApi?.isLoading && setNotificationToDelete(notification)
                                        }}/>

                            {/* <Dropdown className="notification_edit_button">
                                <Dropdown.Toggle
                                    className={"comment-edit-del-button"}
                                    variant="success"
                                    id="edit_dropdown_wrapper">
                                    <PiDotsThreeVerticalBold
                                        className={"comment-edit-del-icon"}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        onClick={() => {
                                            !deleteNotificationByIdApi?.isLoading && setNotificationToDelete(notification)
                                        }}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>
                    </>
            }
        </div>
    );
}
