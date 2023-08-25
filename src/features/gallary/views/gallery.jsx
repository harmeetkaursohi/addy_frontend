import SideBar from "../../sidebar/views/Layout"
import "./gallery.css"
import bg_img from '../../../images/bg_img.png'
import child_girl from '../../../images/child_girl.png'
import nature from '../../../images/nature.png'
import beautiful_nature from '../../../images/beautiful_nature.png'
import ai_bg from '../../../images/ai_bg.png'
import  jsondata  from "../../../locales/data/initialdata.json"
const Gallery=()=>{
    return(
        <>
        <section>
        <SideBar/>
        <div className="cmn_container">
        <div className="cmn_wrapper_outer">
            <div className="gallery_wrapper">
                <div className="gallery_header">
                <h2 className="cmn_text_heading">
                {jsondata.sidebarContent.gallery}
                </h2>
                <h6 className="cmn_small_heading">Here you find all the upcoming Posts you scheduled.</h6>
                </div>
                 <div className="gallery_outer ">
                    <div className="row">
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={bg_img} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={child_girl} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={nature} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={bg_img} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={ai_bg} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={beautiful_nature} className="bg_img"/>
                            </div>
                        </div>
                        {/* ====== */}
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={bg_img} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={child_girl} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={nature} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={bg_img} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={ai_bg} className="bg_img"/>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-md-4 mt-4">
                            <div className="gallery_images">
                                <img src={beautiful_nature} className="bg_img"/>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
        </div>
          
        </section>
        </>
    )
}
export default Gallery