import React, {useState, useEffect} from 'react';
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

import GoogleSVG from '../../assets/images/misc/GoogleSVG';
import FacebookSVG from '../../assets/images/misc/FacebookSVG';
import TwitterSVG from '../../assets/images/misc/TwitterSVG';
import CustomButton from '../common/CustomButton';
import { icon } from '../../assets/images';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {BASE_URL_LOCATION_API, BASE_URL_USER_PROFILE} from '@env'
import PhoneInput from "react-native-phone-number-input";
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function RegisterScreen({navigation}) {
  // const [date, setDate] = useState(new Date(1598051730000));
  // const [dateString, setDateString] = useState('Date of Birth');
  // const [mode, setMode] = useState('date');
  // const [show, setShow] = useState(false);
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  // const [countryName, setCountryName] = useState(null);
  // const [stateName, setStateName] = useState(null);
  // const [cityName, setCityName] = useState(null);
  // const [regionName, setRegionName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    firstName: ''
  });
  const [errors, setErrors] = useState({});
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);
  
  const [genderData, setGenderData] = useState([
    {label: 'Male', value: 'M'},
    {label: 'Female', value: 'F'}
  ]);

  useEffect(() => {
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

    GoogleSignin.configure();
  }, []);

  
const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    setState({ userInfo });
    console.log("Google user info", userInfo);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log(error)
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log(error)
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log(error)
    } else {
      // some other error happened
      console.log("Default error ",error)
    }
  }
};

const fbLogin = (resCallback) => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    result => {
      console.log("fb results=="+result)
      if(result.declinedPermissions && result.declinedPermissions.includes("email")){
        resCallback({message: "Email is required"})
      }
      if(result.isCancelled){
        console.log("Error")
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture',
          null,
          resCallback
        );
        new GraphRequestManager().addRequest(infoRequest).start()
      }
    },
    function(error){
      console.log("Login fail with error:", error)
    }
  )
}

const onFbLogin = async() => {
  try {
    await fbLogin(_responseInfoCallBack)
  } catch (error) {
    console.log("FB login error",error)
  }
}

const _responseInfoCallBack = async(error, result) =>{
  if(error){
    console.log("error fb1", error)
    return;
  } else{
    const userData = result
    console.log("FB data===", userData)
  }
}


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
      if(!gender) errors.gender = "Please select gender";
      if(!phone1){
        errors.phone1 = "Please enter phone1";
      } else if(!regexPhone.test(phone1)){
        errors.phone1 = "Invalid phone1";
      }
      if(!regexPhone.test(phone2)) errors.phone2 = "Invalid phone2";
      if(!addressLine1) errors.addressLine1 = requireFieldMsg;
      if(!countryId) errors.countryId = "Please select country";
      if(!stateId) errors.stateId = "Please select state";
      if(!cityId) errors.cityId = "Please select city";
      if(!regionId) errors.regionId = "Please select region";
      if(!userName) errors.userName = requireFieldMsg;
      if(!password) errors.password = requireFieldMsg;
      if(!confirmPassword) errors.confirmPassword = requireFieldMsg;
      if(password !== confirmPassword) errors.confirmedPassword = "Confirm passward must match with Password fields";
      setErrors(errors);
      return Object.keys(errors).length === 0;
  }

  const handleSubmit = () =>{
    if(validateForm()){
      console.log("Submitted", userName, userPassword);
      setEmail("");
      setFirstName("");
      setErrors({});
      console.log(errors+"****"+email+"***"+firstName);
      handleRegister();
    }
  }

  const setHideFlag = () =>{
    setSecureText(!secureText)
  }

  const setConfirmHideFlag = () =>{
    setConfirmSecureText(!confirmSecureText)
  }

  const handleOnChange = (text, input) =>{
    setFormFields((prevState)=>({...prevState, [input]: text}))
    console.log("Form fields..",formFields)
  };

  const handleError = (errorMessage, input) =>{
    setErrors((prevState)=>({...prevState, [input]: errorMessage}))
    console.log("Form fields..",errors)
  }

  

  const handleState = countryCode => {
    console.log(countryCode);
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
    console.log(cityCode);
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
    .post(`${BASE_URL_USER_PROFILE}/register`, {
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
        //navigation.goBack();
        navigation.navigate('Login', 
          "success"
        );
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
            onPress={googleLogin}
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
            onPress={onFbLogin}
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
          label={'Email ID*'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          // onChangeText={(text) => {setEmail(text);handleOnChange(text, 'email')}}
          // // (text) => {setEmail(text)}
          // onFocus={()=> {
          //   handleError(null, 'email')
          // }}
          onChangeText={(text) => {setEmail(text)}}
          value={email}
          error={errors.email}
        />

        <InputField
          label={'First Name*'}
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
          error={errors.firstName}
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
          label={'Last Name*'}
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
          error={errors.lastName}
        />
  
        <Dropdown
          style={[styles.dropdownRegion, isFocus && {borderColor: 'black'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={genderData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select gender*' : '...'}
          value={gender}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setGender(item.value);
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
          error={errors.gender}
        />
        {
          errors.gender ? (<Text style={styles.errorText}>{errors.gender}</Text>):null
        }

      <PhoneInput
            defaultValue={phone1}
            textInputProps={{maxLength: 10}}
            onChangeText={(text) => {
              setPhone1(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone1(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone-1*"
            error={errors.phone1}
          />
        {
          errors.phone1 ? (<Text style={styles.errorText}>{errors.phone1}</Text>):null
        }
        <PhoneInput
            defaultValue={phone2}
            textInputProps={{maxLength: 10}}
            onChangeText={(text) => {
              setPhone2(text);
            }}
            onChangeFormattedText={(text) => {
              setPhone2(text);
            }}
            containerStyle={styles.phoneInput}
            placeholder="Phone-2"
            error={errors.phone2}
            />
          {
            errors.phone2 ? (<Text style={styles.errorText}>{errors.phone2}</Text>):null
          }
        {/* <InputField
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
        /> */}
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
          onChangeText={(text) => {setAddressLine1(text)}}
          value={addressLine1}
          error={errors.addressLine1}
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
          label={'User Name*'}
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
          error={errors.userName}
        />

        <InputField
          label={'Password*'}
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
          fieldButtonLabel={<FontAwesome name={secureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setHideFlag}
          error={errors.password}
          secureTextFlag={secureText}
        />

        <InputField
          label={'Confirm Password*'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          onChangeText={(text) => {setConfirmPassword(text)}}
          value={confirmPassword}
          fieldButtonLabel={<FontAwesome name={confirmSecureText?"eye-slash":"eye"} size={22} color="purple"/>}
          fieldButtonFunction={setConfirmHideFlag}
          error={errors.confirmPassword}
          secureTextFlag={confirmSecureText}
        />
          {
            errors.confirmedPassword ? (<Text style={styles.errorText}>{errors.confirmedPassword}</Text>):null
          }
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

        {/* <CustomButton label={'Register'} onPress={handleRegister} /> */}
        <CustomButton label={'Register'} onPress={handleSubmit} />
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
  }
});
