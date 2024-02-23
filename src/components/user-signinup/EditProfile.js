import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard
} from 'react-native';

import InputField from '../common/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomButton from '../common/CustomButton';
import { icon } from '../../assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {BASE_URL_LOCATION_API, BASE_URL_USER_PROFILE, BASE_URL_API} from '@env';
import PhoneInput from "react-native-phone-number-input";
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons'; 
import { AuthContext } from '../../context/AuthContext';
import { showMessage, hideMessage  } from "react-native-flash-message";

export default function EditProfile({navigation}) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [regionName, setRegionName] = useState('');
  const [userName, setUserName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailEdit, setEmailEdit] = useState(false);
  const [firstNameEdit, setFirstNameEdit] = useState(false);
  const [middleNameEdit, setMiddleNameEdit] = useState(false);
  const [lastNameEdit, setLastNameEdit] = useState(false);
  const [phone1Edit, setPhone1Edit] = useState(false);
  const [phone2Edit, setPhone2Edit] = useState(false);
  const [addressLine1Edit, setAddressLine1Edit] = useState(false);
  const [addressLine2Edit, setAddressLine2Edit] = useState(false);
  const [cityEdit, setCityEdit] = useState(false);
  const [stateEdit, setStateEdit] = useState(false);
  const [regionEdit, setRegionEdit] = useState(false);
  const {userInfo, userToken} = useContext(AuthContext);
  const updateProfilePayload = {
    userId: userId,
    email: email,
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    phone1: phone1,
    phone2: phone2,
    addressLine1: addressLine1,
    addressLine2: addressLine2,
    stateId: stateId,
    cityId: cityId,
    regionId: regionId 
  }
  
  useEffect(() => {
    console.log("Edit profile launched"+`${BASE_URL_API}/profileEdit?userId=${userInfo.userId}`);
    setUserId(userInfo.userId);
 //Load profile
    axios
    .get(`${BASE_URL_API}/profileEdit?userId=${userInfo.userId}`, {
      headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
      console.log(res.data)
      setEmail(res.data.userEmail)
      setFirstName(res.data.userFirstName)
      setMiddleName(res.data.userMiddleName?res.data.userMiddleName:"")
      setLastName(res.data.userLastName)
      setPhone1(res.data.userPhone1)
      setPhone2(res.data.userPhone2?res.data.userPhone2:"")
      setAddressLine1(res.data.userAddressLine1)
      setAddressLine2(res.data.userAddressLine2?res.data.userAddressLine2:"")
      setCityName(res.data.userCityName)
      setCityId(res.data.cityId)
      setStateId(res.data.stateId)
      setStateName(res.data.userStateName)
      setRegionName(res.data.userRegionName)
      setRegionId(res.data.regionId)
      setCountryId(res.data.countryId)
      setUserName(res.data.userName)

    //Load state
      axios
      .get(`${BASE_URL_LOCATION_API}/StateList?countryId=${res.data.countryId}`, {
        headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
      })
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

    })
    .catch((err) => console.log(err));
  }, []);

  const validateForm = () =>{
      Keyboard.dismiss();
      let errors = {};
      const requireFieldMsg = " Required field*";
      const regexPhone = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if(!email){
        errors.email = requireFieldMsg
      } else if(!regexEmail.test(email)){
        errors.email = "Email is invalid"
      }
      if(!firstName) errors.firstName = requireFieldMsg;
      if(!lastName) errors.lastName = requireFieldMsg;
      if(!phone1){
        errors.phone1 = "Please enter phone1";
      } else if(!regexPhone.test(phone1)){
        errors.phone1 = "Invalid phone1";
      }
      //if(phone2Edit && !regexPhone.test(phone2)) errors.phone2 = "Invalid phone2";
      if(!addressLine1) errors.addressLine1 = requireFieldMsg;
      if(!countryId) errors.countryId = "Please select country";
      if(!stateId) errors.stateId = "Please select state";
      if(!cityId) errors.cityId = "Please select city";
      if(!regionId) errors.regionId = "Please select region";
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if((emailEdit || firstNameEdit || middleNameEdit || lastNameEdit || phone1Edit || phone2Edit || addressLine1Edit || addressLine2Edit || cityEdit || stateEdit || regionEdit) 
        && validateForm()){
      setErrors({});
      console.log(errors+"****"+email+"***"+firstName);
      handleRegister();
    }
  }

  const handleCity = (countryCode, stateCode) => {
    console.log(countryCode+"=="+stateCode);
    setCityEdit(true)
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
    console.log(cityCode);
    setRegionEdit(true);
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
    .put(`${BASE_URL_API}/profileUpdate`, 
        updateProfilePayload,
      {headers: { 'Authorization': "Bearer "+ userToken, 'content-type': 'application/json'},
    })
    .then((res) => {
        showMessage({
          message: "Profile is updated successfully!",
          type: "info",
          hideOnPress: true,
          backgroundColor: "purple",
          style: styles.flashMessage
        })
        navigation.replace('Profile');
        // navigation.navigate('Profile', 
        //   "success"
        // );
    })
    .catch((err) => 
      //console.log(`Login error ${err}`)
      showMessage({
        message: "Failed to save, please try-again.",
        type: "info",
        hideOnPress: true,
        backgroundColor: "purple",
      })
    ); 
  };


  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center', margin: 30}}>
          <FontAwesome5 name="user-edit" size={40} color="purple" />
        </View>

        <InputField
          label={'Email ID*'}
          editable={emailEdit}
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
          fieldButtonLabel={!emailEdit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setEmailEdit(true)}
          error={errors.email}
        />

        <InputField
          label={'First Name*'}
          editable={firstNameEdit}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          //onChangeText={(text) => {handleOnChange(text, 'firstName')}}
          onChangeText={(text) => {setFirstName(text)}}
          value={firstName}
          fieldButtonLabel={!firstNameEdit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setFirstNameEdit(true)}
          error={errors.firstName}

        />
        <InputField
          label={'Middle Name'}
          editable={middleNameEdit}
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
          fieldButtonLabel={!middleNameEdit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setMiddleNameEdit(true)}
        />
        <InputField
          label={'Last Name*'}
          editable={lastNameEdit}
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
          fieldButtonLabel={!lastNameEdit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setLastNameEdit(true)}
          error={errors.lastName}
        />

      {!phone1Edit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'Phone 1*'}
          editable={false}
          icon={
            <FontAwesome name="mobile-phone" size={28} color="black" style={{margin: 5}}/>
          }
          value={" "+phone1}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setPhone1Edit(true)}
        />

      </View>
      }
      {phone1Edit && <PhoneInput
            defaultValue={phone1}
            textInputProps={{maxLength: 12}}
            onChangeText={(text) => {
              setPhone1(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone1(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone-1*"
            error={errors.phone1}
          />}
        {
          errors.phone1 ? (<Text style={styles.errorText}>{errors.phone1}</Text>):null
        }

    {!phone2Edit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'Phone 2'}
          editable={false}
          icon={
            <FontAwesome name="mobile-phone" size={28} color="black" style={{margin: 5}}/>
          }
          value={" "+phone2}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setPhone2Edit(true)}
        />
      </View>
      }
      {phone2Edit &&
        <PhoneInput
            defaultValue={phone2}
            textInputProps={{maxLength: 12}}
            onChangeText={(text) => {
              setPhone2(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone2(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone-2"
            error={errors.phone2}
            />}
          {
            errors.phone2 ? (<Text style={styles.errorText}>{errors.phone2}</Text>):null
          }
 
        <InputField
          label={'Address Line 1*'}
          editable={addressLine1Edit}
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
          fieldButtonLabel={!addressLine1Edit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setAddressLine1Edit(true)}
          error={errors.addressLine1}
        />
        <InputField
          label={'Address Line 2'}
          editable={addressLine2Edit}
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
          fieldButtonLabel={!addressLine2Edit && <FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setAddressLine2Edit(true)}
        />

      {!stateEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'State'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setStateName(text)}}
          value={" "+stateName}
          error={errors.stateName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>setStateEdit(true)}
        />

      </View>
      }
      {stateEdit &&
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
          />}
          {
            errors.stateId ? (<Text style={styles.errorText}>{errors.stateId}</Text>):null
          }

      {!cityEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'City'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setPhone1(text)}}
          value={" "+cityName}
          error={errors.cityName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>handleCity(countryId, stateId)}
        />

      </View>
      }
      {cityEdit && 
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
          />}
          {
            errors.cityId ? (<Text style={styles.errorText}>{errors.cityId}</Text>):null
          }

      {!regionEdit && 
        <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <InputField
          label={'Region'}
          editable={false}
          icon={
            <FontAwesome5 name="city" size={20} color="black" style={{margin: 5}}/>
          }
          onChangeText={(text) => {setRegionName(text)}}
          value={" "+regionName}
          error={errors.regionName}
          fieldButtonLabel={<FontAwesome name="pencil" size={20} color="purple" />}
          fieldButtonFunction={()=>
            handleRegion(cityId)}
        />

      </View>
      }
      {regionEdit && 
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
          />}
          {
            errors.regionId ? (<Text style={styles.errorText}>{errors.regionId}</Text>):null
          }

      
        <CustomButton label={'Save'} onPress={handleSubmit} 
          disable={!(emailEdit || firstNameEdit || middleNameEdit || lastNameEdit || phone1Edit || phone2Edit || addressLine1Edit || addressLine2Edit || cityEdit || stateEdit || regionEdit)}/>
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
  flashMessage: {
    borderRadius: 12,
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#222',
    margin: 12
  }
});
