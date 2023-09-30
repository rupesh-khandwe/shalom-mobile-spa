import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function UserProfile({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#006600", fontSize: 40 }}>Settings Screen!</Text>
            <Ionicons name="ios-settings-outline" size={80} color="#006600" />
        </View>
    );
}