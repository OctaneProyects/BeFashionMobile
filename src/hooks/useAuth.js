import React from 'react'
import axios from 'axios';
import { BASE_URL } from '../config';
import { sleep } from '../utils/sleep';
import { createAction } from '../utils/createAction';

export function useAuth() {

    const [state, dispatch] = React.useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_USER':
                    return {
                        ...state,
                        user: { ...action.payload },
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
            user: undefined,//{user:'Daly'},//undefined
            loading: true,
        },
    );


    const auth = React.useMemo(() => ({

        login: async (user, password) => {

            const { data } = await axios.post(`${BASE_URL}/ValidaAcceso`, {
                Usr: user,
                Pwd: password,
                IdLink: '57E17CA4-F402-4BBF-8A36-3CF11BCC7E06'
            });

            const usr = {
                noemp: data[0].NoEmp,
                name: data[0].NombreCompleto,
                puesto: data[0].Puesto,
            }
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