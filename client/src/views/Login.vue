<template>
    <div class="d-flex">
        <div class="col-sm-6" id="login" style="margin">
            <center><h3>Have account already? <br>Please Login Here</h3></center>
            <form style="border:1px solid black" @submit.prevent="custLogin">
                <div class="form-group row" >
                    <div class="col-sm-6 offset-sm-3" style="padding-top:15px;">
                        <center>Email</center>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-6 offset-sm-3">
                        <input type="email" class="form-control" id="inputEmail" placeholder="Email" v-model="loginEmail">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-6 offset-sm-3">
                        <center>Password</center>
                        <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="loginPassword">
                    </div>
                </div>
                <div class="form-group row" v-if="isErrorLogin">
                    <div class="col-sm-10 offset-sm-1">
                        <center style="color:red;"> email/password is wrong </center>
                    </div>
                </div>
                <div class="form-group row">
                    <div class=" col-sm-6 offset-sm-3">
                        <center><button type="submit" class="btn btn-primary">Sign in</button></center>
                    </div>
                </div>
            </form>
        </div>
        <div class="col-sm-6" id="register">
           <center><h3>Dont have account? <br> Please Register Here</h3></center>
            <form style="border:1px solid black" @submit.prevent="custReg">
                <div class="form-group row" v-if="isErrorReg">
                    <div class="col-sm-10 offset-sm-1">
                        <center style="color:red;"> Error User Registration: {{ errors }}</center>
                    </div>
                </div>
                <div class="form-group row" v-if="isSuccessReg">
                    <div class="col-sm-10 offset-sm-1">
                        <center style="color:black;"> Success User Registration: Please login use {{user.email}} now </center>
                    </div>
                </div>
                <div class="form-group row" style="padding-top:15px;">
                    <div class="col-sm-6 offset-sm-3">
                        <center>Name</center>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-6 offset-sm-3">
                        <input type="text" class="form-control" id="regName" placeholder="Name" v-model="newName">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-6 offset-sm-3">
                        <center>Email</center>
                        <input type="email" class="form-control" id="regEmail" placeholder="Email" v-model="newEmail" required>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-sm-6 offset-sm-3">
                        <center>Password</center>
                        <input type="password" class="form-control" id="inputPassword3" placeholder="Password" v-model="newPassword" required>
                    </div>
                </div>
                <div class="form-group row">
                    <div class=" col-sm-6 offset-sm-3">
                        <center><button type="submit" class="btn btn-primary">Register</button></center>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import server from '@/api/server.js'

export default {
  name: 'cust-login',
  data() {
      return {
          loginEmail: "",
          loginPassword: "",
          errors: "",
          isErrorReg: false,
          isSuccessReg: false,
          isErrorLogin: false,
          newEmail: "",
          newPassword: "",
          newName: "",
          user:""
      }
  },
  methods: {
      custLogin () {
          console.log("masuk ke custlogin ==>", this.loginEmail, this.loginPassword)
          server
            .post("/users/login", {
                email: this.loginEmail,
                password: this.loginPassword,
                loginVia: 'website'
            })
            .then(({data}) => {
                console.log("sign in berhasil", data)
                localStorage.setItem("token", data.token)
                localStorage.setItem("id", data.id)
                this.$store.commit('updateLoginState',{boolean: true})
                this.$router.push('/questions');
            })
            .catch(({ response }) => {
                console.log("sign in error")
                this.errors = response.data.message
                this.isErrorLogin = true;
            })
      },
      custReg () {
        //   console.log("masuk ke custReg ==>", this.newName, this.newEmail)
          this.errors=''
          server
            .post("/users/register", {
                name: this.newName,
                email: this.newEmail,
                password: this.newPassword
            })
            .then(({ data }) => {
                // console.log("berhasil registrasi", data)
                this.isSuccessReg = true
                this.user = data;
                this.$router.push('/login');
                this.newEmail = '';
                this.newPassword = '';
                this.newName = '';
            })
            .catch(({ response }) => {
                // console.error("terjadi error registrasi new user", response.data.errors);
                this.isErrorReg=true
                if (response.data.errors.email) {
                    this.errors = response.data.errors.email.message;
                } else if (response.data.errors.password) {
                    this.errors = response.data.errors.password.message;
                } else {
                    this.errors = 'please check your email/password'
                }
                
                

            });
      }
  }
};
</script>