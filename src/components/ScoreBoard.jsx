import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useCallback, useEffect, useState } from "react";
import { NOTE_TYPES, useSong } from "../hooks/useSong";

export function ScoreBoard() {
  const loadSong = useSong((state) => state.loadSong);
  const currentSong = useSong((state) => state.currentSong);
  const songData = useSong((state) => state.songData);
  const score = useSong((state) => state.score);

  const onExit = useCallback(() => {
    loadSong(null);
  }, []);

  if (!songData) {
    return null;
  }
  return (
    <Defaults>
      <Root>
        <Container
          flexDirection="column"
          md={{ flexDirection: "row" }}
          alignItems="center"
          gap={32}
        >
          <Card borderRadius={32} padding={16}>
            <Container
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gapColumn={12}
              minWidth={142}
            >
              <Image
                width={80}
                height={80}
                objectFit={"cover"}
                keepAspectRatio={false}
                borderRadius={16}
                src={currentSong.thumbnail}
              />
              <Container flexDirection="column" gap={4}>
                <Text>{currentSong.name}</Text>
                <TimeDisplayer />
                <Button
                  variant="rect"
                  size="sm"
                  platter
                  flexGrow={1}
                  onClick={onExit}
                >
                  <Text>Exit</Text>
                </Button>
              </Container>
            </Container>
          </Card>
          <Container flexDirection={"row"} gap={32}>
            <ScoreCard
              title="Missed"
              color={"#FF5252"}
              score={score[NOTE_TYPES.MISS]}
              transformRotateY={12}
            />
            <ScoreCard
              title="Ok"
              color="#00BCD4"
              score={score[NOTE_TYPES.OK]}
              transformRotateY={5}
            />
            <ScoreCard
              title="Good"
              color="#FFC107"
              score={score[NOTE_TYPES.GOOD]}
              transformRotateY={-5}
            />
            <ScoreCard
              title="Perfect"
              color="#7C4DFF"
              score={score[NOTE_TYPES.PERFECT]}
              transformRotateY={-12}
            />
          </Container>
        </Container>
      </Root>
    </Defaults>
  );
}

const TimeDisplayer = () => {
  const songData = useSong((state) => state.songData);
  const [displayTime, setDisplayTime] = useState("00:00");

  useEffect(() => {
    const getDisplayTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const interval = setInterval(() => {
      if (songData.audio) {
        setDisplayTime(
          getDisplayTime(songData.audio.currentTime) +
            " / " +
            getDisplayTime(songData.audio.duration)
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Text color={"#cecece"} fontSize={13}>
      {displayTime}
    </Text>
  );
};

const ScoreCard = ({ title, score, color, ...props }) => {
  return (
    <Card
      borderRadius={32}
      padding={16}
      minWidth={120}
      justifyContent={"center"}
      {...props}
    >
      <Container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gapRow={2}
      >
        <Text fontSize={12} fontWeight={"bold"} color={color}>
          {title.toUpperCase()}
        </Text>
        <Text fontSize={32}>{"" + score}</Text>
      </Container>
    </Card>
  );
};
