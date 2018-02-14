import { createReducer, createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
      setUser: ['user'],
      getUser: ['user']
})

export const INITIAL_STATE = {
      user: null
}

export const getUser = (state) => {return state.user}

export const setUser = (state, {user}) => {
      state.merge({user})
}

export const reducer = createReducer(INITIAL_STATE, {
      [Types.GET_USER]: getUser,
      [Types.SET_USER]: setUser
})