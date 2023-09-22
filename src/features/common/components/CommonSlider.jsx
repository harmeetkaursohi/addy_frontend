import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";

const CommonSlider = ({files, selectedFileType,caption}) => {

    const settings = {
        arrows:false,
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
                    (selectedFileType === "IMAGE") &&

                    files?.map((file, index) => (
                        <div key={index}>
                            <p className="caption_text">{caption}</p>
                            <img  src={URL.createObjectURL(file)} alt={`Image ${index}`} className='post_img'/>
                        </div>
                    ))
                }

                {
                    (selectedFileType === "VIDEO") &&

                    files?.map((file, index) => (
                        <div key={index}>
                            <video src={URL.createObjectURL(file)} alt={`Videos ${index}`} className='post_img'
                                   autoPlay={true}/>
                        </div>
                    ))
                }


            </Slider>
        </>
    )

}

export default CommonSlider;