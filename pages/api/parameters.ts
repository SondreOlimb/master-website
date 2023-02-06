import { getDatabase, ref, set, get, child } from "firebase/database";

type radarType = {
  PSBL: number;
  PSBR: number;
  PSBS: number;
  PSCS: number;
  PSNP: number;
  PSNT: number;
  PSPT: number;
  PSRC: number;
  PSRJ: number;
  PSSJ: number;
  PSSM: number;
  PSSO: number;
  PSTH: number;
  PSTL: number;
  PSTR: number;
  PSTS: number;
};

export async function getRadarParameters(): Promise<radarType | undefined> {
  const dbRef = ref(getDatabase());
  try {
    const data = await get(child(dbRef, `radar/parameters`));
    if (data.exists()) {
      return data.val();
    }
    return;
  } catch (e) {
    console.error(e);
  }
}

export async function editRadarParameters(data: radarType) {
  const dbRef = ref(getDatabase(), `radar/parameters`);
  try {
    await set(dbRef, data);

    return;
  } catch (e) {
    console.error(e);
  }
}
