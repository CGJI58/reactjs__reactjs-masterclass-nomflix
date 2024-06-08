import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { getMovies, IGetAllMoviesResult, IMovie } from "../api";
import { makeImagePath } from "./utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  height: 200vh;
`;

const Loader = styled.div`
  display: flex;
  height: 20vh;
  justify-content: center;
  align-items: center;
`;

const Banner = styled(motion.div)<{ bgphoto: string }>`
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  * {
    text-shadow: #fc0 1px 0 10px;
  }
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 30px;
  width: 50%;
  line-height: 42px;
`;

const Slider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 30px;
`;

const Button = styled(motion.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 50%;
  z-index: 1;
  opacity: 0.3;
`;

const ButtonLeft = styled(Button)`
  left: 0px;
`;

const ButtonRight = styled(Button)`
  right: 0px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 34px;
  cursor: pointer;
`;

const BoxInfo = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const FocusedMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const FocusedCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const FocusedTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const FocusedOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  line-height: 34px;
`;

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const BoxInfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 5;

function Home() {
  const { data, isLoading } = useQuery<IGetAllMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const history = useHistory();
  const focusedMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/:movieId"
  );
  const [index, setIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(false);
  const [exitComplete, setExitComplete] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [banner, setBanner] = useState<IMovie>();
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
  const { scrollY } = useScroll();

  const decreaseIndex = () => {
    if (data) {
      if (!exitComplete) return;
      setExitComplete(false);
      const numberOfMovies = data?.nowPlaying.results.length;
      const maxIndex = Math.ceil(numberOfMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setSlideDirection(true);
    }
  };

  const increaseIndex = () => {
    if (data) {
      if (!exitComplete) return;
      setExitComplete(false);
      const numberOfMovies = data?.nowPlaying.results.length;
      const maxIndex = Math.ceil(numberOfMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setSlideDirection(false);
    }
  };
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
    setBanner(() =>
      data?.nowPlaying.results.find((item) => item.id === movieId)
    );
  };
  const onOverlayClicked = () => history.goBack();
  const clickedMovie =
    focusedMovieMatch?.params.movieId &&
    data?.nowPlaying.results.find(
      (movie) => movie.id === +focusedMovieMatch.params.movieId
    );

  useEffect(() => setBanner(() => data?.nowPlaying.results[0]), [isLoading]);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(banner?.backdrop_path ?? "")}>
            <Title>{banner?.title}</Title>
            <OverView>{banner?.overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setExitComplete(true)}
            >
              <ButtonLeft
                onClick={decreaseIndex}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                &lArr;
              </ButtonLeft>
              <ButtonRight
                onClick={increaseIndex}
                whileHover={{ opacity: 1, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                &rArr;
              </ButtonRight>
              <Row
                initial={{ x: slideDirection ? -windowWidth : windowWidth }}
                animate={{ x: 0 }}
                exit={{ x: slideDirection ? windowWidth : -windowWidth }}
                transition={{ duration: 3.8, type: "tween" }}
                key={index}
              >
                {data?.nowPlaying.results
                  .slice(index * offset, index * offset + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={BoxVariants}
                      initial="normal"
                      key={movie.id}
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path ?? "", "w500")}
                    >
                      <BoxInfo variants={BoxInfoVariants}>
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {focusedMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <FocusedMovie
                  layoutId={focusedMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <FocusedCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <FocusedTitle>{clickedMovie.title}</FocusedTitle>
                      <FocusedOverview>{clickedMovie.overview}</FocusedOverview>
                    </>
                  )}
                </FocusedMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
