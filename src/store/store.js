import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const state = {
    id: 0,
    currentPage: 1
}
const mutations = {
    postScDetail(state, val) {
        state.id = val.id
        state.currentPage = val.page
        console.log(val)
    }
}

export default new Vuex.Store({
    state,
    mutations
})