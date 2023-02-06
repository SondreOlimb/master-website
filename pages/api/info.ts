import { getDatabase, ref, set, get, child, update } from "firebase/database";

export type infoType = {
  lat: number;
  lng: number;
  status: string;
  time: number;
  range: number;
  speed: number;
};

export async function getRadarInfo(): Promise<infoType | undefined> {
  const dbRef1 = ref(getDatabase());
  try {
    const data = await get(child(dbRef1, `radar/info`));

    if (data.exists()) {
      return data.val();
    }
  } catch (e) {
    console.error(e);
  }
}

export type rangeSpeed = {
  range: number;
  speed: number;
};
export async function updateRadarInfo(info: rangeSpeed) {
  const dbRef1 = ref(getDatabase());
  const obj = {
    "radar/info/speed": info.speed,
    "radar/info/range": info.range,
  };

  try {
    const data = await update(dbRef1, obj);
    return data;
  } catch (e) {
    console.error(e);
    return;
  }
}
