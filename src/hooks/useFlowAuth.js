import React from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';
import {sleep} from '../utils/sleep';
import {createAction} from '../utils/createAction';

export function useFlowAuth() {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case 'BEGIN_ROUTE':
            console.log(estado)
          return {
            ...state,
            estado: {...action.payload},
          };

        default:
          return state;
      }
    },
    {
      user: undefined,
      estado: false,
    },
  );

  const authFlow = React.useMemo(() => ({
    iniciar: async () => {
      const estado = true;
      dispatch(createAction('BEGIN_ROUTE', estado));
    },
  }));
  return {authFlow, state};
}
