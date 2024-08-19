import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_LOCATION_API} from '@env'

export const getCountryList = (callback) => {
    AsyncStorage.getItem("CountryList", function(error, list) {
        if (list !== null) {
            console.log("Retrieve CountryList from cache");
            callback(JSON.parse(list));
        } else {
            axios
                .get(`${REACT_APP_LOCATION_API}/CountryList`, {
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
                    AsyncStorage.setItem("CountryList", JSON.stringify(countryArray));
                    callback(countryArray);
                })
                .catch((err) => console.log(err));
        }
    });
}

export const getStateList = (countryCode, callback) => {
    const defaultCountryId = 78; //India
    var config = {
        method: 'get',
        url: `${REACT_APP_LOCATION_API}/StateList?countryId=${countryCode}`,
        headers: {
            'content-type': 'application/json',
        },
    };
    if (countryCode === defaultCountryId) {
        AsyncStorage.getItem("IndiaStateList", function(error, list) {
            if (list !== null) {
                console.log("Retrieve India State list from cache");
                callback(JSON.parse(list));
            } else {
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
                        AsyncStorage.setItem("IndiaStateList", JSON.stringify(stateArray));
                        callback(stateArray);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    } else {
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
                callback(stateArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}