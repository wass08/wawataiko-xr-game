import { Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  NOTES_COLORS,
  NOTES_MAPPING,
  NOTES_POSITIONS,
  useSong,
} from "../hooks/useSong";

export const Note = ({ note, ...props }) => {
  const ref = useRef();
  const songData = useSong((state) => state.songData);

  const getNotePosition = useSong((state) => state.getNotePosition);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (note && !note?.playedStatus) {
      ref.current.position.x = NOTES_POSITIONS[NOTES_MAPPING[note.midi]].x;
      ref.current.position.y = NOTES_POSITIONS[NOTES_MAPPING[note.midi]].y;
      ref.current.position.z = getNotePosition(note);
    }
  }, [ref, note, songData]);

  const [played, setPlayed] = useState(false);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
    if (!played && note.playedStatus) {
      setPlayed(true);
    }
  });
  if (played) {
    return null;
  }

  return (
    <group {...props} ref={ref} dispose={null}>
      <Instance scale={0.2} color={NOTES_COLORS[NOTES_MAPPING[note.midi]]} />
    </group>
  );
};
