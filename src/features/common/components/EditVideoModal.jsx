import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import "./common.css"
const EditVideoModal = ({videoInfo,showEditVideoModal,setShowEditVideoModal,getVideoBlob}) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState(0);
  const [endTimeMs, setEndTimeMs] = useState(0);
  
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFileValue, setVideoFileValue] = useState('');  
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');

  const ffmpegRef = useRef(new FFmpeg());


  const videoRef = useRef(null)
  const messageRef = useRef(null)
  let initialSliderValue = 0;
  useEffect(()=>{    
    setVideoFileValue(videoInfo);
    setVideoSrc(URL.createObjectURL(videoInfo.file))
  },[])
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


  useEffect(function(){
   
  },[videoTrimmedUrl])  

    //Called when handle of the nouislider is being dragged
    const updateOnSliderChange = (values, handle) => {
      setVideoTrimmedUrl('');
      let readValue;
      if (handle) {
        readValue = values[handle] | 0;
        if (endTime !== readValue) {
          setEndTime(readValue);
          setEndTimeMs(readValue * 1000);
          
        }
      } else {
        readValue = values[handle] | 0;
        if (initialSliderValue !== readValue) {
          initialSliderValue = readValue;
          if (videoRef && videoRef.current) {
            videoRef.current.currentTime = readValue;
            setStartTime(readValue);
            setStartTimeMs(readValue * 1000)
          }
        }
      }
    };
    //Play the video when the button is clicked
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
  };

  //Pause the video when then the endTime matches the currentTime of the playing video
  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };

  //Trim functionality of the video
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
    
      // const baseURL = "/public/js";       
      // const { name } = videoFileValue.file;      
     
      // const ffmpeg = ffmpegRef.current;      
 
      // ffmpeg.on("log", ({ message }) => {
      //   if (messageRef.current) messageRef.current.innerHTML = message;
      // });    

      // ffmpeg.load({
      //   coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      //   wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`,"application/wasm"),
      //   workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`,"text/javascript"),
      // }).then(()=>console.log("ffmpeg1")).catch((e)=>console.log("ffmpeg",e));

      // //Write video to memory
      // await ffmpeg.writeFile(        
      //   name,
      //   videoFileValue.file,
      // ).then(()=>console.log("ffmpeg2")).catch((e)=>console.log("ffmpeg",e));
      // const videoFileType = videoFileValue.file.type.split('/')[1];
      // //Run the ffmpeg command to trim video
      // await ffmpeg.exec(
      //   '-i',
      //   name,
      //   '-ss',
      //   `${convertToHHMMSS(startTime)}`,
      //   '-to',
      //   `${convertToHHMMSS(endTime)}`,
      //   '-acodec',
      //   'copy',
      //   '-vcodec',
      //   'copy',
      //   `out.${videoFileType}`,
      // ).then(()=>console.log("ffmpeg3")).catch((e)=>console.log("error ",e));   

   
      // const fileData = await ffmpeg.readFile(`out.${videoFileType}`).then(()=>console.log("ffmpeg4")).catch((e)=>console.log("ffmpeg",e));
     
      // const url = URL.createObjectURL(
      //   new Blob([fileData.buffer], { type: videoFileValue.file.type }),
      // );

      setVideoTrimmedUrl(url);    
  };

  //Convert the time obtained from the video to HH:MM:SS format
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
  }
};

// const saveHandler=()=>{
//   console.log("save handler")
//   const addformdata=new FormData
//     addformdata.append("startTime",startTime)
//     addformdata.append("endTime",endTime)
//     addformdata.append("video",videoInfo)
    
//     const fetchtrimvideo=fetch("http://localhost:5000/trim-video",{header:{"Accept":"Application/json"},addformdata})
//     .then((data)=>{
//       console.log(data,"data90")
//       return data})
//     .then((res)=>res.json())
//     .catch((err)=>{console.log("error while fetching data",err)})
// }
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
            limit={30}
            range={{ min: 0, max: videoDuration || 2 }}
            start={[0, videoDuration || 2]}
            connect
            onUpdate={updateOnSliderChange}
          />
          <br />
     
         
          Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{' '}
          {convertToHHMMSS(endTime)}
        
          <br />
          
          <button className='cmn_crop_video_btn ' onClick={handlePlay}>Play</button> &nbsp;
          <button className=" cmn_crop_video_btn "onClick={handleTrim}>Trim</button>
          <button className=" ms-2 cmn_crop_video_btn "onClick={handlePause}>Pause</button>
          <br />
          {videoTrimmedUrl && (
            
            <video controls>
              <source src={videoTrimmedUrl} type={videoFileValue.type} />
            </video>
          )}
        
        </div>
                                                                                
    </Modal.Body>
    <Modal.Footer>                    
    <div className=" ">
        <button className="cmn_btn_color cmn_connect_btn disconnect_btn" onClick={handleClose}> Cancel</button>
        <button type="button" className="cmn_btn_color cmn_connect_btn connect_btn ms-3"
               > Save
        </button>
    </div>

    </Modal.Footer>
</Modal>

      

  
  )
}

export default EditVideoModal
