import { Container, Image, Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { useXR } from "@react-three/xr";
import { store } from "../App";
import { useSong } from "../hooks/useSong";

export function UI() {
  const loadSong = useSong((state) => state.loadSong);
  const songs = useSong((state) => state.songs);
  const mode = useXR((state) => state.mode);
  const session = useXR((state) => state.session);
  const songData = useSong((state) => state.songData);
  const passthrough = useSong((state) => state.passthrough);
  const setPassthrough = useSong((state) => state.setPassthrough);
  if (songData) {
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
          <Card
            borderRadius={32}
            padding={16}
            flexDirection={"column"}
            alignItems={"center"}
            gap={8}
          >
            <Image
              src="images/wawa-taiko.png"
              width={120}
              onClick={() => window.open("https://wawasensei.dev", "_blank")}
            />
            <Text
              fontSize={11}
              onClick={() => window.open("https://wawasensei.dev", "_blank")}
            >
              by Wawa Sensei
            </Text>
            <Container
              flexDirection="column"
              justifyContent="space-between"
              alignItems="stretch"
              gapRow={8}
            >
              <Container flexDirection="row" gap={8}>
                {songs.map((song, idx) => (
                  <Container key={idx} flexDirection="column" gap={4}>
                    <Card
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSong(song);
                      }}
                      hover={{
                        backgroundOpacity: 0.5,
                      }}
                      borderRadius={16}
                      flexDirection={"column"}
                      gap={4}
                      padding={4}
                    >
                      <Image
                        width={142}
                        height={142}
                        objectFit={"cover"}
                        keepAspectRatio={false}
                        borderRadius={16}
                        src={song.thumbnail}
                      />
                      <Text
                        maxWidth={142}
                        fontSize={13}
                        textAlign={"center"}
                        fontWeight={"bold"}
                      >
                        {song.name}
                      </Text>
                    </Card>
                  </Container>
                  // </Button>
                ))}
              </Container>
              <Container
                flexDirection="row"
                justifyContent={"space-evenly"}
                gap={8}
              >
                {mode === null ? (
                  <Button
                    variant="rect"
                    size="sm"
                    platter
                    flexGrow={1}
                    onClick={() => store.enterAR()}
                  >
                    <Text>VR/AR</Text>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="rect"
                      size="sm"
                      platter
                      flexGrow={1}
                      onClick={() => setPassthrough(!passthrough)}
                    >
                      <Text>Passthrough</Text>
                    </Button>
                    <Button
                      variant="rect"
                      size="sm"
                      platter
                      flexGrow={1}
                      onClick={() => session.end()}
                    >
                      <Text>Exit VR</Text>
                    </Button>
                  </>
                )}
              </Container>
            </Container>
          </Card>
        </Container>
      </Root>
    </Defaults>
  );
}
