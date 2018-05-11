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
            // Angie
            socket.on("addProject", project =>{
                db.createProject(project)
                .then(created => io.emit('successful-project', created))
                .catch(e => io.emit('unsuccessful-project', e))
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
            socket.on('removeTodo', (todo) => {
                db.removeTodo(todo)
                .then(remove => {
                    db.getProjects(todo)
                    .then(proj => {
                        db.getTodos(proj)
                        .then(todos => {
                            io.emit('get-todos', todos)
                        })
                    })
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
                db.clearTodo(currentProj)
                .then(removed =>{
                    db.getTodos(currentProj)
                    .then(todo =>io.emit('get-todos', todo))
                })
            })
        })
}
