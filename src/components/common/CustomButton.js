import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress, disable}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={{
        backgroundColor: disable?'gray':'#AD40AF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
