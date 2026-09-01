import { cn } from "@/lib/cn";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";

cssInterop(LinearGradient, {
  className: "style",
});

type StyledLinearGradientProps = Omit<LinearGradientProps, "colors"> & {
  className?: string;
  colors: [string, string, ...string[]];
  children?: React.ReactNode;
};

const StyledLinearGradient = ({
  className,
  colors,
  children,
  ...props
}: StyledLinearGradientProps) => {
  return (
    <LinearGradient className={cn(className)} colors={colors} {...props}>
      {children}
    </LinearGradient>
  );
};
export default StyledLinearGradient;
