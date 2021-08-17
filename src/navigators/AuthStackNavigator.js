import React from 'react'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterScreen } from '../screens/RegisterScreen';
import { createStackNavigator } from '@react-navigation/stack'

const AuthStack = createStackNavigator();

export function AuthStackNavigator() {

    return (
        <AuthStack.Navigator
            mode={'modal'}
            screenOptions={{
                headerShown: false,
            }}
        >

            <AuthStack.Screen name={'Login'} component={LoginScreen}></AuthStack.Screen>
            <AuthStack.Screen name={'Register'} component={RegisterScreen}></AuthStack.Screen>

        </AuthStack.Navigator>

    )

}

