import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomTopNavButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#AD40AF',
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
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
