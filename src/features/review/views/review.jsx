import SideBar from "../../sidebar/views/Layout"
import "./review.css"
import instagram_img from '../../../images/instagram.png'
import bg_img from '../../../images/bg_img.png'
import child_girl from '../../../images/child_girl.png'
import nature from '../../../images/nature.png'
import beautiful_nature from '../../../images/beautiful_nature.png'
import ai_bg from '../../../images/ai_bg.png'
import tiktok_img from '../../../images/tiktok.svg'
import jsondata from "../../../locales/data/initialdata.json"
const Review=()=>{
    return(
        <>
        <section>
        <SideBar/>
        <div className="cmn_container">
            <div className="cmn_wrapper_outer">
                <div className="review_wrapper">
                    <div className="review_header">
                        <div className="review_heading">
                        <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                        <h6 className="cmn_small_heading">Here you find all the upcoming Posts you scheduled.</h6>
                        </div>
                        <select className="filter_select_btn cmn_text_style">
                            <option>Filter</option>
                            <option>1</option>
                        </select>
                    </div>
                    <div className="post_review_wrapper table-responsive">
                        <table >
                       <thead>
                        <tr>
                        <th>{jsondata.post}</th>
                       <th>{jsondata.socialmedia}</th>
                       <th>{jsondata.likes}</th>
                       <th>{jsondata.comments}</th>
                       <th>{jsondata.share}</th>
                       <th></th>
                        </tr>
                       </thead>
                       <tbody>
                        <tr>
                        <td>
                            <img src={bg_img} className="bg_img"/>
                        </td>
                        <td><img src={instagram_img}/></td>
                        <td>1k likes</td>
                        <td>100 Comments</td>
                        <td>100 Share</td>
                        <td>
                            <button className="view_post_btn cmn_bg_btn">{jsondata.viewpost}</button>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <img src={ai_bg} className="bg_img"/>
                        </td>
                        <td><img src={tiktok_img}/></td>
                        <td>1k likes</td>
                        <td>100 Comments</td>
                        <td>100 Share</td>
                        <td>
                            <button className="view_post_btn cmn_bg_btn">{jsondata.viewpost}</button>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <img src={child_girl} className="bg_img"/>
                        </td>
                        <td><img src={tiktok_img}/></td>
                        <td>1k likes</td>
                        <td>100 Comments</td>
                        <td>100 Share</td>
                        <td>
                            <button className="view_post_btn cmn_bg_btn">{jsondata.viewpost}</button>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <img src={nature} className="bg_img"/>
                        </td>
                        <td><img src={tiktok_img}/></td>
                        <td>1k likes</td>
                        <td>100 Comments</td>
                        <td>100 Share</td>
                        <td>
                            <button className="view_post_btn cmn_bg_btn">{jsondata.viewpost}</button>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <img src={beautiful_nature} className="bg_img"/>
                        </td>
                        <td><img src={tiktok_img}/></td>
                        <td>1k likes</td>
                        <td>100 Comments</td>
                        <td>100 Share</td>
                        <td>
                            <button className="view_post_btn cmn_bg_btn">{jsondata.viewpost}</button>
                        </td>
                        </tr>
                       </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </section>
        </>
    )
    }
    export default Review