import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { movieState } from "../atoms";
import { makeImagePath } from "../Routes/utils";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 10;
`;

const PopUp = styled(motion.div)<{ scrollvalue: number }>`
  position: absolute;
  top: ${(props) => props.scrollvalue}px;
  width: 50vw;
  height: 80vh;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 11;
`;

const PopUpCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const PopUpTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const PopUpOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const defaultScrollValue = 100;

function PopUpMovie() {
  const history = useHistory();
  const movie = useRecoilValue(movieState);
  const { scrollY } = useScroll();
  const [scrollValue, setScrollValue] = useState(defaultScrollValue);

  useMotionValueEvent(scrollY, "change", (scroll) => {
    setScrollValue(() => scroll + 100);
  });

  const onOverlayClick = () => history.push("/");
  return (
    <Wrapper>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <PopUp
        scrollvalue={scrollValue}
        layoutId={movie.id + ""}
        transition={{ delay: 0, duration: 0.2, type: "linear" }}
      >
        {
          <>
            <PopUpCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  movie.backdrop_path,
                  "w500"
                )})`,
              }}
            />
            <PopUpTitle>{movie.title}</PopUpTitle>
            <PopUpOverview>{movie.overview}</PopUpOverview>
          </>
        }
      </PopUp>
    </Wrapper>
  );
}

export default PopUpMovie;
