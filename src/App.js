import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStackNavigator} from './navigators/AuthStackNavigator';
import {AuthContext} from './context/AuthContext';
import {MainStackNavigator} from './navigators/MainStackNavigator';
import {useAuth} from './hooks/useAuth';
import {useFlowAuth} from './hooks/useFlowAuth';
import {UserContext} from './context/UserContext';
import {EstatusContext} from './context/EstatusContext';
import  TerminaViaje from './screens/ChecklistTienda'

const RootStack = createStackNavigator();

export default function () {
  const {auth, state} = useAuth();
  const {authFlow,estatus} = useFlowAuth();

  const EstatusValue={
    authFlow: authFlow,
    estado: estatus.estado
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
