import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import { useState } from "react";
import { makeImagePath } from "../Routes/utils";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Button = styled(motion.div)<{ direction: string }>`
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
  z-index: 3;
  opacity: 0.3;
  ${(props) => props.direction}: 0px;
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 5px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 34px;
  cursor: pointer;
  position: relative;
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

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    "z-index": 2,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const BoxInfoVariants = {
  normal: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface INowPlaying {
  movies: IGetMoviesResult;
  offset: number;
  rowWidth: number;
}

function NowPlaying({ movies, offset, rowWidth }: INowPlaying) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [exitComplete, setExitComplete] = useState(true);

  const paginate = (newDirection: number) => {
    if (!exitComplete) return;
    const nextPage = page + newDirection;
    const maxPage = Math.ceil(movies.results.length / offset);

    setExitComplete(false);
    if (nextPage === maxPage) {
      setPage([0, newDirection]);
    } else if (nextPage === -1) {
      setPage([maxPage - 1, newDirection]);
    } else {
      setPage([nextPage, newDirection]);
    }
  };

  const rowTransition = {
    type: "linear",
    duration: 0.8,
  };

  const rowVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? rowWidth : -rowWidth,
      transition: rowTransition,
    }),
    center: {
      x: 0,
      transition: rowTransition,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? rowWidth : -rowWidth,
      transition: rowTransition,
    }),
  };

  return (
    <Wrapper>
      <AnimatePresence
        initial={false}
        custom={direction}
        onExitComplete={() => setExitComplete(true)}
      >
        <Row
          offset={offset}
          key={page}
          custom={direction}
          variants={rowVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {movies.results
            .slice(page * offset, (page + 1) * offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                variants={BoxVariants}
                initial="normal"
                whileHover="hover"
                key={movie.id}
                bgphoto={makeImagePath(movie.backdrop_path ?? "", "w500")}
              >
                <BoxInfo variants={BoxInfoVariants}>
                  <h4>{movie.title}</h4>
                </BoxInfo>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <Button
        direction="left"
        whileHover={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        onClick={() => paginate(-1)}
      >
        &lArr;
      </Button>
      <Button
        direction="right"
        whileHover={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        onClick={() => paginate(1)}
      >
        &rArr;
      </Button>
    </Wrapper>
  );
}

export default NowPlaying;
