import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getRadarParameters } from "./api/parameters";
import { getRadarSettings } from "./api/settings";

const Settings = () => {
  const radarParameters = useQuery({
    queryKey: ["parameters"],
    queryFn: getRadarParameters,
  });
  const radarSettings = useQuery({
    queryKey: ["settings"],
    queryFn: getRadarSettings,
  });

  return (
    <ProtectedRoute>
      <div className="flex py-2 container mx-auto ">
        <div className="flex gap-2">
          {radarParameters.data && (
            <div>
              <h3>Parameters</h3>
              <div className="overflow-x-auto">
                <table className="table w-fit">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(radarParameters.data).map(
                      ([param, value]) => {
                        return (
                          <tr key={param}>
                            <td>{param}</td>
                            <td>{value}</td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {radarSettings.data && (
            <div>
              <h3>Parameters</h3>
              <div className="overflow-x-auto">
                <table className="table w-fit">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(radarSettings.data).map(
                      ([param1, value1]) => {
                        return (
                          <tr key={param1}>
                            <td>{param1}</td>
                            <td>{value1}</td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
