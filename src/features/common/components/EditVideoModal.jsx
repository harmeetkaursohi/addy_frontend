import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import axios from 'axios';

import "./common.css"
let ffmpeg;

const EditVideoModal = ({videoInfo,showEditVideoModal,setShowEditVideoModal,setTrimmedVideoUrl,setBlobVideo,isReuired}) => {

  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const[videoBlobData,setVideoBlobData]=useState(null)
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');  
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');
  const [play,setPlay]=useState(false)




  const videoRef = useRef(null)

  let initialSliderValue = 0;
 

  const loadScript = (src) => {
    return new Promise((onFulfilled, _) => {
      
      const script = document.createElement('script');
      let loaded;
      script.async = 'async';
      script.defer = 'defer';
      script.setAttribute('src', src);
      
      script.onreadystatechange = script.onload = () => {
        
        if (!loaded) {
          onFulfilled(script);
        }
        loaded = true;
      };
      script.onerror = function () {
        console.log('Script failed to load');
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  };

  useEffect(()=>{
    setVideoFileValue(videoInfo);
    setVideoSrc(videoInfo.url? videoInfo.url:`${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + videoInfo?.id)
    // setVideoSrc(URL.createObjectURL(videoInfo?.file!==null?videoInfo?.file:`${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + file?.id))
  },[])

 
  useEffect(() => {

 
    // Load the ffmpeg script
    loadScript('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js').then(() => {
      if (typeof window !== 'undefined') {
        // Create a dummy SharedArrayBuffer if SharedArrayBuffer is not defined
        if (typeof SharedArrayBuffer === 'undefined') {
          const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 100, shared: true });
          globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor;
        }
        
        // Create the ffmpeg instance
        ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
        
        // Load ffmpeg.wasm-core script
        ffmpeg.load();
        
        // Set true that the script is loaded
        setIsScriptLoaded(true);
      }
    }).catch((err) => console.error(err));
    
  }, []);

   //Get the duration of the video using videoRef
   useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
      
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);




    //Called when handle of the nouislider is being dragged
    const updateOnSliderChange = (values, handle) => {
      setVideoTrimmedUrl('');
      let readValue;
      if (handle) {
        readValue = values[handle] | 0;
        if (endTime !== readValue) {
          setEndTime(readValue);
     
          
        }
      } else {
        readValue = values[handle] | 0;
        if (initialSliderValue !== readValue) {
          initialSliderValue = readValue;
          if (videoRef && videoRef.current) {
            videoRef.current.currentTime = readValue;
            setStartTime(readValue);
         
          }
        }
      }
    };
    //Play the video when the button is clicked
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
      setPlay(true)
    }
  };

  //Pause the video when then the endTime matches the currentTime of the playing video
  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };


 let isTrimming=false

  const handleTrim = async () => {
     const videoDurationSeconds = endTime - startTime;
  
        if (videoDurationSeconds < 4) {
       
            alert('Video duration must be at least 4 seconds.');
            return;
        }
        if (videoDurationSeconds > 15 * 60) { 
        
            alert('Video duration cannot exceed 15 minutes.');
            return;
        }
    if (isTrimming) {
        console.log("Trimming is already in progress. Skipping.");
        return;
    }

    try {
      
        isTrimming = true;


        if (isScriptLoaded) {
            const { name, type } = videoFileValue.file;
            
            // Fetch file using Axios with custom headers
            const response = await axios.get(videoFileValue.url, {
                responseType: 'blob',
                // headers: {
                //   'Cross-Origin-Embedder-Policy': 'require-corp',
                //   'Cross-Origin-Opener-Policy': 'same-origin'
                // }
            });
          
            const fileData = response.data;
            ffmpeg.FS('writeFile', name, new Uint8Array(await fileData.arrayBuffer()));

            const videoFileType = type.split('/')[1];
            await ffmpeg.run(
                '-i', name,
                '-ss', `${convertToHHMMSS(startTime)}`,
                '-to', `${convertToHHMMSS(endTime)}`,
                '-acodec', 'copy',
                '-vcodec', 'copy',
                `out.${videoFileType}`
            );
            const data = ffmpeg.FS('readFile', `out.${videoFileType}`);
            const trimmedBlob = new Blob([data.buffer], { type: videoFileValue.type });
            const trimmedUrl = URL.createObjectURL(trimmedBlob);
            const trimmedFile = new File([data.buffer], name, { type: type });
            setVideoBlobData(trimmedFile);
            setVideoTrimmedUrl(trimmedUrl);
        }
    } catch (error) {
        console.error("Error while trimming video:", error);
    } finally {

        isTrimming = false;
    }
};


  
    



  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
   
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    // only mm:ss
    if (hours === '00') {
      time = minutes + ':' + seconds;
    } else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    
    return time;
  };
  
  const handleClose=()=>{
    setShowEditVideoModal(false)
  }

 const handlePause = () => {
  if (videoRef && videoRef.current) {
    videoRef.current.pause();
    setPlay(false)
  }
};

const saveHandler=()=>{
  setTrimmedVideoUrl(videoTrimmedUrl)
  setBlobVideo(videoBlobData)
  
  setShowEditVideoModal(false)
}

  return (
    <Modal className='facebook_modal_outer' size="md" show={showEditVideoModal} onHide={handleClose} backdrop="static">
    <Modal.Header closeButton>
        <Modal.Title className="CropImageModal_header">
            <div className='facebook_title'>
                <h2 className='cmn_text_style'>Edit video</h2>
            </div>
        </Modal.Title>
    </Modal.Header>
    <Modal.Body className='crop-image-parent container'>                    
        <div className='crop-image-container video-element-container'>   
        <video className='w-100'  src={videoSrc} ref={videoRef} onTimeUpdate={handlePauseVideo} >
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
          <Nouislider
            behaviour="tap-drag"
            step={1}
            margin={3}
            // limit={60*3}
            range={{ min: 0, max: videoDuration || 2 }}
            start={[0, videoDuration || 2]}
            connect
            onUpdate={updateOnSliderChange}
          />
          <br />
     
         
          Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{' '}
          {convertToHHMMSS(endTime)}
        
          <br />
          
          <button className='cmn_crop_video_btn ' onClick={play? handlePause: handlePlay }>{play?"Pause":"Play"}</button> &nbsp;
          <button className=" cmn_crop_video_btn "onClick={handleTrim}>Trim</button>
          <br />
          {videoTrimmedUrl && (
            
            <video controls>
              <source src={videoTrimmedUrl} type={videoFileValue.type} />
            </video>
          )}
        
        </div>
                                                                                
    </Modal.Body>
    <Modal.Footer>                    
    <div className="editvideobtn_outer ">
        <button className="cmn_btn_color cmn_connect_btn disconnect_btn editVideo_cancel_btn" onClick={handleClose}> Cancel</button>
        <button disabled={videoTrimmedUrl.length===0} onClick={saveHandler} type="button" className={`ms-3 connect_btn ${videoTrimmedUrl.length===0?"disabled-button": "cmn_btn_color cmn_connect_btn  "}`}
               > Save
        </button>
    </div>

    </Modal.Footer>
</Modal>

      

  
  )
}

export default EditVideoModal
