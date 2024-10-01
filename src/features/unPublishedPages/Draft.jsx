import jsondata from "../../locales/data/initialdata.json";
import {useNavigate} from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {ParentDraftComponent} from "./views/ParentDraftComponent";
import {useEffect, useRef, useState} from "react";
import instagram_img from "../../images/instagram.png";
import linkedin from "../../images/linkedin.svg";
import {getAllSocialMediaPostsByCriteria} from "../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../app/auth/auth";
import ConnectSocialAccountModal from "../common/components/ConnectSocialAccountModal";
import {useAppContext} from "../common/components/AppProvider";
import Dropdown from "react-bootstrap/Dropdown";
import {useGetConnectedSocialAccountQuery} from "../../app/apis/socialAccount";

const Draft = () => {
    const dispatch = useDispatch();
    const token = getToken();
    const navigate = useNavigate();
    const [baseSearchQuery, setBaseSearchQuery] = useState({
        postStatus: ["DRAFT"],
        plannerCardDate: new Date(),
        period: "MONTH",
    });
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")

    const [apiTrigger, setApiTrigger] = useState(null);
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false);
    const connectedPagesData = useSelector((state) => state.facebook.getFacebookConnectedPagesReducer);

    useEffect(() => {
        dispatch(
            getAllSocialMediaPostsByCriteria({
                token: token,
                query: {...baseSearchQuery},
            })
        );
    }, [baseSearchQuery,apiTrigger]);

    const calendarRef = useRef(null);

    const customHeaderClick = (eventType) => {
        if (eventType === "Prev") {
            calendarRef?.current?.getApi().prev();
        } else if (eventType === "Next") {
            calendarRef?.current?.getApi().next();
        }
        let inst = new Date(
            calendarRef?.current?.getApi()?.currentData?.viewTitle.toString()
        );
        inst.setDate(inst.getDate() + 10);
        setBaseSearchQuery({...baseSearchQuery, plannerCardDate: inst});
    };
    const handleCreatePost = () => {
        const isAnyPageConnected =
            connectedPagesData?.facebookConnectedPages?.length > 0;
        const isAnyAccountConnected =
            getConnectedSocialAccountApi?.data?.length > 0;
        if (isAnyPageConnected && isAnyAccountConnected) {
            navigate("/planner/post");
        } else {
            setShowConnectAccountModal(true);
        }
    };
    const {sidebar} = useAppContext();
    return (
        <>
            <section>
                {/*<SideBar/>*/}
                <div className={sidebar ? "cmn_container" : "cmn_Padding"}>
                    <div className="cmn_outer">
                        <div className="planner_outer white_bg_color cmn_height_outer">
                            <div className="planner_header_outer  align-items-center">
                                <div className="planner_header">
                                    <h2>{jsondata.sidebarContent.draft}</h2>
                                    <h6>{jsondata.draft_heading}</h6>
                                </div>

                                <div className="draft_createPost_outer">
                                    <button
                                        onClick={handleCreatePost}
                                        className="cmn_btn_color create_post_btn cmn_white_text cursor-pointer"
                                    >
                                        {jsondata.createpost}
                                    </button>
                                </div>
                            </div>

                            <div className="calender_outer_wrapper draft_component_outer mt-3">
                                {/* filter dropdown  */}
                                {
                                    false && <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Filters
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <div className="filters_outer">
                                                <div className="choose_platform_dropdown">
                                                    <img width={24} src={linkedin}/>
                                                    <h5 className="inter_font">Linkedin</h5>
                                                    <input type="checkbox"/>
                                                </div>


                                            </div>
                                            <div className="filters_outer">
                                                <div className="choose_platform_dropdown">
                                                    <img width={24} src={instagram_img}/>
                                                    <h5 className="inter_font">Instagram</h5>
                                                    <input type="checkbox"/>
                                                </div>
                                            </div>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                }

                                <div className={`calendar-container hidden`}>
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[dayGridPlugin]}
                                        headerToolbar={
                                            getConnectedSocialAccountApi?.isLoading ||
                                            getConnectedSocialAccountApi?.data?.length === 0 ||
                                            connectedPagesData?.loading ||
                                            connectedPagesData?.facebookConnectedPages?.length === 0
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
                                    />
                                </div>
                            </div>

                            <ParentDraftComponent reference={"DRAFT"} setApiTrigger={setApiTrigger}/>
                        </div>
                    </div>
                </div>
            </section>

            {showConnectAccountModal && (
                <ConnectSocialAccountModal
                    showModal={showConnectAccountModal}
                    setShowModal={setShowConnectAccountModal}
                />
            )}
        </>
    );
};
export default Draft;
