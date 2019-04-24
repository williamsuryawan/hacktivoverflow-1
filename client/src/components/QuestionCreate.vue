<template>
    <div class="container">
        <h1 class="mt-2">Add A New Question</h1>
        <form v-on:submit.prevent="AddQuestion">
            <div class="form-group row">
                <label for="inputName" class="col-sm-4 col-form-label">Question Title</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" v-model="title" id="inputName" placeholder="Question Title Here">
                </div>
            </div>
            <div class="form-group row">
                <label for="inputContent" class="col-sm-4 col-form-label">Content:</label>
                <div id="app" class="col-sm-8">
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputTag" class="col-sm-4 col-form-label">Tags (please enter before you add another tags):</label>
                <div class="col-sm-8">
                    <tags-input element-id="tags"
                            v-model="newTag"
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
import server from '@/api/server.js'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Swal from 'sweetalert2'

export default {
    name: "app",
    components: {
        "tags-input": VoerroTagsInput
    },
    data() {
        return {
            title: "",
            newTag: "",
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
        this.$store.commit('updateAllQuestionsState', {boolean: false})
        this.$store.commit('updateAnswerAddState', {boolean: false})
    },
    methods: {
        AddQuestion () {
            this.isLoading = true
            console.log("data question siap kirim utk create ==>", this.title, localStorage.getItem("token"))
            server
                .post('/questions/', {
                    title: this.title,
                    description: this.editorData,
                    tags: this.newTag}, 
                    {headers: {token: localStorage.getItem("token")
                }})
                .then(response => {
                    console.log("berhasil create questions", response)
                    this.isLoading = false;
                    this.title = '';
                    this.editorData ='';
                    this.newTag ='';
                    this.$router.push("/questions");
                    this.$store.dispatch('getAllQuestions')
                    this.$store.commit('updateAllQuestionsState', {boolean: true})
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Adding Question Success ',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
                .catch (({ error }) => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: 'Adding Question Failed ',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.errors = '';
                    if(error.data.err) {
                    for (let key in error.data.err.errors) {
                            this.errors = error.data.err.errors[key].message;
                        }
                    }
                    console.log("gagal create questions", error, this.errors);
                })
        }
    }
}
</script>