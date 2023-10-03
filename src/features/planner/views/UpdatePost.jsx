import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllPostsByBatchIdAction} from "../../../app/actions/postActions/postActions";
import {getToken} from "../../../app/auth/auth";
import {useParams} from "react-router-dom";
import CommonPostFields from "./CommonPostFields";

const UpdatePost = () => {

    const getPostsByBatchIdList = useSelector(state => state.post.getAllPostsByBatchIdReducer.data);
    const dispatch = useDispatch();
    const token = getToken();
    const {batchId} = useParams();


    useEffect(() => {

        const requestBody = {
            batchId: batchId ? batchId : "651bd80bba5a9f1c1706d6161696326736681",
            token: token
        }

        if (!getPostsByBatchIdList) {
            dispatch(getAllPostsByBatchIdAction(requestBody))
        }
    }, []);

    return (
        <>
            <CommonPostFields formType={"Update"} getPostsByBatchIdList={getPostsByBatchIdList}/>
        </>
    )
};

export default UpdatePost;