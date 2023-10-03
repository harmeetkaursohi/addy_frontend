import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './Planner.css'
import SideBar from '../../sidebar/views/Layout'
import instagram_img from '../../../images/instagram.png'
import linkedin from '../../../images/linkedin.svg'
import jsondata from '../../../locales/data/initialdata.json'
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {getAllPostsForPlannerAction} from "../../../app/actions/postActions/postActions";
import {showErrorToast} from "../../common/components/Toast";
import {useDispatch, useSelector} from "react-redux";

const Planner = () => {

    const dispatch = useDispatch();
    const token = getToken();
    const getAllPostsForPlannerData = useSelector(state => state.post.getAllPostsForPlannerReducer.data);

    console.log("@@@ getAllPostsForPlannerData ::: ", getAllPostsForPlannerData)
    console.log("@@@ getAllPostsForPlannerData ::: ", JSON.stringify(getAllPostsForPlannerData));

    useEffect(() => {
        document.title = 'Planner';
    }, []);

    useEffect(() => {
        const decodeJwt = decodeJwtToken(token);
        const requestBody = {
            customerId: decodeJwt.customerId,
            token: token,
            auditableSearchParams: {}
        }

        if (!getAllPostsForPlannerData) {
            dispatch(getAllPostsForPlannerAction(requestBody));
        }
    }, []);


    const events = [
        {title: 'Instagram post', start: new Date(), imageUrl: instagram_img}, {
            title: "Twitter",
            start: '2023-08-18',
            imageUrl: linkedin
        }
    ]

    // const events = () => {
    //     const events = Object.keys(responseData).map(date => {
    //         console.log()
    //         const dateEvents = responseData[date];
    //         return Object.keys(dateEvents).map(batchId => {
    //             return dateEvents[batchId].map(event => {
    //                 return {
    //                     title: event.socialAccountType, // Use appropriate title
    //                     start: new Date(event.feedPostDate),
    //                     imageUrl: event.attachments[0].attachmentId, // Use appropriate image URL
    //                 };
    //             });
    //         });
    //     }).flat();
    //     return events;
    // }

    // render event content
    const eventContent = ({event}) => (
        <div className="custom_event">
            <img src={event.extendedProps.imageUrl} alt={event.title}/>
            <h3>{event.title}</h3>
        </div>
    );
    // customise week name
    const customDayHeaderContent = (args) => {
        // You can customize the day names here
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[args.date.getDay()];
    };

    return (
        <>
            <section>
                <SideBar/>
                <div className='cmn_container'>
                    <div className='planner_outer'>
                        <div className='planner_header_outer'>
                            <div className='planner_header'>
                                <h2>{jsondata.sidebarContent.planner}</h2>
                                <h6>Here you find all the upcoming Posts you scheduled.</h6>
                            </div>
                            <div>
                                <Link className='cmn_btn_color create_post_btn cmn_white_text'
                                      to="/post">{jsondata.createpost}</Link>
                            </div>
                        </div>
                        <div className='events_wrapper'>
                            <div className='row'>
                                <div className='col-lg-4 col-md-6 col-sm-12'>
                                    <div className='event_group'>
                                        <h2 className='cmn_text_heading'>2</h2>
                                        <h5 className='cmn_small_heading'>Scheduled for Today</h5>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 col-sm-12'>
                                    <div className='event_group'>
                                        <h2 className='cmn_text_heading'>2</h2>
                                        <h5 className='cmn_small_heading'>Posted this Week</h5>
                                    </div>
                                </div>
                                <div className='col-lg-4 col-md-6 col-sm-12'>
                                    <div className='event_group' style={{borderRight: "unset"}}>
                                        <h2 className='cmn_text_heading'>2</h2>
                                        <h5 className='cmn_small_heading'>Upcoming this Week</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* select option */}
                        <div className='calender_outer_wrapper'>
                            <div className="custom-header">
                                <select className=" filter_options cmn_text_style box_shadow">
                                    <option>Filter</option>
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                </select>
                            </div>
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView='dayGridMonth'
                                weekends={true}
                                events={events}
                                eventContent={eventContent}
                                dayHeaderContent={customDayHeaderContent}
                                headerToolbar={{
                                    left: '  prev',
                                    center: 'title',
                                    right: 'next,timeGridDay,',
                                }}
                            >
                            </FullCalendar>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Planner