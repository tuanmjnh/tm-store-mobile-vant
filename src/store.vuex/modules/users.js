import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/users'

const constant = {
  group: null,
  username: null,
  password: null,
  fullName: null,
  email: null,
  phone: null,
  personNumber: null,
  region: null,
  avatar: null,
  note: '',
  dateBirth: new Date(),
  gender: null,
  address: null,
  roles: [],
  verified: false,
  enable: true
}

const state = {
  items: [],
  item: { ...constant },
  pagination: {
    filter: '',
    sortBy: 'level',
    enable: true,
    group: 'manager',//'client',
    page: 1,
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 1,
    totalPage: 0
  }
}
const mutations = MUTATIONS(constant, state.pagination)
const actions = ACTIONS(collection, state.pagination)
actions.changePassword = ({ commit }, params) => {
  return api.post(`${collection}/change-password`, { data: params })
}
actions.resetPassword = ({ commit }, params) => {
  return api.post(`${collection}/reset-password`, { data: params })
}
actions.update = ({ commit }, params) => {
  return api.put(collection, { data: params.update }).then((res) => {
    commit('UPDATE_ITEMS', params.data)
    return res
  })
}
// const mutations = {
//   SET_ITEMS(state, value) {
//     state.items = value ? value : []
//   },
//   SET_ITEM(state, value) {
//     if (value) state.item = value
//     else state.item = { ...constant }
//   },
//   ADD_ITEMS(state, value) {
//     if (Array.isArray(value)) value.forEach(e => { state.items.push(e) })
//     else state.items.push(value)
//   },
//   UPDATE_ITEMS(state, value) {
//     if (state.items && state.items.length) {
//       if (Array.isArray(value)) {
//         value.forEach(e => {
//           const i = state.items.findIndex(x => x._id === e._id)
//           if (i > -1) state.items.splice(i, 1, e)
//         })
//       } else {
//         const i = state.items.findIndex(x => x._id === value._id)
//         if (i > -1) state.items.splice(i, 1, value)
//       }
//     }
//   },
//   UPDATE_ONE(state, value) {
//     const i = state.items.findIndex(x => x._id === value._id)
//     if (i > -1) {
//       Object.keys(value).forEach(e => {
//         state.items[i][e] = value[e]
//       })
//     }
//   },
//   FLAG_REMOVE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e)
//         if (i > -1) state.items.splice(i, 1)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value)
//       if (i > -1) state.items.splice(i, 1)
//     }
//   },
//   REMOVE_ITEMS(state, value) {
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e._id)
//         if (i > -1) state.items.splice(i, 1)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) state.items.splice(i, 1)
//     }
//   }
// }
// const actions = {
//   get({ commit }, params) {
//     return api.get(collection, { params }).then((res) => {
//       if (res && res.data) commit('SET_ITEMS', res.data)
//       // if (res && res.rowsNumber) commit('SET_ROWS_NUMBER', res.rowsNumber)
//       return res
//     })
//   },
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   find({ commit }, params) {
//     return api.get(`${collection}/find`, { params })// .then((res) => { return res })
//   },
//   exist({ commit }, params) {
//     return api.debonce({ method: 'get', params: params, url: `${collection}/get-meta` })// .then((res) => { return res })
//   },
//   post({ commit }, params) {
//     return api.post(collection, params).then((res) => {
//       commit('ADD_ITEMS', res)
//       commit('SET_ITEM')
//       return res
//     })
//   },
//   put({ commit }, params) {
//     return api.put(collection, params).then((res) => {
//       commit('UPDATE_ITEMS', params)
//       return res
//     })
//   },
//   update({ commit }, params) {
//     return api.put(`${collection}/update`, params.update).then((res) => {
//       commit('UPDATE_ITEMS', params.data)
//       return res
//     })
//   },
//   patch({ commit }, params) {
//     return api.patch(collection, params).then((res) => {
//       commit('FLAG_REMOVE_ITEMS', res.success)
//       return res
//     })
//   },
//   changePassword({ commit }, params) {
//     return api.post(`${collection}/change-password`, params)
//   },
//   resetPassword({ commit }, params) {
//     return api.post(`${collection}/reset-password`, params)
//   },
//   imports({ commit }, params) {
//     return api.post(`${collection}/import`, params)
//   },
//   delete({ commit }, params) {
//     return api.delete(collection, params).then((res) => {
//       commit('REMOVE_ITEMS', params)
//       return res
//     })
//   }
// }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
