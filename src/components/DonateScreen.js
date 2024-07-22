import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableHighlight,
  Modal,
  Pressable
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import axios from 'axios';
import {REACT_APP_LOCATION_API} from '@env'
import { showMessage  } from "react-native-flash-message";
import InputField from './common/InputField';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import CustomButton from './common/CustomButton';
import Base64 from 'react-native-base64';
import sha256 from 'sha256';
import { AuthContext } from '../context/AuthContext';
import {REACT_APP_BASE_URL_API} from '@env'

export default function DonateScreen() {
  const [env, setEnv] = useState("SANDBOX");
  const [merchantId, setMerchantId] = useState("PGTESTPAYUAT86");
  const [appId, setAppId] = useState(null);
  const [enableLogging, setEnableLogging] = useState(true);
  const [userId, setUserId] = useState('');
  const [mobileNumber, setMobileNumber] = useState();
  const [amount, setAmount] = useState();
  const [phonepeResCode, setPhonepeResCode] = useState(true);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const {userToken, userInfo}= useContext(AuthContext);
  const donationObj = {
    "userId": userId,
    "phone": mobileNumber,
    "amount": amount
  }

  useEffect(() => {
      setUserId(userInfo.userId);
    console.log("Donation launched"+userId);


  }, []);

  const validateForm = () =>{
      Keyboard.dismiss();
      let errors = {};
      const requireFieldMsg = " Required field*";
      const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
      if(!mobileNumber){
        errors.mobileNumber = requireFieldMsg;
      } else if(!regexPhone.test(mobileNumber)){
        errors.mobileNumber = "Invalid mobile number";
      }
      if(!amount) errors.amount = requireFieldMsg;
  
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    const merchantPrefix = "T";
    return `${merchantPrefix}${timestamp}${random}`;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      console.log("Submitted");
      setErrors({});
      console.log(errors+"****");

      PhonePePaymentSDK.init(env, merchantId, appId, enableLogging).then(resp => {

          console.log("response ..",resp)
          const requestBody = {
            merchantId: merchantId,
            merchantTransactionId:generateTransactionId(),
            amount: (amount * 100),
            mobileNumber: mobileNumber,
            callbackUrl: "",
            paymentInstrument: {
              type:"PAY_PAGE"
            }
          }

          const salt_key = "96434309-7796-489d-8924-ab56988a6076";
          const salt_index = 1;
          const payload = JSON.stringify(requestBody);
          const payload_main = Base64.encode(payload);
          const url = payload_main+"/pg/v1/pay"+salt_key;
          const checksum = sha256(url)+"###"+salt_index;
          console.log("requestBody == ", requestBody);
          console.log("payload == ", payload);
          console.log("payload_main == ", payload_main);
          console.log("url == ", url);
          console.log("checksum == ", checksum);
          PhonePePaymentSDK.startTransaction(
            payload_main,
            checksum,
            null,
            null
          ).then(resp=>{
            console.log("response === ", resp)
            if(resp.status==="SUCCESS")
              setPhonepeResCode(false)
              console.log("resp.status=SUCCESS",mobileNumber, amount);
              setUserId(userInfo.userId)
              axios
              .post(`${REACT_APP_BASE_URL_API}/shalom/donate`, 
                donationObj,
                  {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
              })
              .then((res) => {
                  console.log("Persisted donation...")
              })
              .catch((err) => console.log(`Failed to persist donation ${err}`)); 
          }).catch(err => console.log(err));
        }
      ).catch(err => console.log(err));
    }
  }


  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      {!phonepeResCode && showMessage({
                message: "Thank you for supporting our mission!!",
                type: "info",
                hideOnPress: true,
                autoHide: false,
                backgroundColor: "purple",
              })}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
          <MaterialIcons name="event" size={50} color="purple" />
        </View>
        {phonepeResCode && <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Dear Shalomers,{'\n'}{'\n'}
                Shalom is a free service and a mean to connect to GOD, brought to you by <Text style={{ fontSize: 18, fontWeight: 'bold', color:'purple'}}>"Shalom - A Believer’s Hub"</Text>.{'\n'}{'\n'}
                
                If you're blessed by this service and would like to support our ministry, we invite you to partner with us. {'\n'}{'\n'}

                Click on Donate button and support this ministry to serve better. {'\n'}{'\n'}

                May God bless you as you decided to partner with us.</Text>
            </View>
        </View>}

        {!phonepeResCode && <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalSuccessText}>Dear Shalomer!{'\n'}{'\n'}
                On behalf of entire Shalom group, we want to extend our sincerest gratitude for your recent gift. Without the support of congregants like you, we wouldn’t be able to spread God’s word and touch the lives of everyone in our community. {'\n'}{'\n'}
                
                Generosity brings you closer to God, as it helps others grow closer to Him, too. Your generosity is no small thing; there is mightiness in the meek. {'\n'}{'\n'}

                Please consider becoming a recurring donor or giving again to our campaign. Repeat donors make our important work possible. {'\n'}{'\n'}

                Thank you again for your kindness and your impact on our community!!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setPhonepeResCode(true)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </View>
        </View>}

        {phonepeResCode && <InputField
          label={'Mobile number*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {
            setMobileNumber(text);
          }}
          value={mobileNumber}
          error={errors.mobileNumber}
        />
        }
        {phonepeResCode && <InputField
          label={'Amount*'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {
            setAmount(text);
          }}
          value={amount}
          error={errors.amount}
        />
        }
       {phonepeResCode && <CustomButton label={'Donate'} onPress={handleSubmit} /> }

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>About our mission?</Text>
          <TouchableOpacity onPress={()=>setModalVisible(true)}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Click</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Dear Shalomers,{'\n'}{'\n'}
                  Shalom is a free service brought to you by <Text style={{ fontSize: 18, fontWeight: 'bold', color:'purple'}}>"Shalom - A Believer’s Hub"</Text>.{'\n'}{'\n'}
                  
                  <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Our Vision-</Text>{'\n'}
                  <Text style={{ fontSize: 15 }}>{`\u25CF `}  Help Christian believers find a church near them anywhere in the world.</Text>{'\n'}
                  <Text style={{ fontSize: 15 }}>{`\u25CF `}Create a unique global social media platform for Christian believers. </Text>{'\n'}{'\n'}

                  If you're blessed by this service and would like to support our ministry, we invite you to partner with us. {'\n'}{'\n'}

                  Click on Donate button and support this ministry to serve better. {'\n'}{'\n'}

                  May God bless you as you decided to partner with us.</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  dropdownRegion: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 25,
  },
  phoneInput: {
    width:'100%',
    height: 55,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc', 
    marginBottom: 20, 
    paddingHorizontal: 10, 
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'purple',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
  },
  modalSuccessText: {
    marginBottom: 15,
    fontStyle: 'italic',
    textAlign: 'justify',
  },
});
