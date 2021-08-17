import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export function FilledButton({ title, style, onPress }) {

    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.text}>
                {title.toUpperCase()}
            </Text>
        </TouchableOpacity >
    )
    
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#00a2e5',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 16
    }
})