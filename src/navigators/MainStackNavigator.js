import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { LandingScreen } from '../screens/LandingScreen';
import CapturaKilometraje from '../screens/CapturaKilometraje';
import Formulario from '../screens/Formulario';
import TerminaViaje from '../screens/TerminaViaje';
import { FinalizaRuta } from '../screens/FinalizaRuta';
import { MostradorAntesServicio } from '../screens/MostradorAntesServicio';
import { MostradorDespuesServicio } from '../screens/MostradorDespuesServicio';
import { ImageScreenExample} from '../screens/ImageScreenExample'

const MainStack = createStackNavigator();

export function MainStackNavigator() {

    return (
        <MainStack.Navigator>
            <MainStack.Screen name={'Inicio'} component={CapturaKilometraje}></MainStack.Screen>
            <MainStack.Screen name={'Home'} component={LandingScreen}></MainStack.Screen>
            <MainStack.Screen name={'MostradorDespues'} component={MostradorDespuesServicio}></MainStack.Screen>  
            <MainStack.Screen name={'Formulario'} component={Formulario}></MainStack.Screen>
            <MainStack.Screen name={'MostradorDespues'} component={MostradorDespuesServicio}></MainStack.Screen>  
            <MainStack.Screen name={'TerminaTienda'} component={TerminaViaje}></MainStack.Screen> 
            <MainStack.Screen name={'MostradorAntes'} component={MostradorAntesServicio}></MainStack.Screen>
        </MainStack.Navigator>

    )
}

