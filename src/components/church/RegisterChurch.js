import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Keyboard, 
  Text
} from 'react-native';

import InputField from '../common/InputField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../common/CustomButton';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'; 
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {BASE_URL_CHURCH_API, BASE_URL_LOCATION_API} from '@env'

export default function RegisterChurch({navigation}) {
  const {userToken, userInfo}= useContext(AuthContext);
  const [churchWebsiteUrl, setChurchWebsiteUrl] = useState('');
  const [churchName, setChurchName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressline1, setAddressline1] = useState('');
  const [addressline2, setAddressline2] = useState('');
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [userId, setUserId] = useState([]);
  const [createdBy, setCreatedBy] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const church_model = {
    'userId': userId,
    'churchName': churchName,
    'churchWebsiteUrl': churchWebsiteUrl,
    'phone1': phone1,
    'phone2': phone2,
    'addressline1': addressline1,
    'addressline2': addressline2,
    'countryId': countryId,
    'stateId': stateId,
    'cityId': cityId,
    'regionId': regionId,
    'createdBy': createdBy
  }

  useEffect(() => {
    setUserId(userInfo.userId);
    setCreatedBy(userInfo.userFirstName+" "+userInfo.userLastName);
    console.log("Registration launched"+BASE_URL_LOCATION_API);
    axios
    .get(`${BASE_URL_LOCATION_API}/CountryList`, {
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

  const validateForm = () =>{
    Keyboard.dismiss();
    let errors = {};
    const requireFieldMsg = " Required field*";
    const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if(!churchName) errors.churchName = requireFieldMsg;

    if(!phone1){
      errors.phone1 = requireFieldMsg;
    } else if(!regexPhone.test(phone1)){
      errors.phone1 = "Invalid phone1";
    }
    if(phone2){
      if(!regexPhone.test(phone2)) errors.phone2 = "Invalid phone2";
    }
    if(!addressline1) errors.addressline1 = requireFieldMsg;
    if(!countryId) errors.countryId = "Please select country";
    if(!stateId) errors.stateId = "Please select state";
    if(!cityId) errors.cityId = "Please select city";
    if(!regionId) errors.regionId = "Please select region";
    setErrors(errors);
    return Object.keys(errors).length === 0;
}

const handleSubmit = () =>{
  if(validateForm()){
    setChurchName("");
    setPhone1("");
    setAddressline1("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setRegionId("");
    setErrors({});
    handleRegister();
  }
}

  const handleState = countryCode => {
    var config = {
      method: 'get',
      url: `${BASE_URL_LOCATION_API}/StateList?countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
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
      url: `${BASE_URL_LOCATION_API}/CityList?stateId=${stateCode}&countryId=${countryCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
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
    var config = {
      method: 'get',
      url: `${BASE_URL_LOCATION_API}/RegionList?cityId=${cityCode}`,
      headers: {
        'content-type': 'application/json',
      },
    };

    axios(config)
      .then(function (response) {
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
    .post(`${BASE_URL_CHURCH_API}/register`, 
      church_model,
      {headers: { 'content-type': 'application/json', 'Authorization': "Bearer "+ userToken},
      })
    .then((res) => {
      navigation.navigate('Church', 
      "success"
    );
    })
    .catch((err) => console.log(`Login error ${err}`)); 
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
        <FontAwesome5 name="church" size={50} color="purple" />
        </View>

        <InputField
          label={'Church Name*'}
          icon={
            <MaterialCommunityIcons
              name="church"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          onChangeText={(text) => {setChurchName(text)}}
          value={churchName}
          error={errors.churchName}
        />


        <InputField
          label={'Church web-site url'}
          icon={
            <MaterialCommunityIcons
              name="web"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          onChangeText={(text) => {setChurchWebsiteUrl(text)}}
          value={churchWebsiteUrl}
        />

        <InputField
          label={'Phone-1*'}
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
          error={errors.phone1}
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
          label={'Address Line 1*'}
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
          error={errors.addressline1}
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
          onChangeText={(text) => {setAddressline2(text)}}
          value={addressline2}
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
          placeholder={!isFocus ? 'Select country*' : '...'}
          searchPlaceholder="Search..."
          value={countryId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountryId(item.value);
            handleState(item.value);
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
          error={errors.countryId}
          />
          {
            errors.countryId ? (<Text style={styles.errorText}>{errors.countryId}</Text>):null
          }

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
          placeholder={!isFocus ? 'Select state*' : '...'}
          searchPlaceholder="Search..."
          value={stateId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setStateId(item.value);
            handleCity(countryId, item.value);
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
          error={errors.stateId}
          />
          {
            errors.stateId ? (<Text style={styles.errorText}>{errors.stateId}</Text>):null
          }

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
          placeholder={!isFocus ? 'Select city*' : '...'}
          searchPlaceholder="Search..."
          value={cityId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCityId(item.value);
            handleRegion(item.value);
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
          error={errors.cityId}
          />
          {
            errors.cityId ? (<Text style={styles.errorText}>{errors.cityId}</Text>):null
          }

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
          placeholder={!isFocus ? 'Select region*' : '...'}
          searchPlaceholder="Search..."
          value={regionId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setRegionId(item.value);
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
          error={errors.regionId}
          />
          {
            errors.regionId ? (<Text style={styles.errorText}>{errors.regionId}</Text>):null
          }

        <CustomButton label={'Register'} onPress={handleSubmit} />

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
  errorText: {
    color: 'red',
    marginBottom: 20,
  }
});
