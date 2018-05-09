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
    todos: [],
}, { strict: false })

const todoSchema = new Mongoose.Schema({
    description: "",
    done:false
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
        name: data
    }
    return Project.create(content)
}

const createTodo = data => {
    const content = {
        description: data,
    }
    return Todo.create(content)
}

const removeProj = data => {
    return Project.remove(data, function (err){
        if (err)
            console.log(err)
    })
}

//change all active to false and then set one to true
const activeProj = data =>{
    return Project.updateMany()
}

const allProjects = () => Project.find()

module.exports ={
    createProject,
    createTodo,
    allProjects,
    removeProj
}
