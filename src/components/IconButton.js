import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'


export function IconButton({ name, style, onPress }) {

    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Icon name={name} color='black'></Icon>
        </TouchableOpacity >
    )

}
const styles = StyleSheet.create({
    button: {},
})