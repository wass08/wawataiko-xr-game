import { Bvh, Float, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { DrumStick } from "./components/DrumStick";
import { Experience } from "./components/Experience";
import { ScoreBoard } from "./components/ScoreBoard";
import { UI } from "./components/ui";
import { NOTES_COLORS, useSong } from "./hooks/useSong";

export const store = createXRStore({
  controller: DrumStick,
});

function App() {
  const score = useSong((state) => state.score);
  return (
    <>
      <div className="controls">
        <div className="controls__key" style={{ color: NOTES_COLORS.Middle }}>
          S
        </div>
        <div className="controls__key" style={{ color: NOTES_COLORS.Side }}>
          D
        </div>
        <div className="controls__key" style={{ color: NOTES_COLORS.Crash }}>
          F
        </div>
      </div>
      <Canvas
        shadows
        camera={{
          position: window.innerWidth < 1024 ? [0, 0.8, 3] : [0, 0.5, 1],
          fov: 70,
        }}
      >
        {window.location.href.includes("localhost") && <Stats />}
        <color attach="background" args={["#ececec"]} />
        <XR store={store}>
          <group position-y={1} position-z={-5}>
            <Float rotationIntensity={0.4} speed={1.5}>
              <UI />
            </Float>
          </group>
          <group position-y={3} position-z={-5}>
            <ScoreBoard />
          </group>
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
