import { React, useState, useRef, useEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import jinxvideo from "./assets/jinx.mp4";
import vivideo from "./assets/vi.mp4";
import song from "./assets/music.mp3";

function App() {
  // Memoize the random video selection to prevent reloading on re-renders
  const randomVideo = useMemo(() => {
    const videos = [jinxvideo, vivideo];
    return videos[Math.floor(Math.random() * videos.length)];
  }, []);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Music player functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      // Use requestAnimationFrame to throttle updates and prevent excessive re-renders
      requestAnimationFrame(() => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
      });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateTime);

      // Try autoplay first
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If autoplay fails, wait for user click anywhere on screen
          const handleScreenClick = () => {
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                document.removeEventListener("click", handleScreenClick);
              })
              .catch(console.error);
          };

          document.addEventListener("click", handleScreenClick);

          // Cleanup function will remove this listener
          return () => {
            document.removeEventListener("click", handleScreenClick);
          };
        });

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateTime);
      };
    }
  }, []);

  useGSAP(() => {
    gsap.to(".riotlogo", {
      duration: 1,
      left: 25,
      ease: "easeInOut",
    });
    gsap.to(".arcanelogo", {
      duration: 1.5,
      left: 170,
      delay: 0.5,
      ease: "easeInOut",
    });
    gsap.to(".headertext", {
      duration: 1.5,
      left: 250,
      delay: 0.5,
      ease: "easeInOut",
    });
    gsap.to(".s2text", {
      duration: 1,
      delay: 0.5,
      opacity: 1,
      ease: "easeInOut",
    });

    const textTimeline = gsap.timeline({ delay: 0.5 });

    gsap.set(".arcanetext", { scale: 1 });
    gsap.set(".loltext", { scale: 1, opacity: 0 });
    gsap.set(".arcane-container", { gap: "0px" });

    textTimeline
      .to(".arcanetext", {
        delay: 1,
        duration: 0.5,
        scale: 1.3,
        ease: "ease2.out",
      })
      .to(
        ".arcane-container",
        {
          duration: 0.5,
          gap: "300px",
          ease: "ease2.out",
        },
        "<",
      )
      .to(
        ".loltext",
        {
          duration: 0.5,
          scale: 1,
          opacity: 1,
          ease: "power2.out",
        },
        "-=0.5",
      )
      .to(".arcanetext", {
        duration: 1,
        scale: 1,
        ease: "ease.inOut",
      })
      .to(
        ".arcane-container",
        {
          duration: 0.5,
          gap: "0px",
          ease: "power2.inOut",
        },
        "<",
      )
      .to(
        ".loltext",
        {
          duration: 0.5,

          scale: 0.5,
          opacity: 1,
          ease: "power2.inOut",
        },
        "<",
      );

    const videoTimeline = gsap.timeline({ delay: 0.2 });

    gsap.set(".video-element", { y: -200 });

    videoTimeline
      .to(".video-element", {
        duration: 1,
        y: 0,
        ease: "power2.out",
      })
      .to(".video-element", {
        duration: 0.8,
        top: 0,
        ease: "power2.inOut",
        delay: 0,
      });
  });

  return (
    <>
      <div className="main bg-black w-full h-screen relative overflow-hidden">
        <div>
          <div className="header z-[10] absolute top-0 left-0 px-10 py-10 flex flex-col justify-between w-full">
            <div className=" absolute riotlogo h-25 w-25 top-12 left-1/2 ">
              <img src="https://www.bryter-global.com/hubfs/riot%20logo.png"></img>
            </div>
            <div className="headertext text-white absolute left-1/1 text-base">
              <h2>WATCH THE CITY</h2>
              <h2>CATCH FIRE</h2>
            </div>
            <div>
              <h1 className=" arcanelogo absolute text-white left-1/1 text-4xl ">
                A
              </h1>
            </div>
            <div className="s2text absolute text-white text-xl right-10 flex flex-col items-end opacity-0">
              <h1>SEASON</h1>
              <h1> 2</h1>
            </div>
          </div>
          {/* Background Video */}
          <div className="video ">
            <video
              className="video-element absolute h-screen w-full scale-[1.2] -bottom-200 z-[2]"
              src={randomVideo}
              autoPlay
              loop
              muted
            ></video>
          </div>
          <div className="watchbtn absolute z-[20] flex flex-row gap-4 items-center justify-center top-0 bottom-0 left-0 right-0 mt-70 ml-50 ">
            <button className="bg-black  text-white font-bold  py-2 px-4  rounded-br-lg">
              Watch Now
            </button>
            <h1 className="text-white opacity-[0.5]">ONLY ON NETFLIX</h1>
          </div>
        </div>
        {/* Music Player */}
        <div className="music-player absolute top-8 right-4 z-[20]  backdrop-blur-xl rounded-xl p-3 w-72 mr-40">
          <audio ref={audioRef} loop src={song} />

          <div className="flex items-center gap-3">
            {/* Song Info & Controls */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">
                    Ashes and Blood
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    Woodkid - Arcane
                  </p>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center ml-2"
                >
                  {isPlaying ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {Math.floor(currentTime / 60)}:
                  {String(Math.floor(currentTime % 60)).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* center Text */}
        <div className="centertext absolute z-[15] text-white flex flex-col items-center justify-center top-0 bottom-0 left-0 right-0 gap-2">
          <div className="arcane-container flex flex-row ">
            <h1 className="arcanetext text-[148px]">A</h1>
            <h1 className="arcanetext text-[148px]">R</h1>
            <h1 className="arcanetext text-[148px]">C</h1>
            <h1 className="arcanetext text-[148px]">A</h1>
            <h1 className="arcanetext text-[148px]">N</h1>
            <h1 className="arcanetext text-[148px]">E</h1>
          </div>
          <h1 className="loltext text-5xl -mt-18">LEAGUE OF LEGENDS</h1>
        </div>
      </div>
    </>
  );
}

export default App;
