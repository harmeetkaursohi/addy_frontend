import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import noImageAvailable from "../../../images/no_img_posted.png"
import ReactPlayer from "react-player";


const CommonSlider = ({files, selectedFileType, caption, hashTag, viewSimilarToSocialMedia = true}) => {
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
            {viewSimilarToSocialMedia ? <Slider {...settings} >
                    {
                        (selectedFileType === "IMAGE") &&

                        files?.map((file, index) => (
                            <div key={index}>
                                <p className="caption_text">{`${caption} ${hashTag}`}</p>
                                <img src={file.url} alt={`Image ${index}`} className='post_img'/>
                            </div>
                        ))
                    }

                    {
                        (selectedFileType === "VIDEO") &&

                        files?.map((file, index) => (
                            <div key={index}>
                                <ReactPlayer
                                    className='post_img'
                                    url={file.url}
                                    controls={true}
                                />
                            </div>
                        ))

                    }


                </Slider>

                :

                <Slider {...settings} >

                    {
                        files.length <= 0 && <img src={noImageAvailable} alt={`Image`} className='post_img'/>
                    }

                    {
                        Array.isArray(files) && files.length > 0 && files?.map((file, index) => (
                            <div key={index}>
                                <img src={file?.imageURL} alt={`Image ${index}`} className='post_img'/>
                            </div>
                        ))
                    }

                </Slider>
            }

        </>
    )

}

export default CommonSlider;