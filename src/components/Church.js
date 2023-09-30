import * as React from 'react';
import { View, Text, Image } from 'react-native';

export default function Church({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Church Screen</Text>
        </View>
    );
}