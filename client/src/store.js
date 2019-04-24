import Vue from 'vue';
import Vuex from 'vuex';
import server from '@/api/server.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    allQuestions: [],
    showQuestion: true,
    showAnswerAdd: false,
    showQuestionDetail: false
  },
  mutations: {
    updateLoginState(state, payload) {
      state.isLogin = payload.boolean;
    },
    mutateAllQuestionsState(state, payload){
      state.allQuestions = payload.allQuestions
    },
    updateAllQuestionsState(state, payload) {
      state.showQuestion = payload.boolean
    },
    updateAnswerAddState(state, payload) {
      state.showAnswerAdd = payload.boolean
    },
    updateQuestionsDetailState(state, payload) {
      state.showQuestionDetail = payload.boolean
    },
  },
  actions: {
    getAllQuestions({ commit }) {
      server
        .get(`/questions`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(res => {
          console.log("berhasil get all questions", res.data.data)
          commit('mutateAllQuestionsState', {allQuestions: res.data.data})
        })
        .catch(err => {
          swal({
            title: "Fail to load all questions!",
            text: err.response.data.message,
            icon: "error",
          })
        })
    },
  },
});
