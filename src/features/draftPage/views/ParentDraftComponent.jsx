import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {getAllDraftPostsByCustomerAndPeriodAction} from "../../../app/actions/postActions/postActions";
import DraftComponent from "./DraftComponent";

export const ParentDraftComponent = () => {

    const dispatch = useDispatch();
    const token = getToken();

    const [drafts, setDrafts] = useState([]);

    const getAllDraftPostsByCustomerAndPeriodData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);

    useEffect(() => {
        dispatch(getAllDraftPostsByCustomerAndPeriodAction({token: token, query:{} }));

    }, [])


    useEffect(() => {
        if (Array.isArray(drafts) && drafts.length===0 &&  getAllDraftPostsByCustomerAndPeriodData?.data) {
            setDrafts(Object.keys(getAllDraftPostsByCustomerAndPeriodData?.data));
        }
    }, [getAllDraftPostsByCustomerAndPeriodData]);

    return (

        <div className={"draft-post-list-outer row m-0"}>

            {drafts && Array.isArray(drafts) && drafts.map(curKey => (
                <div className={drafts.length === 1 ? "col-lg-12" : "col-lg-6"}>
                    <DraftComponent batchIdData={getAllDraftPostsByCustomerAndPeriodData?.data?.[curKey]}/>
                </div>
            ))
            }
        </div>
    )


}