import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export function Error({ error }) {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{error}</Text>
        </View>
    )

}
const styles = StyleSheet.create({
    text: {
        color: 'rgb(237, 85, 101)',
        fontWeight: 'bold',
    }
})