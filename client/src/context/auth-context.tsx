import { useReducer, useEffect, createContext, Dispatch, ReactNode } from 'react';

import axios from 'axios';

import { reducer, AuthAction, AuthStateType  } from './auth-reducer';

interface AuthContextType extends AuthStateType {
  dispatch: Dispatch<AuthAction>;
}

const initialState: AuthStateType = {
  authenticated: false,
  user: null,
  loading: true
}

export const AuthContext = createContext<AuthContextType>(
  initialState as AuthContextType
)

export const AuthContextProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [auth, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true
  })

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => {
        dispatch({ type: 'LOGIN', payload: res.data })
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch({ type: 'STOP_LOADING' }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...auth, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

