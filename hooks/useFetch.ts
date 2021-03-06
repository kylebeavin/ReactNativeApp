import {useEffect, useRef, useReducer, useContext} from 'react';
import AppContext from '../providers/AppContext';
import {ToastContext} from '../providers/ToastProvider';

export const useFetch = (url: string, method: string, body?: {}) => {
  const {token, grpId} = useContext(AppContext);
  const {show} = useContext(ToastContext);

  const cache = useRef<any>({}); // ToDo: Think about the types in this file instead of using any.
  let bodyObj = !body ? {group_id: grpId} : body;

  const initialState = {
    status: 'idle',
    error: null,
    data: [],
  };

  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'FETCHING':
        return {...initialState, status: 'fetching'};
      case 'FETCHED':
        return {...initialState, status: 'fetched', data: action.payload};
      case 'FETCH_ERROR':
        return {...initialState, status: 'error', error: action.payload};
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url) return;

    const fetchData = async () => {
      dispatch({type: 'FETCHING'});

      if (cache.current[url]) {
        const data = cache.current[url + body];
        dispatch({type: 'FETCHED', payload: data});
      } else {
        try {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
            method: method,
            body: JSON.stringify(bodyObj),
          });
          const data = await response.json();
          cache.current[url + body] = data;
          if (cancelRequest) return;
          dispatch({type: 'FETCHED', payload: data});
        } catch (error) {
          if (cancelRequest) return;
          show({message: error.message});
          dispatch({type: 'FETCH_ERROR', payload: error.message});
        }
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url, body]);

  return state;
};
