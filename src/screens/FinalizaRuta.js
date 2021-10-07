import React, { useState, useEffect } from 'react'
import {
    View, SafeAreaView, StyleSheet, Text, TextInput, Button, TouchableOpacity, Alert
} from 'react-native'
import { CheckBox, Input } from 'react-native-elements';
import { Heading } from '../components/Heading';
import axios from 'axios'
import { BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome'



export function FinalizaRuta({ navigation }) {

    const [idViaje, setIdViaje] = useState(3)
    const [entMercancia, setEntMerc] = useState(0);
    const [entDevolucion, setEntDev] = useState(0);

    const [totalPz, setTotalPz] = useState(0);
    const [vehiculo, setVehiculo] = useState();
    const [kmInicial, setKmInicial] = useState(0);

    const [kmFinal, setKmFinal] = useState("0");
    const [imagen64, setImagen64] = useState()

    const [hrInicial, setHrInicial] = useState("0");
    const [hrFinal, setHrFinal] = useState("");
    const [pzVendidas, setPzVendidas] = useState(0);
    const [pzDanadas, setPzDanadas] = useState("0");
    const [pzDefectuosa, setPzDefectuosa] = useState("0");
    const [visitasDiarias, setVisitasDiarias] = useState(0);
    const [visitasEfectivas, setVisitasEfectivas] = useState(0);
    const [promocion, setPromocion] = useState(0);


    const terminaRuta = () => {

    };


    const insertFinalaViaje = async () => {

        console.log(`entra, KmFinal`, kmFinal)
        if (parseInt(kmFinal) <= 0) {
            Alert.alert(
                "Verifique los datos",
                "Agregue un kilometraje final",
            );
            return;
        }
        // if (!imagen64) {
        //     Alert.alert(
        //         "Verifique los datos",
        //         "Adjunte una imagen del odómetro",
        //         [

        //             { text: "Aceptar" }
        //         ]
        //     );
        //     return;
        // }

        const viaje = {
            idViaje: idViaje,
            inventarioFinalPzs: totalPz,
            kmInicial: kmInicial,
            kmFinal: kmFinal,
            horaInicial: hrInicial,
            horaFinal: hrFinal,
            pzVendidas: pzVendidas,
            pzDanadas: parseInt(pzDanadas),
            pzDefectuosasFabrica: parseInt(pzDefectuosa),
            visitaDiaria: visitasDiarias,
            visitasEfectivas: visitasEfectivas
        }
        console.log(viaje);

        const result = await axios.post(
            `${BASE_URL}viajes/InsertFinalViaje`,
            viaje,
        );
        if (result.data == 'ok') {
            Alert.alert(
                "Listo!",
                "Haz terminado tu ruta por hoy",
                [

                    { text: "Terminar", onPress: () => navigation.navigate('Home') }
                ]
            );
        } else {
            alert(result);
        }
        console.log(result.data);




    }
    const getFinalRuta = async () => {

        await axios.get(
            `${BASE_URL}viajes/GetFinalizaViaje?viaje=${idViaje}`,

        ).then((result) => {
            const res = JSON.parse(result.data)[0];
            console.log(res);
            setTotalPz(res.totalPz)
            setVehiculo(res.vehiculo)
            setKmInicial(res.KmInicial)
            setPzVendidas(res.pzVendidas)
            setPromocion(res.Promociones)
            setHrInicial(res.fechaInicial)
            const date = new Date().toLocaleDateString().toString();
            setHrFinal(date)
        });


    }


    useEffect(() => {
        console.log(`useEfect si llega`,)
        getFinalRuta()
    }, [])
    return (
        <SafeAreaView>
            <View style={{ paddingTop: 10 }}>
                <View style={styles.checkboxContainer}>
                    {/* entrada de mercancia por vehiculo */}
                    <TextInput
                        value={entMercancia}
                        onValueChange={setEntMerc}
                        keyboardType="numeric"
                        style={{ borderWidth: 2, borderColor: 'black', width: 70, height: 35 }}
                    />
                    <Text style={styles.label}>Entrada de mercancia por vehiculo </Text>
                </View>
                <View style={styles.checkboxContainer}>
                    {/* Devoluciones */}
                    <TextInput
                        value={entDevolucion}
                        onValueChange={setEntDev}
                        keyboardType="number-pad"
                        style={{ borderWidth: 2, borderColor: 'black', width: 70, height: 35 }}
                    />
                    <Text style={styles.label}>Entrada por devolucion</Text>
                </View>
            </View>
            <View style={{ paddingLeft: 70, paddingRight: 10, alignContent: "center" }}>
                <View>

                    <Text style={{ padding: 5 }}>

                        {totalPz} Total de piezas en carro
                    </Text>
                </View>
                <View>

                    <Text style={{ padding: 5 }}>
                        {vehiculo} No. Vehiculo
                    </Text>
                </View>
                <View>

                    <Text style={{ padding: 5 }}>
                        {kmInicial} KM inicial
                    </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput

                        onChangeText={setKmFinal}
                        keyboardType="numeric"
                        style={{ height: 35 }}
                    />
                    <Text style={{ padding: 5 }}>
                        KM final
                    </Text>

                    <Icon
                        name="camera"
                        size={25}
                        color="gray"
                        padding={20}
                        onPress={() => launchCamera()}
                    />
                </View>
                <View>

                    <Text style={{ padding: 5 }}>
                        {hrInicial} Hora de salida
                    </Text>
                </View>

                <View>
                    <Text style={{ padding: 5 }}>
                        {hrFinal} Hora de llegada
                    </Text>
                </View>

                <View>

                    <Text style={{ padding: 5 }}>
                        {pzVendidas} Piezas vendidas
                    </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput

                        onChange={setPzDanadas}
                        keyboardType="numeric"
                        style={{ height: 35 }}
                    />
                    <Text style={{ padding: 5 }}>
                        Piezas dañadas
                    </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput

                        onChange={setPzDefectuosa}
                        keyboardType="numeric"
                        style={{ height: 35 }}
                    />
                    <Text style={{ padding: 5 }}>
                        Defectuosas de fabrica
                    </Text>
                </View>

                {/* <View>

                    <Text>
                        {visitasDiarias} Visita diaria
                    </Text>
                </View>

                <View>

                    <Text>
                        {visitasEfectivas} Visitas efectivas
                    </Text>
                </View> */}

                <View>

                    <Text style={{ padding: 5 }}>
                        {promocion} Promocion
                    </Text>
                </View>


            </View>
            <View style={styles.btnSubmitContainer}>
                <TouchableOpacity
                    style={styles.btnSubmit}
                    onPress={() => insertFinalaViaje()}>
                    <Text style={styles.btnSubmitText}>Terminar mi ruta</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        alignContent: 'space-around',
    },
    comentsContainer: {
        paddingHorizontal: '7%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignContent: 'flex-end',
        justifyContent: 'space-around',
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        margin: 8,
        width: 250,
    },
    textInput: {
        backgroundColor: 'white',
    },
    btnSubmit: {
        marginTop: 40,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgb(27,67,136)'
    },
    btnSubmitContainer: {
        padding: 20,
    },
    btnSubmitText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

