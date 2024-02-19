import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../../app/auth/auth";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import DraftComponent from "./DraftComponent";
import {sortByKey} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import noDraftPosts from "../../../images/no_draft_posts.png";
import {useLocation} from "react-router-dom";

export const ParentDraftComponent = ({setDraftPost,reference="",resetData=null}) => {

    const dispatch = useDispatch();
    const token = getToken();
    const [drafts, setDrafts] = useState([]);
    const getAllDraftPostsByCustomerAndPeriodData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);




    useEffect(() => {
        if (getAllDraftPostsByCustomerAndPeriodData?.data) {
            setDrafts(Object.values(getAllDraftPostsByCustomerAndPeriodData?.data));
        }
    }, [getAllDraftPostsByCustomerAndPeriodData]);

    return (

        <div className={"row m-0"}>

            {getAllDraftPostsByCustomerAndPeriodData.loading && (<CommonLoader />) }

            {!getAllDraftPostsByCustomerAndPeriodData.loading   && drafts && Array.isArray(drafts) && drafts.length===0 &&
                <div className="noDraftPosts_outer p-5 text-center mt-3">
                    <img src={noDraftPosts} alt={"No Drafts"} className=" no-draft-img"/>
                    <h2 className="acc_not_connected_heading">No Account is connected Yet! Click  Create Post to connect an account.</h2>
                </div>
            }

{!getAllDraftPostsByCustomerAndPeriodData.loading && drafts && Array.isArray(drafts) && sortByKey(drafts,"createdAt").map((curDraftObject, key) => (
                <div className={"col-lg-4"} key={key+"curDraftObject"}>
                    {
                        <DraftComponent resetData={resetData} batchIdData={curDraftObject} setDraftPost={setDraftPost} setDrafts={setDrafts} reference={reference}/>
                    }


                </div>

            ))
            }
        </div>
    )


}

