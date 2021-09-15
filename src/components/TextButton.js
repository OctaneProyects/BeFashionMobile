import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export function TextButton({title, style, onPress}) {
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  button: {

  },
  text: {
    fontStyle: 'italic',
    color: 'white',
    fontSize: 12,
  },
});
