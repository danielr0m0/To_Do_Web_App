//save project and todos related to the project
const
    config = require('./config.json'),
    Mongoose = require('mongoose'),
    { generateHash, validatePassword } = require('./validate')

Mongoose.connect(config.uri)

Mongoose.connection.on('error', err => {
    console.log('MongoDB Connection Error:' + err)
})

// const UserSchema = new Mongoose.Schema({
//     name: String,
//     avatar: String,
//     socketId: String,
//     password: String
// }, { strict: false })


const projectSchema = new Mongoose.Schema({
    name: "",
    active: false,
    todos: [],
}, { strict: false })

const todoSchema = new Mongoose.Schema({
    p_id: "",
    description: "",
    done:false,
}, { strict: false })

const
    // User = Mongoose.model('users', UserSchema),
    Project = Mongoose.model('projects', projectSchema),
    Todo = Mongoose.model('todos', todoSchema)

// const createUser = (userName, password, socketId) => {
//     // find if username is in db
//     return findUserByName(userName)
//         .then(found => {
//             if (found)
//                 throw new Error('User already exists')

//             return {
//                 socketId,
//                 name: userName,
//                 password: generateHash(password),
//                 avatar: `https://robohash.org/${userName}?set=set3`
//             }
//         })
//         // create user
//         .then(user => User.create(user))
//         // return avatar and name
//         .then(({ name, avatar }) => {
//             return { name, avatar }
//         })
// }


const createProject = data => {
    const content = {
        name: data,
        active: false
    }
    return Project.create(content)
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

module.exports ={
    createProject,
    createTodo,
    allProjects,
    removeProj,
    activeProj,
    findActive,
    getTodos,
    removeTodo
}
