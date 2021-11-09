import React from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';
import {sleep} from '../utils/sleep';
import {createAction} from '../utils/createAction';

export function useFlowAuth() {
  const [estatus, dispatch] = React.useReducer(
    (estatus, action) => {
      switch (action.type) {
        case 'SET_STATUS':
          return {
            ...estatus,
            estatus: action.payload,
          };
        case 'GET_STATUS':
          return {
            ...estatus,
            estado: action.payload,
          };

        default:
          return estatus;
      }
    },
    {
      estado: {
        Modulo: 'LandingScreen',
      },
    },
  );

  const authFlow = React.useMemo(() => ({
    iniciar: async () => {
      const estado = true;
      dispatch(createAction('BEGIN_ROUTE', estado));
    },
    //SETEAR STATUS
    setEstatus: async (idModulo, idTienda, idUsuario, idViaje) => {
      try {
        await axios
          .post(`${BASE_URL}viajes/InsertEstatusViajeUsuario`, {
            idModulo,
            idTienda,
            idUsuario,
            idViaje,
          })
          .then(res => {
            const result = res.data;
            let jsonStatus = JSON.parse(result);

            console.log('Insert');
            console.log(jsonStatus[0]);

            dispatch(createAction('SET_STATUS', jsonStatus[0]));
          });
      } catch (e) {
        alert(`Ocurrio un error as definir el estatus: ${e}`);
      }
    },

    //OBTENER ESTATUS DEL USUARIO EN LA APP
    getEstatus: async (opc, idUsuario) => {
      try {
        const params = {
          opc: opc,
          idUsuario: idUsuario, //agregar id usuario REAL
        };
        await axios
          .get(`${BASE_URL}viajes/GetEstatusViajeUsuario`, {params})
          .then(res => {
            const result = res.data;
            let jsonStatus = JSON.parse(result);
            console.log('GET');
            console.log(jsonStatus[0]);
            // const estatus = {
            //   pantalla: jsonStatus[0].IdModulo,
            // };
            dispatch(createAction('GET_STATUS', jsonStatus[0]));
          });
      } catch (e) {
        alert(`Ocurrio un error al obtener el estatus: ${e}`);
      }
    },
  }));

  return {authFlow, estatus};
}
