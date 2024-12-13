import { Bvh, Float, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR, XROrigin } from "@react-three/xr";
import { degToRad } from "three/src/math/MathUtils.js";
import { DrumStick } from "./components/DrumStick";
import { Experience } from "./components/Experience";
import { ScoreBoard } from "./components/ScoreBoard";
import { UI } from "./components/UI";
import { NOTES_COLORS } from "./hooks/useSong";

export const store = createXRStore({
  controller: DrumStick,
  meshDetection: false,
  planeDetection: false,
});

function App() {
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
          <group position-y={2} position-z={-3} rotation-x={degToRad(20)}>
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
