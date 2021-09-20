import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {HeaderIconButton} from '../components/HeaderIconButton';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {FilledButton} from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {BASE_URL} from '../config';
import {ScrollView} from 'react-native-gesture-handler';

const data = [
  {
    name: 'Terminados',
    population: 21500000,
    color: 'rgb(27,67,136)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Pendientes',
    population: 2800000,
    color: 'rgb(124,145,176)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};
const screenWidth = Dimensions.get('window').width;

// const labels = ['Oxxo 1', 'Oxxo 2', 'Oxxo 3', 'Oxxo 4', 'oxxo 5'];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: 'rgb(27,67,136)', //actual
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: 'rgb(27,67,136)',
  stepStrokeUnFinishedColor: 'rgb(124,145,176)', //sin terminar
  separatorFinishedColor: 'rgb(27,67,136)', // terminado linea de union
  separatorUnFinishedColor: 'rgb(124,145,176)', //sin terminar
  stepIndicatorFinishedColor: 'rgb(27,67,136)', //terminado
  stepIndicatorUnFinishedColor: 'rgb(124,145,176)', //sin terminar
  stepIndicatorCurrentColor: '#ffffff', //actual
  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: 'rgb(27,67,136)', //actual numero
  stepIndicatorLabelFinishedColor: '#ffffff', //terminado
  stepIndicatorLabelUnFinishedColor: 'white', // numero si terminar
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: 'rgb(27,67,136)', //actual etiqueta
};
const labels = [];
const CantTiendas=0;

export function LandingScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const {logout} = React.useContext(AuthContext);
  const user = React.useContext(UserContext);
  const [stepValue, setStep] = useState(0);
  const [tiendas, setTiendas] = useState([]);
  const [stepCant, setStepCant] = useState(4);

  useEffect(async () => {
    setIsLoading(true); //cargando
    setStepCant();
    await GetTiendas(user.IdUsuario); // invoca al metodo de GetTiendas para obtener los datos

    
  }, []);

  //fucnion para regresar las tiendas
  const GetTiendas = async (IdUsuario) => {
    const params = {
      idRuta:  1, //agregar id usuario REAL
    };

    try {
      await axios.get(`${BASE_URL}rutas/GetTiendas`, {params}).then((res) => {
        const result = res.data;
        let jsontiendas = JSON.parse(result);
        setTiendas(jsontiendas);
        
        console.log("tiendas");
        console.log(tiendas);

        //inserta los nombres de las tiendas en el arreglo labels
        for (let i = 0; i < jsontiendas.length; i++) {
          labels.push(jsontiendas[i].Nombre);
        }
        console.log(labels);
        console.log(jsontiendas.length);
        setStepCant(jsontiendas.length)
        setIsLoading(false);
      });
    } catch(e) {
      alert(`Ocurrio un error ${e}` );
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="sign-out-alt"
          size={15}
          color="blue"
          onPress={() => {
            logout();
          }}></Icon>

        // <HeaderIconButton
        //     name={'log-out'}
        //     onPress={() => {
        //         logout();
        //     }}
        // />
      ),
    });
  }, [navigation, logout]);

  return (
    <>
      {isLoading ? null : (
        <View style={styles.container}>
          <View style={styles.rightText}>
            <Text style={{color: 'blue'}}>+ Agregar ubicación</Text>
          </View>

          <Text>Bienvenido,</Text>
          <Text>{user.name}!</Text>

          <View style={styles.containerCenter}>
            <PieChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              hasLegend={1}
            />
          </View>

          <ScrollView horizontal={true} >
            <View style={{alignContent:'center'}}>
            <StepIndicator 
              customStyles={customStyles}
              currentPosition={stepValue}
              stepCount={stepCant}
              labels={labels}
              onPress= {(pos) => console.log(tiendas[pos].id)}
              onPress={(pos) => {( stepValue == pos ? (            navigation.navigate('MostradorAntes', {
                   idTienda: tiendas[pos].id,
                   nombreTienda: tiendas[pos].Nombre,
                 })) : (alert('Aun no puede ingresar a esta tienda')))
     
              }}
            />
            </View>
            </ScrollView>
          <View>
          <FilledButton
                title={'Aumentar'}
                style={styles.loginButton}
                onPress={() => {
                    (stepValue == 5 ? (setStep(0)) : (setStep(stepValue + 1)));
                }}
            /> 
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  loginButton: {
    marginVertical: 20,
  },
  containerCenter: {
    alignItems: 'center',
  },
  rightText: {
    alignSelf: 'flex-end',
    marginVertical: 2,
  },
});
