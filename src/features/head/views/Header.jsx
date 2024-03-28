import search_icon from "../../../images/search_icon.svg"
import jsondata from "../../../locales/data/initialdata.json"
import './Header.css'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Loader from "../../loader/Loader";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";

const Header = ({userData, setShowConnectAccountModal}) => {

    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);

    const getAllFacebookPagesData = useSelector(state => state.facebook.getFacebookPageReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    const pinterestBoardsData = useSelector(state => state.socialAccount.getAllPinterestBoardsReducer);
    const getAllLinkedinPagesData = useSelector(state => state.socialAccount.getAllLinkedinPagesReducer);


    const navigate = useNavigate();
    const handleCreatePost = () => {
        const isAnyPageConnected = connectedPagesData?.facebookConnectedPages?.length > 0
        const isAnyAccountConnected = getAllConnectedSocialAccountData?.data?.length > 0
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
                        <div className="header_container_box">
                                    <div className="header_container">
                                        <h2 className="">{typeof userData?.fullName !== "undefined" ? `${jsondata.heythere} ${userData?.fullName}!` :
                                            <SkeletonEffect count={1}></SkeletonEffect>}</h2>
                                        <h6>{typeof userData?.fullName !== "undefined" ? `Curious to explore? Welcome  to your all-in Dashboard and discover more!` :
                                            <SkeletonEffect count={1}></SkeletonEffect>}</h6>
                                    </div>
                               
                           
                                    {/*<div className="search_outer flex-grow-1">*/}
                                    {/*    <img src={search_icon} className="search_icon"/>*/}
                                    {/*    <input type="text" className="form-control search_input" placeholder="Search"/>*/}
                                    {/*</div>*/}

                                    
                                    <div className="create_Ad_outer">
                                        {
                                            (connectedPagesData?.loading || getAllConnectedSocialAccountData?.loading || getAllFacebookPagesData?.loading || instagramBusinessAccountsData?.loading || pinterestBoardsData?.loading || getAllLinkedinPagesData?.loading) ?
                                                <div
                                                    className="createPost_btn crate_btn cmn_btn_color cursor-pointer">
                                                    <Loader/>
                                                </div> : <div onClick={handleCreatePost}
                                                              className="createPost_btn crate_btn cmn_btn_color cursor-pointer">
                                                    {jsondata.createpost}
                                                </div>
                                        }

                                    </div>

                               
                           
                        </div>

                    </form>
                </div>
            </header>
        </>
    )
}
export default Header