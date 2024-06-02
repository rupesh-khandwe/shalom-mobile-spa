import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import {View , ActivityIndicator, Linking, AppState } from 'react-native';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import AppStack from './AppStack';

export default function AppNav() {
    const {isLoading, userToken} = useContext(AuthContext);

    /* useEffect(() => {
        const handleDeepLink = ({ url }) => {
            const route = url.replace(/.*?:\/\//g, '');
            console.log("url: ",url)
            console.log("route: ",route)

            const routeName = route.split('/')[0];
            console.log("routeName: ",routeName)

            if (routeName === 'golive') {
              const id = route.split('/')[1];
              console.log("id: ",id)
            }
        }

        const listner = Linking.addEventListener('url', handleDeepLink);

        return () => {
          listner.remove();
        };

      }, []); */

    /**
     * Linking Configuration
     */
    const linking = {
        // Prefixes accepted by the navigation container, should match the added schemes
        prefixes: ["shalomgolive://"],  // , "https://shalomgolive/"
        // Route config to map uri paths to screens
        config: {
        // Initial route name to be added to the stack before any further navigation,
        // should match one of the available screens
            initialRouteName: "Home",
            screens: {
                // myapp://home -> HomeScreen
                Home: {
                    screens: {
                    // myapp://details/1 -> DetailsScreen with param id: 1
                        GoLive: "golive/:id"
                    }
                }
            },
        },
        async getInitialURL() {
            return Linking.getInitialURL();
        },
    };


    if(isLoading){
        return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
        ); 
    }
    return (
        <NavigationContainer linking={linking}>
            { userToken !== null ? <AppStack /> :  <AuthStack />}
           
        </NavigationContainer>
    );

}
