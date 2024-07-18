import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { movieState } from "../atoms";
import styled from "styled-components";
import { makeImagePath } from "../Routes/utils";
import { motion } from "framer-motion";

const Wrapper = styled(motion.div)<{ bgphoto: string }>`
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

function Banner() {
  const movie = useRecoilValue(movieState);
  const [banner, setBanner] = useState(movie);
  useEffect(() => {
    setBanner(movie);
  }, [movie]);
  return (
    <Wrapper
      bgphoto={makeImagePath(banner?.backdrop_path ?? "")}
      layoutId={movie.id + "banner"}
    >
      <Title>{banner?.title}</Title>
      <OverView>{banner?.overview}</OverView>
    </Wrapper>
  );
}

export default Banner;
