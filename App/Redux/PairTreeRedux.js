import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pairTreeSetUser: ['user']
})

export const PairTreeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  user: null
})

/* ------------- Selectors ------------- */

export const PairTreeSelectors = {
  getUser: state => state.user
}

/* ------------- Reducers ------------- */

export const setUser = (state, { user }) =>
  state.merge({user})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PAIR_TREE_SET_USER]: setUser
})
