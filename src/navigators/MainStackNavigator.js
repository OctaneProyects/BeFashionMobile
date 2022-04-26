import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LandingScreen } from '../screens/LandingScreen';
import CapturaKilometraje from '../screens/CapturaKilometraje';
import FormularioEntrega from '../screens/FormularioEntrega';
import ChecklistTienda from '../screens/ChecklistTienda';
import { FinalizaViaje } from '../screens/FinalizaRuta';
import { FinalizaViajeDirecta } from '../screens/FinalizaRutaDirecta';
import { MostradorAntesServicio } from '../screens/MostradorAntesServicio';
import { MostradorDespuesServicio } from '../screens/MostradorDespuesServicio';
import { SelectionMode } from '../screens/SelectionMode';
import { ImageScreenExample } from '../screens/ImageScreenExample'; //pantalla de prueba (ver imagen de BD)
import { Text } from 'react-native';
import mapScreen from '../screens/mapScreen';
import { AgregarUbicacion } from '../screens/AgregarUbicacion';
import PictureScreenScan from '../screens/PictureScreenScan';
import CameraScreen from '../screens/CameraScreen';
import { MisVentas } from '../screens/MisVentas';

const MainStack = createStackNavigator();

export function MainStackNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name={'SelectionMode'}
        component={SelectionMode}
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
        name={'MisVentas'}
        component={MisVentas}
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

      <MainStack.Screen
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

      <MainStack.Screen
        name={'maps'}
        component={mapScreen}
        options={{
          title: 'maps',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'PictureScreenScan'}
        component={PictureScreenScan}
        options={{
          title: 'camera',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
      <MainStack.Screen
        name={'CameraScreen'}
        component={CameraScreen}
        options={{
          title: 'camera',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>

      <MainStack.Screen
        name={'FinalizarRutaDirecta'}
        component={FinalizaViajeDirecta}
        options={{
          title: 'Be Fashion Eyewear',
          headerLeft: () => null,
          headerStyle: { backgroundColor: 'rgb(27,67,136)' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 16,
          },
        }}></MainStack.Screen>
    </MainStack.Navigator>
  );
}
