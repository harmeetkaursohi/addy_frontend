import {useAppContext} from "../common/components/AppProvider";
import "./Notification.css"
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import ConnectSocialMediaAccount from "../common/components/ConnectSocialMediaAccount";
import CommonLoader from "../common/components/CommonLoader";
import {
    getCommentCreationTime,
    getEmptyArrayOfSize,
    isNullOrEmpty,
    removeObjectFromArray
} from "../../utils/commonUtils";
import SkeletonEffect from "../loader/skeletonEffect/SkletonEffect";
import jsondata from "../../locales/data/initialdata.json"
import notConnected_img from "../../images/no_acc_connect_img.svg";
import Swal from "sweetalert2";
import notification_img from "../../images/clear_notification.svg"
import {EmptyNotificationGridMessage} from "../../utils/contantData";
import no_notification_img from "../../images/no_notification_bg.svg"
import {useGetConnectedSocialAccountQuery} from "../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../app/apis/pageAccessTokenApi";
import {
    useClearAllNotificationMutation,
    useDeleteNotificationByIdMutation,
    useGetUnseenNotificationsQuery, useLazySearchNotificationsQuery,
     useSetNotificationsToSeenByCustomerIdMutation,
    useSetNotificationsToSeenMutation
} from "../../app/apis/notificationApi";
import {unseenNotificationsCount} from "../../app/globalSlice/globalSlice";
import {handleRTKQuery} from "../../utils/RTKQueryUtils";
import {Dropdown} from "react-bootstrap";
import {PiDotsThreeVerticalBold} from "react-icons/pi";

const Notification = () => {

    const {sidebar} = useAppContext()
    const dispatch = useDispatch();

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
            dispatch(unseenNotificationsCount({count: 0}))
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
        Swal.fire({
            imageUrl: notification_img,
            title: `Clear Notifications`,
            html: `<p class="modal_heading">Are you sure you want to clear notifications?</p>`,
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

    return (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching) ?
        <CommonLoader classname={sidebar ? "loader_siderbar_open" : "loader_siderbar_close"}></CommonLoader>
        : (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding"}>
                    <div className="cmn_outer">

                        <div className="notification_wrapper cmn_wrapper_outer white_bg_color cmn_height_outer">
                            <div className="notification_header align-items-center gap-3">
                                <h2 className="cmn_text_heading">{jsondata.notification}</h2>

                            </div>
                            <div className="d-flex justify-content-between">
                                <h6 className={"cmn_small_heading "}>{jsondata.notification_heading}</h6>

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
                                    <>
                                        <div className=" align-items-center mt-4">
                                            {
                                                (isAllNotificationsCleared ||
                                                    (Array.isArray(searchNotificationsApi?.data?.data) && isNullOrEmpty(searchNotificationsApi?.data?.data) && Array.isArray(unseenNotificationsApi?.data) && isNullOrEmpty(unseenNotificationsApi?.data))) &&
                                                <div className="d-flex justify-content-center no_notification_wrapper">
                                                    <div>
                                                        <img src={no_notification_img}/>
                                                        <h4 className="no-notifications-text text-center mt-4">No New
                                                            Notifications</h4>
                                                    </div>
                                                </div>
                                            }
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
                                        {
                                            (searchNotificationsApi?.isLoading || searchNotificationsApi?.isFetching || unseenNotificationsApi?.isLoading || unseenNotificationsApi?.isFetching) ?
                                                <>
                                                    {
                                                        getEmptyArrayOfSize(4).map((_, i) => {
                                                            return <div className={"notifications_layout"}>
                                                                <SkeletonEffect count={1}/>
                                                                <SkeletonEffect count={1} className={"w-25 mt-2"}/>
                                                            </div>
                                                        })
                                                    }
                                                </>:
                                                searchNotificationsApi?.data?.hasNext &&
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


                                    </>
                            }
                            {
                                (getConnectedSocialAccountApi?.data?.length === 0 || getAllConnectedPagesApi?.data?.length === 0) &&
                                <ConnectSocialMediaAccount
                                    image={notConnected_img}
                                    message={EmptyNotificationGridMessage}/>
                            }


                        </div>

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
                            <Dropdown className="notification_edit_button">
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
                            </Dropdown>
                        </div>
                    </>
            }
        </div>
    );
}
