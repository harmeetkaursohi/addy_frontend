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
    computeImageURL, isNullOrEmpty
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

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
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

        const eventStartDate = event?._def?.extendedProps?.postDate
        const dateString = eventStartDate;
        const date = new Date(dateString);
        const dayOfMonth = date.getDate();

        let backgroundColor
        let border
        let textColor
        if ([1, 5, 9, 13, 17, 21, 28].includes(dayOfMonth)) {
            backgroundColor = '#fce5d6';
            border = "4px solid #B94D09";
            textColor = "#782E00"
        } else if ([3, 6, 8, 14, 18, 22, 25, 26, 30].includes(dayOfMonth)) {
            backgroundColor = '#defcd6';
            border = "4px solid #56B909";
            textColor = "#023E01"
        } else if ([4, 10, 12, 15, 19, 23, 27, 31].includes(dayOfMonth)) {
            backgroundColor = '#d6f3fc';
            border = "4px solid  #098FB9";
            textColor = "#033C48"
        } else {
            backgroundColor = '#fcd6d6';
            border = "4px solid #B90909";
            textColor = "#780000"
        }


        let classname = event?._def?.extendedProps?.batchId
        const postOnSocialMedia = event?._def?.extendedProps?.childCardContent?.length > 0 ? event?._def?.extendedProps?.childCardContent[0] : null
        return (
            <div className={"cal_Div w-100 test"}
                 style={{
                     backgroundColor: backgroundColor,
                     borderLeft: border,
                     // pointerEvents: isPostDatesOnSameDayOrInFuture(event?._def?.extendedProps?.postDate, new Date()) ? "" : "none"
                 }}>

                <div className="w-100 p-0 calendar_card">

                    {
                        postOnSocialMedia !== null &&
                        <div className={"custom_event"}
                        >
                            <img src={postOnSocialMedia?.imageUrl} alt={postOnSocialMedia.title}/>
                            <h3 style={{color: textColor}}
                                className={`custom_event_heading${classname}`}>{postOnSocialMedia.title}</h3>
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
                    !getPostsForPlannerApi?.isLoading && !getPostsForPlannerApi?.isFetching && !getPlannerPostsCountApi?.isLoading && !getPlannerPostsCountApi?.isFetching &&
                    <button className="createPost_btn crate_btn ms-0 p-0 w-100 planner_view_more_btn"
                    >{
                        (event?._def?.extendedProps?.showMoreContent > 0) &&
                        "+ " + event?._def?.extendedProps?.showMoreContent
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
        setSelectedDate(getDayStartInUTC(inst.getDate(), inst.getMonth(), inst.getFullYear()));

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
                                className={`cmn_btn_color create_post_btn cmn_white_text`}
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
                                    <div className="planner_calender w-100">
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
                                                                <li key={ind}>
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
                                            // dayCellClassNames={(arg) => {
                                            //     if (arg?.isPast) {
                                            //         return "calendar_card_disable";
                                            //     }
                                            // }}
                                            headerToolbar={
                                                // (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getConnectedSocialAccountApi?.data?.length === 0 || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.data?.length === 0) ?
                                                {
                                                    left: "  prev",
                                                    center: "title",
                                                    right: "next,timeGridDay,",
                                                }
                                                    // :
                                                    // {
                                                    //     left: "  prev",
                                                    //     center: "title",
                                                    //     right: "next,timeGridDay,",
                                                    // }
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
                                        <div className={"scheduled_posts social_accounts"}>
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
