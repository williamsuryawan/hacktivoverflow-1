<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" to="/" style="color:black">Hacktiv Overflow by William Suryawan</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse ml-5" id="navbarNavAltMarkup">
                <div class="navbar-nav" >
                    <a class="nav-item nav-link active" href="#" v-if="!isLogin" > <router-link to="/" style="color:black"> Home </router-link> <span class="sr-only">(current)</span></a>
                    <router-link to="/questions/" style="color:black"> <a class="nav-item nav-link active" href="#" style="color:black" @click.prevent="showAllArticle">  All Questions  <span class="sr-only">(current)</span></a> </router-link>
                    <router-link to="/login/" style="color:black"> <a class="nav-item nav-link" href="#" v-if="!isLogin"  style="color:black">  Login </a> </router-link>
                    <router-link to="/login/" style="color:black"> <a class="nav-item nav-link" href="#" v-if="!isLogin"  style="color:black">  Register </a></router-link>
                    <a class="nav-item nav-link" href="#" v-if="isLogin" @click.prevent="logOut" style="color:black">Logout </a>
                </div>
            </div>
            <router-link to="/questions/create"><button class="btn btn-outline-success my-2 my-sm-0 mr-3" v-if="isLogin"> Ask Question</button></router-link>
        </nav>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Swal from 'sweetalert2'

export default {
  name: 'navbar',
  computed: {
    ...mapState(["isLogin"])
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$store.commit('updateLoginState',{boolean: false})
    } else {
      this.$store.commit('updateLoginState',{boolean: true})
    }
  },
  methods: {
      logOut() {
        console.log("masuk ke konfirmasi logout")
        Swal.fire({
            title: 'Do you want to log out?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout'
        })
        .then(result => {
          if (result.value) {
            console.log(" logout berhasil")
            localStorage.clear()
            this.$store.commit('updateLoginState',{boolean: false})
            this.$router.push('/');
          }
        })
      },
      inviteLogin() {
          Swal.fire({
            position: 'top-end',
            type: 'info',
            title: 'You need to login to add/show your cart',
            showConfirmButton: false,
            timer: 1500
        })
      },
      showAllArticle() {
        this.$router.push(`/questions/`)
        // this.$store.dispatch('getAllQuestions')
        this.$store.commit('updateAllQuestionsState', {boolean: true})
        this.$store.commit('updateQuestionsDetailState', {boolean: false})
      }
  }
};
</script>