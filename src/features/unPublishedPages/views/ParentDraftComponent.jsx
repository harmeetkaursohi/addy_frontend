import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../../app/auth/auth";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import DraftComponent from "./DraftComponent";
import {sortByKey} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import noDraftPosts from "../../../images/no_draft_posts.png";

export const ParentDraftComponent = ({setDraftPost}) => {

    const dispatch = useDispatch();
    const token = getToken();

    const [drafts, setDrafts] = useState([]);

    const getAllDraftPostsByCustomerAndPeriodData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);

    useEffect(() => {
        dispatch(getAllSocialMediaPostsByCriteria({token: token, query:{} }));

    }, [])


    useEffect(() => {
        if (getAllDraftPostsByCustomerAndPeriodData?.data) {
            setDrafts(Object.values(getAllDraftPostsByCustomerAndPeriodData?.data));
        }
    }, [getAllDraftPostsByCustomerAndPeriodData]);

    return (

        <div className={"row m-0"}>

            {getAllDraftPostsByCustomerAndPeriodData.loading && (<CommonLoader />) }

            {!getAllDraftPostsByCustomerAndPeriodData.loading   && drafts && Array.isArray(drafts) && drafts.length===0 &&
                <div className="cmn_background p-5 text-center mt-3"><img src={noDraftPosts} alt={"No Drafts"} className="img-fluid"/></div>
            }

            {!getAllDraftPostsByCustomerAndPeriodData.loading && drafts && Array.isArray(drafts) && sortByKey(drafts,"createdAt").map(curDraftObject => (
                <div className={drafts.length === 1 ? "col-lg-12" : "col-lg-6"}>
                    <DraftComponent batchIdData={curDraftObject} setDraftPost={setDraftPost} setDrafts={setDrafts}/>
                </div>
            ))
            }
        </div>
    )


}

