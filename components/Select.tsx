import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  register?: UseFormRegister<FieldValues>;
  name: string;
  options: string[];
  labelname: string;
};

export function Select({
  register,
  options,
  name,
  labelname,
  ...rest
}: SelectProps) {
  if (register) {
    return (
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-white">{labelname}</span>
        </label>
        <select
          {...register(name)}
          className="select w-full max-w-xs"
          {...rest}
        >
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return <></>;
}
