import { getDatabase, ref, child, onValue } from "firebase/database";

type radarlogsType = {
  [id: string]: {
    log: string;
  }[];
};

export async function getRadarDetections(): Promise<string | undefined> {
  const dbRef = ref(getDatabase(), `radar/info`);
  try {
    const data = await onValue(dbRef, (snapshot) => {
      console.log(snapshot.val());
      return snapshot.val();
    });
  } catch (e) {
    console.error(e);
    return;
  }
}
