import React, { forwardRef } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface NumericInputProps extends TextInputProps {
  decimal?: boolean; // Allow decimal numbers if true
  editable?: boolean; // Allow enabling/disabling editing
}

const NumericInput = forwardRef<TextInput, NumericInputProps>(
  ({ decimal = false, editable = true, ...props }, ref) => {
    const handleChangeText = (text: string) => {
      const regex = decimal ? /^\d*(\.\d{0,3})?$/ : /^\d*$/;
      if (regex.test(text)) {
        props.onChangeText?.(text);
      }
    };

    return (
      <TextInput
        {...props}
        ref={ref}
        keyboardType={decimal ? "decimal-pad" : "number-pad"}
        onChangeText={handleChangeText}
        editable={editable}
        style={[styles.input, props.style]}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    fontSize: 12,
    textAlign: "right",
    paddingLeft: 4,
    paddingRight: 4,
    width: 100,
    paddingBottom: 4,
    paddingTop: 4,
  },
});

export default NumericInput;
