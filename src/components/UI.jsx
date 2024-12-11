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
          <Card borderRadius={32} padding={16}>
            <Container
              flexDirection="column"
              justifyContent="space-between"
              alignItems="stretch"
              gapRow={8}
            >
              <Container flexDirection="row" gap={8}>
                {songs.map((song, idx) => (
                  // <Button
                  //   key={idx}
                  //   padding={12}
                  //   variant="rect"
                  //   size="sm"
                  //   platter
                  //   onClick={() => loadSong(song.path)}
                  // >
                  <Container key={idx} flexDirection="column" gap={4}>
                    <Card
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSong(song.path);
                      }}
                      hover={{
                        backgroundOpacity: 0.5,
                      }}
                      borderRadius={9999}
                      flexDirection={"row"}
                      gap={4}
                      // minWidth={200}
                      paddingRight={32}
                    >
                      <Image
                        width={80}
                        height={80}
                        objectFit={"cover"}
                        keepAspectRatio={false}
                        borderRadius={9999}
                        src={"thumbnails/song1.webp"}
                      />
                      <Text size="sm">{song.name}</Text>
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
                    onClick={() => store.enterVR()}
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
                      onClick={() => store.enterAR()}
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
