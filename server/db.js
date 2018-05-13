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
        active: false,
        todos: []
    }

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
        done: false
    }
    return Todo.create(content)
}

const allProjects = () => Project.find()

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


const removeProj = data => {
    Todo.remove({p_id : data._id})
    .catch(e =>{
        console.log(e);
    })
    return Project.remove(data, function (err){
        if (err)
            console.log(err)
    })
}

const archiveTodos = () => Todo.remove({done : true})

const getTodos = id =>{
    return Todo.find({p_id : id})
}

const updateTodos = todo => {
    if (todo.done) {
        return Todo.update({_id: todo._id}, {done : false})
                .then(update => Todo.find({p_id : todo.p_id}))
    } else
        return Todo.update({_id: todo._id}, {done : true})
        .then(update => Todo.find({p_id : todo.p_id}))
}

const removeTodo = data => {
    return Todo.remove({_id: data._id})
}

const clearTodo = (proj) => Todo.remove({
    done : true,
    p_id : {$eq : proj._id}
})


module.exports ={
    createProject,
    createTodo,
    allProjects,
    removeProj,
    activeProj,
    findActive,
    getTodos,
    removeTodo,
    clearTodo,
    archiveTodos,
    updateTodos,
}
