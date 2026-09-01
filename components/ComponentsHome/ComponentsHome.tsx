import React from "react";
import { View, Text, TextInput } from "react-native";

type ComponentsHomeProps = {
  label?: string;
  placeholder?: string;
  value: string;
  setValue: (text: string) => void;
  keyboardType?: "default" | "numeric";
  secureTextEntry?: boolean;
};

const ComponentsHome = ({
  label,
  placeholder = "",
  value,
  setValue,
  keyboardType = "default",
  secureTextEntry = false,
}: ComponentsHomeProps) => {
  return (
    <View className="w-full gap-1 mb-3">
      {label ? <Text className="text-sm font-bold text-gray-700">{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        className="w-full rounded-xl border border-gray-300 bg-white px-[14px] py-[10px] text-[15px] text-black"
      />
    </View>
  );
};

export default ComponentsHome;