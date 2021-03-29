import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = InputProps &
  TextareaProps & {
    label?: string;
    name: string;
    textArea?: boolean;
  };

const InputField: React.FC<InputFieldProps> = ({
  label,
  textArea,
  ...props
}) => {
  const [field, { error }] = useField(props.name);
  return (
    <FormControl flex={1} isInvalid={!!error}>
      {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
      {textArea ? (
        <Textarea {...field} {...props} id={field.name} />
      ) : (
        <Input borderColor="gray" {...field} {...props} id={field.name} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
export default InputField;
