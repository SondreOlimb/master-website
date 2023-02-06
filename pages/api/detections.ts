import { getDatabase, ref, child, onValue } from "firebase/database";

type radarDetectionsType = {
  [time: number]: {
    id: number;
    life: number;
    range: number;
    speed: number;
  }[];
};

export async function getRadarDetections(): Promise<
  radarDetectionsType | undefined
> {
  const dbRef = ref(getDatabase(), `radar/detections`);
  try {
    const data = await onValue(dbRef, (snapshot) => {
      return snapshot.val();
    });
  } catch (e) {
    console.error(e);
  }
}
