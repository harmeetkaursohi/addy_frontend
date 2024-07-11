import Modal from "react-bootstrap/Modal";
import {RxCross2} from "react-icons/rx";
import "./DeletePostFromSocialMediaModal.css"
import success_img from "../../../images/success_img.svg";
import Loader from "../../loader/Loader";
import {useState} from "react";
import {useSelector} from "react-redux";

const DeletePostFromSocialMediaModal = ({
                                            show,
                                            setShow,
                                            cancelButtonText = "Cancel",
                                            confirmButtonText = "Delete",
                                            setSelectedPagesToDeletePost,
                                            title = "Delete Post",
                                            pageList
                                        }) => {


    const deletePostOnSocialMediaData = useSelector((state) => state.post.deletePostOnSocialMediaReducer);
    const [selectedPages, setSelectedPages] = useState([])

    const handleChange = (e) => {
        if (selectedPages?.includes(e.target.value)) {
            setSelectedPages([...selectedPages?.filter(c=>c!==e.target.value)])
        } else {
            setSelectedPages([...selectedPages,e.target.value])
        }
    }
    const handleSelectAll = (e) => {
       if(pageList?.filter(c=>c.socialMediaType!=="INSTAGRAM")?.length===selectedPages?.length){
           setSelectedPages([])
       }else{
           setSelectedPages([...pageList?.filter(cur=>cur.socialMediaType!=="INSTAGRAM")?.map(cur=>cur.pageId)])
       }
    }
    const handleClose = () => setShow(false);
    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={show} onHide={handleClose} className={"alert_modal_body"} centered>

                    <Modal.Body>
                        <div className='pop_up_cross_icon_outer text-end cursor-pointer'
                             onClick={(e) => {
                                 handleClose()
                             }}>
                            <RxCross2 className="pop_up_cross_icon"/></div>
                        <h2 className={"text-center delete-post-txt"}> {title}</h2>
                        <p className={"confirmation-txt mb-2"}>
                            Please select the platforms to remove post.
                        </p>
                        {
                            pageList && Array.isArray(pageList) && pageList?.map((page,index) => {
                                return (
                                    <div class={page?.socialMediaType==="INSTAGRAM" ?"opacity-5 ms-2" :"ms-2"} key={index}>
                                        <input className={"page-select-checkbox me-2"} type="checkbox" value={page?.pageId}
                                               checked={selectedPages?.includes(page?.pageId)}
                                               onChange={handleChange}
                                               disabled={page?.socialMediaType==="INSTAGRAM"}
                                               id={index}/>
                                        <label className="form-check-label" htmlFor={index}>
                                            {page?.pageName}
                                        </label>
                                    </div>
                                )
                            })
                        }
                        {
                            pageList && Array.isArray(pageList) && pageList?.length > 1 &&
                            <div class=" ms-2">
                                <input className="page-select-checkbox me-2" type="checkbox" value=""
                                       onChange={handleSelectAll}
                                       checked={pageList?.filter(c=>c.socialMediaType!=="INSTAGRAM")?.length===selectedPages?.length}
                                       id="flexCheckDefault"/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    Select All
                                </label>

                            </div>
                        }

                        {
                            pageList?.some(c=>c?.socialMediaType==="INSTAGRAM") && <div className={"service-unavailable-txt ms-2 mt-1"}>*Service Currently Unavailable for Instagram</div>
                        }

                        <div className="confirm_btn ">
                            <button className="cmn_modal_cancelbtn"
                                    onClick={(e) => {
                                        handleClose()
                                    }}
                            >
                                {cancelButtonText}
                            </button>
                            <button type="button" className="cmn_btn_color cmn_connect_btn  yes_btn"
                                    disabled={selectedPages?.length==0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedPagesToDeletePost(selectedPages)
                                        setSelectedPages([])
                                    }}
                            >{confirmButtonText}
                                {
                                    deletePostOnSocialMediaData?.loading && <Loader className={"ms-2 h-16 w-16"}/>
                                }
                            </button>
                        </div>


                    </Modal.Body>
                </Modal>

            </div>
        </>
    );
}
export default DeletePostFromSocialMediaModal;