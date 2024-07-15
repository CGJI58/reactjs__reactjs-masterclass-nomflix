import { motion, useScroll } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { movieState } from "../atoms";
import { makeImagePath } from "../Routes/utils";

const Wrapper = styled.div``;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 10;
`;

const PopUp = styled(motion.div)`
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

function PopUpMovie() {
  const history = useHistory();
  const movie = useRecoilValue(movieState);
  const { scrollY } = useScroll();
  const onOverlayClick = () => history.push("/");
  return (
    <Wrapper>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <PopUp style={{}} layoutId={movie.id + ""}>
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
