import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './Planner.css'
import instagram_img from '../../../images/instagram_logo.svg'
import linkedin from '../../../images/linkedin.svg'
import jsondata from '../../../locales/data/initialdata.json'
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {
    computeAndReturnPlannerEvent,
    computeImageURL,
    extractPostPages,
    extractPostPagesDataFromData,
    isNullOrEmpty
} from "../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../utils/contantData";
import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
import SkeletonEffect from '../../loader/skeletonEffect/SkletonEffect'
import {useAppContext} from '../../common/components/AppProvider'
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {
    useGetPlannerPostsCountQuery,
    useGetPostsForPlannerQuery,
} from "../../../app/apis/postApi";
import Dropdown from 'react-bootstrap/Dropdown';
import {CgChevronDown} from "react-icons/cg";
import ScheduledPost from './ScheduledPost';
import {getDayStartInUTC} from "../../../utils/dateUtils";
import "../../common/components/CommonShowMorePlannerModal.css"


const Planner = () => {

    const {sidebar} = useAppContext();
    const token = getToken();
    const decodeJwt = decodeJwtToken(token);
    const navigate = useNavigate();
    const calendarRef = useRef(null);

    const [baseSearchQuery, setBaseSearchQuery] = useState({
        postStatus: ["SCHEDULED", "PUBLISHED"],
        socialMediaTypes: Object.keys(SocialAccountProvider)
    });
    const [isPostApiLoading, setIsPostApiLoading] = useState(false)
    // const [selectedDate, setSelectedDate] = useState(getDayStartInUTCFor(new Date()));
    const [selectedDate, setSelectedDate] = useState(null);
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

    const [events, setEvents] = useState([
        {title: 'Instagram post', start: new Date().getTime(), imageUrl: instagram_img},
        {title: "Twitter", start: new Date().getTime(), imageUrl: linkedin}
    ]);

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("");
    const socialMediaConnected = getConnectedSocialAccountApi?.data?.map(cur => cur?.provider);
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const calendarApi = calendarRef?.current?.getApi();
    const view = calendarApi?.view;
    const startDate = view?.currentStart;
    const endDate = view?.currentEnd;

    const getPostsForPlannerApi = useGetPostsForPlannerQuery({
        ...baseSearchQuery,
        customerId: decodeJwt.customerId,
        plannerCardDate: baseSearchQuery.plannerCardDate ? baseSearchQuery.plannerCardDate.toISOString() : null,
        creationDateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
        }
    }, {skip: isNullOrEmpty(calendarRef) || isNullOrEmpty(baseSearchQuery) || isNullOrEmpty(startDate) || isNullOrEmpty(endDate)})

    const getPlannerPostsCountApi = useGetPlannerPostsCountQuery({
        ...baseSearchQuery,
        customerId: decodeJwt.customerId,
        plannerCardDate: baseSearchQuery.plannerCardDate ? baseSearchQuery.plannerCardDate.toISOString() : null,
        creationDateRange: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
        }
    }, {skip: isNullOrEmpty(calendarRef) || isNullOrEmpty(baseSearchQuery) || isNullOrEmpty(startDate) || isNullOrEmpty(endDate)})

    useEffect(() => {
        document.title = 'Planner'
    }, []);

    useEffect(() => {
        if (calendarRef?.current) {
            // Re-render the component once calenderRef is set so that Apis will be hit with selected calendar time
            setBaseSearchQuery({
                ...baseSearchQuery
            })
        }
    }, []);

    useEffect(() => {
        if (!getPostsForPlannerApi.isLoading && !getPostsForPlannerApi?.isFetching && getPostsForPlannerApi?.data) {
            setEvents(computeAndReturnPlannerEvent(getPostsForPlannerApi?.data));
        }
    }, [getPostsForPlannerApi]);

    const handleCreatePost = () => {
        if (getConnectedSocialAccountApi?.data?.length === 0) return
        const isAnyPageConnected = getAllConnectedPagesApi?.data?.length > 0
        const isAnyAccountConnected = getConnectedSocialAccountApi?.data?.length > 0
        if (isAnyPageConnected && isAnyAccountConnected) {
            navigate("/planner/post")
        } else {
            setShowConnectAccountModal(true)
        }
    }

    // render event content
    const renderCalendarCards = ({event}) => {

        // const eventStartDate = event?._def?.extendedProps?.postDate
        // const dateString = eventStartDate;
        // const date = new Date(dateString);
        // const dayOfMonth = date.getDate();


        let classname = event?._def?.extendedProps?.batchId
        // const postOnSocialMedia = event?._def?.extendedProps?.childCardContent?.length > 0 ? event?._def?.extendedProps?.childCardContent[0] : null
        const postedOnPages = extractPostPages(extractPostPagesDataFromData(getPostsForPlannerApi?.data, event?._def?.extendedProps?.postDate))


        return (
            <div className={`cal_Div w-100 test`}>


                <div className="w-100 p-0 calendar_card">

                    {
                        !isNullOrEmpty(postedOnPages) &&
                        postedOnPages?.slice(0, 3).map((page, index) => (
                        <div className="custom_event" key={index}>
                            <img
                                src={computeImageURL(page?.socialMediaType)}
                                alt={page?.socialMediaType}
                            />
                            <h3 className={`custom_event_heading ${classname}`}>
                                {page?.pageName}
                            </h3>
                        </div>
                    ))
                    }
                </div>
                {
                    !isNullOrEmpty(postedOnPages) && postedOnPages?.length > 3 &&
                    <button
                        className={`createPost_btn crate_btn ms-0  w-100 planner_view_more_btn `}
                    >
                        {
                            "And " + (postedOnPages?.length - 3) + " more..."
                        }
                    </button>
                }
                {/*{*/}
                {/*    !getPostsForPlannerApi?.isLoading && !getPostsForPlannerApi?.isFetching && !getPlannerPostsCountApi?.isLoading && !getPlannerPostsCountApi?.isFetching &&*/}
                {/*    <button*/}
                {/*        className={`createPost_btn crate_btn ms-0  w-100 planner_view_more_btn ${(event?._def?.extendedProps?.showMoreContent === 0) && "d-none"}`}*/}
                {/*    >{*/}
                {/*        (event?._def?.extendedProps?.showMoreContent > 0) &&*/}
                {/*        "And " + event?._def?.extendedProps?.showMoreContent + " more..."*/}
                {/*    }*/}
                {/*    </button>*/}
                {/*}*/}
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
        const [monthName, year] = calendarRef?.current?.getApi()?.currentData?.viewTitle.toString().split(" ");
        const date = new Date(`${monthName} 1, ${year} 00:00:00`);
        setSelectedDate(getDayStartInUTC(date.getDate(), date.getMonth(), date.getFullYear()));

        date.setDate(date.getDate() + 10);

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
            plannerCardDate: date
        })

    };

    const handleSocialMediaFilters = (curKey) => {

        if (curKey === "all") {
            setBaseSearchQuery((prevSearchQuery) => {
                const socialMediaTypes = baseSearchQuery.socialMediaTypes || [];
                return {
                    ...prevSearchQuery,
                    socialMediaTypes: Object.keys(SocialAccountProvider).every(type => socialMediaTypes.includes(type)) ? [] : Object.keys(SocialAccountProvider)
                };
            });
        } else {
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
                <div className={sidebar ? 'cmn_container' : "cmn_Padding"}>
                    <div className='cmn_outer'>
                        <div className='planner_header_outer mb-3 align-items-center gap-2'>
                            <div className='planner_header flex-grow-1'>
                                <h2>{jsondata.sidebarContent.planner}</h2>
                                <h6>{jsondata.post_shecdule_heading}</h6>
                            </div>
                            <button
                                disabled={getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching}
                                onClick={handleCreatePost}
                                className={`cmn_btn_color create_post_btn cmn_white_text ${getConnectedSocialAccountApi?.data?.length === 0 && "not_connected"}`}
                            >
                                {jsondata.createpost}
                            </button>

                        </div>
                        <div className="planner_post_track_outer">
                            <ul className="schdeuled_post_list">
                                {
                                    (getPlannerPostsCountApi?.isLoading || getPlannerPostsCountApi?.isFetching) &&
                                    <>
                                        <li>
                                            <h4><SkeletonEffect count={1} className={"w-25 m-auto "}/></h4>
                                            <h3><SkeletonEffect count={1} className={"w-75 m-auto mt-2"}/></h3>
                                        </li>
                                        <li>
                                            <h4><SkeletonEffect count={1} className={"w-25 m-auto"}/></h4>
                                            <h3><SkeletonEffect count={1} className={"w-75 m-auto mt-2"}/></h3>
                                        </li>
                                        <li>
                                            <h4><SkeletonEffect count={1} className={"w-25 m-auto"}/></h4>
                                            <h3><SkeletonEffect count={1} className={"w-75 m-auto mt-2"}/></h3>
                                        </li>
                                    </>

                                }

                                {
                                    !getPlannerPostsCountApi?.isLoading && !getPlannerPostsCountApi?.isFetching && getPlannerPostsCountApi?.data && Object.keys(getPlannerPostsCountApi.data).map((key, index) => {
                                        return (
                                            <li key={index}>
                                                <div className='planner_info'>
                                                    <h4>{getPlannerPostsCountApi.data[key]}</h4>
                                                    <h3>{key}</h3>
                                                </div>
                                            </li>
                                        )
                                    })
                                }

                            </ul>
                        </div>

                        <div
                            className={`planner_outer   cmn_height_outer planner_container`}>


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
                                                        disabled={getConnectedSocialAccountApi?.data?.filter(c => c.provider === cur).length === 0}>{SocialAccountProvider[cur].charAt(0).toUpperCase() + SocialAccountProvider[cur].slice(1)}</option>)
                                        })}
                                    </select>


                                </div>
                            } */}
                                {/* new code planner */}


                                <div
                                    className={`CalenderOuter_Wrapper`}>
                                    <div className={`planner_calender w-100 ${selectedDate && "select_wrapper"}`}>
                                        <Dropdown className='cmn_dropdown'>
                                            <Dropdown.Toggle>
                                                Filters <CgChevronDown/>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <li>
                                                    <h4>Select All</h4>
                                                    <input className="privacy-policy-checkbox"
                                                           type={"checkbox"}
                                                           checked={Array.isArray(baseSearchQuery.socialMediaTypes) ? Object.keys(SocialAccountProvider).every(type => baseSearchQuery.socialMediaTypes.includes(type)) : false}
                                                           onChange={(e) => handleSocialMediaFilters("all")}/>
                                                </li>
                                                {
                                                    Object.keys(SocialAccountProvider).map((curKey, ind) => {

                                                            return (
                                                                <li key={ind}
                                                                    className={socialMediaConnected?.includes(curKey) ? "" : "d-none"}>
                                                                    <div className="d-flex gap-2 align-items-center ">
                                                                        <img src={computeImageURL(curKey)} height="20px"
                                                                             width="20px"/>
                                                                        <h4>{SocialAccountProvider[curKey]}</h4>
                                                                    </div>
                                                                    <input
                                                                        className="privacy-policy-checkbox"
                                                                        type="checkbox"
                                                                        checked={baseSearchQuery.socialMediaTypes && baseSearchQuery.socialMediaTypes.includes(curKey)}
                                                                        value={curKey}
                                                                        onChange={(e) => handleSocialMediaFilters(curKey)}
                                                                    />


                                                                </li>
                                                            )
                                                        }
                                                    )
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <FullCalendar
                                            dateClick={(arg) => {
                                                if (isPostApiLoading) return
                                                const localDate = new Date(arg.date);
                                                setSelectedDate(getDayStartInUTC(localDate.getDate(), localDate.getMonth(), localDate.getFullYear()));
                                            }}
                                            ref={calendarRef}
                                            plugins={[dayGridPlugin, interactionPlugin]}
                                            initialView="dayGridMonth"
                                            weekends={true}
                                            events={events}
                                            eventContent={renderCalendarCards}
                                            dayHeaderContent={customDayHeaderContent}
                                            dayCellClassNames={(arg) => {
                                                const cellDate = new Date(arg.date);
                                                const hasEvent = events.some(event => new Date(event.start).toDateString() === cellDate.toDateString());
                                                const isSelected = selectedDate && cellDate.toDateString() === new Date(selectedDate).toDateString();

                                                return [
                                                    hasEvent && 'event-date-cell',
                                                    isSelected && 'selected-date-cell'
                                                ].filter(Boolean).join(' ');
                                            }}
                                            headerToolbar={
                                                {
                                                    left: "  prev",
                                                    center: "title",
                                                    right: "next,timeGridDay,",
                                                }
                                            }
                                            customButtons={{
                                                prev: {
                                                    text: "Prev",
                                                    click: () => customHeaderClick("Prev"),
                                                },
                                                next: {
                                                    text: "Next",
                                                    click: () => customHeaderClick("Next"),
                                                },
                                            }}
                                            eventBackgroundColor="#ffcccc" // Sets a light red background for all events
                                            eventClassNames={(arg) => {
                                                const eventDate = new Date(arg.event.start);
                                                const currentDate = new Date();
                                                if (eventDate.getDate() === currentDate.getDate() &&
                                                    eventDate.getMonth() === currentDate.getMonth() &&
                                                    eventDate.getFullYear() === currentDate.getFullYear()) {
                                                    return 'event-today'; // Add class for today’s event
                                                }
                                                return '';
                                            }}
                                            dayCellContent={(arg) => {
                                                const calenderDate = arg.date;
                                                const dateString = calenderDate;
                                                const cellDate = new Date(dateString);
                                                const currentDate = new Date()
                                                if (cellDate !== null) {
                                                    return (
                                                        <div
                                                            className={(currentDate.getDate() === cellDate.getDate() && currentDate.getMonth() === cellDate.getMonth() && currentDate.getFullYear() === cellDate.getFullYear()) ? " current_date_outer" : " calendar_card1"}>
                                                            <h3> {arg?.dayNumberText}</h3>
                                                        </div>
                                                    );
                                                }
                                            }}
                                            fixedWeekCount={false}
                                            showNonCurrentDates={false}
                                        />
                                    </div>
                                    {
                                        selectedDate &&
                                        <div className={"scheduled_posts"}>
                                            <ScheduledPost
                                                selectedDate={selectedDate}
                                                setSelectedDate={setSelectedDate}
                                                selectedSocialMediaTypes={baseSearchQuery?.socialMediaTypes || []}
                                                plannerPosts={getPostsForPlannerApi}
                                                setIsPostApiLoading={setIsPostApiLoading}
                                            />
                                        </div>
                                    }
                                </div>


                                {/* <div className="col-lg-3 col-md-12 col-sm-12">
                                        <div className={`${isDraftPost ? " d-none" : "planner_create_post_container"}`}>
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
                                                        onClick={handleDraft}
                                                        isDisabled={false}
                                                    />
                                                    {
                                                        (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching) ?
                                                            <span
                                                                className=" create_post_btn cmn_white_text cursor-pointer text-center"><Loader
                                                                className="create-post-loader"/></span>
                                                            :
                                                            <button
                                                                onClick={handleCreatePost}
                                                                className="cmn_btn_color create_post_btn cmn_white_text cursor-pointer"
                                                            >
                                                                {jsondata.createpost}
                                                            </button>
                                                    }
                                                </div>

                                            </div>
                                       

                                            <div className="planner_post_track_outer">
                                                <div className={"d-flex pb-2 align-items-center"}>
                                                    <h3 className="planner_create_post_heading  flex-grow-1">Social
                                                        Media</h3>
                                                    <span className={"mr-4"}><input type={"checkbox"}
                                                                                    checked={Array.isArray(baseSearchQuery.socialMediaTypes) ? Object.keys(SocialAccountProvider).every(type => baseSearchQuery.socialMediaTypes.includes(type)) : false}
                                                                                    onChange={(e) => handleSocialMediaFilters("all")}/></span>

                                                </div>

                                                <ul className="schdeuled_post_list post_outer_list">

                                                    {Object.keys(SocialAccountProvider).map((curKey, ind) => {

                                                            return (
                                                                <li key={ind}>
                                                                    <div className="d-flex gap-2 align-items-center ">
                                                                        <img src={computeImageURL(curKey)} height="20px"
                                                                             width="20px"/>
                                                                        <h4>{SocialAccountProvider[curKey]}</h4>
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={baseSearchQuery.socialMediaTypes && baseSearchQuery.socialMediaTypes.includes(curKey)}
                                                                        value={curKey}
                                                                        onChange={(e) => handleSocialMediaFilters(curKey)}
                                                                    />


                                                                </li>
                                                            )
                                                        }
                                                    )}

                                                </ul>
                                            </div>
                                        </div>
                                    </div> */}
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {
                showConnectAccountModal &&
                <ConnectSocialAccountModal
                    showModal={showConnectAccountModal}
                    setShowModal={setShowConnectAccountModal}></ConnectSocialAccountModal>
            }
            {/* {showPost && <IndividualPostModal show={showPost} setShow={setShowPost}/>} */}

        </>
    )
}
export default Planner;
