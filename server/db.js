//save project and todos related to the project
const
    config = require('./config.json'),
    Mongoose = require('mongoose')

Mongoose.connect(config.uri)

Mongoose.connection.on('error', err => {
    console.log('MongoDB Connection Error:' + err)
})

const projectSchema = new Mongoose.Schema({
    name: "",
    active: false,
}, { strict: false })

const todoSchema = new Mongoose.Schema({
    p_id: "",
    description: "",
    done:false,
}, { strict: false })

const
    Project = Mongoose.model('projects', projectSchema),
    Todo = Mongoose.model('todos', todoSchema)

const createProject = data => {
    const content = {
        name: data,
        active: false
    }
    // TODO fix unhandled promise rejection
    return Project.findOne(content)
        .then(found => {
            if (found)
                throw new Error('Project already exists')
            else
                return Project.create(content)
        })
}

const createTodo = data => {
    const content = {
        p_id : data.p_id,
        description: data.description,
        //changed to true for testing reasons
        done: true
    }
    return Todo.create(content)
}

const getTodos = data =>{
    return Todo.find({p_id : data._id})
}

const removeProj = data => {
    return Project.remove(data, function (err){
        if (err)
            console.log(err)
    })
}

const removeTodo = data => {
    return Todo.remove(data, function (err){
        if (err)
            console.log(err)
    })
}

//change all active to false and then set one to true
const activeProj = data =>{
    //make all projects that are active false
    return Project.update({active  : { $eq: true}, _id: {$ne: data._id}}, {active: false})
    .then(update =>{
      return Project.update({_id: data._id}, {active: true})
       .then(update =>{
           return Project.find()
       })
    })
}

const findActive = () => Project.findOne({active : true}) 

const allProjects = () => Project.find()

const clearTodo = (proj) => Todo.remove({done : true, p_id : {$eq : proj._id}}, false)

module.exports ={
    createProject,
    createTodo,
    allProjects,
    removeProj,
    activeProj,
    findActive,
    getTodos,
    removeTodo,
    clearTodo
}
