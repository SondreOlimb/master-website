import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useQuery } from "@tanstack/react-query";
import { getRadarInfo } from "./api/info";
import { getRadarDetections } from "./api/detections";
import { secondsToDateTime } from "@/utils";
import {
  getDatabase,
  limitToLast,
  onValue,
  orderByKey,
  query,
  ref,
} from "firebase/database";

type radarDetectionsType = {
  [time: number]: {
    id: number;
    life: number;
    range: number;
    speed: number;
  }[];
};

type radarlogsType = {
  [id: string]: {
    log: string;
  }[];
};

type infoType = {
  lat: number;
  lng: number;
  status: string;
  time: number;
};

const DashboardPage = () => {
  const [online, setOnline] = useState(false);
  const [data, setData] = useState<radarDetectionsType>();
  const [info, setInfo] = useState<infoType>();
  const [logs, setLogs] = useState<radarlogsType>();

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
    const dbRef = ref(getDatabase(), `radar/logs`);
    const filter = query(dbRef, limitToLast(10));
    const sort = query(filter, orderByKey());
    onValue(sort, (snapshot) => {
      console.log(snapshot.val());
      setLogs(snapshot.val());
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
    <ProtectedRoute>
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
            <div className="stat-title">Lat</div>
            <div className="stat-value text-secondary">
              {info ? info.lat.toPrecision(4) : "N/A"}
            </div>
            <div className="stat-desc text-secondary"></div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Long</div>
            <div className="stat-value">
              {info ? info.lng.toPrecision(4) : "N/A"}
            </div>
            <div className="stat-desc"></div>
          </div>
        </div>
        {logs && (
          <div className="card w-96 bg-base-100 shadow-xl">
            {Object.entries(logs).map(([id, log]) => {
              return <p key={id}>{log}</p>;
            })}
          </div>
        )}
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
    </ProtectedRoute>
  );
};

export default DashboardPage;
