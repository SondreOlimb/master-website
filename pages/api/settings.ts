import { getDatabase, ref, set, get, child } from "firebase/database";

type radarSettingsType = {
  RSBW: number;
  RSID: number;
  RSRG: number;
  RSSF: number;
};

export async function getRadarSettings(): Promise<
  radarSettingsType | undefined
> {
  const dbRef1 = ref(getDatabase());
  try {
    const data = await get(child(dbRef1, `radar/settings`));

    if (data.exists()) {
      return data.val();
    }
  } catch (e) {
    console.error(e);
  }
}
