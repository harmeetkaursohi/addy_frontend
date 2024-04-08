// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import './Planner.css'
// import SideBar from '../../sidebar/views/Layout'
// import instagram_img from '../../../images/instagram.png'
// import pinterest_icon from '../../../images/pinterest_icon.svg'
// import linkedin from '../../../images/linkedin.svg'
// import jsondata from '../../../locales/data/initialdata.json'
// import {Link, useNavigate} from "react-router-dom";
// import {useEffect, useRef, useState} from "react";
// import {decodeJwtToken, getToken} from "../../../app/auth/auth";
// import {
//     getAllSocialMediaPostsByCriteria,
//     getAllPlannerPostAction,
//     getAllPostsForPlannerAction,
//     getPlannerPostCountAction,
// } from "../../../app/actions/postActions/postActions";
// import {useDispatch, useSelector} from "react-redux";
// import {
//     isPostDatesOnSameDayOrInFuture,
//     computeAndReturnPlannerEvent,
//     dateFormat, computeStartEndDate
// } from "../../../utils/commonUtils";
// import {SocialAccountProvider} from "../../../utils/contantData";
// import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
// import {ParentDraftComponent} from "../../unPublishedPages/views/ParentDraftComponent";
// import CommonShowMorePlannerModel from "../../common/components/CommonShowMorePlannerModal";
// import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
// import Loader from '../../loader/Loader'
// import SkeletonEffect from '../../loader/skeletonEffect/SkletonEffect'
// import { useAppContext } from '../../common/components/AppProvider'

// const Planner = () => {
//     const dispatch = useDispatch();
//     const token = getToken();
//     const navigate = useNavigate();
//     const { sidebar } = useAppContext();

//     const [isLoading, setIsLoading] = useState(false);
//     const calendarRef = useRef(null);
//     const [baseSearchQuery, setBaseSearchQuery] = useState({postStatus: ["SCHEDULED", "PUBLISHED"]});
//     const [isDraftPost, setDraftPost] = useState(false);
//     const [showMorePlannerModel, setShowMorePlannerModel] = useState(false);
//     const [plannerPosts, setPlannerPosts] = useState([]);
//     const [eventDate, setEventDate] = useState(null);
//     const [batchIds, setBatchIds] = useState([]);
//     const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

//     const [events, setEvents] = useState([
//         {title: 'Instagram post', start: new Date().getTime(), imageUrl: instagram_img},
//         {title: "Twitter", start: new Date().getTime(), imageUrl: linkedin}
//     ]);
//     const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
//     const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
//     const getAllPostsForPlannerData = useSelector(state => state.post.getAllPostsForPlannerReducer);
//     const getPlannerPostCountReportData = useSelector(state => state.post.getPlannerPostCountReportReducer);
//     const getAllPlannerPostsData = useSelector(state => state.post.getAllPlannerPostReducer);


//     useEffect(() => {
//         document.title = isDraftPost ? 'Draft' : 'Planner';
//     }, []);


//     useEffect(() => {
//         if (calendarRef.current) {
//             const decodeJwt = decodeJwtToken(token);
//             const calendarApi = calendarRef.current.getApi();
//             const view = calendarApi.view;
//             const startDate = view.currentStart;
//             const endDate = view.currentEnd;

//             const requestBody = {
//                 token: token,
//                 query: {
//                     ...baseSearchQuery,
//                     customerId: decodeJwt.customerId,
//                     creationDateRange: {
//                         startDate: startDate,
//                         endDate: endDate
//                     }
//                 }
//             }

//             dispatch(getAllPostsForPlannerAction(requestBody));
//             dispatch(getPlannerPostCountAction(requestBody));
//         }
//     }, []);


//     useEffect(() => {
//         if (!getAllPostsForPlannerData.loading && getAllPostsForPlannerData?.data) {
//             setEvents(computeAndReturnPlannerEvent(getAllPostsForPlannerData?.data));
//         }
//     }, [getAllPostsForPlannerData]);


//     useEffect(() => {
//         if (getAllPlannerPostsData?.data) {
//             setPlannerPosts(Object.values(getAllPlannerPostsData?.data))
//         }
//     }, [getAllPlannerPostsData]);

//     const handleCreatePost = () => {
//         const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length > 0
//         const isAnyAccountConnected = getAllConnectedSocialAccountData?.data?.length > 0
//         if (isAnyPageConnected && isAnyAccountConnected) {
//             navigate("/planner/post")
//         } else {
//             setShowConnectAccountModal(true)
//         }
//     }


//     useEffect(() => {

//         if (Object.keys(baseSearchQuery).length > 0) {

//             if (isDraftPost) {
//                 dispatch(getAllSocialMediaPostsByCriteria({
//                     token: token,
//                     query: {postStatus: ["DRAFT"], plannerCardDate: baseSearchQuery?.plannerCardDate, period:"MONTH"}
//                 }));
//             } else {

