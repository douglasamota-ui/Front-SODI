import { cn } from "@/lib/cn";
import React from "react";
import { Text, TextInput, View } from "react-native";

type CampoDeTextoProps = {
  label: string;
  placeholder?: string;
  viewClassName?: string;
  labelClassName?: string;
  textInputClassName?: string;
  value: string;
  errorMessage?: string;
  isError: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const CampoDeTexto = ({
  label,
  placeholder = "",
  viewClassName = "",
  labelClassName = "",
  textInputClassName = "",
  value,
  errorMessage = "",
  isError,
  setValue,
}: CampoDeTextoProps) => {
  return (
    <View>
      <View className={cn("gap-1", viewClassName)}>
        <Text className={cn("text-black text-xl", labelClassName)}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={(e) => setValue(e)}
          placeholder={placeholder}
          className={cn(
            "bg-white px-4 w-72 text-lg rounded-xl h-16",
            textInputClassName,
          )}
        />
      </View>
      {isError ? (
        <Text className="text-red-600 mt-2">{errorMessage}</Text>
      ) : null}
    </View>
  );
};
export default CampoDeTexto;