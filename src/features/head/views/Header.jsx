import jsondata from "../../../locales/data/initialdata.json"
import './Header.css'
import { useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Loader from "../../loader/Loader";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {
    useConnectSocialAccountMutation,
    useDisconnectSocialAccountMutation,
    useGetAllFacebookPagesQuery,
    useGetAllInstagramBusinessAccountsQuery, useGetAllLinkedinPagesQuery,
    useGetAllPinterestBoardsQuery,
    useGetConnectedSocialAccountQuery
} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {enabledSocialMedia} from "../../../utils/contantData";
import {isNullOrEmpty} from "../../../utils/commonUtils";

const Header = ({userData, setShowConnectAccountModal}) => {

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const navigate = useNavigate();
    const handleCreatePost = () => {
        const isAnyPageConnected = getAllConnectedPagesApi?.data?.length > 0
        const isAnyAccountConnected = getConnectedSocialAccountApi?.data?.length > 0
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
                                        <h6>{typeof userData?.fullName !== "undefined" ? jsondata.dashboard_heading :
                                            <SkeletonEffect count={1}></SkeletonEffect>}</h6>
                                    </div>

                                    
                                    <div className="create_Ad_outer">
                                        {/*{*/}
                                        {/*    (getAllConnectedPagesApi?.isLoading || getConnectedSocialAccountApi?.isLoading || getAllFacebookPagesApi?.isLoading || instagramBusinessAccountsData?.loading || pinterestBoardsData?.loading || getAllLinkedinPagesData?.loading) ?*/}
                                        {/*        <div*/}
                                        {/*            className="createPost_btn crate_btn cmn_btn_color cursor-pointer loader_btn_container">*/}
                                        {/*            <Loader/>*/}
                                        {/*        </div> :*/}
                                        {/*        <div onClick={handleCreatePost}*/}
                                        {/*             className="createPost_btn crate_btn cmn_btn_color cursor-pointer">*/}
                                        {/*            {jsondata.createpost}*/}
                                        {/*        </div>*/}
                                        {/*}*/}
                                        {
                                            !getAllConnectedPagesApi?.isLoading &&
                                            <div onClick={handleCreatePost}
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
