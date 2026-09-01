import { cn } from "@/lib/cn";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type BotaoProps = TouchableOpacityProps & {
  className?: string;
  children: React.ReactNode;
};

const BotaoCad = ({ className, children, ...props }: BotaoProps) => {
  return (
    <TouchableOpacity
      className={cn("bg-#3c8670-600 p-5 rounded-full min-w-40", className)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
export default BotaoCad;