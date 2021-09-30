import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LandingScreen} from '../screens/LandingScreen';
import CapturaKilometraje from '../screens/CapturaKilometraje';
import Formulario from '../screens/Formulario';
import TerminaViaje from '../screens/TerminaViaje';
import {FinalizaRuta} from '../screens/FinalizaRuta';
import {MostradorAntesServicio} from '../screens/MostradorAntesServicio';
import {MostradorDespuesServicio} from '../screens/MostradorDespuesServicio';
import {ImageScreenExample} from '../screens/ImageScreenExample'; //pantalla de prueba (ver imagen de BD)
import { Text} from 'react-native';

const MainStack = createStackNavigator();

export function MainStackNavigator() {
  return (
    <MainStack.Navigator>
      {/* <MainStack.Screen
        name={'Inicio'}
        component={CapturaKilometraje}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerRight: () => <Text style={{color:'white'}} > usuario</Text>,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
        ></MainStack.Screen>
      <MainStack.Screen
        name={'Home'}
        component={LandingScreen}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerRight: () => <Text> usuario</Text>,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'MostradorDespues'}
        component={MostradorDespuesServicio}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,

          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'Formulario'}
        component={Formulario}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'TerminaTienda'}
        component={TerminaViaje}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'MostradorAntes'}
        component={MostradorAntesServicio}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen> */}
        <MainStack.Screen
        name={'FinalizarRuta'}
        component={FinalizaRuta}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
    </MainStack.Navigator>
  );
}
