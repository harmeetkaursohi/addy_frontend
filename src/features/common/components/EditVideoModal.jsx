import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';


import "./common.css"
let ffmpeg;

const EditVideoModal = ({videoInfo,showEditVideoModal,setShowEditVideoModal,setTrimmedVideoUrl,setVideoBlob,isReuired}) => {
console.log(videoInfo,"videoInfo",isReuired,"isReuired")
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

    console.log("fdsfds");
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


  
 
  const handleTrim = async () => {
    console.log("hlow")
    if (isScriptLoaded) {
      
     const { name, type } = videoFileValue.file;
    
     const fileData = await window.FFmpeg.fetchFile(videoFileValue.url, {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        // Add any other headers you need here
      }
      });
      // Write video to memory
      ffmpeg.FS('writeFile', name, fileData);
      const videoFileType = type.split('/')[1];
      // Run the ffmpeg command to trim video
      await ffmpeg.run(
        '-i',
        name,
        '-ss',
        `${convertToHHMMSS(startTime)}`,
        '-to',
        `${convertToHHMMSS(endTime)}`,
        '-acodec',
        'copy',
        '-vcodec',
        'copy',
        `out.${videoFileType}`,
      );
      // Convert data to URL and store it in videoTrimmedUrl state
      const data = ffmpeg.FS('readFile', `out.${videoFileType}`);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: videoFileValue.type }));
      var file = new File([data.buffer], name, {type: type});

      setVideoBlobData(file)
      setVideoTrimmedUrl(url);
    }
  };
 


  const handleTrim1 = async () => {
   
    if (isScriptLoaded) {

      const name=videoFileValue.fileName
     const { fileName , mediaType  } = videoFileValue;
     const fileExtension = fileName.split('.').pop();

     // Append file extension to mediaType
     const newMediaType = `${mediaType}/${fileExtension}`;
     
     const fileData = `${import.meta.env.VITE_APP_API_BASE_URL}` + "/attachments/" + videoInfo?.id;

     // Create a Blob object from the data
     const blob = new Blob([fileData], { type: mediaType });
     
     // Create a new File object from the Blob and specify the filename
     const fileinfo = new File([blob], name, { type: mediaType});
     console.log(fileinfo,"filedata56")

      // Write video to memory
      ffmpeg.FS('writeFile', name, await window.FFmpeg.fetchFile(fileinfo));

      const videoFileType = newMediaType.split('/')[1];

      // Run the ffmpeg command to trim video
      await ffmpeg.run(
        '-i',
        name,
        '-ss',
        `${convertToHHMMSS(startTime)}`,
        '-to',
        `${convertToHHMMSS(endTime)}`,
        '-acodec',
        'copy',
        '-vcodec',
        'copy',
        `out.${videoFileType}`,
      );
      // Convert data to URL and store it in videoTrimmedUrl state
      const data = ffmpeg.FS('readFile', `out.${videoFileType}`);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: newMediaType }));

      var file = new File([data.buffer], name, {type: type});


      setVideoBlobData(file)
      setVideoTrimmedUrl(url);
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
  setVideoBlob(videoBlobData)
  
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
            // limit={130}
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
          <button className=" cmn_crop_video_btn "onClick={isReuired? handleTrim1:handleTrim}>Trim</button>
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
        <button disabled={videoTrimmedUrl===undefined|| videoTrimmedUrl===null}onClick={saveHandler} type="button" className={videoTrimmedUrl===undefined|| videoTrimmedUrl===null? "disabled-button":"cmn_btn_color cmn_connect_btn connect_btn ms-3"}
               > Save
        </button>
    </div>

    </Modal.Footer>
</Modal>

      

  
  )
}

export default EditVideoModal
