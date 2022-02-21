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
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';
import {EstatusContext} from '../context/EstatusContext';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {IconButton} from '../components/IconButton';
import {LogOutUser} from '../components/LogOutUser';

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

export function LandingScreen({route, navigation}) {
  const appState = useRef(AppState.currentState);
  const [isLoading, setIsLoading] = useState(true);
  const {logout} = React.useContext(AuthContext);
  const user = React.useContext(UserContext);
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);
  const [stepValue, setStep] = useState(0);
  const {IdViaje} = route.params;
  const [ruta, setRuta] = useState({});
  const [dataGraph, setDataGraph] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [cantTiendas, setCanTiendas] = useState(0);
  const [btnContinuar, setBtnContinuar] = useState(false);
  const isFocused = useIsFocused();
  const [inventario, setInventario] = useState(0);
  const [location, setLocation] = useState({
    latitude: 32.65,
    longitude: -115.39,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });

  //metodo nuevo v 1.4.4
  useEffect(() => {
    const _watcher = Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude: latitude, longitude: longitude});
      },
      (error) => {
        console.log(`Error al iniciar el watch: ${error}`);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
    return () => {
      Geolocation.clearWatch(_watcher);
    };
  }, []);

  //se ejecuta cada que cambia la ubicacion v1.4.4
  useEffect(() => {
    console.log('nueva region: ', location);
    return () => {
      console.log('Region actualizada');
    };
  }, [location]);

  useEffect(() => {
    if (isFocused === true) {
      if (ruta) {
        GetTiendas();
      }
      if (estado == null) {
        authFlow.getEstatus(1, user.IdUsuario);
      }
    }
    return () => {};
  }, [isFocused]);

  //Esta funcion valida la distancia entre el dispositivo y la tienda
  async function validateDistance(latTienda, longTienda, pos) {
    //si se presiona la tienda anterior()
    if (pos == estado.PasoActual - 1) {
      console.log(estado.ViajeTerminado);
      if (estado.ViajeTerminado == 'false') {
        Alert.alert(
          'Reiniciar tienda',
          'Estas seguro de reiniciar esta tienda',
          [
            {text: 'Ok', onPress: () => resetUltimaTienda(pos)},
            {text: 'Cancelar'},
          ],
        );
      } else {
        Alert.alert(
          'Ya terminaste tu viaje!',
          'No es posible reiniciar la tienda cuando tu viaje ha terminado.',
          [{text: 'Entendido'}],
        );
      }
    } else if (pos == estado.PasoActual) {
      // getLocation();
      var dis = getDistance(
        {latitude: latTienda, longitude: longTienda},
        {latitude: location.latitude, longitude: location.longitude},
      );
      console.log(tiendas);
      console.log([pos]);

      console.log(`idTienda>>>>>>>>>>>>: ${tiendas[pos].Id}`);
      console.log(`nombre>>>>>>>>>>>>: ${tiendas[pos].Nombre}`);
      console.log(`Distancia: ${dis}`);
      if (dis <= parseInt(tiendas[pos].RadioGeocerca)) {
        await authFlow.getEstatus(0, user.IdUsuario);
        console.log('El modulo al que vamos es:');
        console.log(estado.Modulo);
        if (estado) {
          if (
            estado.Modulo &&
            ['MostradorAntesServicio', 'LandingScreen'].includes(estado.Modulo)
          ) {
            await authFlow.setEstatus(
              8,
              tiendas[pos].Id,
              user.IdUsuario,
              estado.IdViaje,
            );
            navigation.navigate('MostradorAntesServicio', {
              idTienda: tiendas[pos].Id,
              nombreTienda: tiendas[pos].Nombre,
              idViaje: estado.IdViaje,
            });
          } else {
            navigation.navigate(estado.Modulo, {
              idTienda: tiendas[pos].Id,
              nombreTienda: tiendas[pos].Nombre,
              idViaje: estado.IdViaje,
            });
          }
        }
      }
      //authFlow.getEstatus(0, user.IdUsuario),
      else {
        Alert.alert(
          'No puedes ingresar a esta tienda',
          'Estas fuera de rango',
          [{text: 'OK'}],
        );
      }
    }
  }

  //FUNCION PARA RESETEAR LA ULTIMA VISITA
  async function resetUltimaTienda(pos) {
    try {
      console.log(`Reiniciando la tienda...`);
      const reset = await axios.post(
        `${BASE_URL}Tiendas/resetTienda?IdTienda=${tiendas[pos].IdTienda}&IdViaje=${estado.IdViaje}&IdUsuario=${user.IdUsuario}`,
        {},
      );
      console.log(`Peticion resuelta...`);
      if (reset) {
        console.log(`Actualizando estado...`);
        authFlow.getEstatus(0, user.IdUsuario);
        console.log(`Estatus obtenido: ${estado}`);
      }
    } catch (e) {
      alert(`Ocurrio un error al reiniciar la tienda ${e}`);
    }
    return () => {
      setIsLoading(false);
    };
  }

  //Este useEffect se detona cuando el usuario sale y regresa a la APP.
  useEffect(() => {
    return () => {
      const subscription = AppState.addEventListener(
        'change',
        (nextAppState) => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            appState.current = nextAppState;
            console.log('modulo ');

            //console.log(estado.Modulo);
            if (
              appState.current == 'active' &&
              estado.Modulo != 'MostradorAntesServicio' &&
              estado.Modulo != 'MostradorDespuesServicio'
            ) {
              console.log('si entro ');
              GetRuta();
              //authFlow.getEstatus(0, user.IdUsuario);
            }
          }
          //el estado actual sera el nuevo
          console.log(estado);
          appState.current = nextAppState;
        },
      );

      return () => {
        subscription.remove();
      };
    };
  }, []);

  //Este useEffect se detona al cargar la pantalla
  useEffect(async () => {
    setIsLoading(true); //cargando
    // setStepCant();
    await GetRuta();
    // await getLocation();
    console.log('ESTADO');
    console.log(estado);
    console.log('RUTA');
    console.log(ruta);

    // getStatusViaje();
    if (ruta) {
      GetTiendas(); // invoca al metodo de GetTiendas para obtener los datos
    } else {
      if (cantTiendas == 0) {
        console.log('CantTiendas');
        console.log(cantTiendas);
        setBtnContinuar(false);
      }
      setIsLoading(false);
    }
    return () => {
      console.log('cargo');
    };
  }, []);

  useEffect(() => {
    if (ruta) {
      GetTiendas(); // invoca al metodo de GetTiendas para obtener los datos
    } else {
      if (cantTiendas == 0) {
        console.log('CantTiendas');
        console.log(cantTiendas);
        setBtnContinuar(false);
      }
      //si el checklist general
      if (estado.ViajeTerminado == true) {
        setBtnContinuar(false);
      } else {
        setBtnContinuar(true);
      }
      setIsLoading(false);
    }
    return () => {};
  }, [ruta]);

  useEffect(() => {
    console.log('USE EFFECT DEL ESTADO');
    console.log(estado);
    console.log(`Tiendas: ${tiendas}`);
    if (estado != null && tiendas.length > 0) {
      if (stepValue != estado.PasoActual) {
        setStep(estado.PasoActual);
      }
      verificaCompletado();
      if (estado.Modulo && estado.Modulo != 'landingScreen') {
        if (tiendas > 0) {
          navigation.dispatch(
            CommonActions.navigate({
              name: estado.Modulo,
              params: {
                idTienda: tiendas[stepValue].Id,
                nombreTienda: tiendas[stepValue].Nombre,
                idviaje: estado.IdViaje,
              },
            }),
          );
        }
      }
    }
    return () => {
      console.log('Terminando con el estado');
    };
  }, [estado]);

  //Este useEffect se detona cuando se cambia se completa/omite una tienda
  //Construye la grafica y obtiene la ubicacion de la siguiente tienda
  useEffect(() => {
    chartConstructor();
    return () => {
      console.log('Desmontado despues del cambio de paso');
    };
  }, [stepValue]);

  //Este Est para la cantiendas
  useEffect(() => {
    chartConstructor();
    if (cantTiendas > 0 && estado != null) {
      verificaCompletado();
    }
    return () => {
      console.log('Desmontado despues del cambio de cantidad de tiendas');
    };
  }, [cantTiendas]);

  function verificaCompletado() {
    setStep(estado.PasoActual);
    //verifica que si ya se completo la ultima tienda
    if (estado.PasoActual == cantTiendas && cantTiendas > 0) {
      //verifica si ya se complet el checklist final
      if (estado.ViajeTerminado == 'true') {
        console.log('NOO MUESTRA BUTTON');
        setBtnContinuar(false);
      } else {
        console.log('SI MUESTRA BUTTON');
        setBtnContinuar(true);
      }
    } else {
      setBtnContinuar(false);
    }
  }

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
  function getLocation() {
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
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }

  //fucnion para regresar las tiendas
  const GetTiendas = (idRuta) => {
    labels.length = 0;
    const params = {
      idRuta: ruta.Id, //agregar id usuario REAL
    };
    try {
      axios.get(`${BASE_URL}rutas/GetTiendas`, {params}).then((res) => {
        const result = res.data;
        let jsontiendas = JSON.parse(result);

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
    setIsLoading(false);
  };

  //fucnion para regresar las tiendas
  const GetRuta = async () => {
    const params = {
      opc: 3,
      idUsuario: user.IdUsuario,
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

  //Metodo para saltar tienda
  async function skipTienda() {
    const form = {
      idViaje: estado.IdViaje,
      idTienda: tiendas[stepValue].Id,
      idUsuario: user.IdUsuario,
      isExhibido: false,
      isSurtido: false,
      cant: 0,
      isAlcance: false,
      comentarios: 'NO VISITADO (OMITIDO)',
      visitada: false,
    };
    console.log(tiendas[stepValue]);
    console.log(form);
    try {
      const res = await axios.post(
        `${BASE_URL}Tiendas/InsertaChecklistTienda`,
        form,
      );
      console.log(`El resultado de insertar el checklist: ${res}`);
      if (res) {
        const result = JSON.parse(res.data);
        console.log(result);
        if (result[0].result == 'okay') {
          await authFlow.setEstatus(
            6,
            tiendas[stepValue].Id,
            user.IdUsuario,
            IdViaje,
          );
          authFlow.getEstatus(0, user.IdUsuario);

          Alert.alert(
            'Listo',
            `Se ha omitido la tienda: ${tiendas[stepValue].Nombre}`,
            [
              {
                text: 'Aceptar',
                // onPress: () => authFlow.getEstatus(0, user.IdUsuario),
                // navigation.navigate('LandingScreen')
              },
            ],
          );
        }
      }
    } catch (error) {
      alert(error);
    }
  }

  //nuevo metodo 1.4.4 Obtener Ubicacion constante

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogOutUser></LogOutUser>,
    });
  }, [navigation, logout]);

  return (
    <>
      {isLoading ? null : (
        <View style={styles.globalContainer}>
          <View style={styles.containerUp}>
            <View style={styles.rightText}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('addSite');
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name={'plus-circle'} color="black"></Icon>
                  <Text style={{color: 'blue'}}> Agregar tienda</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                  <Text>
                    {estado.Articulos ? estado.Articulos : user.Articulos}{' '}
                    PIEZAS EN CARRO
                  </Text>
                </View>

                <View>
                  <View style={{alignItems: 'flex-end', marginVertical: '3%'}}>
                    <TouchableOpacity
                      style={styles.skipTienda}
                      onPress={() =>
                        Alert.alert(
                          'Omitir tienda',
                          `Esta seguro de omitir esta tienda? ${tiendas[stepValue].Nombre}`,
                          [
                            {
                              text: 'Aceptar',
                              onPress: () => {
                                skipTienda();
                              },
                            },
                            {text: 'cancelar'},
                          ],
                        )
                      }>
                      <Text style={{fontSize: 12, color: 'black'}}>
                        Omitir tienda{' '}
                        <Icon name="ban" size={15} color="red"></Icon>
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                            pos,
                          )
                        }
                      />
                    </View>
                  </ScrollView>
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

          {btnContinuar ? (
            <View style={styles.containerUp}>
              <TouchableOpacity
                style={styles.btnSubmit}
                onPress={() => {
                  navigation.navigate('FinalizarRuta', {
                    idViaje: estado.IdViaje,
                  });
                }}>
                <Text style={styles.btnSubmitText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.containermap}>
              <StatusBar barStyle="dark-content" />
              {location && (
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 3,
                    longitudeDelta: 3,
                  }}
                  showsUserLocation={true}
                  showsMyLocationButton={true}>
                  {tiendas.map((marker, index) => (
                    <Marker
                      key={index}
                      title={marker.Nombre}
                      coordinate={{
                        latitude: marker.Latitud,
                        longitude: marker.Longitud,
                      }}
                    />
                  ))}
                </MapView>
              )}
            </View>
          )}
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
  btnSubmit: {
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
  },

  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },

  containermap: {
    flex: 1,
    paddingBottom: 10,
    // ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  globalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerUp: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
