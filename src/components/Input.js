import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

export function Input({ style, ...props }) {

    return (
        <TextInput
            {...props}
            style={[styles.input, style]}
        />
    )

}
const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 5,
        padding: 7,
    }
})