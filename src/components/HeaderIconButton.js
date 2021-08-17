import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { IconButton } from './IconButton';


export function HeaderIconButton({ name, onPress }) {

    return (
        <IconButton name={name} style={styles.container} onPress={onPress}></IconButton>
    )

}
const styles = StyleSheet.create({
    container: {
        marginRight:16,
    },
})