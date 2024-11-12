import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';

import { icon, shalom } from '../assets/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COMPANY_NAME, COMPANY_EMAIL} from '@env'

const NeedHelpScreen = ({navigation}) => {

const emailSubject = 'Query regarding Shalom - A believers app';
const emailDesc = 'General query';
const onPressEmailClick = () => {
    Linking.openURL('mailto:'+COMPANY_EMAIL+'?subject='+emailSubject+'&body='+emailDesc)
 }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:30}}>
      <Image
          source={shalom}
          style={{ height: 100, width: 100, resizeMode: 'contain' }}
          flex={1}
          resizeMode="contain"
          resizeMethod="resize"
          
        />
        <Image
          source={icon}
          style={{transform: [{rotate: '-2deg'}], width:100, height:100}}
        />
      </View>
      <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Need HELP!!{'\n'}{'\n'}
                Shalom is a free service and a mean to connect to GOD, brought to you by <Text style={{ fontSize: 18, fontWeight: 'bold', color:'purple'}}>{COMPANY_NAME}</Text>.{'\n'}{'\n'}
                Please click on below email address
                for any queries regarding Sign-up or challenges you face during Shalom journey.  
              </Text> 
            </View>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:30}}>

      <TouchableOpacity
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => onPressEmailClick()}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Roboto-MediumItalic',
          }}>
          {COMPANY_EMAIL}
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
      </TouchableOpacity>

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
        onPress={() =>  navigation.navigate('Login')}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Roboto-MediumItalic',
            marginRight: 250
          }}>
          Back
        </Text>
        
      </TouchableOpacity>
      
      
      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 8,
    textAlign: 'justify',
    fontSize:20
  },
});

export default NeedHelpScreen;
