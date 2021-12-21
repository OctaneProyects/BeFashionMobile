import React from 'react'
import axios from 'axios';
import { BASE_URL } from '../config';
import { sleep } from '../utils/sleep';
import { createAction } from '../utils/createAction';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_USER':
                    return {
                        ...state,
                        user: { ...action.payload },
                        estatus: 'okay'
                    };
                case 'REMOVE_USER':
                    return {
                        ...state,
                        user: undefined,
                    };
                case 'SET_LOADING':
                    return {
                        ...state,
                        loading: action.payload,
                    };
                case 'BEGIN_ROUTE':
                    console.log(action.payload)
                    return {
                        ...state,
                        loading: action.payload,
                    };
                default:
                    return state;
            }
        },
        {
            user: undefined,
            loading: true,
        },
    );


    const auth = React.useMemo(() => ({

        login: async (user, password) => {

            console.log(BASE_URL)

            const { data } = await axios.post(`${BASE_URL}usuarios/validaAcceso`, {
                Usuario: user,
                Pwd: password,
                // IdLink: '57E17CA4-F402-4BBF-8A36-3CF11BCC7E06'
            });

            const usr = {
                name: data.Nombre,
                Usuario : data.Usuario,
                IdUsuario: data.Id,
                idvehiculo: data.Vehiculo.split('|')[0],
                vehiculo: data.Vehiculo.split('|')[2],
                articulos:data.Inventario
            }

             console.log(usr);
            dispatch(createAction('SET_USER', usr));
        },

        logout: async () => {
            // await SecureStorage.removeItem('user');
            dispatch(createAction('REMOVE_USER'));
        },

        register: async (user, password) => {

            await sleep(1000);

            const { data } = await axios.post(`${BASE_URL}/ValidaAcceso`, {
                Usr: user,
                Pwd: password,
                IdLink: '57E17CA4-F402-4BBF-8A36-3CF11BCC7E06'
            });

        },
        //
        iniciar: async () => {
            const estado = true;
            dispatch(createAction('BEGIN_ROUTE', estado));
        },

    }))
    return { auth, state }
}