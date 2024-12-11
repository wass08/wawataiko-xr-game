import { Instances, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils } from "three";
import { useParticles } from "../hooks/useParticles";
import {
  NOTE_SETTINGS,
  NOTE_TYPES,
  NOTES_COLORS,
  NOTES_MAPPING,
  NOTES_POSITIONS,
  TIMELINE_SIZE,
  useSong,
} from "../hooks/useSong";
import { Note } from "./Note";

export const Notes = ({ children }) => {
  const ref = useRef();
  const songData = useSong((state) => state.songData);
  const registerOnNotePlayed = useSong((state) => state.registerOnNotePlayed);
  const unregisterOnNotePlayed = useSong(
    (state) => state.unregisterOnNotePlayed
  );
  const updateScore = useSong((state) => state.updateScore);

  const addExplosion = useParticles((state) => state.addExplosion);

  useEffect(() => {
    if (!songData?.audio) {
      return;
    }
    const onNotePlayed = (note) => {
      const curTime = songData.audio.currentTime;

      songData?.notes.some((songNote) => {
        // stop when return true
        if (songNote.playedStatus) {
          return false; // skip if already played
        }
        const noteTime = songNote.time;
        const diff = Math.abs(curTime - noteTime);

        if (diff <= NOTE_SETTINGS.OK) {
          if (note !== NOTES_MAPPING[songNote.midi]) {
            songNote.playedStatus = NOTE_TYPES.MISS;
          } else {
            songNote.playedStatus =
              diff <= NOTE_SETTINGS.PERFECT
                ? NOTE_TYPES.PERFECT
                : diff <= NOTE_SETTINGS.GOOD
                  ? NOTE_TYPES.GOOD
                  : NOTE_TYPES.OK;
          }

          updateScore(songNote.playedStatus);

          if (songNote.playedStatus !== NOTE_TYPES.MISS) {
            const notePosition = NOTES_POSITIONS[NOTES_MAPPING[songNote.midi]];
            addExplosion({
              position: [notePosition.x, notePosition.y, 0],
              color: NOTES_COLORS[NOTES_MAPPING[songNote.midi]],
            });
            return true;
          }
        }
      });
    };
    registerOnNotePlayed(onNotePlayed);
    return () => {
      unregisterOnNotePlayed(onNotePlayed);
    };
  }, [songData]);

  const lastCheck = useRef(0);

  useFrame(() => {
    if (ref.current && songData?.audio) {
      const songProgression =
        songData.audio.currentTime / songData.audio.duration;
      ref.current.position.z = MathUtils.lerp(
        0,
        TIMELINE_SIZE,
        songProgression
      );

      if (Date.now() - lastCheck.current > 100) {
        const curTime = songData.audio.currentTime;
        lastCheck.current = Date.now();
        songData?.notes.some((songNote) => {
          if (songNote.playedStatus) {
            return;
          }
          const noteTime = songNote.time;
          const diff = curTime - noteTime;
          if (diff > NOTE_SETTINGS.OK) {
            songNote.playedStatus = NOTE_TYPES.MISS;
            updateScore(songNote.playedStatus);
            return;
          } else {
            return true; // Stop as next notes are in the future
          }
        });
      }
    }
  });
  const { nodes, materials } = useGLTF("/models/Note.glb");
  return (
    <group ref={ref}>
      <Instances
        limit={2000}
        range={2000}
        geometry={nodes.Cylinder.geometry}
        material={materials.Material}
        frustumCulled={false}
      >
        {songData?.notes.map((note, idx) => (
          <Note key={idx} note={note} />
        ))}
      </Instances>
    </group>
  );
};
