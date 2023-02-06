import React from "react";
import { Controller, FieldValues, UseFormRegister } from "react-hook-form";

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  register?: UseFormRegister<FieldValues>;
  control?: any;
  name: string;
  options: string[];
  labelname: string;
};

export function Select({
  register,
  options,
  name,
  labelname,
  control,
  ...rest
}: SelectProps) {
  if (register) {
    return (
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-white">{labelname}</span>
        </label>
        <Controller
          render={({ field }) => {
            return (
              <select
                {...field}
                //   {...register(name)}
                className="select w-full max-w-xs"
                {...rest}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          }}
          name={name}
          control={control}
        />
      </div>
    );
  }
  return <></>;
}
