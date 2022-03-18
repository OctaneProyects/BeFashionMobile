import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigator} from './navigators/AuthStackNavigator';
import {AuthContext} from './context/AuthContext';
import {MainStackNavigator} from './navigators/MainStackNavigator';
import {useAuth} from './hooks/useAuth';
import {useFlowAuth} from './hooks/useFlowAuth';
import {UserContext} from './context/UserContext';
import {EstatusContext} from './context/EstatusContext';
import TerminaViaje from './screens/ChecklistTienda';
import {BeFashionLoader} from './components/BeFashionLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootStack = createStackNavigator();

export default function () {
  const {auth, state} = useAuth();
  const {authFlow, estatus} = useFlowAuth();

  const EstatusValue = {
    authFlow: authFlow,
    estado: estatus.estado,
  };

  const initialLoginState = {
    isLoading: true,
    userData: null,
  };

  useEffect(() => {
    setTimeout(async () => {
      let userToken = null;
      var founduser;
      let userJSON;
      try {
        console.log('Buscando');
        userToken = await AsyncStorage.getItem('userToken');
        founduser = await AsyncStorage.getItem('@userData');
        userJSON = JSON.parse(founduser);
        console.log('userJSON');

        if (founduser) {
          console.log('Se encontro usuario');
          console.log(userJSON);
          console.log('Se encontro usuario');
          auth.retrieve(userJSON);
          // const {data} = await axios.get(
          //   `${BASE_URL}clientes/ObtieneDatosCliente`,
          //   {
          //     params: {
          //       idCliente: userJSON.idCliente,
          //     },
          //   },
          // );
          //   dispatch({
          //     type: 'RETRIEVE_TOKEN',
          //     token: userToken,
          //     userData: JSON.parse(data)[0],
          //   });
          // } else {
          //   dispatch({
          //     type: 'RETRIEVE_TOKEN',
          //     token: userToken,
          //     userData: userJSON,
          //   });
        } else {
          auth.logout();
        }
      } catch (e) {
        console.log(e);
        // dispatch({
        //   type: 'RETRIEVE_TOKEN',
        //   token: userToken,
        //   userData: userJSON,
        // });
      }
    }, 1500);
  }, []);

  if (state.loading) {
    return <BeFashionLoader></BeFashionLoader>;
  }

  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {state.user ? (
            <RootStack.Screen name={'MainStack'}>
              {() => (
                <UserContext.Provider value={state.user}>
                  <EstatusContext.Provider value={EstatusValue}>
                    <MainStackNavigator />
                  </EstatusContext.Provider>
                </UserContext.Provider>
              )}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen
              name={'AuthStack'}
              component={AuthStackNavigator}></RootStack.Screen>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
