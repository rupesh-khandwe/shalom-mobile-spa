import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet
} from 'react-native';

import InputField from '../common/InputField';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import GoogleSVG from '../../assets/images/misc/GoogleSVG';
import FacebookSVG from '../../assets/images/misc/FacebookSVG';
import TwitterSVG from '../../assets/images/misc/TwitterSVG';
import CustomButton from '../common/CustomButton';
import { cover, icon } from '../../assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';


export default function RegisterScreen({navigation}) {
  const [date, setDate] = useState(new Date(1598051730000));
  const [dateString, setDateString] = useState('Date of Birth');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [regionName, setRegionName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const BASE_URL_API = "http://192.168.68.133:8090/address/v1";
  const BASE_URL_RGSTR_API = "http://192.168.68.133:8090/userProfile/v1/register";

  useEffect(() => {
    console.log("Registration launched");
    axios
    .get(`${BASE_URL_API}/CountryList`, {
      headers: { 'content-type': 'application/json'},
    })
    .then((res) => {
      var count = Object.keys(res.data).length;
      let countryArray = [];
      for (var i = 0; i < count; i++) {
        countryArray.push({
          value: res.data[i].countryId,
          label: res.data[i].countryName,
        });
      }
      setCountryData(countryArray);
    })
    .catch((err) => console.log(err));
  }, []);

  const handleState = countryCode => {
    console.log(countryCode);
    var config = {
      method: 'get',
      url: `${BASE_URL_API}/StateList?countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          console.log( response.data[i].stateId+"="+response.data[i].stateName);
          stateArray.push({
            value: response.data[i].stateId,
            label: response.data[i].stateName,
          });
        }
        setStateData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    console.log(countryCode+"=="+stateCode);
    var config = {
      method: 'get',
      url: `${BASE_URL_API}/CityList?stateId=${stateCode}&countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].cityId,
            label: response.data[i].cityName,
          });
        }
        setCityData(cityArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRegion = (cityCode) => {
    console.log(cityCode);
    var config = {
      method: 'get',
      url: `${BASE_URL_API}/RegionList?cityId=${cityCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let regionArray = [];
        for (var i = 0; i < count; i++) {
          regionArray.push({
            value: response.data[i].regionId,
            label: response.data[i].regionName + " - " + response.data[i].pincode,
          });
        }
        setRegionData(regionArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRegister = () => {
    console.log(handleRegister);
    axios
    .post(`${BASE_URL_RGSTR_API}`, {
        email,
        firstName,
        middleName,
        lastName,
        gender,
        phone1,
        phone2,
        addressLine1,
        addressLine2,
        countryId,
        stateId,
        cityId,
        regionId, 
        userName, 
        password
    })
    .then((res) => {
        console.log(res.data);
        navigation.goBack();
    })
    .catch((err) => console.log(`Login error ${err}`)); 
  };

 {/* DOB code in future if needed */}
    // const onChange = (event, selectedDate) => {
    //   const currentDate = selectedDate;
    //   const year = selectedDate.getFullYear();
    //   const month = selectedDate.getMonth()+1; 
    //   const day= selectedDate.getDate();
    //   const dateString = `${day}-${month}-${year}`;
    //   setShow(false);
    //   setDateString(dateString);
    //   setDate(currentDate);
    // };

    // const showMode = (currentMode) => {
    //   setShow(true);
    //   setMode(currentMode);
    // };

    // const showDatepicker = () => {
    //   showMode('date');
    // };

    // const showTimepicker = () => {
    //   showMode('time');
    // };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Image
            source={icon}
            width={100}
            height={100}
            style={{transform: [{rotate: '-15deg'}]}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Register
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <GoogleSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <FacebookSVG height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <TwitterSVG height={24} width={24} />
          </TouchableOpacity>
        </View>

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          Or, register with email ...
        </Text>

        <InputField
          label={'Email ID'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          onChangeText={(text) => {setEmail(text)}}
          value={email}
        />

        <InputField
          label={'First Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setFirstName(text)}}
          value={firstName}
        />
        <InputField
          label={'Middle Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setMiddleName(text)}}
          value={middleName}
        />
        <InputField
          label={'Last Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setLastName(text)}}
          value={lastName}
        />
        <InputField
          label={'Gender'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setGender(text)}}
          value={gender}
        />
        <InputField
          label={'Phone-1'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setPhone1(text)}}
          value={phone1}
        />
        <InputField
          label={'Phone-2'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setPhone2(text)}}
          value={phone2}
        />
        <InputField
          label={'Address Line 1'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setAddressLine1(text)}}
          value={addressLine1}
        />
        <InputField
          label={'Address Line 2'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setAddressLine2(text)}}
          value={addressLine2}
        />

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select country' : '...'}
          searchPlaceholder="Search..."
          value={countryId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountryId(item.value);
            handleState(item.value);
            setCountryName(item.label);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={stateData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select state' : '...'}
          searchPlaceholder="Search..."
          value={stateId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setStateId(item.value);
            handleCity(countryId, item.value);
            setStateName(item.label);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={cityData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select city' : '...'}
          searchPlaceholder="Search..."
          value={cityId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCityId(item.value);
            handleRegion(item.value);
            setCityName(item.label);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />

        <Dropdown
          style={[styles.dropdownRegion, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={regionData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select region' : '...'}
          searchPlaceholder="Search..."
          value={regionId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setRegionId(item.value);
            setRegionName(item.label);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? '#AD40AF' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
        {/* <InputField
          label={'Country'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setAddressline1(text)}}
          value={addressline1}
        /> */}
        <InputField
          label={'User Name'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setUserName(text)}}
          value={userName}
        />

        <InputField
          label={'Password'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          onChangeText={(text) => {setPassword(text)}}
          value={password}
        />

        <InputField
          label={'Confirm Password'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
        />
        {/* DOB code in future if needed */}
        {/* <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{marginRight: 5}}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>
              {dateString.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* <Button onPress={showDatepicker} title="Show date picker!" />
        <Button onPress={showTimepicker} title="Show time picker!" />
        <Text>selected: {date.toLocaleString()}</Text> */}
        {/* {show && (<DateTimePicker
          testID="dateTimePicker"
          minimumDate={new Date(1947, 0, 1)}
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
        )} */}

        <CustomButton label={'Register'} onPress={handleRegister} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
          </TouchableOpacity>
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
});
