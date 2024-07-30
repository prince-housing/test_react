import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const mimeTypes = [
  'video/webm; codecs="vp8, vorbis"',
  'video/ogg; codecs="theora, vorbis"',
  'video/mp4; codecs="avc1.64001e, mp4a.40.2"',
  'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
  'video/mp4'
];
const mimeCodec = mimeTypes[3];
const chunkSize = 500 * 1024;

const ChunkedVideoPlayer = forwardRef((props, fwdRef) => {
  const {
    videoUrl,
    preloadPercentage = 20,
    controls = false,
    width,
    height,
    preload = "metaData",
    poster,
    style,
    autoPlay,
    muted = true,
    onTimeUpdate,
    onEnded,
    onPlay,
  } = props;
  const videoRef = useRef(null);
  const fetchAndAppendChunkCallNumber = useRef(0);
  // eslint-disable-next-line no-unused-vars
  const [mediaSource, setMediaSource] = useState(null);
  const [sourceBuffer, setSourceBuffer] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isBuffering, setIsBuffering] = useState(false);
  const [lastBufferBytes, setLastBufferBytes] = useState(0);
  const [videoSize, setVideoSize] = useState(0);

  const playVideo = (time = 0) => {
    if (videoRef?.current) {
      //   videoRef.current.currentTime = time;
      console.log(
        "here comes in play video",
        time,
        videoRef.current.src,
        videoRef.current.currentTime,
        videoRef.current.duration
      );
      // videoRef.current.src = videoUrl
      videoRef.current.play().then(() => {
        console.log("here comes in playing...:");
      }).catch((error) => {
        console.error("here comes in Error playing video:", error);
      });
    }
  };
  const pauseVideo = () => {
    if (videoRef?.current) {
      videoRef.current.pause();
    }
  };
  const resetVideo = () => {
    if (videoRef?.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  const getCurrentTime = () => {
    return videoRef?.current?.currentTime || 0;
  };
  const getDuration = () => {
    return videoRef?.current?.duration || 0;
  };
  const getVideoSize = async (url) => {
    const response = await fetch(url, { method: "HEAD" });
    const contentLength = response.headers.get("Content-Length");
    const contentType = response.headers.get("Content-Type");
    console.log("here comes in getVideoSize", contentLength, contentType);
    return parseInt(contentLength, 10);
  };
  const fetchAndAppendChunk = async (start, end, sourceBuffer) => {
    console.log("Fetching and appending chunk:", start, end);
    setIsBuffering(true);

    try {
      const response = await fetch(videoUrl, {
        headers: { Range: `bytes=${start}-${end}` },
      });

      // const blob = await response.blob();
      const chunk = await response.arrayBuffer();
      console.log(
        "here comes in fetchAndAppendChunk sourceBuffer.updating 0 ",
        sourceBuffer.updating
      );
      sourceBuffer.appendBuffer(chunk);
      console.log(
        "here comes in fetchAndAppendChunk sourceBuffer.updating 1",
        sourceBuffer.updating,
      );

      setIsBuffering(false);
    } catch (error) {
      console.error("Error fetching video chunk:", error);
      setIsBuffering(false);
    }
  };

  const startPreloadVideo = async () => {
    if (
      videoRef.current &&
      "MediaSource" in window &&
      MediaSource.isTypeSupported(mimeCodec)
    ) {
      const mediaSource = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSource);
      videoRef.current.crossOrigin = 'anonymous';


      mediaSource.addEventListener("sourceopen", async () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
          const videoSize = await getVideoSize(videoUrl);
          const preloadSize = Math.ceil(videoSize * (preloadPercentage / 100));
          console.log(
            "here comes in ---  startPreloadVideo video dimensions",
            chunkSize,
            preloadSize,
            videoSize
          );
          setSourceBuffer(sourceBuffer);
          setMediaSource(mediaSource);
          setVideoSize(videoSize);
          setLastBufferBytes(preloadSize);

          await fetchAndAppendChunk(0, preloadSize, sourceBuffer);
          sourceBuffer.addEventListener(
            "updateend",
            () => {
              console.log("here comes in ---  startPreloadVideo updateend -- ");
              if (autoPlay && videoRef.current.paused) {
                playVideo();
              }
            },
            { once: true }
          );
        } catch (error) {
          console.error("Error during source buffer operations:", error);
        }
      });
      mediaSource.addEventListener("error", (e) => {
        console.error("MediaSource error:", e);
      });
    } else {
      console.error("Unsupported MIME type or codec: ", mimeCodec);
    }
  };
  useImperativeHandle(fwdRef, () => ({
    play: playVideo,
    pause: pauseVideo,
    reset: resetVideo,
    getCurrentTime: getCurrentTime,
    getDuration: getDuration,
    startPreloadVideo: startPreloadVideo,
  }));

  useEffect(() => {
    console.log("here comes in --- useEffect", videoUrl, preloadPercentage);
    if (autoPlay) {
      startPreloadVideo();
    }
  }, [videoUrl, preloadPercentage]);

  const handleBufferWaiting = async () => {
    console.log("here comes in --- handleBufferWaiting", fetchAndAppendChunkCallNumber.current);
    if (lastBufferBytes < videoSize && fetchAndAppendChunkCallNumber.current > 0) {
      const start = lastBufferBytes + 1;
      const tempEnd = start + chunkSize;
      const end = tempEnd > videoSize ? videoSize - 1 : tempEnd;
      console.log("here comes in --- buffering", start, end);
      await fetchAndAppendChunk(start, end, sourceBuffer);
      setLastBufferBytes(end);
    }
    fetchAndAppendChunkCallNumber.current = fetchAndAppendChunkCallNumber.current + 1;
  };

  const handleVideoLoadStart = () => {
    console.log("here comes in --- handleVideoLoadStart");
    onPlay?.();
  };
  const handleVideoEnd = () => {
    console.log("here comes in --- handleVideoEnd");
    onEnded?.();
  };
  const handleTimeUpdate = async () => {
    onTimeUpdate?.();
  };
  return (
    <video
      ref={videoRef}
      controls={controls}
      width={width}
      height={height}
      // preload={preload}
      poster={poster}
      style={style}
      autoPlay={autoPlay}
      muted={muted}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleVideoEnd}
      onPlay={handleVideoLoadStart}
      onWaiting={handleBufferWaiting}
      onError={(e) => console.error("Video error:", e.target.error.message)}
    />
  );
});
export default ChunkedVideoPlayer;
