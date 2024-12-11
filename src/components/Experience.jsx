import {
  Environment,
  Float,
  Gltf,
  OrbitControls,
  Text3D,
  useFont,
} from "@react-three/drei";

import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { NOTES_COLORS, NOTES_POSITIONS, useSong } from "../hooks/useSong";
import { Avatar } from "./Avatar";
import { BouncingItem } from "./BouncingItem";
import { Cymbal } from "./Cymbal";
import { Drum } from "./Drum";
import { DrumCollider } from "./DrumCollider";
import { ExplosionParticles } from "./ExplosionParticles";
import { NoteMesh } from "./NoteMesh";
import { Notes } from "./Notes";
import { NotesPlayer } from "./NotesPlayer";

export const Experience = () => {
  const songData = useSong((state) => state.songData);
  const playNote = useSong((state) => state.playNote);
  const playedNotes = useSong((state) => state.playedNotes);

  useEffect(() => {
    const onKeyPress = (event) => {
      if (event.repeat) {
        return;
      }
      switch (event.key) {
        case "a":
          playNote("Middle");
          break;
        case "z":
          playNote("Side");
          break;
        case "e":
          playNote("Crash");
          break;
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => {
      document.removeEventListener("keypress", onKeyPress);
    };
  }, []);

  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     playNote("Middle");
  //   }, 1000);
  //   return () => {
  //     clearInterval(timeout);
  //   };
  // }, []);

  const combo = useSong((state) => state.combo);

  const dance =
    combo > 50
      ? "Swing"
      : combo > 20
        ? "House"
        : combo > 5
          ? "HipHop"
          : "HappyIdle";

  const controls = useThree((state) => state.controls);

  useEffect(() => {
    if (!controls) {
      return;
    }
    controls.target.set(0, 0.5, 0);
    controls.update();
  }, [controls]);

  const springs = useSpring({
    scale: combo > 0 ? 1 : 0,
  });

  return (
    <>
      <NotesPlayer />
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
      <group
        position-z={-8}
        position-y={0}
        rotation-y={degToRad(45)}
        position-x={-8}
      >
        <animated.group {...springs}>
          <Avatar avatar={"avatar_1733298114125"} animation={dance} />
        </animated.group>
      </group>
      <group
        position-z={-8}
        position-y={0}
        rotation-y={degToRad(-45)}
        position-x={8}
      >
        <animated.group {...springs}>
          <Avatar avatar={"avatar_1733298250949"} animation={dance} />
        </animated.group>
      </group>
      {/* <mesh position-z={-14} rotation-x={degToRad(-12)}>
        <planeGeometry args={[60, 60]} />
        <MeshTransmissionMaterial
          color="mediumpurple"
          distortion={0.4}
          roughness={0.1}
          temporalDistortion={0.5}
          thickness={2}
        />
      </mesh> */}
      <OrbitControls makeDefault />
      <Environment preset="sunset" environmentIntensity={0.6} />
      <Gltf src="models/uploads_files_4381654_LightBlueSky.glb" />

      <Float
        rotation-y={degToRad(25)}
        position-y={1.42}
        position-z={-1.2}
        position-x={-1.1}
        speed={5}
        floatIntensity={0.5}
      >
        <animated.group {...springs}>
          <Text3D
            scale={0.72}
            size={0.5}
            bevelEnabled
            bevelThickness={0.02}
            font={"fonts/Inter_Bold.json"}
          >
            x{combo}
            <meshStandardMaterial
              color="white"
              emissive={"mediumpurple"}
              emissiveIntensity={0.5}
            />
          </Text3D>
        </animated.group>
      </Float>
      <group position-z={-0.5} position-y={1}>
        <ExplosionParticles />
        <group>
          {/* <mesh>
            <boxGeometry args={[2, 0.05, 0.05]} />
            <meshStandardMaterial color="#333" transparent opacity={0.24} />
          </mesh> */}
          <Notes />
        </group>

        <group
          position-x={NOTES_POSITIONS["Crash"].x}
          position-y={NOTES_POSITIONS["Crash"].y}
        >
          <NoteMesh color={NOTES_COLORS["Crash"]} />
          <DrumCollider
            radius={0.3}
            height={0.1}
            onHit={() => playNote("Crash")}
          />

          <BouncingItem noteValue={"Crash"}>
            <Cymbal scale={1.6} />
          </BouncingItem>
        </group>

        <group
          position-x={NOTES_POSITIONS["Middle"].x}
          position-y={NOTES_POSITIONS["Middle"].y}
        >
          <NoteMesh color={NOTES_COLORS["Middle"]} />
          <DrumCollider
            radius={0.31}
            height={0.42}
            onHit={() => playNote("Middle")}
          />
          <BouncingItem noteValue={"Middle"} position-y={-0.42}>
            <Drum color={NOTES_COLORS["Middle"]} scale={0.06} />
          </BouncingItem>
        </group>
        <group
          position-x={NOTES_POSITIONS["Side"].x}
          position-y={NOTES_POSITIONS["Side"].y}
        >
          <NoteMesh color={NOTES_COLORS["Side"]} />
          <DrumCollider
            radius={0.21}
            height={0.28}
            onHit={() => playNote("Side")}
          />
          <BouncingItem noteValue={"Side"} position-y={-0.28}>
            <Drum color={NOTES_COLORS["Side"]} scale={0.04} />
          </BouncingItem>
        </group>
      </group>
    </>
  );
};

useFont.preload("fonts/Inter_Bold.json");
