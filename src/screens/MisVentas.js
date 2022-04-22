import React, { useRef, useEffect, useState } from 'react';
import {
    Button,
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
import { SectionList, FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { convertSpeed, getDistance, getPreciseDistance } from 'geolib';
import { EstatusContext } from '../context/EstatusContext';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { IconButton } from '../components/IconButton';
import { LogOutUser } from '../components/LogOutUser';
import { Loading } from '../components/Loading';
import { ListItem } from 'react-native-elements';

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

export function MisVentas({ route, navigation }) {
    const appState = useRef(AppState.currentState);
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = React.useContext(AuthContext);
    const user = React.useContext(UserContext);
    const { estado } = React.useContext(EstatusContext);
    const { authFlow } = React.useContext(EstatusContext);
    const [stepValue, setStep] = useState(0);
    const [ruta, setRuta] = useState({});
    const [tiendas, setTiendas] = useState([]);
    const [cantTiendas, setCanTiendas] = useState(0);
    const [loading, setLoading] = useState(true);

    const [infoReporteDiario, setInfoRptVts] = useState([]);
    const [granTotal, setGranTotal] = useState(0);
    const [solTotal, setSolTotal] = useState(0);
    const [bfTotal, setBfTotal] = useState(0);
    const [lTotal, setLTotal] = useState(0);
    const [artIni, setArtIni] = useState(0);


    //Construye la grafica y obtiene la ubicacion de la siguiente tienda
    useEffect(async () => {
        await reporteVtas();
    }, []);



    //reporte de ventas
    const reporteVtas = async () => {
        let params = {
            idUsuario: user.IdUsuario,
            //idUsuario: '53', //Para pruebas
        };
        try {
            setLoading(true);
            axios.get(`${BASE_URL}reportes/GetVentasHoy`, { params }).then((res) => {
                const result = res.data;
                let r = JSON.parse(result);
                if (Array.isArray(r) && r.length > 0) {
                    setGranTotal(r[0].GranTotal);
                    setSolTotal(r[0].TSOL);
                    setBfTotal(r[0].TBF);
                    setLTotal(r[0].TL);
                    setArtIni(r[0].ArticulosIniciales);
                }
                //inserta los nombres de las tiendas en el arreglo labels
                // labels = r.map(function (t) {
                //   return t.Cliente;
                // });

                setInfoRptVts(r);
                setLoading(false);
                //console.log(labels);

            });
        } catch (e) {
            console.log(`Ocurrio un error ${e}`);

        }
    }


    //nuevo metodo 1.4.4 Obtener Ubicacion constante

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <LogOutUser></LogOutUser>,
        });
    }, [navigation, logout]);

    return (

        <SafeAreaView style={styles.container}>
            <View style={styles.hdrContainer}>
                <Text style={styles.activityName}>Reporte diario</Text>
            </View>
            <View style={styles.resumenContainer}>
                <View style={styles.rowSection}>
                    <Text style={styles.h1}>Cantidad inicio Carro: {artIni}</Text>
                    <Text style={styles.h1}>Gran Total: {granTotal} </Text>
                </View>
                <Text style={styles.h1}>Cantidad disponible: {artIni - granTotal}</Text>
                <View style={styles.rowSection}>
                    <Text style={styles.h2}>TSOL: {solTotal}</Text>
                    <Text style={styles.h2}>TBF: {bfTotal}</Text>
                    <Text style={styles.h2}>TL: {lTotal}</Text>
                </View>
            </View>
            <View style={styles.listContainer}>
                {infoReporteDiario && infoReporteDiario.length > 0 ?
                    <FlatList
                        data={infoReporteDiario}
                        renderItem={
                            ({ item }) =>
                                <View style={[styles.item,
                                ["Completada"].includes(item.Estatus) ?
                                    styles.itemGreen :
                                    (["Visitando", "Activo"].includes(item.Estatus) ?
                                        styles.itemActive :
                                        (["Omitida"].includes(item.Estatus) ?
                                            styles.itemRed :
                                            styles.itemGray))]

                                }>
                                    <View style={styles.itemRow}>
                                        <Text style={styles.itemText}>{item.Tienda}</Text>
                                        <Text style={styles.itemText}>
                                            {
                                                ["Completada"].includes(item.Estatus) ?
                                                    <Icon
                                                        name={'check-circle'}
                                                        style={styles.icon}
                                                    ></Icon> :
                                                    (["Visitando", "Activo"].includes(item.Estatus) ?
                                                        <Icon
                                                            name={'flag'}
                                                            style={styles.icon}
                                                        ></Icon> :
                                                        (["Omitida"].includes(item.Estatus) ?
                                                            <Icon
                                                                name={'times-circle'}
                                                                style={styles.icon}
                                                            ></Icon> :
                                                            <Icon
                                                                name={'clock'}
                                                                style={styles.icon}
                                                            ></Icon>))
                                            }
                                            {' '}
                                            {item.Estatus}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={styles.itemText}>SOL: {item.SOL}</Text>
                                        <Text style={styles.itemText}>BF:{item.BF}</Text>
                                        <Text style={styles.itemText}>TL:{item.L}</Text>
                                    </View>

                                </View>

                        }
                    ></FlatList>
                    :
                    <View style={[styles.item, styles.itemGray]}>
                        <Text style={[styles.itemText]}>
                            Sin información
                        </Text>
                    </View>
                }
            </View >
            <Loading loading={loading} />
        </SafeAreaView >

    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    hdrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityName: {
        fontSize: 24,
    },
    h1: {
        fontSize: 16,
    },
    h2: {
        fontSize: 14,
    },
    resumenContainer: {
        flex: 3,
        paddingHorizontal: 12,
    },
    rowSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    listContainer: {
        padding: 2,
        flex: 8,
    },
    item: {
        paddingHorizontal: 10,
        marginVertical: 10,
        borderWidth: 5,
        borderRadius: 10,
        borderStyle: 'solid',
    },
    itemGreen: {
        backgroundColor: '#68a832',
        borderColor: '#314d19',

    },
    itemGray: {
        backgroundColor: '#9a9c98',
        borderColor: '#40423e',
    },
    itemRed: {
        backgroundColor: '#a30b0b',
        borderColor: '#610808',
    },
    itemActive: {
        backgroundColor: '#0f67a6',
        fontWeight: '#083657',
    },
    icon: {
        fontSize: 16,
        padding: 5,

    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,

    },
    itemText: {
        color: 'white',
        fontSize: 18,
    },




});
