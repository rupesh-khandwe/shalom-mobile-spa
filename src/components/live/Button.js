import React from "react";
import {
  Text,
  TouchableOpacity
} from "react-native";

// Common Component which will also be used in Controls Component
const Button = ({ onPress, buttonText, backgroundColor, btnStyle }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...btnStyle,
          backgroundColor: backgroundColor,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

export default Button;