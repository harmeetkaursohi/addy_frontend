import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";

const CommonSlider = ({files, selectedFileType, caption, hashTag}) => {

    console.log("@@@ files ",files)

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
            <Slider {...settings} >
                {
                    // (selectedFileType === "IMAGE") &&

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
                            <video src={file.url} alt={`Videos ${index}`} className='post_img'
                                   autoPlay={true}/>
                        </div>
                    ))
                }


            </Slider>
        </>
    )

}

export default CommonSlider;