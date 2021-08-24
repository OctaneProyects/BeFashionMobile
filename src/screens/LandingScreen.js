import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { HeaderIconButton } from '../components/HeaderIconButton';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext'
import {
    PieChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import StepIndicator from 'react-native-step-indicator';
import { FilledButton } from '../components/Button'

const data = [
    {
        name: "Seoul",
        population: 21500000,
        color: "rgba(131, 167, 234, 0.5)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Toronto",
        population: 2800000,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
];
const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
};
const screenWidth = Dimensions.get("window").width;

const labels = ["Cart", "Delivery Address", "Order Summary", "Payment Method", "Track"];
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: 'green',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: 'green',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: 'green',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: 'green',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: 'green',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: 'green'
}

export function LandingScreen({ navigation }) {

    const { logout } = React.useContext(AuthContext);
    const user = React.useContext(UserContext);
    const [stepValue, setStep] = useState(0);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    name={'log-out'}
                    onPress={() => {
                        logout();
                    }}
                />
            ),
        });
    }, [navigation, logout]);


    return (
        <View style={styles.container}>
            <Text>Welcome to landing</Text>
            <Text>{user.name}</Text>
            <View style={styles.containerCenter}>
                <PieChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    hasLegend={0}
                />
            </View>

            <StepIndicator
                customStyles={customStyles}
                currentPosition={stepValue}
                labels={labels}
            />

            <FilledButton
                title={'Aumentar'}
                style={styles.loginButton}
                onPress={() => {
                    (stepValue == 5 ? setStep(0) : setStep(stepValue + 1));
                }}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    loginButton:
    {
        marginVertical: 20,
    },
    containerCenter: {
        alignItems: 'center',
    }
});