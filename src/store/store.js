import Vuex from 'vuex';
import axios from 'axios';

export const store = new Vuex.Store({

    state: {
        apiUrl: 'http://127.0.0.1:8000/api',
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    },

    getters: {
        isAuthenticated: state => !!state.token,
        user: state => state.user,
    },

    mutations: {
        SET_USER(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        CLEAR_AUTH(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },

    actions: {
        async fetchUser({ commit, state }) {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`${state.apiUrl}/user/${userId}`, {
                        headers: { Authorization: `Bearer ${state.token}` },
                    });
                    commit('SET_USER', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
                commit('CLEAR_AUTH');
                throw error; // Re-throw the error for the component to handle
            }
        },
        logout({ commit }) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            commit('CLEAR_AUTH');
        },
    }
});