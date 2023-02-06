import ProtectedRoute from "@/components/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { editRadarParameters, getRadarParameters } from "./api/parameters";
import { getRadarSettings } from "./api/settings";
import { useForm } from "react-hook-form";
import Form from "@/components/Form";
import { Select } from "@/components/Select";
import { infoType, rangeSpeed, updateRadarInfo } from "./api/info";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/Input";

const Settings = () => {
  const radarParameters = useQuery({
    queryKey: ["parameters"],
    queryFn: getRadarParameters,
  });
  const radarSettings = useQuery({
    queryKey: ["settings"],
    queryFn: getRadarSettings,
  });
  const notify = () => {
    toast.success("Success Notification !", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();
  async function onSubmit(data: rangeSpeed) {
    const obj = {
      range: data.range,
      speed: data.speed,
    };
    await updateRadarInfo(obj);
    notify();
  }

  async function onSubmitParameters(data: any) {
    await editRadarParameters(data);
    notify();
  }

  useEffect(() => {
    console.log(radarParameters.data);
  }, [radarParameters.data]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col py-2 container items-center mx-auto w-full">
        <div className="flex flex-col gap-2 ">
          {radarParameters.data && (
            <Form onSubmit={onSubmit}>
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

              <button className="btn col-span-2" type="submit">
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
                <button className="btn col-span-2" type="submit">
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
