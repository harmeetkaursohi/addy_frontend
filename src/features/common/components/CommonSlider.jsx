import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import noImageAvailable from "../../../images/no_img_posted.png"
import ReactPlayer from "react-player";


const CommonSlider = ({
                          files,
                          selectedFileType = "",
                          caption,
                          hashTag,
                          showThumbnail = false,
                          viewSimilarToSocialMedia = true,
                          height = "350px"
                      }) => {

    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
            {viewSimilarToSocialMedia ?
                <div>
                    <p className="caption_text">{`${caption} ${hashTag}`}</p>

                    <Slider {...settings} >

                        {
                            (selectedFileType === "IMAGE" || files.every(file => file.mediaType === "IMAGE")) &&

                            files?.map((file, index) => {
                                return (<div key={index}>
                                    <img src={file?.url || "data:image/jpeg; base64," + file?.attachmentSource}
                                         alt={`Image ${index}`} className='post_img'/>
                                </div>)
                            })
                        }

                        {
                            (selectedFileType === "VIDEO" || files.every(file => file.mediaType === "VIDEO")) &&
                            files?.map((file, index) => (
                                <div key={index}>
                                    <ReactPlayer
                                        height={"100%"}
                                        width={"100%"}
                                        className='post_img'
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
                            files.length === 0 && <img src={noImageAvailable} alt={`Image`} className='post_img'/>
                        }

                        {
                            Array.isArray(files) && files.length > 0 && files?.map((file, index) => (
                                <div key={index}>
                                    {file?.mediaType === "IMAGE" || showThumbnail ?
                                        <img src={"data:image/jpeg; base64,"+ file?.imageURL} alt={`Image ${index}`} className='post_img'/>
                                        :
                                        <ReactPlayer
                                            height={height}
                                            width={"100%"}
                                            className=''
                                            url={`${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + file.sourceURL}
                                            controls={true}
                                        />

                                    }


                                </div>
                            ))
                        }


                    </Slider>
                </div>
            }

        </>
    )

}

export default CommonSlider;