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

const applauseAudio = new Audio("audios/applause.mp3");
export const missAudio = new Audio("audios/miss.mp3");

export const useSong = create((set, get) => {
  const loadSong = async (song) => {
    if (song === null) {
      const curAudio = get().songData?.audio;
      if (curAudio) {
        curAudio.pause();
      }
      set({
        currentSong: null,
        songData: null,
      });
      return;
    }
    const audio = new Audio(`${song.path}.mp3`);
    await audio.play();
    audio.addEventListener("ended", () => {
      set({ songEnded: true });
      applauseAudio.currentTime = 0;
      applauseAudio.play();
    });

    const midi = await Midi.fromUrl(`${song.path}.mid`);

    const notes = [];
    midi.tracks.forEach((track) => {
      //tracks have notes and controlChanges

      //notes are an array
      notes.push(...track.notes);
    });
    set({
      currentSong: song,
      songEnded: false,
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
    passthrough: false,
    setPassthrough: (value) => set({ passthrough: value }),
    songs: [
      {
        name: "Tropical Wawa",
        path: "audios/audiostock_199178",
        thumbnail: "thumbnails/tropical-wawa.webp",
      },
      {
        name: "Wawa City Pop",
        path: "audios/audiostock_1274720",
        thumbnail: "thumbnails/wawa-city-pop.webp",
      },
      {
        name: "Wawa Rock",
        path: "audios/audiostock_1111962",
        thumbnail: "thumbnails/wawa-rock.webp",
      },
    ],
    currentSong: null,
    songData: null,
    songEnded: false,
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
    updateScore: (type) => {
      set((state) => {
        if (type === NOTE_TYPES.MISS && state.combo > 0) {
          missAudio.currentTime = 0;
          missAudio.play();
        }
        return {
          combo: type === NOTE_TYPES.MISS ? 0 : state.combo + 1,
          score: { ...state.score, [type]: state.score[type] + 1 },
        };
      });
    },
  };
});
