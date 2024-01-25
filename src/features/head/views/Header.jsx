import search_icon from "../../../images/search_icon.svg"
import jsondata from "../../../locales/data/initialdata.json"
import './Header.css'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const Header = ({userData, getAllConnectedSocialAccountData, facebookPageList, setShowConnectAccountModal}) => {

    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const navigate = useNavigate();
    const handleCreatePost = () => {
        const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length>0
        const isAnyAccountConnected=getAllConnectedSocialAccountData?.data?.length>0
        if (isAnyPageConnected && isAnyAccountConnected) {
            navigate("/planner/post")
        } else {
            setShowConnectAccountModal(true)
        }
    }
    return (
        <>
            <header>
                <div className="header_outer">
                    <form>
                        <div className="row">
                            <div className="col-lg-5 col-md-12 col-sm-12">
                                <div className="header_outer_container">
                                    <div className="header_container">
                                        <h2 className="">{`${jsondata.heythere} ${userData?.fullName}!`}</h2>
                                        <h6>Curious to explore? Welcome  to your all-in Dashboard and discover more!</h6>

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-12 col-sm-12">
                                <div className="d-flex  gap-3 flex-wrap">
                                    {/*<div className="search_outer flex-grow-1">*/}
                                    {/*    <img src={search_icon} className="search_icon"/>*/}
                                    {/*    <input type="text" className="form-control search_input" placeholder="Search"/>*/}
                                    {/*</div>*/}

                                    <div className="flex-grow-1"></div>
                                    <div className="create_Ad_outer">
                                        {/*<button className="Create_Ad_btn crate_btn">*/}
                                        {/*    {jsondata.createad}*/}
                                        {/*</button>*/}
                                        {/*{*/}
                                        {/*    ((!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length > 0) && facebookPageList?.length > 0) &&*/}
                                        {/*        <Link to="/planner/post" className="createPost_btn crate_btn cmn_btn_color">*/}
                                        {/*            {jsondata.createpost}*/}
                                        {/*        </Link>*/}

                                        {/*}*/}
                                        {
                                            !getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data &&
                                            <div onClick={handleCreatePost}
                                                 className="createPost_btn crate_btn cmn_btn_color cursor-pointer">
                                                {jsondata.createpost}
                                            </div>

                                        }

                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </header>
        </>
    )
}
export default Header