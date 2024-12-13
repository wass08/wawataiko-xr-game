import { Environment, Gltf, OrbitControls, useFont } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Instruments } from "../components/Instruments";
import { Notes } from "../components/Notes";
import { useSong } from "../hooks/useSong";
import { Combo } from "./Combo";
import { ExplosionParticles } from "./ExplosionParticles";
import { NotesPlayer } from "./NotesPlayer";

export const Experience = () => {
  const playNote = useSong((state) => state.playNote);

  useEffect(() => {
    const onKeyPress = (event) => {
      if (event.repeat) {
        return;
      }
      switch (event.key) {
        case "s":
          playNote("Middle");
          break;
        case "d":
          playNote("Side");
          break;
        case "f":
          playNote("Crash");
          break;
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => {
      document.removeEventListener("keypress", onKeyPress);
    };
  }, []);

  const controls = useThree((state) => state.controls);

  useEffect(() => {
    if (!controls) {
      return;
    }
    controls.target.set(0, 0.5, 0);
    controls.update();
  }, [controls]);

  const passthrough = useSong((state) => state.passthrough);

  return (
    <>
      <NotesPlayer />

      <group position-z={-0.5} position-y={1}>
        <ExplosionParticles />
        <group>
          <Notes />
        </group>
        <Instruments />
      </group>
      <directionalLight
        castShadow
        position={[5, 5, 2]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.00001}
      />
      <Gltf src="models/tori.glb" castShadow receiveShadow />
      <Combo />

      <OrbitControls makeDefault />
      <Environment preset="sunset" environmentIntensity={0.6} />
      {/* {mode !== "immersive-ar" && ( */}
      {!passthrough && (
        <Gltf src="models/uploads_files_4381654_LightBlueSky.glb" />
      )}
    </>
  );
};

useFont.preload("fonts/Inter_Bold.json");
