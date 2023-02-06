import React from "react";
import { useForm } from "react-hook-form";

type FormProps = {
  defaultValues?: any;
  children: React.ReactNode;
  onSubmit: (data: any) => void;
};

export default function Form({ defaultValues, children, onSubmit }: FormProps) {
  const methods = useForm({ defaultValues });
  const { handleSubmit } = methods;

  return (
    <form
      className=" grid grid-cols-1  gap-4  "
      onSubmit={handleSubmit(onSubmit)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return child?.props?.name
            ? React.createElement(child.type, {
                ...{
                  ...child.props,
                  register: methods.register,
                  control: methods.control,
                  key: child.props.name,
                },
              })
            : child;
        }
      })}
    </form>
  );
}