//                 const decodeJwt = decodeJwtToken(token);
//                 const calendarApi = calendarRef.current.getApi();
//                 const view = calendarApi.view;
//                 const startDate = view.currentStart;
//                 const endDate = view.currentEnd;

//                 const requestBody = {
//                     token: token,
//                     query: {
//                         ...baseSearchQuery,
//                         customerId: decodeJwt.customerId,
//                         creationDateRange: {
//                             startDate: startDate,
//                             endDate: endDate
//                         }
//                     }
//                 }

//                 dispatch(getAllPostsForPlannerAction(requestBody));
//                 dispatch(getPlannerPostCountAction(requestBody));
//             }


//         }
//     }, [baseSearchQuery, isDraftPost]);


//     // render event content
//     const renderCalendarCards = ({event}) => {
//         const postOnSocialMedia = event?._def?.extendedProps?.childCardContent?.length > 0 ? event?._def?.extendedProps?.childCardContent[0] : null
//         return (
//             <div className={"cal_Div w-100 test"}
//                  style={{pointerEvents: isPostDatesOnSameDayOrInFuture(event?._def?.extendedProps?.postDate, new Date()) ? "" : "none"}}>

//                 <div className="w-100 p-0 calendar_card">
//                     {
//                         postOnSocialMedia !== null &&
//                         <div className={"custom_event mb-2"}
//                              onClick={(e) => {
//                              }}>
//                             <img  src={postOnSocialMedia?.imageUrl} alt={postOnSocialMedia.title}/>
//                             <h3>{postOnSocialMedia.title}</h3>
//                         </div>
//                     }


//                     {/*{event?._def?.extendedProps?.childCardContent?.map((c, index) => {*/}
//                     {/*    return (*/}

//                     {/*        <div key={index} className={index === 0 ? "custom_event mb-2" : "custom_event mb-2"}*/}
//                     {/*             onClick={(e) => {*/}
//                     {/*             }}>*/}
//                     {/*            <img className={"ms-4"} src={c?.imageUrl} alt={event.title}/>*/}
//                     {/*            /!*<h3>{c.title}</h3>*!/*/}
//                     {/*        </div>*/}
//                     {/*    )*/}
//                     {/*})}*/}
//                 </div>
//                 {
//                     !getAllPostsForPlannerData?.loading && !getPlannerPostCountReportData?.loading &&
//                     <button className="createPost_btn crate_btn cmn_btn_color w-100 ms-0 mt-2 mb-3 planner_view_more_btn"
//                             onClick={(e) => handleShowMorePostModal(event)}>
//                         {
//                             (event?._def?.extendedProps?.showMoreContent > 0) ?
//                                 "View " + event?._def?.extendedProps?.showMoreContent + " more" :
//                                 "View more"
//                         }
//                     </button>
//                 }
//             </div>)
//     }


//     const customDayHeaderContent = (args) => {
//         let days
        
//         if(window.innerWidth<=767){
//              days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
//         }else{
//              days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//         }
        
      
//         return days[args.date.getDay()];
//     };


//     const customHeaderClick = (eventType) => {
//         if (eventType === "Prev") {
//             calendarRef?.current?.getApi().prev();
//         } else if (eventType === "Next") {
//             calendarRef?.current?.getApi().next();
//         }
//         let inst = new Date(calendarRef?.current?.getApi()?.currentData?.viewTitle.toString());
//         inst.setDate(inst.getDate() + 10);

//         const decodeJwt = decodeJwtToken(token);

//         const calendarApi = calendarRef.current.getApi();
//         const view = calendarApi.view;
//         const startDate = view.currentStart;
//         const endDate = view.currentEnd;

//         setBaseSearchQuery({
//             ...baseSearchQuery,
//             customerId: decodeJwt.customerId,
//             creationDateRange: {
//                 startDate: startDate,
//                 endDate: endDate
//             },
//             plannerCardDate: inst
//         })
//     };

//     const handleDraft = (e) => {
//         setIsLoading(true);
//         setDraftPost(!isDraftPost);
//         setIsLoading(false);
//     }

//     const handleShowMorePostModal = (event) => {
//         const startDate = event.start;
//         const targetDate = dateFormat(startDate);

//         setEventDate(new Intl.DateTimeFormat('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         }).format(startDate));

//         const plannerPostList = {};
//         const batchIdList = [];

//         Object.keys(getAllPostsForPlannerData?.data)?.filter((key) => {
//             const datePart = key.substring(0, 10);
//             if (datePart === targetDate.substring(0, 10)) {
//                 plannerPostList.plannerPostData = getAllPostsForPlannerData.data[key]
//             }
//         })

//         Object.keys(plannerPostList.plannerPostData)?.map((batchId) => {
//             batchIdList.push(batchId);
//         })

//         setBatchIds(batchIdList);


//         dispatch(getAllPlannerPostAction({
//             token: token,
//             query: JSON.parse(JSON.stringify({
//                 postStatus: ["PUBLISHED", "SCHEDULED"],
//                 batchIds: batchIdList,
//                 plannerCardDate:targetDate,
//                 period:"DAY"
//             }))
//         }));

