import Head from "next/head";

import { Ingrid_Darling, Inter } from "@next/font/google";
import {
  ref,
  getDatabase,
  query,
  limitToLast,
  orderByKey,
  onValue,
} from "firebase/database";
import { useEffect, useState } from "react";
import { secondsToDateTime } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

type radarDetectionsType = {
  [time: number]: {
    id: number;
    life: number;
    range: number;
    speed: number;
  }[];
};

type infoType = {
  lat: number;
  lng: number;
  status: string;
  time: number;
  range: number;
  speed: number;
};

export default function Home() {
  const [online, setOnline] = useState(false);
  const [data, setData] = useState<radarDetectionsType>();
  const [info, setInfo] = useState<infoType>();

  useEffect(() => {
    const dbRef = ref(getDatabase(), `radar/detections`);
    const filter = query(dbRef, limitToLast(10));
    const sort = query(filter, orderByKey());
    onValue(sort, (snapshot) => {
      setData(snapshot.val());
      return;
    });
  }, []);
  useEffect(() => {
    const dbRef = ref(getDatabase(), `radar/info`);
    const date_now = Math.floor(Date.now() / 1000);

    onValue(dbRef, (snapshot) => {
      setOnline(date_now - snapshot.val().time < 100);
      setInfo(snapshot.val());
      return;
    });
  }, []);
  return (
    <>
      <Head>
        <title>Trondheim harbour</title>
        <meta name="description" content="Radar maps of Trondheim harbour" />
        <meta
          name="viewport"
          content="width=device-width,heigth =device-heigth, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center items-center gap-8 py- mt-8 container mx-auto">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Status</div>
            {online ? (
              <div className="stat-value text-success">Online</div>
            ) : (
              <div className="stat-value text-error">Offline</div>
            )}

            <div className="stat-desc">
              Last update: {info ? secondsToDateTime(+info?.time) : "NA"}{" "}
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Max Range</div>
            <div className="stat-value text-secondary">
              {info ? info.range : "N/A"}
            </div>
            <div className="stat-desc text-secondary"></div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Max Speed</div>
            <div className="stat-value">{info ? info.speed : "N/A"}</div>
            <div className="stat-desc"></div>
          </div>
        </div>
        {/* <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className={"flex items-center gap-2 text-center"}>
                <h2 className="card-title text-white">Radar</h2>

                {online ? (
                  <div className="badge badge-success gap-2">Online</div>
                ) : (
                  <div className="badge badge-error gap-2">Offline</div>
                )}
              </div>
              <p>{info?.lat}</p>
              <h2>Latitude:</h2>
              <p> {info?.lng}</p>
              <h2> Longitude:</h2>
            </div>
          </div> */}
        {data && (
          <>
            <table className="table w-fit">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Id</th>
                  <th>Range</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data)
                  .map(([time, detections]) => {
                    return detections.map((detection, index) => {
                      return (
                        <tr key={index}>
                          <td>{secondsToDateTime(+time)}</td>
                          <td>{detection.id}</td>
                          <td>{detection.range}</td>
                          <td>{detection.speed}</td>
                        </tr>
                      );
                    });
                  })
                  .reverse()}
              </tbody>
            </table>
          </>
        )}

        {/* <Map
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 14,
            }}
            style={{ width: 600, height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          /> */}
      </div>
    </>
  );
}
