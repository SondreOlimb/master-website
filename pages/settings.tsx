import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { editRadarParameters, getRadarParameters } from "./api/parameters";
import { getRadarSettings } from "./api/settings";
import { useForm } from "react-hook-form";
import Form from "@/components/Form";
import { Select } from "@/components/Select";
import {
  getRadarInfo,
  infoType,
  rangeSpeed,
  updateRadarInfo,
  updateRadarSettings,
} from "./api/info";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/Input";
import { getDatabase } from "firebase/database";

const Settings = () => {
  const radarParameters = useQuery({
    queryKey: ["parameters"],
    queryFn: getRadarParameters,
  });
  const radarSettings = useQuery({
    queryKey: ["settings"],
    queryFn: getRadarSettings,
  });

  const radarInfo = useQuery({
    queryKey: ["radarInfo"],
    queryFn: getRadarInfo,
  });
  const notify = () => {
    toast.success("Success Notification !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  type range = {
    range: 40 | 70 | 100 | 150 | 200 | 250;
    gain: number;
  };

  type settings_obj = {
    RSBW: number;
    RSSF: number;
    RSID: number;
    RSRG: number;
  };

  async function onSubmit(data: range) {
    const range_object = {
      40: { RSBW: 970, RSSF: 23800, RSID: 11106 },
      70: { RSBW: 554, RSSF: 23848, RSID: 11106 },
      100: { RSBW: 388, RSSF: 23931, RSID: 11106 },
      150: { RSBW: 258, RSSF: 23996, RSID: 11106 },
      200: { RSBW: 194, RSSF: 24028, RSID: 11106 },
      250: { RSBW: 156, RSSF: 24047, RSID: 11106 },
    };

    const obj = {
      range: data.range,
      gain: data.gain,
    };
    let settings_update: settings_obj = {
      ...range_object[data.range],
      RSRG: data.gain,
    };

    await updateRadarInfo(obj);
    await updateRadarSettings(range_object[data.range]);
    notify();
  }

  async function onSubmitParameters(data: any) {
    await editRadarParameters(data);
    notify();
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col py-2 container items-center mx-auto w-full">
        <div className="flex flex-col gap-2 ">
          {radarInfo.data && (
            <Form
              onSubmit={onSubmit}
              defaultValues={{
                range: radarInfo.data.range,
                gain: radarInfo.data.gain,
              }}
            >
              <Select
                labelname="Range"
                name="range"
                options={["40", "70", "100", "150", "200", "250"]}
              />
              <Select
                labelname="Speed"
                name="speed"
                options={["30", "50", "80", "100", "120"]}
              />
              <Input labelname={"Gain"} name={"gain"} />

              <button className="btn md:col-span-2" type="submit">
                Submit
              </button>
              <ToastContainer />
            </Form>
          )}

          {radarParameters.data && (
            <div>
              <h3>Parameters</h3>
              <Form
                onSubmit={onSubmitParameters}
                defaultValues={radarParameters.data}
              >
                {Object.keys(radarParameters.data).map((key) => {
                  return <Input key={key} labelname={key} name={key} />;
                })}
                <button className="btn md:col-span-2" type="submit">
                  Submit
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
