import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { getMovies, IGetAllMoviesResult, IMovie } from "../api";
import NowPlaying from "../Components/NowPlaying";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { movieState } from "../atoms";
import { useRouteMatch } from "react-router-dom";
import Banner from "../Components/Banner";
import PopUpMovie from "../Components/PopUpMovie";

const Wrapper = styled.div`
  position: relative;
  height: 200vh;
  overflow: hidden;
`;

const Loader = styled.div`
  display: flex;
  height: 20vh;
  justify-content: center;
  align-items: center;
`;

const Sliders = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const offset = 4;

function Home() {
  const { data, isLoading } = useQuery<IGetAllMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const bigMovieMatch = useRouteMatch("/movies/:movieId");
  const setMovie = useSetRecoilState<IMovie>(movieState);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    if (data?.nowPlaying.results[0]) {
      setMovie(data?.nowPlaying.results[0]);
      console.log(data);
    }
  }, [isLoading]);
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner />
          {data === undefined ? null : (
            <Sliders>
              <NowPlaying
                movies={data.nowPlaying}
                offset={offset}
                rowWidth={windowWidth}
                yValue={0}
              />
              <NowPlaying
                movies={data.top_rated}
                offset={offset}
                rowWidth={windowWidth}
                yValue={300}
              />
              <NowPlaying
                movies={data.upcoming}
                offset={offset}
                rowWidth={windowWidth}
                yValue={600}
              />
            </Sliders>
          )}
          <AnimatePresence>
            {bigMovieMatch ? <PopUpMovie /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
