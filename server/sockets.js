module.exports = (server, db) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

        io.on('connection', socket => {
            //socket events

            db.allProjects()
            .then(projects => socket.emit('refresh-projects', projects))

            db.findActive()
            .then(project => socket.emit('set-active', project))

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
                .then(created => {
                    io.emit('successful-removeProj', proj)
                })
            }),
            socket.on('setActive', proj =>{
                db.activeProj(proj)
                .then(project => io.emit('activeProj',project))
            }),
            socket.on('getTodos', proj =>{
                db.getTodos(proj)
                .then(todos => io.emit('get-todos',todos))
            }),
            socket.on('clearCompleted', currentProj => {
                // db.getTodos(currentProj)
                // .then(todos => {
                //     for (let i = 0; i < todos.length; i++){
                //         if (todos[i].done == true){
                //             db.removeTodo(todos[i])
                //             .then(todos => {
                //                 db.getTodos(currentProj)
                //                 .then (todos => io.emit('get-todos', todos))
                //             })
                //         }
                //     }
                // })

                db.clearTodo()
                .then(removed =>{
                    
                   
                })
            })
        })
}
