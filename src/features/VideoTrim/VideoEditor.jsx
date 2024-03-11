import { createFFmpeg } from "@ffmpeg/ffmpeg"
import { useEffect, useState } from "react"
import { Slider, Spin } from "antd"
import { VideoPlayer } from "../VideoTrim/VideoPlayer"
import { sliderValueToVideoTime } from "../../utils/commonUtils"
import VideoUpload from "../VideoTrim/VideoUpload"
import VideoConversionButton from "../VideoTrim/VideoConversionButton"
const ffmpeg = createFFmpeg({ log: true })

function VideoEditor() {
    const [ffmpegLoaded, setFFmpegLoaded] = useState(false)
    const [videoFile, setVideoFile] = useState()
    const [videoPlayerState, setVideoPlayerState] = useState()
    const [videoPlayer, setVideoPlayer] = useState()
    const [videoURL, setVideoURL] = useState()
    const [sliderValues, setSliderValues] = useState([0, 100])
    const [loader, setLoader] = useState(false)
console.log(videoURL,"videoURL",ffmpegLoaded,"ffmpegLoaded")
useEffect(() => {
    ffmpeg.load()
        .then(() => {
            setFFmpegLoaded(true);
        })
        .catch(error => {
            console.error('Error loading ffmpeg:', error);
        });
}, []);

    useEffect(() => {
        const min = sliderValues[0]
        if (min !== undefined && videoPlayerState && videoPlayer) {
            videoPlayer.seek(sliderValueToVideoTime(
                videoPlayerState.duration, min
            ))
        }
    }, [sliderValues])

    useEffect(() => {
        if (videoPlayer && videoPlayerState) {
            const [min, max] = sliderValues

            const minTime =sliderValueToVideoTime(videoPlayerState.duration,min)
            const maxTime =sliderValueToVideoTime(videoPlayerState.duration,max)

            if (videoPlayerState.currentTime < minTime) {
                videoPlayer.seek(minTime)
            }
            if (videoPlayerState.currentTime > maxTime) {
                videoPlayer.seek(minTime)
            }
        }
    }, [videoPlayerState])

    useEffect(() => {
        if (!videoFile) {
            setVideoPlayerState(undefined)
            setSliderValues([0, 100])
            setVideoPlayerState(undefined)
            setVideoURL(undefined)
        }
    }, [videoFile])

    return (
        <div>
            {/* <Spin
                spinning={loader || !ffmpegLoaded}
                tip={!ffmpegLoaded ? "Waiting for FFmpeg to load..."
                    :"Loading..."}
            > */}
                <div>
                    {videoFile ? (
                        <VideoPlayer
                            src={URL.createObjectURL(videoFile)}
                            onPlayerChange={(videoPlayer) => {
                                setVideoPlayer(videoPlayer)
                            }}
                            onChange={(videoPlayerState) => {
                                setVideoPlayerState(videoPlayerState)
                            }}
                        />
                    ) : (
                        <h1>Upload a video</h1>
                    )}
                </div>
                <div className="upload-div">
                    <VideoUpload
                        disabled={!!videoFile}
                        onChange={(videoFile) => {
                            console.log("videoFile===>",videoFile)
                            setVideoFile(videoFile)
                        }}
                        onRemove={() => {
                            setVideoFile(undefined)
                        }}
                    />
                </div>
                <div className={"slider-div"}>
                    <h3>Cut Video</h3>
                    <Slider
                        // disabled={!videoPlayerState}
                        value={sliderValues}
                        range={true}
                        onChange={(values) => {
                            setSliderValues(values)
                        }}
                        tooltip={{
                            formatter: null,
                        }}
                    />
                </div>
                <div className={"conversion-div"}>
                    <VideoConversionButton
                        onConversionStart={() => {
                            setLoader(true)
                        }}
                        onConversionEnd={() => {
                            setLoader(false)
                        }}
                        ffmpeg={ffmpeg}
                        videoPlayerState={videoPlayerState}
                        sliderValues={sliderValues}
                        videoFile={videoFile}
                        onVideoCreated={(videoURL) => {
                            console.log("videoURL===>",videoURL)
                            setVideoURL(videoURL)
                        }}

                    />
                </div>
                {videoURL && (
                    <div className="gif-div">
                        <h3>Resulting Trimmed Video</h3>
                        <video src={URL.createObjectURL(videoURL)}
                               className="gif"
                               controls
                               alt="Trimmed video generated on the client side" />
                        <a href={URL.createObjectURL(videoURL)}
                           download="trimmed_video.mp4"
                           className="ant-btn ant-btn-default">
                            Download
                        </a>
                    </div>
                )}

            {/* </Spin> */}
        </div>
    )
}

export default VideoEditor
