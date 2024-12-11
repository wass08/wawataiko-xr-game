import { Container, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { useEffect, useState } from "react";
import { NOTE_TYPES, useSong } from "../hooks/useSong";

export function ScoreBoard() {
  const loadSong = useSong((state) => state.loadSong);
  const songs = useSong((state) => state.songs);
  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const score = useSong((state) => state.score);

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
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gapRow={8}
              minWidth={142}
            >
              <Text>Song 1</Text>
              <TimeDisplayer />
              <Button
                variant="rect"
                size="sm"
                platter
                flexGrow={1}
                onClick={() => loadSong(null)}
              >
                <Text>Exit</Text>
              </Button>
            </Container>
          </Card>
          <Container flexDirection={"row"} gap={32}>
            <ScoreCard
              title="Missed"
              color={"#FF5252"}
              score={score[NOTE_TYPES.MISS]}
            />
            <ScoreCard
              title="Ok"
              color="#00BCD4"
              score={score[NOTE_TYPES.OK]}
            />
            <ScoreCard
              title="Good"
              color="#FFC107"
              score={score[NOTE_TYPES.GOOD]}
            />
            <ScoreCard
              title="Perfect"
              color="#7C4DFF"
              score={score[NOTE_TYPES.PERFECT]}
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
  return <Text>{displayTime}</Text>;
};

const ScoreCard = ({ title, score, color }) => {
  return (
    <Card
      borderRadius={32}
      padding={16}
      minWidth={120}
      justifyContent={"center"}
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
