<template>
    <div class="col-12">
        <h1 class="mt-2">Edit Question</h1>
        <form v-on:submit.prevent="EditQuestion">
            <div class="form-group row">
                <label for="inputTitle" class="col-sm-2 col-form-label">Question Title</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="question.title" id="inputName" placeholder="Question Title Here">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputContent" class="col-sm-2 col-form-label">Question Content</label>
                <div id="app">
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputTag" class="col-sm-4 col-form-label">Tags (please enter before you add another tags):</label>
                <div class="col-sm-8">
                    <tags-input element-id="tags"
                            v-model="tags"
                            :typeahead="true"></tags-input>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-10">
                    <button type="submit" class="btn btn-primary">Post</button>
                </div>
            </div>
            
        </form>
    </div>
</template>

<script>
import server from '@/api/server.js';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

export default {
    name: "app",
    components: {
        "tags-input": VoerroTagsInput
    },
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
            title: "",
            tags: "",
            isLoading: false,
            errors : "",
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                // The configuration of the rich-text editor.
            }
        }
    },
    created() {
        this.getOneQuestion()
    },
    methods: {
        EditQuestion () {
            this.isLoading = true;
            this.title = this.question.title;
            console.log("data question siap kirim utk create ==>", this.title, this.editorData, localStorage.getItem("token"))
            
            server
                .put(`/questions/${this.$route.params.id}`, {
                title: this.title,
                description: this.editorData,
                tags: this.tags}, {headers: {
                    token: localStorage.getItem("token"),
                }})
                .then(response => {
                    console.log("berhasil edit questions", response)
                    this.isLoading = false;
                    this.title = '';
                    this.editorData ='';
                    this.tags ='';
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Edit question success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.$router.push(`/questions/${this.$route.params.id}`);
                })
                .catch (({ error }) => {
                    this.errors = '';
                    if(error.data.err) {
                    for (let key in error.data.err.errors) {
                            this.errors = error.data.err.errors[key].message;
                        }
                    }
                    console.log("gagal edit questions", error, this.errors);
                })
        },
        getOneQuestion() {
            this.QuestionLoading = true;
            server
                .get(`/questions/find/${this.$route.params.id}`)
                .then(({ data }) => {
                    this.$store.dispatch('offParentStatus')
                    this.question = data.data;
                    this.editorData = this.question.description;
                    this.title = this.question.title;
                    this.tags = this.question.tags
                    console.log("berhasil fetch question detail for edit", this.question)
                })
                .catch((err) => {
                    console.log(err);
                })
        },
    }
}
</script>