import './DraftComponent.css'
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {
    computeImageURL,
    handleSeparateCaptionHashtag,
    sortByKey
} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import jsondata from "../../../locales/data/initialdata.json";
import {useEffect, useState} from "react";
import {
    deletePostByBatchIdAction, getAllSocialMediaPostsByCriteria
} from "../../../app/actions/postActions/postActions";
import { getToken} from "../../../app/auth/auth";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import noPostScheduled from "../../../images/no_post_scheduled.svg";
import CommonLoader from "../../common/components/CommonLoader";
import Swal from "sweetalert2";
import { useAppContext } from '../../common/components/AppProvider';
import men from "../../../images/men.png"
import { BiPolygon } from "react-icons/bi";

const ScheduledComponent = ({scheduledData}) => {
const {sidebar}=useAppContext()

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deletePostState = useSelector(state => state.post.deletePostByBatchIdReducer);

    const token = getToken();

    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [deleteIdRef, setDeleteIdRef] = useState(null);

    useEffect(() => {
        scheduledData?.data && setScheduledPosts(Object.values(scheduledData?.data));

    }, [scheduledData]);

    const handleDeletePost = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: `Delete Post`,
            text: `Are you sure you want to delete this post?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (e?.target?.id !== null) {
                    setDeleteIdRef(e?.target?.id);
                    dispatch(deletePostByBatchIdAction({postId: e?.target?.id, token: token}))
                        .then((response) => {
                            if (response.meta.requestStatus === "fulfilled") {
                                setDeleteIdRef(null);
                                showSuccessToast("Post has been deleted successfully");
                                dispatch(getAllSocialMediaPostsByCriteria({
                                    token: token,
                                    query: {limit: 5, period:"MONTH",postStatus: ["SCHEDULED"]}
                                }));
                            }
                        }).catch((error) => {
                        setDeleteIdRef(null);
                        showErrorToast(error.response.data.message);
                    });
                }
            }
        });


    }
    

    return (
        <>

            {scheduledData.loading ?
                <div className="upcoming_post_outer">
                    <CommonLoader/>
                </div>
                :
                <div className="upcoming_post_outer">


                    <div className="">
                        <h2>{jsondata.upcomingpost}</h2>
                    </div>

                    <div className={"row m-0"}>


                        {scheduledData?.data && Object.keys(scheduledData?.data).length === 0 ?

                            <div className="p-5 text-center mt-3 No_Upcoming_Outer">
                                <h4 className="text-center mb-3">
                                    No Upcoming Posts
                                </h4>
                                <img src={noPostScheduled} alt="" className=''/>
                            </div>

                            :
                            scheduledPosts && Array.isArray(scheduledPosts) && sortByKey(scheduledPosts, "feedPostDate").map((curBatch, index)=> (


                                // <div className={scheduledPosts.length===1 ? "col-lg-12" : scheduledPosts.length===2 ? "col-lg-6" :"col-lg-4"}>

                                <div className={sidebar?"col-lg-6 col-md-6 col-sm-12 ":"col-lg-6 col-md-12 col-sm-12 "} key={index}>
                                    <div className="draft-outer ">

                                        {/* <div className={"draft-heading"}>
                                            <h4 className={"posted-on-txt"}>Posted On : </h4>

                                            <div className="page_tags">
                                                {curBatch?.postPages && Array.isArray(curBatch?.postPages) &&
                                                    curBatch?.postPages.map((curPage,index) => (
                                                        <div className="selected-option" key={index}>
                                                            <div>
                                                                <img className={"me-1 social-media-icon"}
                                                                     src={computeImageURL(curPage?.socialMediaType)}
                                                                     alt={"instagram"}/>
                                                            </div>
                                                            <p className={"social-media-page-name"}>{curPage?.pageName}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div> */}

                                        <div className="post-image-outer">
                                           
                                            {curBatch?.attachments.length !== 0 && 
                                            <div>
                                                <div className='upcoming_post_header_outer cmn_upcoing_post_header'>
                                                <img src={men} height="20px" width="20px"/>
                                                <h3>John doe</h3>
                                                </div>
                                                <div className='Tommorrow_header cmn_upcoing_post_header'>
                                                <BiPolygon />
                                                <span>Tommorrow</span>
                                                </div>
                                            </div>}
                                            {curBatch?.attachments &&
                                                <CommonSlider files={curBatch?.attachments} selectedFileType={null}
                                                              caption={null}
                                                              hashTag={null}
                                                              viewSimilarToSocialMedia={false}/>}

                                        </div>


                                        <div className="card-body post_card">
                                        <div className={'mb-2'}>
                                                    <span
                                                        className={"hash_tags"}>{formatDate(curBatch?.feedPostDate)}</span>
                                                </div>
                                                
                                                <h3 className={" upcoming_post_content mb-0"}>{curBatch?.message !== null && curBatch?.message !== "" ? handleSeparateCaptionHashtag(curBatch?.message)?.caption || "---No Caption---" : "---No Caption---"}</h3>
                                          

                                         
                                                <div className={'mb-2 hash_tags_outer_container'}>
                        <span
                            className={"hash_tags "}>{curBatch?.message !== null && curBatch?.message !== "" ? handleSeparateCaptionHashtag(curBatch?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
                                                </div>

                                               
                                                
                                           

                                            <div
                                                className="mt-4 upcomingPostBtn_Outer ">

                                                <GenericButtonWithLoader className={"outline_btn nunito_font schedule_btn loading"}
                                                                         label={"Delete Post"}
                                                                         isLoading={deleteIdRef === curBatch?.id && deletePostState?.loading}
                                                                         onClick={handleDeletePost}
                                                                         id={curBatch?.id}
                                                                         contentText={"Deleting..."}
                                                                         isDisabled={false}
                                                />
                                                <GenericButtonWithLoader className={"post_now nunito_font cmn_bg_btn loading"}
                                                                         label={"Change Post"}
                                                                         onClick={() => navigate("/post/" + curBatch?.id)}
                                                                         isDisabled={false}
                                                />
                                            </div>

                                        </div>


                                    </div>

                                </div>

                            ))}

                    </div>


                </div>

            }
        </>
    )

}

export default ScheduledComponent;