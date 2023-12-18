import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import nature_img from "../../images/nature.png"
import Slider from "react-slick";
import "./slider.css"
function Carousel() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:true
  };
  return (
    <div className="slider_outer_container content_outer">
    <Slider {...settings}>
        {/* first slider */}
      <div className="caresoul_wrapper_box">
        <div className="row">
          <div className="col-lg-4 col-sm-12 col-md-12 pe-0">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>

            </div>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-12 pe-0">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>
              
            </div>
          </div>

          <div className="col-lg-4 col-sm-12 col-md-12 pe-0">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>
              
            </div>
          </div>

        </div>
      </div>
      {/* second slider */}
      <div className="caresoul_wrapper_box">
        <div className="row">
          <div className="col-lg-4 col-sm-12 col-md-12">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>

            </div>
          </div>
          <div className="col-lg-4 col-sm-12 col-md-12">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>
              
            </div>
          </div>

          <div className="col-lg-4 col-sm-12 col-md-12">
            <div className="slider_innnerContent">

            
              <Card className="card_body_content">
             
                <Card.Body className="p-0">
                <div className="caresoul_inner_content_outer">
                   <img src={nature_img} className="caresoul_img"/>
                   <div className="date_Time_container">
                    <input type="date"/>
                   </div>
                </div>
                   <ul className="top_city_list acountReach_content_container">
                            <li>
                                <h4 className="cmn_small_heading">Account Reach</h4>
                                <h3>7</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Likes</h4>
                                <h3>3</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Comments</h4>
                                <h3>5</h3>
                            </li>
                            <li>
                                <h4 className="cmn_small_heading">Total Share</h4>
                                <h3>5</h3>
                            </li>
                          </ul>
                </Card.Body>
              </Card>
              
            </div>
          </div>

        </div>
      </div>

      {/* third slider */}
      <div className="caresoul_wrapper_box">
        <h3>3</h3>
      </div>
    </Slider>

    </div>
  );
}

export default Carousel;
