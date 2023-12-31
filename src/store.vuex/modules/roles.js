import { api } from '../../utils/axios'
import MUTATIONS from '../mutations'
import ACTIONS from '../actions'
const collection = '/roles'
const constant = {
  key: '',
  name: '',
  desc: '',
  level: 1,
  color: '#027be3',
  routes: ['dashboard'],
  flag: 1
}
const state = {
  all: [],
  items: [],
  item: { ...constant },
  pagination: {
    filter: '',
    sortBy: 'level',
    flag: 1,
    page: 1,
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 1,
    totalPage: 0
  }
}
const mutations = MUTATIONS(constant, state.pagination)
mutations.SET_ALL = (state, value) => {
  state.all = value ? value : []
}
const actions = ACTIONS(collection, state.pagination)
actions.getAll = ({ commit }, params) => {
  return api.get(`${collection}/get-all`, { params }).then((res) => {
    if (res.data) {
      // Sort by level
      res.data = res.data.sort(function (a, b) { return a.level - b.level })
      commit('SET_ALL', res.data)
    }
    return res
  })
}
actions.finds = ({ commit }, params) => {
  return api.post(`${collection}/finds`, params)
}
// const mutations = {
//   SET_ALL(state, value) {
//     state.all = value ? value : []
//   },
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
//     if (Array.isArray(value)) {
//       value.forEach(e => {
//         const i = state.items.findIndex(x => x._id === e._id)
//         if (i > -1) state.items.splice(i, 1, e)
//       })
//     } else {
//       const i = state.items.findIndex(x => x._id === value._id)
//       if (i > -1) state.items.splice(i, 1, value)
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
//   // SET_ROWS_NUMBER (state, value) {
//   //   state.rowsNumber = value ? value : 0
//   // }
// }
// const actions = {
//   get({ commit }, params) {
//     return api.get(collection, { params }).then((res) => {
//       if (res && res.data) {
//         if (params.all) commit('SET_ALL', res.data)
//         commit('SET_ITEMS', res.data)
//       }
//       // if (res && res.rowsNumber) commit('SET_ROWS_NUMBER', res.rowsNumber)
//       return res
//     })
//   },
//   getAll({ commit }, params) {
//     return api.get(`${collection}/get-all`, { params }).then((res) => {
//       if (res) {
//         // Sort by level
//         res = res.sort(function (a, b) { return a.level - b.level })
//         commit('SET_ALL', res)
//       }
//       return res
//     })
//   },
//   set({ commit }, params) {
//     commit('SET_ITEM', params)
//   },
//   find({ commit }, params) {
//     return api.get(`${collection}/find`, { params }).then((res) => {
//       return res
//     })
//   },
//   exist({ commit }, params) {
//     return api.get(`${collection}/exist`, { params }).then((res) => {
//       return res
//     })
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
//   patch({ commit }, params) {
//     return api.patch(collection, params).then((res) => {
//       commit('FLAG_REMOVE_ITEMS', res.s)
//       return res
//     })
//   },
//   delete({ commit }, params) {
//     return api.delete(collection, params).then((res) => {
//       return res
//     })
//   },
//   loadFileImport({ commit }, params) {
//     return api.post(`${collection}/load-file-import`, params).then((res) => {
//       return res
//     })
//   },
//   finds({ commit }, params) {
//     return api.post(`${collection}/finds`, params).then((res) => {
//       return res
//     })
//   },
//   imports({ commit }, params) {
//     return api.post(`${collection}/imports`, params).then((res) => {
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
