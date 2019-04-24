<template>
    <div v-if="QuestionLoading">
        <p>Please wait</p>
    </div>
    <div class="col-12" v-else>
        <div class="card bg-transparent">
            <div class="card-body">
                <div class="row rounded border-success" style="background: rgba(105,105,105, 0.5); color: black; padding:10px">
                    <div class="row">
                        <div class="col-sm-3">
                            <button class="btn btn-success" id="upvote_button" @click.prevent="upVote(question._id)">Up
                                <span class="badge badge-success"><i class="far fa-thumbs-up fa-2x"></i></span>
                                <span class="badge badge-success" v-if="question.upvoters.length>0">{{question.upvoters.length}}</span>
                            </button> <br> <br>
                            <button class="btn btn-danger" id="downvote_button" @click.prevent="downVote(question._id)">Down 
                                <span class="badge badge-danger"><i class="far fa-thumbs-down fa-2x"></i></span>
                                <span class="badge badge-danger" v-if="question.downvoters.length>0">{{question.downvoters.length}}</span>
                            </button>
                        </div>
                        <div class="col-sm-9">
                            <h3> Question Title: {{ question.title }} </h3>
                            Description: <p v-html="question.description"> </p>
                            <p> Tags: <span class="badge badge-success mr-1" v-for="singletag in question.tags" :key="singletag"> {{ singletag }}</span></p>
                            <div class ="row">
                                <div class="col-3 ">
                                    <button class="btn btn-secondary float-center" id="answer_button" @click.prevent="showAllQuestions">Back</button>
                                </div>
                                <div class="col-3">
                                    <button class="btn btn-warning float-center" id="answer_button" @click.prevent="giveAnswer(question)">Answer</button>
                                </div>
                                <div class="col-3" v-if="AuthorQueVerification(question)">
                                    <router-link :to="'/questions/' + question._id + '/edit'"><button class="btn btn-primary float-center" id="edit_button">Edit</button></router-link>  
                                </div>
                                <div class="col-3" v-if="AuthorQueVerification(question)">
                                    <button class="btn btn-danger float-center" id="answer_button" @click.prevent="deleteQuestion(question)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="showAnswerAdd">
                <h4>Give your answer below:</h4>
                <form v-on:submit.prevent="addAnswer">
                    <div class="form-group row">
                        <label for="inputName" class="col-sm-2 col-form-label"> Your Answer: </label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" v-model="answercontent" id="inputName" placeholder="Answer Content Here">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-10">
                            <button type="submit" class="btn btn-primary">Post Answer</button>
                        </div>
                    </div>
                </form>
            </div>    
        
            <div v-if="!showAnswerAdd">
                <h3>Answer List:</h3>
                <div class="container col-12" v-if="question.answers == 0" style="text-align:center;">
                    <h4> There is no answer yet. Why dont you give any answer by clicking the button answer above? </h4>
                </div>
                <div class="card-body" v-for="answer in question.answers" :key="answer._id"> 
                    <div class ="row rounded border-success" style="background-color: rgb(192,192,192); color: black; padding:10px">
                        <div class="col-sm-3">
                            <button class="btn btn-success" id="upvote_button" @click.prevent="upAnsVote(answer._id)">Up
                                <span class="badge badge-success"><i class="far fa-thumbs-up fa-2x"></i></span>
                                <span class="badge badge-success" v-if="answer.upvoters.length>0">{{answer.upvoters.length}}</span>
                            </button> <br> <br>
                            <button class="btn btn-danger" id="downvote_button" @click.prevent="downAnsVote(answer._id)">Down
                                <span class="badge badge-danger"><i class="far fa-thumbs-down fa-2x"></i></span>
                                <span class="badge badge-danger" v-if="answer.downvoters.length>0">{{answer.downvoters.length}}</span>
                            </button>
                        </div>
                        <div class="col-sm-9">
                            <div class="row" >
                                <div class="col-10" >
                                    
                                    <h5>{{ answer.content }} </h5>
                                    <strong>Posted by: </strong> {{ answer.author.name }}
                                </div>
                                <div class="col-2" v-if="AuthorAnsVerification(answer)">
                                    <router-link :to="'/answers/' + answer._id + '/edit'"><button class="btn btn-primary" id="edit_button">Edit</button></router-link>
                                    <button class="btn btn-danger" id="answer_button" @click.prevent="deleteAnswer(answer._id)">Delete</button>
                                </div>
                            </div>
                            <br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr style="color:black">
    </div>
</template>


<script>
import server from '@/api/server.js';
import { mapState } from "vuex";
import Swal from 'sweetalert2';