//         setShowMorePlannerModel(true);
//     };

//     return (
//         <>
//             <section>
//                 {/*<SideBar/>*/}
//                 <div className={sidebar? 'cmn_container':"cmn_Padding"}>
//                     <div className='cmn_outer'>
//                     <div className='planner_outer white_bg_color'>
//                         <div className='planner_header_outer'>
//                             <div className='planner_header'>
//                                 <h2>{isDraftPost ? jsondata.sidebarContent.draft : jsondata.sidebarContent.planner}</h2>
//                                 <h6>{isDraftPost ? "All of your saved draft posts are located here." : "Here you find all the upcoming Posts you scheduled."}</h6>
//                             </div>
//                             <div className='create_post_btn_Wrapper'>

//                                 <GenericButtonWithLoader
//                                     label={isDraftPost ? jsondata.backToPlanner : jsondata.draftPost}
//                                     className={"draft_btn create_post_btn cmn_white_text"}
//                                     isLoading={isLoading}
//                                     onClick={handleDraft}
//                                     isDisabled={false}
//                                 />
//                                 {
//                                     (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
//                                         <span className='cmn_btn_color create_post_btn cmn_white_text cursor-pointer'
//                                         ><Loader className='create-post-loader'/></span> :
//                                         <button onClick={handleCreatePost}
//                                               className='cmn_btn_color create_post_btn cmn_white_text cursor-pointer'
//                                         >{jsondata.createpost}</button>
//                                 }
//                             </div>
//                         </div>
//                         {
//                             isDraftPost === false && <div className='events_wrapper'>
//                                 <div className='row'>
//                                     {/* Loader */}
//                                     {(getPlannerPostCountReportData?.data && Object.keys(getPlannerPostCountReportData.data)) ? (<></>) : (<>
//                                         <div className='col-lg-4 col-md-6 col-sm-12'>
//                                             <div className='event_group'>
//                                                 <h2 className='cmn_text_heading'><Loader/></h2>
//                                                 <h5 className='cmn_small_heading'><SkeletonEffect
//                                                     count={1}></SkeletonEffect></h5>
//                                             </div>
//                                         </div>
//                                         <div className='col-lg-4 col-md-6 col-sm-12'>
//                                             <div className='event_group' style={{borderRight: "unset"}}>
//                                                 <h2 className='cmn_text_heading'><Loader/></h2>
//                                                 <h5 className='cmn_small_heading'><SkeletonEffect
//                                                     count={1}></SkeletonEffect></h5>
//                                             </div>
//                                         </div>
//                                         <div className='col-lg-4 col-md-6 col-sm-12'>
//                                             <div className='event_group'>
//                                                 <h2 className='cmn_text_heading'><Loader/></h2>
//                                                 <h5 className='cmn_small_heading'><SkeletonEffect
//                                                     count={1}></SkeletonEffect></h5>
//                                             </div>
//                                         </div>
//                                     </>)}
//                                     {/* Loader end */}
//                                     {getPlannerPostCountReportData?.data && Object.keys(getPlannerPostCountReportData.data).map((key, index) => {
//                                         return (
//                                             <div className='col-lg-4 col-md-6 col-sm-12' key={index}>

//                                                 <div className='event_group'
//                                                      style={{borderRight: index === 2 ? "unset" : ""}}>
//                                                     <h2 className='cmn_text_heading'>{getPlannerPostCountReportData.data[key]}</h2>
//                                                     <h5 className='cmn_small_heading'>{key}</h5>
//                                                 </div>

//                                             </div>
//                                         )
//                                     })}

//                                 </div>
//                             </div>
//                         }


//                         <div className='calender_outer_wrapper'>

//                             {
//                                 isDraftPost === false &&
//                                 <div className="custom-header">
//                                     <select className=" filter_options cmn_text_style box_shadow"
//                                             value={baseSearchQuery?.socialMediaType}
//                                             onChange={(e) => {
//                                                 const decodeJwt = decodeJwtToken(token);
//                                                 const calendarApi = calendarRef.current.getApi();
//                                                 const view = calendarApi.view;
//                                                 const startDate = view.currentStart;
//                                                 const endDate = view.currentEnd;
//                                                 setBaseSearchQuery({
//                                                     ...baseSearchQuery,
//                                                     customerId: decodeJwt.customerId,
//                                                     creationDateRange: {
//                                                         startDate: startDate,
//                                                         endDate: endDate
//                                                     },
//                                                     socialMediaType: e.target.value === "All" ? null : e.target.value
//                                                 });
//                                             }}>
//                                         <option value={"All"}>All</option>
//                                         {Object.keys(SocialAccountProvider).map((cur, index) => {
//                                             return (
//                                                 <option key={index} value={cur}
//                                                         disabled={getAllConnectedSocialAccountData?.data?.filter(c => c.provider === cur).length === 0}>{SocialAccountProvider[cur].charAt(0).toUpperCase() + SocialAccountProvider[cur].slice(1)}</option>)
//                                         })}
//                                     </select>


