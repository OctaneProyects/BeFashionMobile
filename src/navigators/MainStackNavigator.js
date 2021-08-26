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
            <MainStack.Screen name={'Captura Kilometraje'} component={CapturaKilometraje}></MainStack.Screen>
            <MainStack.Screen name={'Formulario Captura'} component={Formulario}></MainStack.Screen>
            <MainStack.Screen name={'Termina Visita Tienda'} component={TerminaViaje}></MainStack.Screen>
        </MainStack.Navigator>

    )
}

