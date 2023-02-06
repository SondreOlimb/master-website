import { getDatabase, ref, set, get, child } from "firebase/database";

type infoType = {
  lat: number;
  lng: number;
  status: string;
  time: number;
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
