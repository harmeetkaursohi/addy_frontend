import './DraftComponent.css'
import React from "react";
import draft from '../../../images/draft.png'
import instagram from '../../../images/instagram.png';
import linkedin from '../../../images/linkedin.svg';
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";


const DraftComponent = () => {
    return (<>

        <div className="draft-outer mb-5">


            <div className={"draft-heading"}>
                <h4 className={"posted-on-txt"}>Posted On : </h4>

                <div className="selected-option">
                    <img className={"me-1 social-media-icon"} src={instagram} alt={"instagram"}/>
                    <span className={"social-media-page-name"}>Team Musafir</span>
                </div>


                <div className="selected-option">
                    <img className={"me-1 social-media-icon"} src={linkedin} alt={"linkedin"}/>
                    <span className={"social-media-page-name"}>Team Musafir</span>
                </div>

                <div className="selected-option">
                    <img className={"me-1 social-media-icon"} src={instagram} alt={"instagram"}/>
                    <span className={"social-media-page-name"}>Team Ultivic</span>
                </div>

            </div>


            <div className="post-image-outer d-flex">
                <img className={"post-image"} src={draft} alt={"draft"}/>
            </div>


            <div className="card-body post_card">

                <div className={""}>
                    <span className={"post_caption"}>Post Caption:</span>
                    <h3 className={"caption"}>"Embracing the beauty of the natural world."</h3>
                </div>

                <div className={""}>
                    <h5>Hashtags: </h5>
                    <div className={'mb-2'}>
                        <span className={"hash_tags"}>#NatureLovers #EarthAppreciation #NaturePeace #NatureInspires #NatureMagic #NatureIsCalling</span>

                    </div>

                </div>

                <div className={""}>
                    <h5>Posted On:</h5>
                    <GenericButtonWithLoader className={"un_selected loading"} label={"Not Selected"}/>
                </div>

                <div className="mt-4 ms-3 d-flex gap-2 justify-content-center align-items-center">
                    <GenericButtonWithLoader className={"post_now cmn_bg_btn loading"} label={"Post Now"}/>
                    <GenericButtonWithLoader className={"outline_btn schedule_btn loading"} label={"Schedule Post"}/>
                </div>

            </div>


        </div>
    </>)
}

export default DraftComponent;