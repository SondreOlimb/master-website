import { FieldValues, UseFormRegister } from "react-hook-form";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  register?: UseFormRegister<FieldValues>;
  name: string;
  labelname?: string;
};

export function Input({ register, name, labelname, ...rest }: InputProps) {
  if (register) {
    return (
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-white">{labelname}</span>
        </label>

        <input
          type="number"
          className="input input-bordered input-lg w-full max-w-xs"
          {...register(name)}
          {...rest}
        />
      </div>
    );
  }
  return <></>;
}
