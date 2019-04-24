const Tag = require('../models/tag');

module.exports = {
    NewQuestionTag: function (inputTag) {
        console.log("masuk ke helper NewQuestionTag", inputTag)
        let uniqueTags = [];
        let objectTag = {};
        inputTag.forEach(tag => {
            if(tag.length > 0) {
                objectTag[tag.toLowerCase()] = 'hello'
            }
        });
        console.log("hasil split and looping tag", objectTag)
        uniqueTags = Object.keys(objectTag);
        console.log("ensure the tag is unique",  uniqueTags)

        uniqueTags.forEach(tag => {
            Tag
                .findOne({name: tag})
                .then(findTag => {
                    if(!findTag) {
                        return Tag
                            .create({name: tag })
                            .then(newTag => {
                                console.log("hasil save new tag", newTag)
                            })
                    } else {
                        console.log("Tag sudah ada, hasil find tag", findTag)
                    }
                })
                .catch(error => {
                    throw new Error(error)
                })
        })
        console.log("helper NewQuestionTag selesai", uniqueTags)
        return uniqueTags;
    },
    EditQuestionTag: function (editTag, existingTag) {
        console.log("masuk ke helper EditQuestionTag", editTag, existingTag)
        let uniqueTags = [];
        editTag.split(',').forEach(tagg => {
            existingTag.push(tagg)
        })
        console.log("all tags in array", existingTag)
        let objectTag = {};
        existingTag.forEach(tag => {
            if(tag.length > 0) {
                objectTag[tag] = 'hello'
            }
        });
        console.log("hasil split and looping tag", objectTag)
        uniqueTags = Object.keys(objectTag);
        console.log("ensure the tag is unique",  uniqueTags)

        uniqueTags.forEach(tag => {
            Tag
                .findOne({name: tag})
                .then(findTag => {
                    if(!findTag) {
                        return Tag
                            .create({name: tag })
                            .then(newTag => {
                                console.log("hasil save new tag", newTag)
                            })
                    } else {
                        console.log("Tag sudah ada, hasil find tag", findTag)
                    }
                })
                .catch(error => {
                    throw new Error(error)
                })
        })
        
        console.log("helper EditQuestionTag selesai", uniqueTags)
        return uniqueTags;
    }
}

