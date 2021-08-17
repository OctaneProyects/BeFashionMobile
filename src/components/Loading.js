import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'

export function Loading({ loading }) {

    console.log(loading);

    if (!loading) {
        return <View />;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ActivityIndicator color={'black'} />
                <Text style={styles.text}>Loading...</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 8
    },
    text: {
        margin: 16,
        fontSize: 16,
        fontWeight: '300'
    }
})