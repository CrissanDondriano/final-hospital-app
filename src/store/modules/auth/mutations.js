import Vuex from 'vuex'
import axios from 'axios'
export const store = new Vuex.Store({
    mutations: {
        async updatePosts(state, posts) {
            // console.log("2. Updating posts...");
            await axios.get(state.apiUrl + '/posts')
                .then(response => {
                    // console.log("response: ", response.data);
                    posts = response.data;
                })
                .catch(error => {
                    console.error("Error fetching posts:", error);
                });
            state.posts = posts;
        }
    }
})