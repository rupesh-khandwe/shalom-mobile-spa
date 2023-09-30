import React from 'react';
import { Image } from 'react-native';

import Logo from './assets/shalom_logo.png';

export default function LogoTitle(){
    return(
        <Image
            source={Logo}
            style={{width:44, height:44}}></Image>
    );
}