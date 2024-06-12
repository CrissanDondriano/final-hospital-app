import Vuex from 'vuex'
import axios from 'axios'
export const store = new Vuex.Store({
    name: 'store',
    getters: {
        getPosts: state => {
            return axios.get(state.apiUrl + '/posts')
                .then(response => {
                    state.posts = response.data;
                    // console.log("response: ", response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error("Error fetching posts:", error);
                    return []; // or handle error as needed
                });
        },
    }
})