//                                 </div>
//                             }

//                             <div className={`${isDraftPost ? 'calendar-container hidden' : 'CalenderOuter_Wrapper'}`}>

//                                 <FullCalendar
//                                     ref={calendarRef}
//                                     plugins={[dayGridPlugin]}
//                                     initialView='dayGridMonth'
//                                     weekends={true}
//                                     events={events}
//                                     eventContent={renderCalendarCards}
//                                     dayHeaderContent={customDayHeaderContent}
//                                     dayCellClassNames={(arg) => {
//                                         if (arg?.isPast) {
//                                             return "calendar_card_disable";
//                                         }
//                                     }}
//                                     headerToolbar={(isDraftPost && (getAllConnectedSocialAccountData?.loading || getAllConnectedSocialAccountData?.data?.length === 0 || connectedPagesData?.loading || connectedPagesData?.facebookConnectedPages?.length === 0)) ?
//                                         {
//                                             left: '  ',
//                                             center: '',
//                                             right: '',
//                                         } : {
//                                             left: '  prev',
//                                             center: 'title',
//                                             right: 'next,timeGridDay,',
//                                         }}

//                                     customButtons={{
//                                         prev: {text: 'Custom Prev', click: () => customHeaderClick("Prev")},
//                                         next: {text: 'Custom Next', click: () => customHeaderClick("Next")},
//                                     }}

//                                     dayCellContent={(arg) => {
//                                         const cellDate = arg.date;
//                                         if (cellDate !== null) {
//                                             return <div className="calendar_card1">{arg?.dayNumberText}</div>;
//                                         }
//                                     }}

//                                 />


//                             </div>

//                             <div className={"hr-line"}></div>

//                         </div>

//                         {
//                             isDraftPost === true &&
//                             <ParentDraftComponent setDraftPost={setDraftPost} reference={"PLANNER"}/>
//                         }


//                         {
//                             showMorePlannerModel &&
//                             <CommonShowMorePlannerModel
//                                 commonShowMorePlannerModal={showMorePlannerModel}
//                                 setCommonShowMorePlannerModal={setShowMorePlannerModel}
//                                 plannerPosts={plannerPosts}
//                                 setPlannerPosts={setPlannerPosts}
//                                 eventDate={eventDate}
//                                 baseSearchQuery={baseSearchQuery}
//                             />
//                         }

//                     </div>
//                     </div>
//                 </div>
//             </section>
//             {
//                 showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
//                                                                       setShowModal={setShowConnectAccountModal}></ConnectSocialAccountModal>
//             }

//         </>
//     )
// }
// export default Planner;


// new design code starts here

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './Planner.css'
import SideBar from '../../sidebar/views/Layout'
import instagram_img from '../../../images/instagram.png'
import pinterest_icon from '../../../images/pinterest_icon.svg'
import facebook_icon from '../../../images/fb.svg'
import linkedin from '../../../images/linkedin.svg'
import jsondata from '../../../locales/data/initialdata.json'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {
    getAllSocialMediaPostsByCriteria,
    getAllPlannerPostAction,
    getAllPostsForPlannerAction,
    getPlannerPostCountAction,
} from "../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {
    isPostDatesOnSameDayOrInFuture,
    computeAndReturnPlannerEvent,
    dateFormat, computeStartEndDate,
    computeImageURL
} from "../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../utils/contantData";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {ParentDraftComponent} from "../../unPublishedPages/views/ParentDraftComponent";
import CommonShowMorePlannerModel from "../../common/components/CommonShowMorePlannerModal";
import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
import Loader from '../../loader/Loader'
import SkeletonEffect from '../../loader/skeletonEffect/SkletonEffect'
import { useAppContext } from '../../common/components/AppProvider'

