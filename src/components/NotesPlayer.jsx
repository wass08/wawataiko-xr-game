import { PositionalAudio } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useSong } from "../hooks/useSong";

export const NOTES_AUDIOS = {
  Middle: "audios/Taiko-Middle.mp3",
  Side: "audios/Taiko-Side.mp3",
  Crash: "audios/Taiko-Crash.mp3",
};

export const NotesPlayer = ({ polyphony = 4 }) => {
  const refs = useRef({});
  const notePolyphony = useRef({});

  const setPlayNoteFn = useSong((state) => state.setPlayNoteFn);

  useEffect(() => {
    setPlayNoteFn((note) => {
      const audio = refs.current[note];
      if (!audio) {
        return;
      }
      if (!notePolyphony.current[note]) {
        notePolyphony.current[note] = 0;
      }
      const idx = notePolyphony.current[note];
      audio[idx].stop();
      audio[idx].play();
      notePolyphony.current[note] = (idx + 1) % polyphony;
    });
  }, []);

  return (
    <>
      {Object.keys(NOTES_AUDIOS).map((note) =>
        Array.from({ length: polyphony }).map((_, idx) => (
          <PositionalAudio
            position-x={idx * 1 - polyphony / 2}
            position-z={3 + idx}
            key={`${note}-${idx}`}
            ref={(ref) => {
              if (!refs.current[note]) {
                refs.current[note] = {};
              }
              refs.current[note][idx] = ref;
            }}
            url={NOTES_AUDIOS[note]}
            distance={8}
            autoplay={false}
            loop={false}
          />
        ))
      )}
    </>
  );
};
