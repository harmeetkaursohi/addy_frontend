import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './Planner.css'
import SideBar from '../../sidebar/views/Layout'
import instagram_img from '../../../images/instagram.png'
import linkedin from '../../../images/linkedin.svg'
import jsondata from '../../../locales/data/initialdata.json'
import {Link} from "react-router-dom";
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
    dateFormat, computeStartEndDate
} from "../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../utils/contantData";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {ParentDraftComponent} from "../../unPublishedPages/views/ParentDraftComponent";
import CommonShowMorePlannerModel from "../../common/components/CommonShowMorePlannerModal";

const Planner = () => {
    const dispatch = useDispatch();
    const token = getToken();

    const [isLoading, setIsLoading] = useState(false);
    const calendarRef = useRef(null);
    const [baseSearchQuery, setBaseSearchQuery] = useState({postStatus: ["SCHEDULED", "PUBLISHED"]});
    const [isDraftPost, setDraftPost] = useState(false);
    const [showMorePlannerModel, setShowMorePlannerModel] = useState(false);
    const [plannerPosts, setPlannerPosts] = useState([]);
    const [eventDate, setEventDate] = useState(null);
    const [batchIds, setBatchIds] = useState([]);

    const [events, setEvents] = useState([
        {title: 'Instagram post', start: new Date().getTime(), imageUrl: instagram_img},
        {title: "Twitter", start: new Date().getTime(), imageUrl: linkedin}
    ]);

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




    useEffect(() => {

        if (Object.keys(baseSearchQuery).length > 0) {

            if (isDraftPost) {
                dispatch(getAllSocialMediaPostsByCriteria({
                    token: token,
                    query: {postStatus: ["DRAFT"], plannerCardDate: baseSearchQuery?.plannerCardDate, limit: 1000}
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
        return (
            <div className={"cal_Div w-100 test"}
                 style={{pointerEvents: isPostDatesOnSameDayOrInFuture(event?._def?.extendedProps?.postDate, new Date()) ? "" : "none"}}>

                <div className="w-100 p-0 calendar_card">

                    {event?._def?.extendedProps?.childCardContent?.map((c, index) => {
                        return (
                            <div key={index} className={index === 0 ? "custom_event mb-2" : "custom_event mb-2"}
                                 onClick={(e) => {
                                 }}>
                                <img className={"ms-4"} src={c?.imageUrl} alt={event.title}/>
                                <h3>{c.title}</h3>
                            </div>
                        )
                    })}
                </div>
                {/*{event?._def?.extendedProps?.showMoreContent > 0 &&*/}
                <button className="createPost_btn crate_btn cmn_btn_color w-100 ms-0 mt-2 mb-3"
                        onClick={(e) => handleShowMorePostModal(event)}
                >
                    {
                        event?._def?.extendedProps?.showMoreContent > 0 ?
                            "View " + event?._def?.extendedProps?.showMoreContent + " more" :
                            "View more"
                    }

                </button>
                {/*}*/}
            </div>)
    }


    const customDayHeaderContent = (args) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
            token: token, query: JSON.parse(JSON.stringify({postStatus: ["PUBLISHED","SCHEDULED"], batchIds: batchIdList,creationDateRange:{startDate:computeStartEndDate(startDate,'T00:01:00.000Z'),endDate:computeStartEndDate(startDate,'T23:59:59.000Z')}}))
        }));

        setShowMorePlannerModel(true);
    };

    return (
        <>
            <section>
                <SideBar/>
                <div className='cmn_container'>
                    <div className='planner_outer'>
                        <div className='planner_header_outer'>
                            <div className='planner_header'>
                                <h2>{isDraftPost ? jsondata.sidebarContent.draft : jsondata.sidebarContent.planner}</h2>
                                <h6>Here you find all the upcoming Posts you scheduled.</h6>
                            </div>
                            <div>
                                <GenericButtonWithLoader
                                    label={isDraftPost ? jsondata.backToPlanner : jsondata.draftPost}
                                    className={"draft_btn create_post_btn cmn_white_text"}
                                    isLoading={isLoading}
                                    onClick={handleDraft}
                                    isDisabled={false}
                                />

                                <Link className='cmn_btn_color create_post_btn cmn_white_text'
                                      to="/planner/post">{jsondata.createpost}</Link>
                            </div>
                        </div>
                        {
                            isDraftPost === false && <div className='events_wrapper'>
                                <div className='row'>

                                    {getPlannerPostCountReportData?.data && Object.keys(getPlannerPostCountReportData.data).map((key, index) => {

                                        return (
                                            <div className='col-lg-4 col-md-6 col-sm-12' key={index}>

                                                <div className='event_group'
                                                     style={{borderRight: index === 2 ? "unset" : ""}}>
                                                    <h2 className='cmn_text_heading'>{getPlannerPostCountReportData.data[key]}</h2>
                                                    <h5 className='cmn_small_heading'>{key}</h5>
                                                </div>

                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        }


                        <div className='calender_outer_wrapper'>

                            {
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
                                                <option key={index} value={cur}>{SocialAccountProvider[cur]}</option>)
                                        })}
                                    </select>


                                </div>
                            }

                            <div className={`${isDraftPost ? 'calendar-container hidden' : ''}`}>

                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin]}
                                    initialView='dayGridMonth'
                                    weekends={true}
                                    events={events}
                                    eventContent={renderCalendarCards}
                                    dayHeaderContent={customDayHeaderContent}
                                    dayCellClassNames={(arg) => {
                                        if (arg?.isPast) {
                                            return "calendar_card_disable";
                                        }
                                    }}
                                    headerToolbar={{
                                        left: '  prev',
                                        center: 'title',
                                        right: 'next,timeGridDay,',
                                    }}

                                    customButtons={{
                                        prev: {text: 'Custom Prev', click: () => customHeaderClick("Prev")},
                                        next: {text: 'Custom Next', click: () => customHeaderClick("Next")},
                                    }}

                                    dayCellContent={(arg) => {
                                        const cellDate = arg.date;
                                        if (cellDate !== null) {
                                            return <div className="calendar_card1">{arg?.dayNumberText}</div>;
                                        }
                                    }}

                                />


                            < /div>

                            <div className={"hr-line"}></div>

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
            </section>

        </>
    )
}
export default Planner;