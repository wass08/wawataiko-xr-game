import { Midi } from "@tonejs/midi";
import { create } from "zustand";

export const TIMELINE_SIZE = 1000;
export const NOTE_SETTINGS = {
  OK: 0.3,
  GOOD: 0.2,
  PERFECT: 0.1,
};

export const NOTE_TYPES = {
  MISS: "MISS",
  OK: "OK",
  GOOD: "GOOD",
  PERFECT: "PERFECT",
};

export const NOTES_MAPPING = {
  45: "Middle",
  57: "Crash",
  38: "Side",
};

export const NOTES_COLORS = {
  Middle: "#5A30DD",
  Side: "#82BB78",
  Crash: "orange",
};

export const NOTES_POSITIONS = {
  Middle: { x: -0.5, y: 0 },
  Side: { x: 0.2, y: 0 },
  Crash: { x: 0.7, y: 0.1 },
};

export const useSong = create((set, get) => {
  const loadSong = async (song) => {
    if (song === null) {
      const curAudio = get().songData?.audio;
      if (curAudio) {
        curAudio.pause();
      }
      set({
        songData: null,
      });
      return;
    }
    const audio = new Audio(`${song}.mp3`);
    await audio.play();
    const midi = await Midi.fromUrl(`${song}.mid`);
    console.log(midi);
    const notes = [];
    midi.tracks.forEach((track) => {
      //tracks have notes and controlChanges

      //notes are an array
      notes.push(...track.notes);
    });
    set({
      songData: {
        midi,
        notes,
        audio,
      },
      combo: 0,
      score: {
        [NOTE_TYPES.MISS]: 0,
        [NOTE_TYPES.OK]: 0,
        [NOTE_TYPES.GOOD]: 0,
        [NOTE_TYPES.PERFECT]: 0,
      },
    });
  };

  const getNotePosition = (note) => {
    const songData = get().songData;
    if (!songData) {
      return;
    }

    const songDuration = songData.audio.duration;
    return -(note.time / songDuration) * TIMELINE_SIZE;
  };

  const onNotePlayed = [];

  const registerOnNotePlayed = (callback) => {
    onNotePlayed.push(callback);
  };

  const unregisterOnNotePlayed = (callback) => {
    const index = onNotePlayed.indexOf(callback);
    if (index !== -1) {
      onNotePlayed.splice(index, 1);
    }
  };

  const playNote = (note) => {
    get().playNoteFn(note);
    onNotePlayed.forEach((fn) => fn(note));
  };
  return {
    songs: [
      {
        name: "WawaRock",
        path: "audios/audiostock_1111962",
      },
      {
        name: "TropicaWawa",
        path: "audios/audiostock_199178",
      },
      {
        name: "Song 3",
        path: "audios/audiostock_1111962",
      },
    ],
    songData: null,
    loadSong,
    getNotePosition,
    registerOnNotePlayed,
    unregisterOnNotePlayed,
    playNote,
    playNoteFn: () => {},
    setPlayNoteFn: (fn) => set({ playNoteFn: fn }),
    combo: 0,
    score: {
      [NOTE_TYPES.MISS]: 0,
      [NOTE_TYPES.OK]: 0,
      [NOTE_TYPES.GOOD]: 0,
      [NOTE_TYPES.PERFECT]: 0,
    },
    updateScore: (type) =>
      set((state) => ({
        combo: type === NOTE_TYPES.MISS ? 0 : state.combo + 1,
        score: { ...state.score, [type]: state.score[type] + 1 },
      })),
  };
});

//the file name decoded from the first track
// const name = midi.name
// console.log(midi.header.tempos);
// //get the tracks
// midi.tracks.forEach(track => {
//   //tracks have notes and controlChanges

//   //notes are an array
//   const notes = track.notes;
//   console.log(notes);
//   notes.forEach(note => {
//     //note.midi, note.time, note.duration, note.name
//   })

//   //the control changes are an object
//   //the keys are the CC number
//   track.controlChanges[64]
//   //they are also aliased to the CC number's common name (if it has one)
//   track.controlChanges.sustain.forEach(cc => {
//     // cc.ticks, cc.value, cc.time
//   })

//   //the track also has a channel and instrument
//   //track.instrument.name
// })
