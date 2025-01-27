"use client";
import "./home.css";
import Image from "next/image";
import velo_svg from "../../../public/assets/velo_svg.svg";
import version_back from "../../../public/assets/version_back.svg";
import road from "../../../public/assets/road.svg";
import boy from "../../../public/assets/boy.svg";
import cloud from "../../../public/assets/cloud.svg";
import Social from "@/components/social/Social";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import ShootingStars from "../ui/ShootingStars";

const Home = () => {
  const [active, setActive] = useState(false);
  const [gameWidth, setGameWidth] = useState(1600);
  const [isFacingRight, setFacingRight] = useState(true);
  const [obstacleRect, setObstacleRect] = useState(null);
  const [over, setOver] = useState(false);

  const { data: session } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from");

    if (from === "login" && session?.user?.incompleteProfile) {
      redirect("/profile");
    }
  }, [session, searchParams]);

  const gameArea = useRef(null);
  const player = useRef(null);
  const obstacle = useRef(null);
  const fireworks = useRef(null);

  let playerX = 0;
  const speed = 10;
  const xMin = 0;

  const updateBoundaries = () => {
    setFacingRight(true);
    player.current.style.transform = `translateX(0px) rotateY(0deg)`;
    playerX = 0;
  };

  const isColliding = () => {
    const playerRect = player.current.getBoundingClientRect();
    if (!obstacleRect) return false;

    return (
      playerRect.right > obstacleRect.left &&
      playerRect.left < obstacleRect.right &&
      playerRect.bottom > obstacleRect.top &&
      playerRect.top < obstacleRect.bottom
    );
  };

  const movePlayer = (direction) => {
    if (direction === "left" && playerX > xMin) {
      playerX -= speed;

      if (isFacingRight) {
        setFacingRight(false);
        player.current.style.transform = `translateX(${playerX}px) rotateY(180deg)`;
      } else {
        player.current.style.transform = `translateX(${playerX}px)`;
      }
    } else if (direction === "right" && playerX < gameWidth) {
      playerX += speed;

      if (!isFacingRight) {
        setFacingRight(true);
        player.current.style.transform = `translateX(${playerX}px) rotateY(0deg)`;
      } else {
        player.current.style.transform = `translateX(${playerX}px)`;
      }
    }

    if (isColliding()) {
      setOver(true);
    }
  };

  const handleKeydown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
      movePlayer("left");
    } else if (event.key === "ArrowRight" || event.key === "d") {
      movePlayer("right");
    }
  };

  useEffect(() => {
    const resizeHandler = () => {
      setGameWidth(gameArea.current.clientWidth);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    if (over) {
      fireworks.current.style.display = "block";
    }
  }, [over]);

  useEffect(() => {
    if (over) {
      document.removeEventListener("keydown", handleKeydown);
      return;
    }
    if (obstacle.current) {
      setObstacleRect(obstacle.current.getBoundingClientRect());
    }

    if (active) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [active, over]);

  useEffect(() => {
    updateBoundaries();
  }, [gameWidth]);

  return (
    <>
      {/* <ShootingStars /> */}
      <div className="relative h-screen w-screen overflow-hidden ">
        <Social />
        <section
          className=" h-screen max-w-screen overflow-x-hidden"
          id="gameSection"
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          <div className="absolute inset-0 z-20 animateThis">
            <div className="gridAnimate border absolute top-0 -left-4 w-1/4 h-2/4 bg-theme-blue_dark opacity-50 transform blur-[60px] -rotate-12 animate-circle2" />
            <div className="gridAnimate1 absolute bottom-0 -right-0 w-1/2 h-3/4 bg-theme-blue_light opacity-20 blur-[120px] animate-circle2" />
          </div>
          <div className="absoulte top-1/2 left-1/2 -transform-x-1/2 -transform-y-1/2  mt-[5%] md:mt-0 select-none">
            <Image
              src={velo_svg}
              alt="LOGO"
              className="relative mainText m-auto w-full sm:w-[90%] xl:w-[80%] max-sm:pt-32 max-sm:p-5 rounded-3xl sm:p-20 md:p-32 lg:p-40 z-30"
            />
          </div>

          {/* <div className="absolute top-0 myGrid w-screen h-screen z-20"></div> */}
          <div className="">
            <div
              className="absolute bottom-0 right-10 h-screen w-20"
              ref={obstacle}
              id="obstacle"
            ></div>
            <Image
              src={cloud}
              alt="cloud"
              className=" absolute animate-cloud bottom-[30%] left-3 mx-4 max-w-24 xl:min-w-36 z-[25] select-none"
            />
            <Image
              src={cloud}
              alt="cloud"
              className=" absolute animate-cloud3 bottom-[26%] left-1/2 mx-4 max-w-24 xl:min-w-36 z-[25] select-none"
            />
            <Image
              src={cloud}
              alt="cloud"
              className=" absolute animate-cloud2 bottom-[23%] right-3 mx-4 max-w-24 xl:min-w-36 z-[25] select-none"
            />
            <Image
              src={boy}
              ref={player}
              id="player"
              alt="boy"
              className="absolute bottom-0 mr-8 ml-8 mb-3 xl:mb-5 max-w-8 sm:max-w-10 md:max-w-12 xl:max-w-14 z-40 select-none"
            />

            <div
              id="gameArena"
              className="absolute bottom-0 left-0 w-screen flex justify-end items-end flex-row z-[35] select-none"
              ref={gameArea}
            >
              <Image
                src={road}
                alt="GAME BACK"
                className="-mx-0 sm:-mx-2 hidden sm:block select-none"
              />
              <Image
                src={version_back}
                alt="GAME BACK"
                className="w-full sm:w-1/2 select-none"
              />
            </div>
            {/* <div className="absolute -bottom-16 h-20 w-screen ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 100"
              fill="#94C84C"
            >
              <path d="M0 0v60c9 0 18-3 25-10 13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s36 14 50 0c13-14 36-14 50 0s37 13 50 0c14-14 37-14 50 0 7 7 16 10 25 10V0H0Z"></path>
            </svg>
          </div> */}
          </div>
          <div
            id="fireworks"
            className="absolute right-0 mr-32 mb-40 bottom-0"
            ref={fireworks}
          >
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
