import SideBar from "../sidebar/views/Layout";
import jsondata from "../../locales/data/initialdata.json";
import GenericButtonWithLoader from "../common/components/GenericButtonWithLoader";
import {Link, useNavigate} from "react-router-dom";
import {SocialAccountProvider} from "../../utils/contantData";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {ParentDraftComponent} from "./views/ParentDraftComponent";
import CommonShowMorePlannerModel from "../common/components/CommonShowMorePlannerModal";
import {useEffect, useRef, useState} from "react";
import {isPostDatesOnSameDayOrInFuture} from "../../utils/commonUtils";
import instagram_img from "../../images/instagram.png";
import linkedin from "../../images/linkedin.svg";
import {getAllSocialMediaPostsByCriteria} from "../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../app/auth/auth";
import ConnectSocialAccountModal from "../common/components/ConnectSocialAccountModal";

const Draft = () => {
    const dispatch = useDispatch();
    const token = getToken();
    const navigate = useNavigate();
    const [baseSearchQuery, setBaseSearchQuery] = useState({
        postStatus: ["DRAFT"],
        limit: 1000,
        plannerCardDate: new Date()
    });
    const [resetData, setResetData] = useState(true)
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);

    useEffect(() => {
        dispatch(getAllSocialMediaPostsByCriteria({token: token, query: {...baseSearchQuery}}));
    }, [baseSearchQuery, resetData])

    const calendarRef = useRef(null);

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
    const handleCreatePost = () => {
        const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length>0
        const isAnyAccountConnected=getAllConnectedSocialAccountData?.data?.length>0
        if (isAnyPageConnected && isAnyAccountConnected ) {
            navigate("/planner/post")
        } else {
            setShowConnectAccountModal(true)
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
                                <h2>{jsondata.sidebarContent.draft}</h2>
                                <h6>Here you find all the upcoming Posts you scheduled.</h6>
                            </div>

                            <div className="draft_createPost_outer">

                                <span onClick={handleCreatePost}
                                      className='cmn_btn_color create_post_btn cmn_white_text cursor-pointer'
                                >{jsondata.createpost}</span>
                            </div>

                        </div>


                        <div className='calender_outer_wrapper'>

                            <div className={`calendar-container hidden`}>

                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin]}
                                    headerToolbar={{
                                        left: '  prev',
                                        center: 'title',
                                        right: 'next,timeGridDay,',
                                    }}
                                    customButtons={{
                                        prev: {text: 'Custom Prev', click: () => customHeaderClick("Prev")},
                                        next: {text: 'Custom Next', click: () => customHeaderClick("Next")},
                                    }}
                                />


                            </div>

                            <div className={"hr-line"}></div>

                        </div>

                        <ParentDraftComponent resetData={setResetData} reference={"DRAFT"}/>

                    </div>
                </div>
            </section>

            {
                showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
                                                                      setShowModal={setShowConnectAccountModal}/>
            }
        </>
    );
}
export default Draft;