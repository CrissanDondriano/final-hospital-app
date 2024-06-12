import Vuex from 'vuex'
export const store = new Vuex.Store({
    actions: {
        updatePosts({ commit }) {
            // console.log("1. Updating posts...");
            commit('updatePosts');
        }
    }
})