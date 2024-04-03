import {useAppContext} from "../common/components/AppProvider";
import "./Notification.css"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearAllNotification,
    deleteNotification,
    getUnseenNotifications,
    searchNotification, setNotificationsToSeen
} from "../../app/actions/notificationAction/notificationAction";
import {getToken} from "../../app/auth/auth";
import {RotatingLines} from "react-loader-spinner";
import ConnectSocialMediaAccount from "../common/components/ConnectSocialMediaAccount";
import {FaBell} from "react-icons/fa";
import CommonLoader from "../common/components/CommonLoader";
import {getCommentCreationTime} from "../../utils/commonUtils";
import {Dropdown} from "react-bootstrap";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import SkeletonEffect from "../loader/skeletonEffect/SkletonEffect";
import {
    resetNotificationEventData,
    unseenNotificationsCountData
} from "../../app/slices/notificationSlice/notificationSlice";
import {resetReducers} from "../../app/actions/commonActions/commonActions";
import Swal from "sweetalert2";

const Notification = () => {

    const dispatch = useDispatch();
    const {sidebar} = useAppContext()
    const token = getToken();
    const searchNotificationData = useSelector(state => state.notification.searchNotificationReducer)
    const clearAllNotificationData = useSelector(state => state.notification.clearAllNotificationReducer)
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const unseenNotificationsData = useSelector(state => state.notification.getUnseenNotificationsReducer)
    const setNotificationsToSeenData = useSelector(state => state.notification.setNotificationsToSeenReducer)
    const notificationEventData = useSelector(state => state.notification.notificationEventReducer)
    const deleteNotificationData = useSelector(state => state.notification.deleteNotificationReducer)
    const [notifications, setNotifications] = useState([]);
    const [notificationsUpdatedToSeenIds, setNotificationsUpdatedToSeenIds] = useState([]);
    const [fetchNotifications, setFetchNotifications] = useState(false);
    const [clearAllNotifications, setClearAllNotifications] = useState({
        clearNotifications: false,
        isAllNotificationsCleared: false
    });
    const [deletedNotifications, setDeletedNotifications] = useState([]);
    const [baseSearchQuery, setBaseSearchQuery] = useState({
        offSet: 0,
        pageSize: 5,
        isSeen: true
    });


    useEffect(() => {
        dispatch(resetNotificationEventData())
    }, [])

    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            dispatch(getUnseenNotifications({token: token}))
        }
    }, [getAllConnectedSocialAccountData, connectedPagesData])


    useEffect(() => {
        if (unseenNotificationsData?.data !== null && unseenNotificationsData?.data !== undefined) {
            dispatch(unseenNotificationsCountData({count: 0}))
            if (unseenNotificationsData?.data?.length > 0) {
                const notificationsToUpdate = unseenNotificationsData?.data?.map(notification => notification?.id)
                dispatch(setNotificationsToSeen({
                    token: token,
                    ids: notificationsToUpdate
                })).then(res => {
                    if (res.meta.requestStatus === "fulfilled") {
                        setNotificationsUpdatedToSeenIds([...notificationsUpdatedToSeenIds, ...notificationsToUpdate]);
                        setBaseSearchQuery({
                            ...baseSearchQuery, offSet: unseenNotificationsData?.data?.length
                        })
                    }
                    setFetchNotifications(true);
                })
            } else {
                setFetchNotifications(true);
            }
        }
    }, [unseenNotificationsData])

    useEffect(() => {
        if (notificationEventData?.data !== null && notificationEventData?.data !== undefined && notificationEventData?.data?.length > 0) {
            const notificationsToUpdate = notificationEventData?.data?.map(notification => notification?.id)?.filter(id => !notificationsUpdatedToSeenIds.includes(id))
            if (notificationsToUpdate?.length > 0) {
                dispatch(setNotificationsToSeen({
                    token: token,
                    ids: notificationsToUpdate
                })).then(res => {
                    if (res.meta.requestStatus === "fulfilled") {
                        setNotificationsUpdatedToSeenIds([...notificationsUpdatedToSeenIds, ...notificationsToUpdate]);
                    }
                })
            }
        }
    }, [notificationEventData])


    useEffect(() => {
        if (fetchNotifications) {
            dispatch(searchNotification({
                data: baseSearchQuery,
                token: token
            }))
            setFetchNotifications(false)
        }
    }, [fetchNotifications])

    useEffect(() => {
        if (searchNotificationData.data !== null && searchNotificationData?.data !== undefined) {
            setNotifications([...notifications, ...searchNotificationData?.data?.data])
        }
    }, [searchNotificationData])

    useEffect(() => {
        if (deletedNotifications?.length > 0 && (notifications?.length + notificationsUpdatedToSeenIds?.length - deletedNotifications?.length <= 2) && searchNotificationData?.data?.isLast === false) {
            setBaseSearchQuery({
                ...baseSearchQuery,
                offSet: notifications?.length + notificationsUpdatedToSeenIds?.length - deletedNotifications?.length
            })
            setFetchNotifications(true)
        }
    }, [deletedNotifications])


    useEffect(() => {
        if (clearAllNotifications?.clearNotifications) {
            dispatch(clearAllNotification({token: token})).then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    setClearAllNotifications({
                        clearNotifications: false,
                        isAllNotificationsCleared: true
                    })
                    resetData();
                }

            })
        }
    }, [clearAllNotifications])


    useEffect(() => {
        return () => {
            resetData();
        }
    }, [])

    const resetData = () => {
        setNotifications([])
        setDeletedNotifications([])
        dispatch(resetNotificationEventData())
        dispatch(unseenNotificationsCountData({count: 0}))
        dispatch(resetReducers({sliceNames: ["getUnseenNotificationsReducer"]}))
        dispatch(resetReducers({sliceNames: ["searchNotificationReducer"]}))
    }

    const handleClearAllNotifications = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: `Clear Notifications`,
            text: `Are you sure you want to clear notifications?`,
            showCancelButton: true,
            confirmButtonText: 'Clear',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class'
            }
        }).then((result) => {
            result.isConfirmed && setClearAllNotifications({
                ...clearAllNotifications,
                clearNotifications: true
            });
        });


    }

    return (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding bg_Color"}>
                    <div className="cmn_wrapper_outer">
                        <div className="notification_wrapper">
                            <div className="notification_header align-items-center gap-3">
                                <h2 className="cmn_text_heading">Notifications</h2>

                            </div>
                            <h6 className={"cmn_small_heading "}>All notifications will be directed here for your ease
                                of access.</h6>
                            {
                                (
                                    ((searchNotificationData?.data?.data && searchNotificationData?.data?.data?.length > 0) || (unseenNotificationsData?.data && unseenNotificationsData?.data?.length > 0) || (notificationEventData?.data?.length > 0))
                                    &&
                                    (((searchNotificationData?.data?.data?.length || 0) + (unseenNotificationsData?.data?.length || 0) + (notificationEventData?.data?.length || 0)) > deletedNotifications?.length)
                                )
                                &&
                                <h6 className={"text-end clear-all-notifications  cursor-pointer " + (clearAllNotificationData?.loading ? "disable_btn" : "")}
                                    onClick={handleClearAllNotifications}
                                >clear all</h6>
                            }

                            {
                                (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                                    <CommonLoader classname={"cmn_loader_outer"}></CommonLoader> :
                                    getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0 &&
                                    <>
                                        <div className=" align-items-center mt-4">
                                            {
                                                (
                                                    (searchNotificationData?.data !== undefined && unseenNotificationsData?.data !== undefined) &&
                                                    (
                                                        (searchNotificationData?.data?.data?.length === 0 && notificationEventData?.data?.length === 0 && unseenNotificationsData?.data?.length === 0)
                                                        ||
                                                        ((notifications?.length + notificationEventData?.data?.length + unseenNotificationsData?.data?.length === deletedNotifications?.length) && searchNotificationData?.data?.isLast)
                                                    ) ||
                                                    (clearAllNotifications?.isAllNotificationsCleared && (notificationEventData?.data?.length === 0 || notificationEventData?.data?.length === deletedNotifications?.length))
                                                ) &&
                                                <h4
                                                    className={"no-notifications-text text-center mt-4"}><FaBell
                                                    className={"me-1 mb-1"}/> No notifications to
                                                    display. Check back later for updates!
                                                </h4>
                                            }
                                            {
                                                notificationEventData?.data?.length > 0 && notificationEventData?.data?.map((notification, index) => {
                                                    return deletedNotifications?.includes(notification?.id) ? <></> : (
                                                        <span key={index}>
                                                             <NotificationComponent notification={notification}
                                                                                    deletedNotifications={deletedNotifications}
                                                                                    setDeletedNotifications={setDeletedNotifications}/>
                                                        </span>
                                                    )

                                                })
                                            }

                                            {
                                                unseenNotificationsData?.data !== undefined && unseenNotificationsData?.data?.length > 0 &&
                                                unseenNotificationsData?.data?.map((notification, index) => {
                                                    return deletedNotifications?.includes(notification?.id) ? <></> : (
                                                        <span key={index}>
                                                             <NotificationComponent notification={notification}
                                                                                    deletedNotifications={deletedNotifications}
                                                                                    setDeletedNotifications={setDeletedNotifications}/>
                                                        </span>
                                                    )
                                                })
                                            }
                                            {
                                                notifications?.length > 0 &&
                                                notifications?.map((notification, index) => {
                                                    return deletedNotifications?.includes(notification?.id) ? <></> : (
                                                        <span key={index}>
                                                             <NotificationComponent notification={notification}
                                                                                    deletedNotifications={deletedNotifications}
                                                                                    setDeletedNotifications={setDeletedNotifications}/>
                                                        </span>
                                                    )
                                                })
                                            }
                                        </div>
                                        {
                                            (searchNotificationData?.loading || unseenNotificationsData?.loading) ?
                                                <div className="d-flex justify-content-center  ">
                                                    <RotatingLines
                                                        strokeColor="#F07C33"
                                                        strokeWidth="5"
                                                        animationDuration="0.75"
                                                        width="70"
                                                        visible={true}
                                                    />
                                                </div> :
                                                searchNotificationData?.data?.isLast === false && <div
                                                    className={" load-more-not-btn-outer " + ((searchNotificationData?.loading || deleteNotificationData?.loading || setNotificationsToSeenData?.loading) ? "disable_btn" : "")}>
                                                    <div className={"load-more-notification-btn  cursor-pointer"}
                                                         onClick={() => {
                                                             setBaseSearchQuery({
                                                                 ...baseSearchQuery,
                                                                 offSet: notifications?.length + notificationsUpdatedToSeenIds?.length - deletedNotifications?.length
                                                             })
                                                             setFetchNotifications(true)
                                                         }}
                                                    > Load more...
                                                    </div>
                                                </div>
                                        }


                                    </>
                            }
                            {
                                getAllConnectedSocialAccountData?.data?.length == 0 &&
                                <ConnectSocialMediaAccount messageFor={"ACCOUNT"}/>
                            }
                            {
                                getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length === 0 &&
                                <ConnectSocialMediaAccount messageFor={"PAGE"}/>
                            }


                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}
export default Notification;

const NotificationComponent = ({notification, deletedNotifications, setDeletedNotifications}) => {
    const deleteNotificationData = useSelector(state => state.notification.deleteNotificationReducer)
    const [showNotificationErrorDetails, setShowNotificationErrorDetails] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);
    const dispatch = useDispatch();
    const token = getToken();

    useEffect(() => {
        if (notificationToDelete !== null) {
            dispatch(deleteNotification({
                id: notificationToDelete?.id,
                token: token
            })).then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    setDeletedNotifications([...deletedNotifications, notificationToDelete?.id])
                }
                setNotificationToDelete(null)
            })
        }
    }, [notificationToDelete])


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
                        <div>
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
                            <Dropdown>
                                <Dropdown.Toggle
                                    className={"comment-edit-del-button"}
                                    variant="success"
                                    id="edit_dropdown_wrapper">
                                    <PiDotsThreeVerticalBold
                                        className={"comment-edit-del-icon"}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-2"
                                                   onClick={() => {
                                                       !deleteNotificationData?.loading && setNotificationToDelete(notification)
                                                   }}>Delete</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </>
            }
        </div>
    );
}