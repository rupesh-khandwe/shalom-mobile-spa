import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function CustomTopNavButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: label?'#AD40AF':'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
      }}>
      {label && <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>}
      {!label && <Ionicons name="chevron-back-outline" size={24} color="black" />}
    </TouchableOpacity>
  );
}
