import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { sliderValueToVideoTime } from "../../utils/commonUtils";

function VideoConversionButton({
                                   videoPlayerState,
                                   sliderValues,
                                   videoFile,
                                   ffmpeg,
                                   onConversionStart = () => {},
                                   onConversionEnd = () => {},
                                   onVideoCreated = () => {},
                               }) {

    const trimVideo = async () => {
        console.log("trim_handler")
        //loader
        onConversionStart(true);

        const inputFileName = "input.mp4";
        const outputFileName = "output.mp4";

        // writing the video file to memory
        ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

        const [min, max] = sliderValues;
        const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
        const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);
      console.log("min",minTime,"max",maxTime)
        await ffmpeg.run(
            "-i",
            inputFileName,
            "-ss",
            `${minTime}`,
            "-to",
            `${maxTime}`,
            "-c",
            "copy",
            outputFileName
        );

        const data = ffmpeg.FS("readFile", outputFileName);

        const videoUrl = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );

        const response = await fetch(videoUrl);
        const videoData = await response.blob();

        const trimmedVideoFile = new File([videoData], "trimmed_video.mp4", { type: "video/mp4" });

        console.log("trimmedVideoFile===>", trimmedVideoFile);
        onVideoCreated(trimmedVideoFile)
        onConversionEnd(false);
    };


    return (
        <Button className="ms-2 cmn_crop_video_btn " onClick={() => trimVideo()}>Trim Video</Button>
    );
}

export default VideoConversionButton;
