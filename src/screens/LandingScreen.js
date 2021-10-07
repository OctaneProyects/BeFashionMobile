import React, { useRef, useEffect, useState } from 'react';
import {
  AppState,
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { FilledButton } from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { BASE_URL } from '../config';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { getDistance, getPreciseDistance } from 'geolib';
import { EstatusContext } from '../context/EstatusContext';
import { CommonActions } from '@react-navigation/native';
import { IconButton } from '../components/IconButton';

const screenWidth = Dimensions.get('window').width;

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

export function LandingScreen({ navigation }) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [isLoading, setIsLoading] = useState(true);
  const { logout } = React.useContext(AuthContext);
  const user = React.useContext(UserContext);
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);
  const [stepValue, setStep] = useState(0);
  const [stepCant, setStepCant] = useState(0);
  const [statusViaje, setStatusViaje] = useState(0);

  const [ruta, setRuta] = useState([]);
  const [dataGraph, setDataGraph] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [contar, setContar] = useState(0);
  const [cantTiendas, setCanTiendas] = useState(0);
  const [latAct, setLatAct] = useState(0);
  const [longAct, setLongAct] = useState(0);

  //Esta funcion valida la distancia entre el dispositivo y la tienda
  async function validateDistance(latTienda, longTienda) {
    await getLocation();
    console.log('tienda');
    console.log(`${latTienda} y  ${longTienda}`);
    console.log('actual location');
    console.log(`${location.latitude} y  ${location.longitude}`);
    console.log(
      `actual lat: ${location.latitude}, actual Long: ${location.longitude}`,
    );

    var dis = getDistance(
      { latitude: latTienda, longitude: longTienda },
      { latitude: location.latitude, longitude: location.longitude },
    );

    console.log(`idTienda>>>>>>>>>>>>: ${tiendas[stepValue].Id}`);
    console.log(`nombre>>>>>>>>>>>>: ${tiendas[stepValue].Nombre}`);
    console.log(`Distancia: ${dis}`);

    {
      dis <= parseInt(tiendas[stepValue].RadioGeocerca)
        ? (authFlow.setEstatus(8,26,1,20), authFlow.getEstatus(1)
        // navigation.navigate('MostradorAntesServicio', 
        // {
        //   idTienda: tiendas[stepValue].Id,
        //   nombreTienda: tiendas[stepValue].Nombre,
        // }
        // )
        )
        : Alert.alert(
          'No puedes ingresar a esta tienda',
          'Estas fuera de rango ',
          [{ text: 'OK' }],
        );
    }
  }

  //Este useEffect se detona cuando el usuario sale y regresa a la APP.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {

      if (appState.current.match(/inactive|background/) &&
        nextAppState === 'active'  
      ) {
        console.log('App has come to the foreground!');
        console.log(estado.Modulo)
        appState.current = nextAppState;
        if (appState.current == 'active' && estado.Modulo !="MostradorAntesServicio" && estado.Modulo !="MostradorDespuesServicio" ) {
          console.log("si entro ")
          GetRuta();
          authFlow.getEstatus(1);
        }
      }
      //el estado actual sera el nuevo
      console.log(estado)
      appState.current = nextAppState;

     
    });

    return () => {
      subscription.remove();
    };
  }, []);

  //Este useEffect se detona al cargar la pantalla
  useEffect(async () => {
    setIsLoading(true); //cargando
    // setStepCant();
    await GetRuta();
    await getLocation();
    // await authFlow.setEstatus(6,26,1,20);

    console.log("ESTADO")
    console.log(estado)
    // getStatusViaje();
    GetTiendas(user.IdUsuario); // invoca al metodo de GetTiendas para obtener los datos
  }, []);

//Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(async () => {
    console.log("PANTALLA");
    console.log("SI ESTA RECARGANDO");

    if(estado){
    //navega a la ultima pantalla en que se encontraba el usuario 
      navigation.dispatch(
        CommonActions.navigate({
          name: estado.Modulo,
          // params: {
          //   user: 'jane',
          // },
        })
      )
    }

  }, [estado]);

  //Este useEffect se detona cuando se cambia se completa/omite una tienda 
  //Construye la grafica y obtiene la ubicacion de la siguiente tienda
  useEffect(() => {
    chartConstructor();
    getLocation();
  }, [stepValue]);

  //Este Est para la cantiendas
  useEffect(() => {
    chartConstructor();
  }, [cantTiendas]);

  //constructor de la grafica
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
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        // console.log(`lat:: ${latitude}`);
        // console.log(`long::${longitude}`);
        setLocation({latitude, longitude});
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }
  //fucnion para regresar las tiendas
  const GetTiendas = (idRuta) => {
    labels.length = 0;
    const params = {
      idRuta: 1, //agregar id usuario REAL
    };
    try {
      axios.get(`${BASE_URL}rutas/GetTiendas`, { params }).then((res) => {
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
    const params = {
      opc: 3,
      idUsuario: 1, //agregar id usuario REAL
    };

    try {
      await axios
        .get(`${BASE_URL}rutas/GetRutaUsuario`, { params })
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

  //Metodo para saltar tienda
  function skipTienda() {
    Alert.alert('Omitir tienda', 'Esta seguro de omitir esta tienda?', [
      {
        text: 'Aceptar',
        onPress: () => {
          stepValue == cantTiendas ? setStep(0) : setStep(stepValue + 1);
        },
      },
      { text: 'cancelar' },
    ]);
  }

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

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('addSite')
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name={"plus-circle"} color='black'></Icon>
                  <Text style={{ color: 'blue' }}> Agregar tienda</Text>
                </View>
              </TouchableOpacity>

            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text>Bienvenido:</Text>
                <Text>{user.name}!</Text>
              </View>
              <View>
                <Text>Ruta:</Text>
                {ruta ? (
                  <Text> {ruta.Nombre}!</Text>
                ) : (
                  <Text>Sin ruta Asignada!</Text>
                )}
              </View>
            </View>

            {ruta ? (
              <View>
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
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      style={styles.skipTienda}
                      onPress={() => skipTienda()}>
                      <Text style={{ fontSize: 12, color: 'black' }}>
                        Omitir tienda{' '}
                        <Icon name="ban" size={15} color="red"></Icon>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal={true}>
                    <View style={{ alignContent: 'center' }}>
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
                <View style={{ flex: 1, padding: 0, margin: 0 }}>
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
                        onUserLocationChange={(locationChangedResult) =>
                          getLocation()
                        }
                      />
                    )}
                  </SafeAreaView>
                </View>

                {/* <View>
                  <FilledButton
                    title={'Aumentar'}
                    style={styles.loginButton}
                    onPress={() => {
                      stepValue == cantTiendas
                        ? setStep(0)
                        : setStep(stepValue + 1);
                    }}
                  />
                </View> */}
              </View>
            ) : null}
          </View>
          <View style={{ flex: 1, padding: 0, margin: 0 }}>
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
                  onUserLocationChange={(locationChangedResult) =>
                    getLocation()
                  }
                />
              )}
            </SafeAreaView>
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
  skipTienda: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
