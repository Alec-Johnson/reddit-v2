import { User } from "../types"

const AuthActions = ['LOGIN', 'LOGOUT', 'STOP_LOADING'] as const;

type AuthActionType = Uppercase<typeof AuthActions[number]>

export type AuthStateType = {
  authenticated: boolean
  user: User | undefined
  loading: boolean
}

export type AuthAction = {
  type: AuthActionType;
  payload?: any;
}

export const reducer = (
  state: AuthStateType, 
  action: AuthAction
): AuthStateType => {
  
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: action.payload
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
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}