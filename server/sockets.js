module.exports = (server, db) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

        io.on('connection', socket => {
            //socket events
/* 
1) join user
2) add projects 
3) add todo to the correct project
*/

            db.allProjects()
            .then(projects => socket.emit('refresh-projects', projects))

            socket.on("addProject", project =>{
                db.createProject(project)
                .then(created => io.emit('successful-project', created))
            }),
            socket.on('addTodo', todo => {
                db.createTodo(todo)
                .then(created => io.emit('successful-todo', created))
            }),
            socket.on('removeProj', proj => {
                db.removeProj(proj)
                .then(created => io.emit('successful-removeProj', proj))
            })
        })
}
