import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RxCross2 } from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview";
function PostViewModal({ setShowPostPerview, showPostPerview }) {
  const handleClose = () => setShowPostPerview(false);

  return (
    <>
    
        <Modal
          size="lg"
          show={showPostPerview}
          onHide={handleClose}
          className="alert_modal_body"
          centered
        >
          <div
            className="pop_up_cross_icon_outer  cursor-pointer"
            onClick={(e) => {
              handleClose();
            }}
          >
            <RxCross2 className="pop_up_cross_icon" />
          </div>
          <Modal.Body className="individual_post_content">
          <div className="CommonFeedPreview_container">
   <div>
      <h2 className="cmn_white_text feed_preview facebookFeedpreview_text">Facebook feed Preview</h2>
      <div className="preview_wrapper">
         <div className="user_profile_info">
            <img src="https://scontent.fixc1-3.fna.fbcdn.net/v/t39.30808-1/417835612_122103076028176525_7949149705870830849_n.png?stp=cp0_dst-png_s50x50&amp;_nc_cat=102&amp;ccb=1-7&amp;_nc_sid=6738e8&amp;_nc_ohc=VJhCXtPMkZIQ7kNvgG3XXtz&amp;_nc_zt=24&amp;_nc_ht=scontent.fixc1-3.fna&amp;edm=AJdBtusEAAAA&amp;_nc_gid=A_eXutOsmWy9aoY0kZuI_I3&amp;oh=00_AYBEepeZmOWgzCishk6tuq4611w36JsutudhFIP6DdUBpA&amp;oe=671E4AB1" alt="user image" height="36px" width="36px" />
            <div>
               <h3 className="create_post_text user_name boost_post_text">Addy Ads</h3>
               <h6 className="status create_post_text">
                  <img src="/src/images/ellipse.svg" alt="ellipse image" className="ms-1" /> just now
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" className="world_icon ms-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 2c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zm2 2c0 1-.5 2-1.5 2s-1.5 1-1.5 2v3s1 0 1-3c0-.553.447-1 1-1s1 .447 1 1v3c-.552 0-1 .448-1 1s.448 1 1 1c.553 0 1-.448 1-1h1v-2l1 1-1 1c0 3 0 3-2 4 0-1-1-1-3-1v-2l-2-2v-2c-1 0-1 1-1 1l-.561-.561-2.39-2.39c.11-.192.225-.382.35-.564l.523-.678c1.468-1.716 3.644-2.807 6.078-2.807.691 0 1.359.098 2 .262v.738z"></path>
                  </svg>
               </h6>
            </div>
         </div>
         <div>
            <div className="ms-2    undefined"><span> </span><span> </span></div>
         </div>
         <div className="like_comment_outer">
            <div className="fb_likes">
               <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
               </svg>
               <h3 className="cmn_text_style">Likes</h3>
            </div>
            <div className="fb_likes">
               <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="fb_cmt_icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path>
               </svg>
               <h3 className="cmn_text_style">Comment</h3>
            </div>
            <div className="fb_likes">
               <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z"></path>
               </svg>
               <h3 className="cmn_text_style">Share</h3>
            </div>
         </div>
      </div>
   </div>
   <div>
      <h2 className="cmn_white_text feed_preview facebookFeedpreview_text">Linkedin feed Preview</h2>
      <div className="preview_wrapper ">
         <div>
            <div className="user_profile_info">
               <img src="/src/images/default_user_icon.svg" alt="default image" height="30px" width="30px" className="" />
               <div>
                  <h3 className="create_post_text user_name boost_post_text">
                     testinghub 
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" className="FaLinkedin_icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
                     </svg>
                  </h3>
                  <h6 className="status create_post_text">
                     <img src="/src/images/ellipse.svg" alt="ellipse image" className="ms-1"/> just now
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" className="world_icon ms-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zm2 2c0 1-.5 2-1.5 2s-1.5 1-1.5 2v3s1 0 1-3c0-.553.447-1 1-1s1 .447 1 1v3c-.552 0-1 .448-1 1s.448 1 1 1c.553 0 1-.448 1-1h1v-2l1 1-1 1c0 3 0 3-2 4 0-1-1-1-3-1v-2l-2-2v-2c-1 0-1 1-1 1l-.561-.561-2.39-2.39c.11-.192.225-.382.35-.564l.523-.678c1.468-1.716 3.644-2.807 6.078-2.807.691 0 1.359.098 2 .262v.738z"></path>
                     </svg>
                  </h6>
               </div>
            </div>
            <div className="linkedInimg_container ">
               <div className=" linkedin_post_likes">
                  <div className="linkedin_dropdown">
                     <img src="/src/images/default_user_icon.svg" alt="social icon" height="30px" width="30px" />
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M128 192l128 128 128-128z"></path>
                     </svg>
                  </div>
                  <div className="linkedin_likes">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="thumbsup_icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M608.544 1023.744c-290.832 0-293.071-12.062-329.087-39.183-19.104-14.368-55.151-24.32-186.815-32.896-9.552-.624-18.64-4.288-24.735-11.68-2.8-3.408-68.592-99.36-68.592-253.04 0-151.44 47.088-220.465 49.103-223.665a31.965 31.965 0 0 1 27.12-15.04c108.112 0 257.984-138 358.736-378.896C451.698 27.68 455.298.272 519.298.272c36.4 0 77.2 26.064 97.344 59.505 41.328 68.32 20.335 215.057.927 293.473 66-.528 185.472-1.425 242.32-1.425 79.072 0 131.407 47.152 132.991 116.08.529 22.752-2.464 51.808-9.04 66.848 17.408 17.36 39.857 43.536 40.832 77.248 1.216 43.52-27.28 76.655-45.472 95.663 4.175 12.656 12.527 29.44 11.71 49.505-2 49.344-40.095 81.136-63.823 97.727 1.968 13.504 3.504 38.976-.832 58.672-17.12 78.609-132.4 110.177-317.712 110.177zM109.617 886.77c114.688 9.489 175.998 22.336 208.334 46.672 25.024 18.848 21.168 26.32 290.592 26.32 82.176 0 242.896-3.424 255.216-59.84 4.896-22.56-18.895-44.735-18.976-44.911-6.496-16.032.737-34.849 16.577-41.777.255-.128 64.143-23.007 65.6-58.72.96-22.831-14.72-36.543-15.072-37.12-9.328-14.463-5.92-34.303 8.224-44.16.16-.128 41.551-25.215 40.543-59.423-.784-27.168-36.576-46.289-37.664-46.928-8-4.576-13.824-12.496-15.648-21.552-1.792-9.04.224-18.528 5.84-25.872 0 0 16.272-25.856 15.68-50.112-1.168-51.92-57.007-53.552-68.992-53.552-80.72 0-288.03.816-288.03.816-11.184.048-20.864-5.232-26.88-14.176-6-8.945-6.448-20.048-2.928-30.224 31.263-90.032 48.72-231.28 19.727-279.536-8.544-14.224-10.496-28.432-42.496-28.432-4.432 0-14.991 3.504-25.999 29.744-106.928 255.84-266.64 403.824-397.456 417.168-11.28 25.728-32.496 79.04-32.496 175.775 0 98.737 31.28 175.12 46.305 199.84z"></path>
                     </svg>
                     <h3 className="cmn_text_style">Like</h3>
                  </div>
                  <div className="linkedin_likes">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path>
                     </svg>
                     <h3 className="cmn_text_style">Comment</h3>
                  </div>
                  <div className="linkedin_likes">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="repost__icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"></path>
                     </svg>
                     <h3 className="cmn_text_style">Repost</h3>
                  </div>
                  <div className="linkedin_likes">
                     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M435.9 64.9l-367.1 160c-6.5 3.1-6.3 12.4.3 15.3l99.3 56.1c5.9 3.3 13.2 2.6 18.3-1.8l195.8-168.8c1.3-1.1 4.4-3.2 5.6-2 1.3 1.3-.7 4.3-1.8 5.6L216.9 320.1c-4.7 5.3-5.4 13.1-1.6 19.1l64.9 104.1c3.2 6.3 12.3 6.2 15.2-.2L447.2 76c3.3-7.2-4.2-14.5-11.3-11.1z"></path>
                     </svg>
                     <h3 className="cmn_text_style">Send</h3>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
          </Modal.Body>
        </Modal>
    
    </>
  );
}

export default PostViewModal;
