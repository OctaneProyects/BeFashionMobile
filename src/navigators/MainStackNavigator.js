import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LandingScreen } from '../screens/LandingScreen';
import CapturaKilometraje from '../screens/CapturaKilometraje';
import FormularioEntrega from '../screens/FormularioEntrega';
import ChecklistTienda from '../screens/ChecklistTienda';
import { FinalizaViaje } from '../screens/FinalizaRuta';
import { MostradorAntesServicio } from '../screens/MostradorAntesServicio';
import { MostradorDespuesServicio } from '../screens/MostradorDespuesServicio';
import { ImageScreenExample } from '../screens/ImageScreenExample'; //pantalla de prueba (ver imagen de BD)
import { Text } from 'react-native';
import mapScreen from '../screens/mapScreen';
import { AgregarUbicacion } from '../screens/AgregarUbicacion';

const MainStack = createStackNavigator();

export function MainStackNavigator() {
  return (
    <MainStack.Navigator>
      {/* <MainStack.Screen
        name={'CapturaKilometraje'}
        component={CapturaKilometraje}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerRight: () => <Text style={{ color: 'white' }}> usuario</Text>,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      
      <MainStack.Screen
        name={'LandingScreen'}
        component={LandingScreen}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerRight: () => <Text> usuario</Text>,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      
      <MainStack.Screen
        name={'MostradorDespuesServicio'}
        component={MostradorDespuesServicio}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'FormularioEntrega'}
        component={FormularioEntrega}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen> 
      <MainStack.Screen
        name={'ChecklistTienda'}
        component={ChecklistTienda}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'MostradorAntesServicio'}
        component={MostradorAntesServicio}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'FinalizarRuta'}
        component={FinalizaViaje}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>

      {/*<MainStack.Screen
        name={'addSite'}
        component={AgregarUbicacion}
        options={{
          title: 'Agregar tienda',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
        */}
      {/*  <MainStack.Screen
        name={'maps'}
        component={mapScreen}
        options={{
          title: 'maps',
          headerLeft: () => null,
          headerStyle: {backgroundColor: 'rgb(27,67,136)'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen> */}
    </MainStack.Navigator>
  );
}
