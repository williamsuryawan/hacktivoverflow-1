import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    
    {
      path: '/questions',
      name: 'all-questions',
      component: () => import('./views/Questions.vue'),
      children: [
        {
          path: ':id',
          name: 'question-detail',
          component: () => import('./components/Question.vue')
        }, 
        {
          path: ':id/edit',
          name: 'question-edit',
          component: () => import('./components/QuestionEdit.vue')
        },
        // {
        //   path: 'delete/:id',
        //   name: 'question-delete',
        //   component: () => import('./components/QuestionDelete.vue')
        // }
      ],
    },
    {
      path: '/create',
      name: 'question-create',
      component: () => import('./components/QuestionCreate.vue'),
    },
    {
      path: '/answers/:id/edit',
      name: 'answer-edit',
      component: () => import('./components/AnswerEdit.vue')
    },
  ],
});
