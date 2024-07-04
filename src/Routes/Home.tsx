import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { getMovies, IGetAllMoviesResult, IMovie } from "../api";
import NowPlaying from "../Components/NowPlaying";
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

const offset = 4;

function Home() {
  const { data, isLoading } = useQuery<IGetAllMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const history = useHistory();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [banner, setBanner] = useState<IMovie>();

  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  useEffect(() => {
    setBanner(() => data?.nowPlaying.results[0]);
  }, [isLoading]);

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
          {data === undefined ? null : (
            <NowPlaying
              movies={data.nowPlaying}
              offset={offset}
              rowWidth={windowWidth}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
