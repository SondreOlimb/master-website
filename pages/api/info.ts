import { getDatabase, ref, set, get, child, update } from "firebase/database";

export type infoType = {
  lat: number;
  lng: number;
  status: string;
  time: number;
  range: number;
  speed: number;
  gain: number;
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
  gain: number;
};
export async function updateRadarInfo(info: rangeSpeed) {
  const dbRef1 = ref(getDatabase());
  const obj = {
    "radar/info/speed": 30,
    "radar/info/range": info.range,
    "radar/info/gain": info.gain,
  };

  try {
    const data = await update(dbRef1, obj);
    return data;
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function updateRadarSettings(settings: any) {
  const dbRef1 = ref(getDatabase());
  const obj = {
    "radar/settings": settings,
  };
  try {
    const data = await update(dbRef1, obj);
    return data;
  } catch (e) {
    console.error(e);
    return;
  }
}