export default {
    name: 'question-details',
    data() {
        return {
            question: {
                    _id: '',
                    upvoters: '',
                    downvoters: '',
                    tags: '',
                    answers: [],
                    author: '',
                    title: '',
                    description: '',
                    cm_enabled: false,
            },
            answercontent: '',
            QuestionLoading: true,
            AnswerLoading: true
        };
    },
    created() {
        this.fetchQuestion(),
        this.fetchAnswer()
    },
    computed: {
        ...mapState(["showAnswerAdd", "isLogin"])
    },
    methods: {
        fetchQuestion() {
            this.QuestionLoading = true;
            server
                .get(`/questions/find/${this.$route.params.id}`)
                .then(({ data }) => {
                    console.log("berhasil fetch question detail", data.data)
                    this.$store.commit('updateAllQuestionsState', {boolean: false})
                    this.$store.commit('updateQuestionsDetailState', {boolean: true})
                    this.question = data.data;
                    this.QuestionLoading = false;
                })
                .catch((err) => {
                    console.log("gagal fetch question detail", err);
                })
        },
        AuthorAnsVerification(input) {
            // console.log("cek verification utk edit/del answer", input)
            if (this.isLogin) {
                return (input.author._id.toString() == localStorage.getItem("id").toString());
            } else {
                return false
            }
        },
        AuthorQueVerification(input) {
            // console.log("cek verification utk edit/del question", input)
            if(this.isLogin) {
                return (input.author._id.toString() == localStorage.getItem("id").toString());
            } else {
                return false
            }
        },
        showAllQuestions() {
            this.$router.push('/questions');
            this.$store.commit('updateAllQuestionsState', {boolean: true})
        },
        fetchAnswer () {
            this.AnswerLoading = true;
            console.log("masuk fetch answer")
        },
        upVote(question){
            if(!this.isLogin) {
                Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You need to login to upvote',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                server
                    .put(`questions/upvote/${this.$route.params.id}`,{}, {
                            headers: {
                                token: localStorage.getItem("token")
                                }
                        })
                    .then(({ data }) => {
                        this.fetchQuestion();
                        Swal.fire({
                            position: 'top-end',
                            title: '<i class="far fa-smile fa-6x"></i>',
                            text: 'Upvote is success. Thank you!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(({ response }) => {
                        console.error(response);
                    });
            }
        },
        downVote(question){
            if(!this.isLogin) {
                Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You need to login to downvote',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                server
                    .put(`questions/downvote/${this.$route.params.id}`,{}, {
                        headers: {
                            token: localStorage.getItem("token")
                            }
                    })
                    .then(({ data }) => {
                        this.fetchQuestion();
                        Swal.fire({
                            position: 'top-end',
                            title: '<i class="far fa-sad-cry fa-6x"></i>',
                            text: 'Downvote is success. Thank you!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(({ response }) => {
                        console.error(response);
                    });
            }
        },
        upAnsVote(inputUpVote){
            console.log("masuk upAnsVote ===>", inputUpVote)
            server
                .put(`answers/upvote/${inputUpVote}`,{}, {
                        headers: {
                            token: localStorage.getItem("token")
                            }
                    })
                .then(({ data }) => {
                    this.fetchQuestion();
                    Swal.fire({
                            position: 'top-end',
                            title: '<i class="far fa-smile fa-6x"></i>',
                            text: 'Upvote is success. Thank you!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                })
                .catch(({ response }) => {
                    console.error(response);
                });
        },
        downAnsVote(inputDownVote){
            server
                .put(`answers/downvote/${inputDownVote}`,{}, {
                    headers: {
                        token: localStorage.getItem("token")
                        }
                })
                .then(({ data }) => {
                    this.fetchQuestion();
                    Swal.fire({
                            position: 'top-end',
                            title: '<i class="far fa-sad-cry fa-6x"></i>',
                            text: 'Downvote is success. Thank you!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                })
                .catch(({ response }) => {
                    console.error(response);
                });
        },
        giveAnswer(input) {
            console.log("munculkan form answer:", input)
            if(!this.isLogin) {
                Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You need to login to give answer',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                this.$store.commit('updateAnswerAddState', {boolean: true})
                // this.$store.dispatch('onAnswerAddStatus')
            }
        },
        addAnswer() {
            console.log("masuk ke method add answer:", this.answercontent, this.question._id)
            server
                .post("/answers", {
                    content: this.answercontent,
                    questionId: this.question._id },
                    { headers: {
                        token: localStorage.getItem("token")
                    }})
                .then(({ data }) => {
                    console.log("berhasil add answer")
                    this.$store.commit('updateAnswerAddState', {boolean: false})
                    // this.$store.dispatch('offAnswerAddStatus')
                    this.fetchQuestion();
                })
                .catch(({ response }) => {
                    console.error(response);
                });
        },
        deleteQuestion() {
            console.log(`delete questions ===>`, this.$route.params.id);
            
            Swal.fire({
                title: 'Do you want to delete your own question?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Delete'
            })
            .then(result => {
            if (result.value) {
                return server
                    .delete(`/questions/${this.$route.params.id}`, {
                        headers: {
                        token: localStorage.getItem("token")
                        }
                    })
                .then(() => {
                    console.log("berhasil delete question");
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Deleting question is success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.$router.push({ path: "/questions" });
                    this.$store.dispatch('getAllQuestions')
                    this.$store.commit('updateAllQuestionsState', {boolean: true})
                });
            }
            })
            .catch(({ response }) => {
                console.error(response);
            });
        },
        deleteAnswer(inputAnswerId) {
            console.log(`delete answers ===>`, inputAnswerId);
            Swal.fire({
                title: 'Do you want to delete your own answer?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Delete'
            })
            .then(result => {
            if (result.value) {
                return server
                    .delete(`/answers/${inputAnswerId}`, {
                        headers: {
                        token: localStorage.getItem("token")
                        }
                    })
                .then(() => {
                    console.log("berhasil delete answer");
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Deleting answer is success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.fetchQuestion();
                });
            }
            })
            .catch(({ response }) => {
                console.error(response);
            });
        }
    },

}

</script>