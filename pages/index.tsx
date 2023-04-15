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
import { secondsToDateTime, nsToDateTimeString } from "@/utils";
import classNames from "classnames";
import RangeDopplerPlot from "@/components/RangeDopplerPlot";

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
type trackType = {
  [time: number]: {
    id: number;
    range: number;
    vel: number;
  }[];
};
type radarlogsType = {
  [id: string]: string;
};

export default function Home() {
  const [online, setOnline] = useState(false);
  const [data, setData] = useState<radarDetectionsType>();
  const [info, setInfo] = useState<infoType>();
  const [logs, setLogs] = useState<radarlogsType>();
  const [tracks, setTracks] = useState<trackType>();
  const [track, setTrack] = useState<trackType>();

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
    const dbRef = ref(getDatabase(), `radar/tracks`);
    const filter = query(dbRef, limitToLast(10));
    const sort = query(filter, orderByKey());
    onValue(sort, (snapshot) => {
      const data: trackType = snapshot.val() as trackType;
      setTrack(data);
      return;
    });
  }, []);

  useEffect(() => {
    const dbRef = ref(getDatabase(), `radar/tracks`);
    const filter = query(dbRef, limitToLast(10));

    onValue(filter, (snapshot) => {
      setTracks(snapshot.val());
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

  useEffect(() => {
    const dbRef = ref(getDatabase(), `radar/logs`);
    const filter = query(dbRef, limitToLast(10));
    const sort = query(filter, orderByKey());
    onValue(sort, (snapshot) => {
      setLogs(snapshot.val());
      return;
    });
  }, []);

  function formatLog(log: string) {
    const [date, time, type, ...message] = log.split(" ");
    return (
      <div className="whitespace-nowrap">
        <span className={classNames(" text-green-500 ")}>
          {date + " " + time}
        </span>
        <span
          className={classNames({
            "text-yellow-200 font-bold": type == "WARNING",
            "text-red-500 font-bold": type == "CRITICAL",
            "text-orange-500 font-bold": type == "ERROR",
            "text-blue-500 font-bold": type == "INFO",
          })}
        >{` ${type} `}</span>

        {message.join(" ")}
      </div>
    );
  }
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
        {track && (
          <RangeDopplerPlot
            rangeSetting={200}
            speedSetting={30}
            cords={
              Object.entries(track).map(([time, cords]) => {
                return { data: cords };
              })[0]
            }
          />
        )}
        {logs && (
          <div className="card w-5/6 bg-base-100 p-4 overflow-x-scroll">
            <div className="flex flex-col gap-2">
              {Object.entries(logs)
                .map(([id, log]) => {
                  return (
                    <div key={id} className="">
                      {formatLog(log)}
                    </div>
                  );
                })
                .reverse()}
            </div>
          </div>
        )}
        {tracks && (
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
                {Object.entries(tracks)
                  .map(([time, trackArray]) => {
                    return trackArray.map((track, index) => {
                      return (
                        <tr key={index}>
                          <td>{nsToDateTimeString(+time)}</td>
                          <td>{track.id}</td>
                          <td>{track.range}</td>
                          <td>{track.vel}</td>
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
