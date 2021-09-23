import React, {useRef, useEffect, useState} from 'react';
import {
  AppState,
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
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
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';
import { set } from 'react-native-reanimated';

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
var labels = [];

export function LandingScreen({navigation}) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [isLoading, setIsLoading] = useState(true);
  const {logout} = React.useContext(AuthContext);
  const user = React.useContext(UserContext);
  const [stepValue, setStep] = useState(0);
  const [stepCant, setStepCant] = useState(0);

  const [ruta, setRuta] = useState([]);
  const [dataGraph, setDataGraph] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [location, setLocation] = useState(null);
  const [contar, setContar] = useState(0);
  const [cantTiendas, setCanTiendas] = useState(0);
  const [latAct, setLatAct] = useState(0);
  const [longAct, setLongAct] = useState(0);
  var latActual = 0;
  var longActual = 0;

  async function validateDistance(latTienda, longTienda) {
    await getLocation();
    console.log('tienda');
    console.log(`${latTienda} y  ${longTienda}`);
    console.log('actual location');
    console.log(`${location.latitude} y  ${location.longitude}`);
    console.log(`actual lat: ${latActual}, actual Long: ${longActual}`);

    var dis = getDistance(
      {latitude: latTienda, longitude: longTienda},
      {latitude: latActual, longitude: longActual},
    );

    console.log(`idTienda>>>>>>>>>>>>: ${tiendas[stepValue].Id}`);
    console.log(`nombre>>>>>>>>>>>>: ${tiendas[stepValue].Nombre}`);
    console.log(`Distancia: ${dis}`);

    {
      dis <= parseInt(tiendas[stepValue].RadioGeocerca)
        ? navigation.navigate('MostradorAntes', {
            idTienda: tiendas[stepValue].Id,
            nombreTienda: tiendas[stepValue].Nombre,
          })
        : Alert.alert(
            'No puedes ingresar a esta tienda',
            'Estas fuera de rango ',
            [{text: 'OK'}],
          );
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      if (appState.current == 'active') {
        console.log('actualizando');
        GetRuta();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(async () => {
    setIsLoading(true); //cargando
    // setStepCant();
    await GetRuta();
    await getLocation();
    //esta funcion tiene que completarse y despues ejecutar las que estan dentro del .Then 
    await GetTiendas(user.IdUsuario); // invoca al metodo de GetTiendas para obtener los datos
    
    console.log("SI LLEGA PARIENTE")
  }, []);

  //ESTE es para la GRafica
  useEffect(() => {
    chartConstructor();
  }, [stepValue]);

  //Este Est para la cantiendas
  useEffect(() => {
    chartConstructor();
  }, [cantTiendas]);

  

  function chartConstructor() {
    console.log(`Terminados: ${stepValue}`);
    console.log(`Tiendas: ${cantTiendas}`);
    console.log(`por Terminar: ${cantTiendas - stepValue}`);
    const data = [
      {
        name: 'Terminados',
        population: stepValue,
        color: 'rgb(27,67,136)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Pendientes',
        population: cantTiendas - stepValue,
        color: 'rgb(124,145,176)',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ];

    setDataGraph(data);
  }

  //obtiene ubicacion actual del dispositivo fisico
  async function getLocation() {
    console.log(`GETLOCATION`)
    await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          console.log(`${latitude}`);
          console.log(`${longitude}`);
          setLocation({latitude, longitude});
          latActual = latitude;
          longActual = longitude;

          console.log(`latitud: ${latitude} y longitud: ${longitude}`);
          // console.log(`location: ${location.latitude}`);
          return resolve();
        },
        (error) => {
          console.log(error.code, error.message);
          return reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }
  //fucnion para regresar las tiendas
  const GetTiendas = (idRuta) => {
      labels.length = 0;
      const params = {
        idRuta: 1, //agregar id usuario REAL
      };
      try {
        axios.get(`${BASE_URL}rutas/GetTiendas`, {params}).then((res) => {
          const result = res.data;
          let jsontiendas = JSON.parse(result);
          console.log(`Josntiendas: ${jsontiendas.length}`);
          //inserta los nombres de las tiendas en el arreglo labels
          labels = jsontiendas.map(function (t) {
            return t.Nombre;
          });
          setIsLoading(false);
          setCanTiendas(jsontiendas.length);
          setTiendas(jsontiendas);
        });
      } catch (e) {
        alert(`Ocurrio un error ${e}`);
      }
  };

  //fucnion para regresar las tiendas
  const GetRuta = async (opc, idUsuario) => {
    console.log(`GETRUTA`);
    const params = {
      opc: 3,
      idUsuario: 1, //agregar id usuario REAL
    };

    try {
      await axios
        .get(`${BASE_URL}rutas/GetRutaUsuario`, {params})
        .then((res) => {
          const result = res.data;
          let jsonRuta = JSON.parse(result);
          setRuta(jsonRuta[0]);
          console.log('ruta');
          console.log(jsonRuta);
          console.log('Ruta obj');
          console.log(ruta);
        });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
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
          <View>
            <View style={styles.rightText}>
              <Text style={{color: 'blue'}}>+ Agregar ubicación</Text>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text>Bienvenido:</Text>
                <Text>{user.name}!</Text>
              </View>
              <View>
                <Text>Ruta:</Text>
                <Text>
                  {ruta.Nombre}! {cantTiendas}
                </Text>
              </View>
            </View>

            <View style={styles.containerCenter}>
              <PieChart
                data={dataGraph}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={'population'}
                backgroundColor={'transparent'}
                hasLegend={1}
              />
            </View>

            <View>
              <ScrollView horizontal={true}>
                <View style={{alignContent: 'center'}}>
                  <StepIndicator
                    customStyles={customStyles}
                    currentPosition={stepValue}
                    stepCount={cantTiendas}
                    labels={labels}
                    onPress={(pos) =>
                      validateDistance(
                        tiendas[pos].Latitud,
                        tiendas[pos].Longitud,
                      )
                    }
                    // onPress={(pos) => {
                    //   stepValue == pos
                    //     ? navigation.navigate('maps', {
                    //         idTienda: tiendas[pos].id,
                    //         nombreTienda: tiendas[pos].Nombre,
                    //         latitud: tiendas[pos].Latitud,
                    //         longitud: tiendas[pos].Longitud,
                    //       })
                    //     : alert('Aun no puede ingresar a esta tienda');
                    // }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{flex: 1, padding: 0, margin: 0}}>
            <SafeAreaView style={styles.containermap}>
              <StatusBar barStyle="dark-content" />
              {location && (
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.0,
                  }}
                  showsUserLocation={true}
                />
              )}
            </SafeAreaView>
          </View>

          <View>
          <FilledButton
                title={'Aumentar'}
                style={styles.loginButton}
                onPress={() => {
                    (stepValue == cantTiendas ? (setStep(0)) : (setStep(stepValue + 1) ));
                }}
            /> 
          </View>
        </View>
      )}
    </>
  );
}

/*CONFIGURACIONES */
//Confiruracion de la Grafica
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  containermap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
