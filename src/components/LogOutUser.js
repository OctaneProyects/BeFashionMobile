import React,{useContext} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {UserContext} from '../context/UserContext';
import {AuthContext} from '../context/AuthContext';

export function LogOutUser() {
  const user = useContext(UserContext);
  const {logout} = useContext(AuthContext);

  return (
    <View style={{flexDirection: 'row', paddingRight: 10}}>
      <Text style={{color: 'white', paddingHorizontal: 15}}>{user.name}</Text>
      <Icon
        name="sign-out-alt"
        size={20}
        color="white"
        onPress={() => {
          logout();
        }}></Icon>
    </View>
  );
}
