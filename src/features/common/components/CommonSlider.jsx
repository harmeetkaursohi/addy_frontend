import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React, {useState} from "react";
import noImageAvailable from "../../../images/no_img_posted.png"
import ReactPlayer from "react-player";
import CommentText from "../../review/views/comments/CommentText";
import './common.css'
import { Image } from "react-bootstrap";
const CommonSlider = ({
                          files,
                          selectedFileType = "",
                          caption,
                          hashTag,
                          showThumbnail = false,
                          viewSimilarToSocialMedia = true,
                          isPublished = false,
                          enableShowPlannerModel = false,
                          isrequired,
                          className,
                          height,

                      }) => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    const [showText, setShowText] = useState(false)

    return (
        <>

            {viewSimilarToSocialMedia ?
                <div>
                    <div className={`ms-2   ${showText ? "feed_preview_Caption_outer" : ` ${className}`}`}>
                        {isrequired ? "" : <CommentText socialMediaType={"INSTAGRAM"} comment={`${caption} ${hashTag}`}
                                                        className={"highlight cursor-pointer Caption_outer"} setShowText={setShowText}
                                                        showText={showText}/>}
                    </div>
                    <Slider {...settings} >

                        {
                            (selectedFileType === "IMAGE" || files.every(file => file.mediaType === "IMAGE")) &&

                            files?.map((file, index) => {
                                return (<div key={index}>
                                    <Image src={file?.url || "data:image/jpeg; base64," + file?.attachmentSource}
                                         alt={`Image ${index}`} className='post_img'/>
                                </div>)
                            })
                        }

                        {
                            (selectedFileType === "VIDEO" || files.every(file => file.mediaType === "VIDEO")) &&
                            files?.map((file, index) => (
                                <div key={index}>
                                    <ReactPlayer
                                        height={height?height:"250px"}
                                        width={"100%"}
                                        className='video_player_outer'
                                        url={file?.url || `${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + file?.id}
                                        controls={true}
                                    />
                                </div>
                            ))

                        }


                    </Slider>

                </div>


                :

                <div className={"coment_view_carousal w-100"}>
                    <Slider {...settings}>

                        {
                            files?.length === 0 && <Image src={noImageAvailable} alt={`Image 23F`} className='post_img'/>
                        }

                        {
                            enableShowPlannerModel === true && Array.isArray(files) && files.length > 0 && files[0].mediaType === "IMAGE" &&

                            <Image
                                src={(files[0].postStatus && files[0].postStatus === "SCHEDULED") ? "data:image/jpeg; base64," + files[0]?.imageURL : files[0]?.imageURL}
                                alt={`Image`} className='post_img'/>
                        }

                        {
                            enableShowPlannerModel === true && Array.isArray(files) && files.length > 0 && files[0].mediaType === "VIDEO" &&
                            <ReactPlayer
                                height={"114px"}
                                width={"100%"}
                                className=''
                                url={`${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + files[0].sourceURL}
                                controls={true}
                            />
                        }


                        {
                            enableShowPlannerModel === false && Array.isArray(files) && files.length > 0 && files?.map((file, index) => {

                                return (<div key={index}>

                                    {file?.mediaType === "IMAGE" || showThumbnail  || !file.sourceURL?
                                        <div className={className ? className : "post_image_outerwrapper"}>
                                            <Image
                                                src={isPublished ? file?.imageURL : "data:image/jpeg; base64," + file?.imageURL}
                                                alt={`Image ${index}`} className='post_img'/></div>
                                        :

                                        <ReactPlayer
                                            width={"100%"}
                                            className={className ? className : 'video_player_outer'}
                                            url={isPublished ? file.sourceURL || file?.imageURL : `${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + file.sourceURL}
                                            controls={true}
                                        />

                                    }
                                </div>)
                            })
                        }


                    </Slider>
                </div>
            }

        </>
    )

}

export default CommonSlider;
