import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

export default function InputField({
  label,
  editable,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  value,
  onChangeText,
  onFocus = () => {},
  error,
  secureTextFlag,
}) {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
        borderColor: error?'red':inputIsFocused?'gray':'gray'
      }}>
      {icon}
      {inputType === 'password' ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          secureTextEntry={secureTextFlag}
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
          onFocus={()=>{
            onFocus();
            setInputIsFocused(true);
          }}
          onBlur={()=>{
            setInputIsFocused(false)
          }}
        />       
      ) : (
        <TextInput
          placeholder={label}
          editable={editable}
          keyboardType={keyboardType}
          autoCorrect={false}
          style={{flex: 1, paddingVertical: 0}}
          value={value}
          onChangeText={onChangeText}
          onFocus={()=>{
            onFocus();
            setInputIsFocused(true);
          }}
          onBlur={()=>{
            setInputIsFocused(false)
          }}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: '#AD40AF', fontWeight: '700'}}>{fieldButtonLabel}</Text>
      </TouchableOpacity>
      <View>{error && <Text style={{color: 'red'}}>{error}</Text>}</View>
    </View>
  );
}
