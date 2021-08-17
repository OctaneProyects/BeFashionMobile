import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { LandingScreen } from '../screens/LandingScreen';

const MainStack = createStackNavigator();

export function MainStackNavigator() {

    return (
        <MainStack.Navigator>
            <MainStack.Screen name={'Home'} component={LandingScreen}></MainStack.Screen>
        </MainStack.Navigator>

    )
}

