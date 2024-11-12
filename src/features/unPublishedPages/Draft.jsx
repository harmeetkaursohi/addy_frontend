import jsondata from "../../locales/data/initialdata.json";
import {useNavigate} from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {ParentDraftComponent} from "./views/ParentDraftComponent";
import React, { useRef, useState} from "react";
import instagram_img from "../../images/instagram.png";
import linkedin from "../../images/linkedin.svg";
import ConnectSocialAccountModal from "../common/components/ConnectSocialAccountModal";
import {useAppContext} from "../common/components/AppProvider";
import Dropdown from "react-bootstrap/Dropdown";
import {useGetConnectedSocialAccountQuery} from "../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../app/apis/pageAccessTokenApi";
import ConnectSocialMediaAccount from "../common/components/ConnectSocialMediaAccount";
import NotConnected_img from "../../images/noaccount_draft.svg?react";
import { formatMessage } from "../../utils/commonUtils";
import { NotConnected } from "../../utils/contantData";
const Draft = () => {

    const {sidebar} = useAppContext();
    const navigate = useNavigate();
    const [baseSearchQuery, setBaseSearchQuery] = useState({
        postStatus: ["DRAFT"],
        plannerCardDate: new Date(),
        period: "MONTH",
    });
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false);

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
        const isAnyPageConnected = getAllConnectedPagesApi?.data?.length > 0;
        const isAnyAccountConnected = getConnectedSocialAccountApi?.data?.length > 0;
        if (isAnyPageConnected && isAnyAccountConnected) {
            navigate("/planner/post");
        } else {
            setShowConnectAccountModal(true);
        }
    };

    return (
        <>
            <section>
                <div className={sidebar ? "cmn_container" : "cmn_Padding"}>
                <div className="cmn_outer">
                <div className="planner_header_outer  align-items-center mb-3">
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
              {  getConnectedSocialAccountApi?.data?.length === 0  ||  getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 ?

            (<div className="review_wrapper cmn_height_outer no_account_bg white_bg_color">

            <div className="no-post-review acc_not_connected_heading no_draft">

                        {
                            getConnectedSocialAccountApi?.data?.length === 0 &&
                            <ConnectSocialMediaAccount    image={<><NotConnected_img className="acc_not_connected_img no_draft"/></>}
                                                    message={<>
                                                    You aren’t connected to any social media accounts right now. <br />
                                                    Connect to begin creating drafts and posts!
                                                    </>}/>

                        }
                        {
                            getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 &&
                            <ConnectSocialMediaAccount    image={<><NotConnected_img className="acc_not_connected_img no_draft"/></>}
                                                    // message={formatMessage(NotConnected, ["posts", "social media pages"])}
                                                    message={<>
                                                        You aren’t connected to any social media accounts right now. <br />
                                                        Connect to begin creating drafts and posts!
                                                        </>}
                                                    />
                        }
                        </div>
                        </div>)
                        :


                       ( <div className="planner_outer">

                            <div className="calender_outer_wrapper draft_component_outer">
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
                                        headerToolbar={getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.data?.length === 0 || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.data?.length === 0
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

                            <ParentDraftComponent searchQuery={baseSearchQuery}/>
                        </div>)
                        }
                    </div>
                </div>

            </section>

            {
                showConnectAccountModal &&
                <ConnectSocialAccountModal
                    showModal={showConnectAccountModal}
                    setShowModal={setShowConnectAccountModal}
                />
            }
        </>
    );
};
export default Draft;
