import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GamingSVG from '../assets/images/misc/GamingSVG';

const OnboardingScreen = ({navigation}) => {
  const shalomLogo = require('../assets/shalom_registered_logo.JPG');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <View style={{marginTop: 30}}>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontWeight: 'bold',
            fontSize: 30,
            color: '#20315f',
          }}>
          SHALOM
        </Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={shalomLogo}
          width={300}
          height={300}
          style={{transform: [{rotate: '-15deg'}]}}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Roboto-MediumItalic',
          }}>
          Let's Begin
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