const Planner = () => {
    const dispatch = useDispatch();
    const token = getToken();
    const navigate = useNavigate();
    const { sidebar } = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const calendarRef = useRef(null);
    const [baseSearchQuery, setBaseSearchQuery] = useState({postStatus: ["SCHEDULED", "PUBLISHED"]});
    const [isDraftPost, setDraftPost] = useState(false);
    const [showMorePlannerModel, setShowMorePlannerModel] = useState(false);
    const [plannerPosts, setPlannerPosts] = useState([]);
    const [eventDate, setEventDate] = useState(null);
    const [batchIds, setBatchIds] = useState([]);
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

    const [events, setEvents] = useState([
        {title: 'Instagram post', start: new Date().getTime(), imageUrl: instagram_img},
        {title: "Twitter", start: new Date().getTime(), imageUrl: linkedin}
    ]);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const getAllPostsForPlannerData = useSelector(state => state.post.getAllPostsForPlannerReducer);
    const getPlannerPostCountReportData = useSelector(state => state.post.getPlannerPostCountReportReducer);
   
    const getAllPlannerPostsData = useSelector(state => state.post.getAllPlannerPostReducer);


    useEffect(() => {
        document.title = isDraftPost ? 'Draft' : 'Planner';
    }, []);


    useEffect(() => {
        if (calendarRef.current) {
            const decodeJwt = decodeJwtToken(token);
            const calendarApi = calendarRef.current.getApi();
            const view = calendarApi.view;
            const startDate = view.currentStart;
            const endDate = view.currentEnd;

            const requestBody = {
                token: token,
                query: {
                    ...baseSearchQuery,
                    customerId: decodeJwt.customerId,
                    creationDateRange: {
                        startDate: startDate,
                        endDate: endDate
                    }
                }
            }

            dispatch(getAllPostsForPlannerAction(requestBody));
            dispatch(getPlannerPostCountAction(requestBody));
        }
    }, []);


    useEffect(() => {
        if (!getAllPostsForPlannerData.loading && getAllPostsForPlannerData?.data) {
            setEvents(computeAndReturnPlannerEvent(getAllPostsForPlannerData?.data));
        }
    }, [getAllPostsForPlannerData]);


    useEffect(() => {
        if (getAllPlannerPostsData?.data) {
            setPlannerPosts(Object.values(getAllPlannerPostsData?.data))
        }
    }, [getAllPlannerPostsData]);

    const handleCreatePost = () => {
        const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length > 0
        const isAnyAccountConnected = getAllConnectedSocialAccountData?.data?.length > 0
        if (isAnyPageConnected && isAnyAccountConnected) {
            navigate("/planner/post")
        } else {
            setShowConnectAccountModal(true)
        }
    }


    useEffect(() => {

        if (Object.keys(baseSearchQuery).length > 0) {

            if (isDraftPost) {
                dispatch(getAllSocialMediaPostsByCriteria({
                    token: token,
                    query: {postStatus: ["DRAFT"], plannerCardDate: baseSearchQuery?.plannerCardDate, period:"MONTH"}
                }));
            } else {

                const decodeJwt = decodeJwtToken(token);
                const calendarApi = calendarRef.current.getApi();
                const view = calendarApi.view;
                const startDate = view.currentStart;
                const endDate = view.currentEnd;

                const requestBody = {
                    token: token,
                    query: {
                        ...baseSearchQuery,
                        customerId: decodeJwt.customerId,
                        creationDateRange: {
                            startDate: startDate,
                            endDate: endDate
                        }
                    }
                }

                dispatch(getAllPostsForPlannerAction(requestBody));
                dispatch(getPlannerPostCountAction(requestBody));
            }


        }
    }, [baseSearchQuery, isDraftPost]);


    // render event content
    const renderCalendarCards = ({event}) => {
        const postOnSocialMedia = event?._def?.extendedProps?.childCardContent?.length > 0 ? event?._def?.extendedProps?.childCardContent[0] : null
        return (
            <div className={"cal_Div w-100 test"}
                 style={{pointerEvents: isPostDatesOnSameDayOrInFuture(event?._def?.extendedProps?.postDate, new Date()) ? "" : "none"}}>

                <div className="w-100 p-0 calendar_card">
                    
               {
                        postOnSocialMedia !== null &&
                        <div className={"custom_event"}
                             onClick={(e) => {
                             }}>
                            <img  src={postOnSocialMedia?.imageUrl} alt={postOnSocialMedia.title}/>
                            <h3 className='custom_event_heading'>{postOnSocialMedia.title}</h3>
                        </div>
                    }


                    {/*{event?._def?.extendedProps?.childCardContent?.map((c, index) => {*/}
                    {/*    return (*/}

                    {/*        <div key={index} className={index === 0 ? "custom_event mb-2" : "custom_event mb-2"}*/}
                    {/*             onClick={(e) => {*/}
                    {/*             }}>*/}
                    {/*            <img className={"ms-4"} src={c?.imageUrl} alt={event.title}/>*/}
                    {/*            /!*<h3>{c.title}</h3>*!/*/}
                    {/*        </div>*/}
                    {/*    )*/}
                    {/*})}*/}
                </div>
                {
                    !getAllPostsForPlannerData?.loading && !getPlannerPostCountReportData?.loading &&
                    <button className="createPost_btn crate_btn ms-0 p-0 w-100 planner_view_more_btn"
                            onClick={(e) => handleShowMorePostModal(event)}>
                                
                        {
                           
                            (event?._def?.extendedProps?.showMoreContent > 0) ?
                            "+" +event?._def?.extendedProps?.showMoreContent :
                                "View more"
                        }
                    </button>
                }
            </div>)
    }


    const customDayHeaderContent = (args) => {
        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
        return days[args.date.getDay()];
    };


    const customHeaderClick = (eventType) => {
        if (eventType === "Prev") {
            calendarRef?.current?.getApi().prev();
        } else if (eventType === "Next") {
            calendarRef?.current?.getApi().next();
        }
        let inst = new Date(calendarRef?.current?.getApi()?.currentData?.viewTitle.toString());
        inst.setDate(inst.getDate() + 10);

        const decodeJwt = decodeJwtToken(token);

        const calendarApi = calendarRef.current.getApi();
        const view = calendarApi.view;
        const startDate = view.currentStart;
        const endDate = view.currentEnd;

        setBaseSearchQuery({
            ...baseSearchQuery,
            customerId: decodeJwt.customerId,
            creationDateRange: {
                startDate: startDate,
                endDate: endDate
            },
            plannerCardDate: inst
        })
    };

    const handleDraft = (e) => {
        setIsLoading(true);
        setDraftPost(!isDraftPost);
        setIsLoading(false);
    }

    const handleShowMorePostModal = (event) => {
        const startDate = event.start;
        const targetDate = dateFormat(startDate);

        setEventDate(new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(startDate));

        const plannerPostList = {};
        const batchIdList = [];

        Object.keys(getAllPostsForPlannerData?.data)?.filter((key) => {
            const datePart = key.substring(0, 10);
            if (datePart === targetDate.substring(0, 10)) {
                plannerPostList.plannerPostData = getAllPostsForPlannerData.data[key]
            }
        })

        Object.keys(plannerPostList.plannerPostData)?.map((batchId) => {
            batchIdList.push(batchId);
        })

        setBatchIds(batchIdList);


        dispatch(getAllPlannerPostAction({
            token: token,
            query: JSON.parse(JSON.stringify({
                postStatus: ["PUBLISHED", "SCHEDULED"],
                batchIds: batchIdList,
                plannerCardDate:targetDate,
                period:"DAY"
            }))
        }));

        setShowMorePlannerModel(true);
    };


    const eventDidMount = (info) => {
        const eventElement = info.el;
        const cellElement = eventElement.closest('.fc-daygrid-day-frame');
        

      
        const eventStartDate = new Date(info.event.start);
        let backgroundColor;
        let border;
        if (eventStartDate.getDate() === 1 || eventStartDate.getDate() === 28 ||eventStartDate.getDate() === 21||eventStartDate.getDate() === 17 ||eventStartDate.getDate() === 13 ||eventStartDate.getDate() === 5 ||eventStartDate.getDate() === 9) {
            backgroundColor = '#fce5d6'; 
            border="4px solid #B94D09"
            
          } else if (eventStartDate.getDate() === 8 ||eventStartDate.getDate() === 30 || eventStartDate.getDate() === 25 ||eventStartDate.getDate() === 22 ||eventStartDate.getDate() === 18 ||eventStartDate.getDate() === 6 ||eventStartDate.getDate() === 14 || eventStartDate.getDate() === 26||eventStartDate.getDate() === 3) {
            backgroundColor = '#defcd6'; 
            border="4px solid #56B909"
          }
          else if (eventStartDate.getDate() === 27 ||eventStartDate.getDate() === 4 || eventStartDate.getDate() === 23||eventStartDate.getDate() === 19 ||eventStartDate.getDate() === 12 ||eventStartDate.getDate() === 15 || eventStartDate.getDate() === 10 || eventStartDate.getDate() === 31) {
            backgroundColor = '#e5e5e5'; 
            border="4px solid  #098FB9"
           
          }
          else if(eventStartDate.getDate() === 11 ||eventStartDate.getDate() === 29 || eventStartDate.getDate() === 24 ||eventStartDate.getDate() === 20 || eventStartDate.getDate() === 16 ||eventStartDate.getDate() === 2||eventStartDate.getDate() === 7){
          backgroundColor = '#fcd6d6'; 
          border="4px solid #B90909"
          }
         
        cellElement.style.backgroundColor = backgroundColor
        cellElement.style.borderLeft =border
      };

// new code
useEffect(() => {

    if (Object.keys(baseSearchQuery).length > 0) {

        if (isDraftPost) {
            dispatch(getAllSocialMediaPostsByCriteria({
                token: token,
                query: {postStatus: ["DRAFT"], plannerCardDate: baseSearchQuery?.plannerCardDate, period:"MONTH"}
            }));
        } else {

            const decodeJwt = decodeJwtToken(token);
            const calendarApi = calendarRef.current.getApi();
            const view = calendarApi.view;
            const startDate = view.currentStart;
            const endDate = view.currentEnd;

            const requestBody = {
                token: token,
                query: {
                    ...baseSearchQuery,
                    customerId: decodeJwt.customerId,
                    socialMediaTypes : baseSearchQuery?.socialMediaTypes || [],
                    creationDateRange: {
                        startDate: startDate,
                        endDate: endDate
                    }
                }
            }

            dispatch(getAllPostsForPlannerAction(requestBody));
            dispatch(getPlannerPostCountAction(requestBody));
        }


    }
}, [baseSearchQuery, isDraftPost]);

const handleSocialMediaFilters =(curKey)=>{
    if(curKey==="all"){
        setBaseSearchQuery((prevSearchQuery) => {
            const socialMediaTypes = baseSearchQuery.socialMediaTypes || [];
            return {
                ...prevSearchQuery,
                socialMediaTypes: Object.keys(SocialAccountProvider).every(type=> socialMediaTypes.includes(type)) ? [] : Object.keys(SocialAccountProvider)
            };
        });
    }else{
        setBaseSearchQuery((prevSearchQuery) => {
            const updatedSocialMediaTypes = prevSearchQuery.socialMediaTypes ? [...prevSearchQuery.socialMediaTypes] : [];

            if (updatedSocialMediaTypes.includes(curKey)) {
                // Remove curKey if it exists
                const index = updatedSocialMediaTypes.indexOf(curKey);
                updatedSocialMediaTypes.splice(index, 1);
            } else {
                updatedSocialMediaTypes.push(curKey);
            }

            return {
                ...prevSearchQuery,
                socialMediaTypes: updatedSocialMediaTypes
            };
        });
    }

}
    return (
        <>
            <section>
                {/*<SideBar/>*/}
                <div className={sidebar? 'cmn_container':"cmn_Padding"}>
                    <div className='cmn_outer'>
                    <div className='planner_outer white_bg_color'>
                        <div className='planner_header_outer'>
                            <div className='planner_header'>
                                <h2>{isDraftPost ? jsondata.sidebarContent.draft : jsondata.sidebarContent.planner}</h2>
                                <h6>{isDraftPost ? "All of your saved draft posts are located here." : "Here you find all the upcoming Posts you scheduled."}</h6>
                            </div>
                           
                        </div>
                        


                        <div className='calender_outer_wrapper'>

                            {/* {
                                isDraftPost === false &&
                                <div className="custom-header">
                                    <select className=" filter_options cmn_text_style box_shadow"
                                            value={baseSearchQuery?.socialMediaType}
                                            onChange={(e) => {
                                                const decodeJwt = decodeJwtToken(token);
                                                const calendarApi = calendarRef.current.getApi();
                                                const view = calendarApi.view;
                                                const startDate = view.currentStart;
                                                const endDate = view.currentEnd;
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    customerId: decodeJwt.customerId,
                                                    creationDateRange: {
                                                        startDate: startDate,
                                                        endDate: endDate
                                                    },
                                                    socialMediaType: e.target.value === "All" ? null : e.target.value
                                                });
                                            }}>
                                        <option value={"All"}>All</option>
                                        {Object.keys(SocialAccountProvider).map((cur, index) => {
                                            return (
                                                <option key={index} value={cur}
                                                        disabled={getAllConnectedSocialAccountData?.data?.filter(c => c.provider === cur).length === 0}>{SocialAccountProvider[cur].charAt(0).toUpperCase() + SocialAccountProvider[cur].slice(1)}</option>)
                                        })}
                                    </select>


                                </div>
                            } */}
                            {/* new code planner */}
                            <div className="row mt-5">
                  <div className="col-lg-9 col-md-12 col-sm-12">
                    <div
                      className={`${
                        isDraftPost
                          ? "calendar-container hidden"
                          : "CalenderOuter_Wrapper"
                      }`}
                    >
                      <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        weekends={true}
                        events={events}
                        eventContent={renderCalendarCards}
                        dayHeaderContent={customDayHeaderContent}
                        eventDidMount={eventDidMount}
                        dayCellClassNames={(arg) => {
                          if (arg?.isPast) {
                            return "calendar_card_disable";
                          }
                        }}
                        headerToolbar={
                          isDraftPost &&
                          (getAllConnectedSocialAccountData?.loading ||
                            getAllConnectedSocialAccountData?.data?.length ===
                              0 ||
                            connectedPagesData?.loading ||
                            connectedPagesData?.facebookConnectedPages
                              ?.length === 0)
                            ? {
                                left: "  ",
                                center: "",
                                right: "",
                              }
                            : {
                                left: "  prev",
                                center: "title",
                                right: "next,timeGridDay,",
                              }
                        }
                        customButtons={{
                          prev: {
                            text: "Custom Prev",
                            click: () => customHeaderClick("Prev"),
                          },
                          next: {
                            text: "Custom Next",
                            click: () => customHeaderClick("Next"),
                          },
                        }}
                        dayCellContent={(arg) => {
                          const cellDate = arg.date;
                          if (cellDate !== null) {
                            return (
                              <div className="calendar_card1">
                                {arg?.dayNumberText}
                              </div>
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12 col-sm-12">
                    <div className={`${
                        isDraftPost
                          ? " d-none"
                          : "planner_create_post_container"
                      }`}>
                    <div className="planner_create_post">
                      <h3 className="planner_create_post_heading">Create a post </h3>
                      <p>
                      Share your story and inspire others.
                      </p>
                      <div className="create_post_btn_Wrapper mt-3">
                        <GenericButtonWithLoader
                          label={
                            isDraftPost
                              ? jsondata.backToPlanner
                              : jsondata.draftPost
                          }
                          className={"draft_btn  cmn_white_text"}
                          isLoading={isLoading}
                          onClick={handleDraft}
                          isDisabled={false}
                        />
                        {getAllConnectedSocialAccountData?.loading ||
                        connectedPagesData?.loading ? (
                          <span className=" create_post_btn cmn_white_text cursor-pointer">
                            <Loader className="create-post-loader" />
                          </span>
                        ) : (
                          <button
                            onClick={handleCreatePost}
                            className="cmn_btn_color create_post_btn cmn_white_text cursor-pointer"
                          >
                            {jsondata.createpost}
                          </button>
                        )}
                      </div>

                    </div>
                      <div className="planner_post_track_outer">
                        <h3 className="planner_create_post_heading pb-2">Post Track</h3>
                         {isDraftPost === false && <ul className="schdeuled_post_list">
        
                        {(getPlannerPostCountReportData?.data && Object.keys(getPlannerPostCountReportData.data)) ? (<></>) : (<>
                                        
                            <li>
                                <h4><SkeletonEffect count={1}></SkeletonEffect></h4>
                                <h3><Loader/></h3></li>
                                <li>
                                <h4><SkeletonEffect count={1}></SkeletonEffect></h4>
                                <h3><Loader/></h3></li>
                                <li>
                                <h4><SkeletonEffect count={1}></SkeletonEffect></h4>
                                <h3><Loader/></h3></li>
                                        
                                    </>)}
                        {getPlannerPostCountReportData?.data && Object.keys(getPlannerPostCountReportData.data).map((key, index) => {
                                     
                                return (
                                <li key={index}>
                                <h4>{key}</h4>
                                <h3>{getPlannerPostCountReportData.data[key]}</h3> </li>
                                     )
                                 })}
                               
                        </ul>}
                      </div>

                      {/* <div className="planner_post_track_outer">
                        <h3 className="planner_create_post_heading pb-2">Posted On</h3>
                        <ul className="schdeuled_post_list post_outer_list">
                        <li>
                                <div className="d-flex gap-2 align-items-center ">
                                <img src={facebook_icon} height="20px" width="20px"/>
                                <h4>
                                Facebook
                                </h4>

                                </div>
                                <input type="checkbox"/>
                         </li>
                         <li>
                                <div className="d-flex gap-2 align-items-center ">
                                <img src={pinterest_icon} height="20px" width="20px"/>
                                <h4>
                                Pinterest
                                </h4>

                                </div>
                                <input type="checkbox"/>
                          </li>
                         <li>
                                <div className="d-flex gap-2 align-items-center">
                                <img src={linkedin}  height="20px" width="20px"/>
                                <h4>
                                linkedin  </h4>
                                </div>
                                <input type="checkbox"/>
                        </li>
                        <li>
                                <div className="d-flex gap-2 align-items-center">
                                <img src={instagram_img}  height="20px" width="20px"/>
                                <h4>
                               Instagram </h4>
                                </div>
                                <input type="checkbox"/>
                        </li>
                        </ul>
                      </div> */}
                                       <div className="planner_post_track_outer">
                          <div className={"d-flex"}>
                              <h3 className="planner_create_post_heading pb-2 flex-grow-1">Social Media</h3>
                              <span className={"mr-4 mt-2"}><input type={"checkbox"}
                                           checked={Array.isArray(baseSearchQuery.socialMediaTypes) ? Object.keys(SocialAccountProvider).every(type => baseSearchQuery.socialMediaTypes.includes(type)) : false}
                                           onClick={(e) => handleSocialMediaFilters("all")}/></span>

                          </div>

                          <ul className="schdeuled_post_list post_outer_list">

                              {Object.keys(SocialAccountProvider).map(curKey => {
                               
                                  return (
                                      <li>
                                          <div className="d-flex gap-2 align-items-center ">
                                              <img src={computeImageURL(curKey)} height="20px" width="20px"/>
                                            <h4>{SocialAccountProvider[curKey]}</h4>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={baseSearchQuery.socialMediaTypes && baseSearchQuery.socialMediaTypes.includes(curKey)}
                                            value={curKey}
                                            onChange={(e) =>handleSocialMediaFilters(curKey)}
                                        />


                                    </li>
                                )
                            })}

                        </ul>
                      </div>
                      </div>
                  </div>
                </div>
                           

                         

                        </div>

                        {
                            isDraftPost === true &&
                            <ParentDraftComponent setDraftPost={setDraftPost} reference={"PLANNER"}/>
                        }


                        {
                            showMorePlannerModel &&
                            <CommonShowMorePlannerModel
                                commonShowMorePlannerModal={showMorePlannerModel}
                                setCommonShowMorePlannerModal={setShowMorePlannerModel}
                                plannerPosts={plannerPosts}
                                setPlannerPosts={setPlannerPosts}
                                eventDate={eventDate}
                                baseSearchQuery={baseSearchQuery}
                            />
                        }

                    </div>
                    </div>
                </div>
            </section>
            {
                showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
                                                                      setShowModal={setShowConnectAccountModal}></ConnectSocialAccountModal>
            }

        </>
    )
}
export default Planner;
