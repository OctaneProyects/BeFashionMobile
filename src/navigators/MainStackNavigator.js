import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// import { LandingScreen } from '../screens/LandingScreen';
import  CapturaKilometraje  from '../screens/CapturaKilometraje';
import Formulario from  '../screens/Formulario';
import TerminaViaje from  '../screens/TerminaViaje';

const MainStack = createStackNavigator();

export function MainStackNavigator() {

    return (
        <MainStack.Navigator>
            {/* <MainStack.Screen name={'Home'} component={LandingScreen}></MainStack.Screen> */}
            <MainStack.Screen name={'Inicio'} component={CapturaKilometraje}></MainStack.Screen>
            <MainStack.Screen name={'Formulario'} component={Formulario}></MainStack.Screen>
            <MainStack.Screen name={'TerminaViaje'} component={TerminaViaje}></MainStack.Screen>
        </MainStack.Navigator>

    )
}
