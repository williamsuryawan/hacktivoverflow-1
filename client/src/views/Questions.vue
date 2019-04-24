<template>
    <div>
        <div v-if="showQuestionDetail">
            <router-view />
        </div>
        <div class="d-flex" v-if="showQuestion">
            <div class="bg-light border-right col-sm-2 scrollable-menu" id="sidebar">
                <a href @click.prevent="getAllQuestions">
                    <h5> All Questions </h5>
                </a>
                <hr>
                <h5>My Watched Tags: </h5>
                <p v-if="myWatchedTag.length == 0"> You have not watched any tag. Click some tags! </p>
                <ul class="list-group" v-for="watchedTag in myWatchedTag" :key="watchedTag.id">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href @click.prevent="searchQuestionsbyTag(watchedTag)">
                        <span class="badge badge-light badge-pill"> {{ watchedTag }} </span>
                    </a>
                    <a href @click.prevent="unwatchthistag(watchedTag)">
                        <span class="badge badge-primary badge-pill"> <i class="fas fa-times-circle"></i> </span>
                    </a>
                    </li>
                </ul>
            </div>
            <div class="col-sm-10" id="page-content">
                <h1><center> All Questions List ({{allQuestionsList.length}}) </center></h1>
                <div class="row">
                    <div class="col-md-12"> 
                        <div class="card bg-transparent">
                            <div class="card-body" v-for="question in allQuestionsList" :key="question._id"> 
                                <div class="row rounded border-success" style="background: rgba(105,105,105, 0.7)">    
                                    <br>
                                    <div class="col-md-12 col-sm-9" style="color:white">
                                        <h3>Title: {{ question.title }}</h3>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                Question: <p v-html="question.description"> </p> <br>
                                                <p> Posted By: {{ question.author.name }}</p>
                                                <p> Answered By: {{ question.answers.length }} People</p>
                                                <p> Tags: 
                                                    <a v-for="singletag in question.tags" :key="singletag" href @click.prevent="watchthistag(singletag)">
                                                    <span class="badge badge-success mr-1" > {{ singletag }} </span>
                                                    </a></p>
                                                <ul class="list-inline">
                                                    <li class="list-inline-item"><a class="btn btn-primary btn-sm" id="detail_button" @click.prevent="showDetail(question._id)"> <i class="fas fa-info-circle"></i> See Detail </a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <br><br>
                                    </div>
                                </div>
                                <hr style="background-color:black; height: 2px;">   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import server from "@/api/server.js";
import Swal from 'sweetalert2';
import { mapState } from 'vuex'

export default {
    name: "all-questions",
    data() {
        return {
            myWatchedTag: [],
            allQuestionsList: []
        }
    },
    created() {
        // this.$store.dispatch('getAllQuestions')
        
        this.$store.commit('updateAllQuestionsState', {boolean: true})
        this.showMyWatchedTag();
    },
    mounted() {
        console.log("masuk ke mounted", this.allQuestions)
        this.getAllQuestions()
    },
    computed: {
        ...mapState(['allQuestions', 'showQuestion', 'showQuestionDetail', 'isLogin'])
    },
    methods: {
        getAllQuestions() {
            server
                .get(`/questions`, {
                headers: {
                    token: localStorage.getItem('token')
                }})
                .then(res => {
                    console.log("berhasil get all questions here", res.data.data)
                    this.allQuestionsList = res.data.data
                })
                .catch(err => {
                    console.log("terjadi error get all questions")
                })
        },
        showDetail(input) {
            this.$router.push(`/questions/${input}`)
            this.$store.commit('updateQuestionsDetailState', {boolean: true})
        },
        showAllQuestions() {

        },
        showMyWatchedTag() {
            server
                .get('/users/detail', {headers: {token: localStorage.getItem("token")
                }})
                .then(({data}) => {
                    console.log("berhasil get all my watched tags", data.data)
                    this.myWatchedTag = data.data.listWatchedTag
                })  
                .catch(error => {
                    console.log("error get all my watched tags", error)
                })
        },
        watchthistag(input){
            console.log("masuk ke watch this tag", input)
            if(!this.isLogin) {
                this.searchQuestionsbyTag(input);
            } else {
                Swal.fire({
                    title: 'Do you want to watch this tag?',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                })
                .then(result => {
                    if (result.value) {
                        server
                            .post('/users/watch/', {watchtype: 'watch', watchedTag: input},
                                {headers: {token: localStorage.getItem("token")
                            }})
                            .then(({data}) => {
                                console.log("berhasil watch new tags", data.data)
                                Swal.fire({
                                    position: 'top-end',
                                    title: '<i class="far fa-kiss-beam fa-6x"></i>',
                                    text: `Sweet! We love ${input} too!`,
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                                this.showMyWatchedTag();    
                                })  
                            .catch(error => {
                                console.log("error get all my watched tags", error)
                                Swal.fire({
                                    position: 'top-end',
                                    title: '<i class="far fa-smile fa-6x"></i>',
                                    text: `You have watched this tag`,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            })
                    }
                })
            }
            
        },
        unwatchthistag(input){
            console.log("masuk ke unwatch this tag", input)
            server
                .post('/users/watch/', {watchtype: 'unwatch', watchedTag: input},
                    {headers: {token: localStorage.getItem("token")
                }})
                .then(({data}) => {
                    console.log("berhasil unwatch a tag", data.data)
                    Swal.fire({
                        position: 'top-end',
                        title: '<i class="far fa-smile fa-6x"></i>',
                        text: `You have unwatched ${input}`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.showMyWatchedTag();
                    this.getAllQuestions();
                })  
                .catch(error => {
                    console.log("error unwatched tags", error)
                    Swal.fire({
                        position: 'top-end',
                        title: '<i class="far fa-smile fa-6x"></i>',
                        text: `You have not watched this tag`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        },
        searchQuestionsbyTag(input) {
            console.log("masuk ke search my article by tag", this.searchTag, input)
            let searchTagQuery = {
                tags: input
            }
            console.log(searchTagQuery)
            server.get(`/questions/tags`, {params: searchTagQuery})
            .then(({data}) => {
                this.allQuestionsList =[]
                console.log("berhasil search my questions by tag", data)
                this.allQuestionsList = data.data
  
            })
            .catch(error => {
                console.log("Terjadi error search question:", error)
            })
        }
    }
}
</script>

