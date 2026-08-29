import type { Song } from "../types"
import { buildEvents, type Step } from "../lib/song-builder"

// prettier-ignore
const HOT_CROSS_BUNS: Step[] = [
  ["E", 4, 1], ["D", 4, 1], ["C", 4, 2],
  ["E", 4, 1], ["D", 4, 1], ["C", 4, 2],
  ["C", 4, 0.5], ["C", 4, 0.5], ["C", 4, 0.5], ["C", 4, 0.5],
  ["D", 4, 0.5], ["D", 4, 0.5], ["D", 4, 0.5], ["D", 4, 0.5],
  ["E", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

// prettier-ignore
const MARY_HAD_A_LITTLE_LAMB: Step[] = [
  ["E", 4, 1], ["D", 4, 1], ["C", 4, 1], ["D", 4, 1],
  ["E", 4, 1], ["E", 4, 1], ["E", 4, 2],
  ["D", 4, 1], ["D", 4, 1], ["D", 4, 2],
  ["E", 4, 1], ["G", 4, 1], ["G", 4, 2],
  ["E", 4, 1], ["D", 4, 1], ["C", 4, 1], ["D", 4, 1],
  ["E", 4, 1], ["E", 4, 1], ["E", 4, 1], ["E", 4, 1],
  ["D", 4, 1], ["D", 4, 1], ["E", 4, 1], ["D", 4, 1],
  ["C", 4, 4],
]

// prettier-ignore
const TWINKLE_TWINKLE: Step[] = [
  ["C", 4, 1], ["C", 4, 1], ["G", 4, 1], ["G", 4, 1], ["A", 4, 1], ["A", 4, 1], ["G", 4, 2],
  ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 1], ["D", 4, 1], ["C", 4, 2],
  ["G", 4, 1], ["G", 4, 1], ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 2],
  ["G", 4, 1], ["G", 4, 1], ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 2],
  ["C", 4, 1], ["C", 4, 1], ["G", 4, 1], ["G", 4, 1], ["A", 4, 1], ["A", 4, 1], ["G", 4, 2],
  ["F", 4, 1], ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["D", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

// prettier-ignore
const ODE_TO_JOY: Step[] = [
  ["E", 4, 1], ["E", 4, 1], ["F", 4, 1], ["G", 4, 1],
  ["G", 4, 1], ["F", 4, 1], ["E", 4, 1], ["D", 4, 1],
  ["C", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 1],
  ["E", 4, 1.5], ["D", 4, 0.5], ["D", 4, 2],

  ["E", 4, 1], ["E", 4, 1], ["F", 4, 1], ["G", 4, 1],
  ["G", 4, 1], ["F", 4, 1], ["E", 4, 1], ["D", 4, 1],
  ["C", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 1],
  ["D", 4, 1.5], ["C", 4, 0.5], ["C", 4, 2],

  ["D", 4, 1], ["D", 4, 1], ["E", 4, 1], ["C", 4, 1],
  ["D", 4, 1], ["E", 4, 0.5], ["F", 4, 0.5], ["E", 4, 1], ["C", 4, 1],
  ["D", 4, 1], ["E", 4, 0.5], ["F", 4, 0.5], ["E", 4, 1], ["D", 4, 1],
  ["C", 4, 1], ["D", 4, 1], ["G", 3, 2],

  ["E", 4, 1], ["E", 4, 1], ["F", 4, 1], ["G", 4, 1],
  ["G", 4, 1], ["F", 4, 1], ["E", 4, 1], ["D", 4, 1],
  ["C", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 1],
  ["D", 4, 1.5], ["C", 4, 0.5], ["C", 4, 2],
]

// prettier-ignore
const JINGLE_BELLS: Step[] = [
  ["E", 4, 1], ["E", 4, 1], ["E", 4, 2],
  ["E", 4, 1], ["E", 4, 1], ["E", 4, 2],
  ["E", 4, 1], ["G", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 4],

  ["F", 4, 1], ["F", 4, 1], ["F", 4, 1], ["F", 4, 1],
  ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["E", 4, 0.5], ["E", 4, 0.5],
  ["E", 4, 1], ["D", 4, 1], ["D", 4, 1], ["E", 4, 1],
  ["D", 4, 2], ["G", 4, 2],

  ["E", 4, 1], ["E", 4, 1], ["E", 4, 2],
  ["E", 4, 1], ["E", 4, 1], ["E", 4, 2],
  ["E", 4, 1], ["G", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 4],

  ["F", 4, 1], ["F", 4, 1], ["F", 4, 1], ["F", 4, 1],
  ["F", 4, 1], ["E", 4, 1], ["E", 4, 1], ["E", 4, 1],
  ["G", 4, 1], ["G", 4, 1], ["F", 4, 1], ["D", 4, 1],
  ["C", 4, 4],
]

// prettier-ignore
const FRERE_JACQUES: Step[] = [
  ["C", 4, 1], ["D", 4, 1], ["E", 4, 1], ["C", 4, 1],
  ["C", 4, 1], ["D", 4, 1], ["E", 4, 1], ["C", 4, 1],
  ["E", 4, 1], ["F", 4, 1], ["G", 4, 2],
  ["E", 4, 1], ["F", 4, 1], ["G", 4, 2],
  ["G", 4, 0.5], ["A", 4, 0.5], ["G", 4, 0.5], ["F", 4, 0.5], ["E", 4, 1], ["C", 4, 1],
  ["G", 4, 0.5], ["A", 4, 0.5], ["G", 4, 0.5], ["F", 4, 0.5], ["E", 4, 1], ["C", 4, 1],
  ["C", 4, 1], ["G", 3, 1], ["C", 4, 2],
  ["C", 4, 1], ["G", 3, 1], ["C", 4, 2],
]

// prettier-ignore
const ROW_YOUR_BOAT: Step[] = [
  ["C", 4, 1], ["C", 4, 1], ["C", 4, 1], ["D", 4, 1], ["E", 4, 2],
  ["E", 4, 1], ["D", 4, 1], ["E", 4, 1], ["F", 4, 1], ["G", 4, 2],
  ["C", 5, 0.5], ["C", 5, 0.5], ["C", 5, 0.5], ["G", 4, 0.5], ["G", 4, 0.5], ["G", 4, 0.5],
  ["E", 4, 0.5], ["E", 4, 0.5], ["E", 4, 0.5], ["C", 4, 0.5], ["C", 4, 0.5], ["C", 4, 0.5],
  ["G", 4, 1], ["F", 4, 1], ["E", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

// prettier-ignore
const HAPPY_BIRTHDAY: Step[] = [
  ["G", 3, 0.5], ["G", 3, 0.5], ["A", 3, 1], ["G", 3, 1], ["C", 4, 1], ["B", 3, 2],
  ["G", 3, 0.5], ["G", 3, 0.5], ["A", 3, 1], ["G", 3, 1], ["D", 4, 1], ["C", 4, 2],
  ["G", 3, 0.5], ["G", 3, 0.5], ["G", 4, 1], ["E", 4, 1], ["C", 4, 1], ["B", 3, 1], ["A", 3, 2],
  ["F", 4, 0.5], ["F", 4, 0.5], ["E", 4, 1], ["C", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

// prettier-ignore
const AMAZING_GRACE: Step[] = [
  ["C", 4, 1], ["E", 4, 0.5], ["G", 4, 0.5], ["E", 4, 1], ["C", 4, 3],
  ["E", 4, 1], ["G", 4, 3],
  ["G", 4, 1], ["E", 4, 0.5], ["C", 4, 0.5], ["E", 4, 1], ["D", 4, 3],
  ["E", 4, 1], ["G", 4, 0.5], ["C", 5, 0.5], ["C", 5, 1], ["G", 4, 3],
  ["G", 4, 1], ["E", 4, 0.5], ["C", 4, 0.5], ["E", 4, 1], ["D", 4, 1], ["C", 4, 2],
]

// The famous opening bagatelle motif only, simplified — not the full piece.
// prettier-ignore
const FUR_ELISE: Step[] = [
  ["E", 5, 0.5], ["D#", 5, 0.5], ["E", 5, 0.5], ["D#", 5, 0.5], ["E", 5, 0.5], ["B", 4, 0.5], ["D", 5, 0.5], ["C", 5, 0.5], ["A", 4, 1.5], ["R", 0, 0.5],
  ["C", 4, 0.5], ["E", 4, 0.5], ["A", 4, 0.5], ["B", 4, 1.5], ["R", 0, 0.5],
  ["E", 4, 0.5], ["G#", 4, 0.5], ["B", 4, 0.5], ["C", 5, 1.5], ["R", 0, 0.5],
  ["E", 5, 0.5], ["D#", 5, 0.5], ["E", 5, 0.5], ["D#", 5, 0.5], ["E", 5, 0.5], ["B", 4, 0.5], ["D", 5, 0.5], ["C", 5, 0.5], ["A", 4, 2],
]

// Left-hand accompaniment for a gentle first two-hand piece: one held bass
// note per phrase (I - I - V - V - I - I), under the Twinkle Twinkle melody.
// prettier-ignore
const TWINKLE_TWINKLE_BASS: Step[] = [
  ["C", 3, 8],
  ["C", 3, 8],
  ["G", 3, 8],
  ["G", 3, 8],
  ["C", 3, 8],
  ["C", 3, 8],
]

// Left-hand accompaniment for Ode to Joy: one bass note per bar (I under
// phrases 1, 2 and 4; V under phrase 3, which is where the melody leans on G).
// prettier-ignore
const ODE_TO_JOY_BASS: Step[] = [
  ["C", 3, 4], ["C", 3, 4], ["C", 3, 4], ["C", 3, 4],
  ["C", 3, 4], ["C", 3, 4], ["C", 3, 4], ["C", 3, 4],
  ["G", 2, 4], ["G", 2, 4], ["G", 2, 4], ["G", 2, 4],
  ["C", 3, 4], ["C", 3, 4], ["C", 3, 4], ["C", 3, 4],
]

export const SONGS: Song[] = [
  {
    id: "hot-cross-buns",
    title: "Hot Cross Buns",
    composer: "Traditional",
    bpm: 90,
    difficulty: "beginner",
    events: buildEvents(HOT_CROSS_BUNS),
  },
  {
    id: "mary-had-a-little-lamb",
    title: "Mary Had a Little Lamb",
    composer: "Traditional",
    bpm: 100,
    difficulty: "beginner",
    events: buildEvents(MARY_HAD_A_LITTLE_LAMB),
  },
  {
    id: "frere-jacques",
    title: "Frère Jacques",
    composer: "Traditional",
    bpm: 110,
    difficulty: "beginner",
    events: buildEvents(FRERE_JACQUES),
  },
  {
    id: "row-your-boat",
    title: "Row, Row, Row Your Boat",
    composer: "Traditional",
    bpm: 100,
    difficulty: "beginner",
    events: buildEvents(ROW_YOUR_BOAT),
  },
  {
    id: "twinkle-twinkle",
    title: "Twinkle Twinkle Little Star",
    composer: "Traditional",
    bpm: 100,
    difficulty: "beginner",
    events: buildEvents(TWINKLE_TWINKLE),
  },
  {
    id: "happy-birthday",
    title: "Happy Birthday to You",
    composer: "Traditional",
    bpm: 100,
    difficulty: "intermediate",
    events: buildEvents(HAPPY_BIRTHDAY),
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    composer: "Beethoven",
    bpm: 104,
    difficulty: "intermediate",
    events: buildEvents(ODE_TO_JOY),
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    composer: "Traditional",
    bpm: 120,
    difficulty: "intermediate",
    events: buildEvents(JINGLE_BELLS),
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    composer: "Traditional",
    bpm: 70,
    difficulty: "intermediate",
    events: buildEvents(AMAZING_GRACE),
  },
  {
    id: "fur-elise",
    title: "Für Elise (opening)",
    composer: "Beethoven",
    bpm: 120,
    difficulty: "advanced",
    events: buildEvents(FUR_ELISE),
  },
  {
    id: "twinkle-twinkle-two-hands",
    title: "Twinkle Twinkle (Two Hands)",
    composer: "Traditional",
    bpm: 90,
    difficulty: "two-hands",
    events: [...buildEvents(TWINKLE_TWINKLE, "right"), ...buildEvents(TWINKLE_TWINKLE_BASS, "left")],
  },
  {
    id: "ode-to-joy-two-hands",
    title: "Ode to Joy (Two Hands)",
    composer: "Beethoven",
    bpm: 96,
    difficulty: "two-hands",
    events: [...buildEvents(ODE_TO_JOY, "right"), ...buildEvents(ODE_TO_JOY_BASS, "left")],
  },
]

export function getSongById(id: string): Song {
  return SONGS.find((song) => song.id === id) ?? SONGS[0]
}
