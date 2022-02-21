import React from 'react';
import {StyleSheet, View, Image, ActivityIndicator} from 'react-native';

export function BeFashionLoader() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../../Images/BEFASHION_LOGO.png')}></Image>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: 'rgb(27,67,136)',
    // backgroundColor: '#0F212E',
  },
  tinyLogo: {
    resizeMode: 'stretch',
    width: '80%',
    height: '15%',
    marginBottom: '15%',
  },
});
