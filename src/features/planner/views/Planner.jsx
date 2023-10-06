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
    getAllPostsForPlannerAction,
    getPlannerPostCountAction
} from "../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {computeAndReturnPlannerEvent} from "../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../utils/contantData";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import DraftComponent from "../../draftPage/views/DraftComponent";

const Planner = () => {
    const dispatch = useDispatch();
    const token = getToken();

    const [isLoading, setIsLoading] = useState(false);
    const calendarRef = useRef(null);
    const [baseSearchQuery, setBaseSearchQuery] = useState({});
    const [isDraftPost, setDraftPost] = useState(false);

    const [events, setEvents] = useState([
        {title: 'Instagram post', start: new Date(), imageUrl: instagram_img},
        {title: "Twitter", start: new Date(), imageUrl: linkedin}]);

    const getAllPostsForPlannerData = useSelector(state => state.post.getAllPostsForPlannerReducer);
    const getPlannerPostCountReportData = useSelector(state => state.post.getPlannerPostCountReportReducer);


    useEffect(() => {
        document.title = isDraftPost ? 'Draft' : 'Planner';
    }, []);


    useEffect(() => {
        const decodeJwt = decodeJwtToken(token);
        dispatch(getAllPostsForPlannerAction({customerId: decodeJwt.customerId, token: token, query: baseSearchQuery}));
        dispatch(getPlannerPostCountAction({customerId: decodeJwt.customerId, token: token, query: baseSearchQuery}));

    }, []);


    useEffect(() => {
        if (!getAllPostsForPlannerData.loading && getAllPostsForPlannerData?.data) {
            setEvents(computeAndReturnPlannerEvent(getAllPostsForPlannerData?.data));
        }
    }, [getAllPostsForPlannerData]);


    // render event content
    const renderCalendarCards = ({event}) => {
        return (
            <div className={"cal_Div w-100 test"}
                 style={{pointerEvents: event?._def?.extendedProps?.postDate < new Date() ? "none" : ""}}>

                <div className="w-100 p-0 calendar_card">

                    {event?._def?.extendedProps?.childCardContent?.map((c, index) => {
                        return (
                            <div key={index} className={index === 0 ? "custom_event mb-2" : "custom_event mb-2"}
                                 onClick={() => {
                                     console.log("handle singlr click if needed----->")
                                 }}>
                                <img className={"ms-4"} src={c?.imageUrl} alt={event.title}/>
                                <h3>{c.title}</h3>
                            </div>
                        )
                    })}
                </div>
                {event?._def?.extendedProps?.showMoreContent > 0 && <button
                    className={"createPost_btn crate_btn cmn_btn_color w-100 ms-0 mt-2 mb-3"}>{"View " + event?._def?.extendedProps?.showMoreContent + " more"}</button>}
            </div>)
    }


    const customDayHeaderContent = (args) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[args.date.getDay()];
    };


    useEffect(() => {
        if (Object.keys(baseSearchQuery).length > 0) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllPostsForPlannerAction({
                customerId: decodeJwt.customerId,
                token: token,
                query: baseSearchQuery
            }));

            dispatch(getPlannerPostCountAction({
                customerId: decodeJwt.customerId,
                token: token,
                query: baseSearchQuery
            }));


        }
    }, [baseSearchQuery]);


    const customHeaderClick = (eventType) => {
        if (eventType === "Prev") {
            calendarRef?.current?.getApi().prev();
        } else if (eventType === "Next") {
            calendarRef?.current?.getApi().next();
        }
        let inst = new Date(calendarRef?.current?.getApi()?.currentData?.viewTitle.toString());
        inst.setDate(inst.getDate() + 10);
        setBaseSearchQuery({...baseSearchQuery, plannerCardDate: inst})

    };

    const handleDraft = (e) => {
        setIsLoading(true);
        setDraftPost(!isDraftPost);
        setIsLoading(false);
    }

    console.log("isDraft", isDraftPost)

    function eventAddStyle(arg) {
        if (arg.event.extendedProps.demanding) {
            console.log("if eventAddStyle")
            return ['maxLevel']; //maxLevel and lowLevel are two CSS classes defined in a .css file
        } else {
            console.log("else eventAddStyle")
            return ['lowLevel'];
        }
    }

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
                                />

                                <Link className='cmn_btn_color create_post_btn cmn_white_text'
                                      to="/post">{jsondata.createpost}</Link>
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
                        {/* select option */}

                        <div className='calender_outer_wrapper'>

                            {
                                isDraftPost === false &&
                                <div className="custom-header">
                                    <select className=" filter_options cmn_text_style box_shadow"
                                            value={baseSearchQuery?.socialAccountType}
                                            onChange={(e) => {
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    socialAccountType: e.target.value === "All" ? null : e.target.value
                                                });
                                            }}>
                                        <option value={"All"}>All</option>
                                        {Object.keys(SocialAccountProvider).map((cur) => {
                                            return (<option value={cur}>{SocialAccountProvider[cur]}</option>)
                                        })}
                                    </select>


                                </div>
                            }

                            <div className={`${isDraftPost ? 'calendar-container hidden' : ''}`}>

                                <FullCalendar
                                    // height={}
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
                                            return <div c>{arg?.dayNumberText}</div>
                                        }
                                    }}
                                />


                            < /div>

                            <div className={"hr-line"}></div>

                        </div>

                        {
                            isDraftPost === true &&
                            <div className={"draft-post-list-outer row m-0"}>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                                <div className="col-lg-6">
                                    <DraftComponent/>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </section>
        </>
    )
}
export default Planner