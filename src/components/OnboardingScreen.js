import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { icon, shalom } from '../assets/images';

const OnboardingScreen = ({navigation}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <View style={{marginTop: 3}}>
       
        <Image
          source={shalom}
          style={{ height: 100, width: 200, resizeMode: 'contain' }}
          flex={1}
          resizeMode="contain"
          resizeMethod="resize"
          
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 200}}>
        <Image
          source={icon}
          width={100}
          height={100}
          style={{transform: [{rotate: '-2deg'}]}}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 350,
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
          A Believer’s Hub
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
