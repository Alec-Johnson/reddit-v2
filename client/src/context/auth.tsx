import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { User } from '../types'

// Approach to creating our context is taken from this article:
// https://kentcdodds.com/blog/how-to-use-react-context-effectively

interface State {
  authenticated: boolean
  user: User | undefined
  loading: boolean
}

interface Action {
  type: string
  payload: User | undefined
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true
})

const DispatchContext = createContext(null)

const reducer = (state: State, {type, payload}: Action) => {
  switch(type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload
      }
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false
      }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true
  })

  // Saves us from passing an object everytime, slightly cleaner
  const dispatch = (type: string, payload?: any) => defaultDispatch({type, payload})

  useEffect(() => {
    axios.get('/auth/me')
      .then(res => {
        dispatch('LOGIN', res.data)
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => dispatch('STOP_LOADING'))
  }, [])

  return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)