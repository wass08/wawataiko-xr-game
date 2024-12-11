import { Bvh, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { DrumStick } from "./components/DrumStick";
import { Experience } from "./components/Experience";
import { ScoreBoard } from "./components/ScoreBoard";
import { UI } from "./components/ui";
import { useSong } from "./hooks/useSong";

export const store = createXRStore({
  controller: DrumStick,
});

function App() {
  const score = useSong((state) => state.score);
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0.5, 1], fov: 70 }}>
        <Stats />
        <color attach="background" args={["#ececec"]} />
        <XR store={store}>
          {/* <Fullscreen
              overflow="scroll"
              scrollbarColor="black"
              dark={{ backgroundColor: "black" }}
              flexDirection="column"
              gap={32}
              paddingX={32}
              alignItems="center"
              padding={32}
            > */}
          <group position-y={1} position-z={-5}>
            <UI />
          </group>
          <group
            // rotation-y={degToRad(-25)}
            position-y={3}
            position-z={-5}
            // position-x={1}
          >
            <ScoreBoard />
          </group>
          {/* </Fullscreen> */}
          <group position-y={-1}>
            <Bvh firstHitOnly>
              <Experience />
            </Bvh>
            <XROrigin position-z={0.2} />
          </group>
        </XR>
      </Canvas>
    </>
  );
}

export default App;
