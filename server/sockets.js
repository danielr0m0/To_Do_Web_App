module.exports = (server, db) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

        io.on('connection', socket => {
            //socket events

            db.allProjects()
            .then(projects => socket.emit('refresh-projects', projects))

            //daniel
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
             //daniel
             socket.on('setActive', proj =>{
                db.activeProj(proj)
                .then(project => io.emit('activeProj',project))
            }),
            //wiliam
            socket.on('removeProj', proj => {
                db.removeProj(proj)
                .then(created => {
                    io.emit('successful-removeProj', proj)
                })
            }),
            socket.on('archive', currentProj => {
                db.archiveTodos()
                .then(removeTodo => {
                    if (currentProj)
                        db.getTodos(currentProj._id)
                        .then(todo => io.emit('get-todos', todo))
                })
            }),
            //jurely
            socket.on('getTodos', proj =>{
                db.getTodos(proj._id)
                .then(todos => io.emit('get-todos',todos))
            }),
            socket.on('updateTodos', todo => {
                db.updateTodos(todo)
                .then(todos => io.emit('get-todos', todos))
            }),
            //alisha
            socket.on('removeTodo', (todo) => {
                db.removeTodo(todo)
                .then(remove => {
                    db.getTodos(todo.p_id)
                    .then(todos=>{
                        io.emit('get-todos',todos)
                    })
                })
            }),
            socket.on('clearCompleted', currentProj => {
                db.clearTodo(currentProj)
                .then(removed =>{
                    db.getTodos(currentProj._id)
                    .then(todo =>io.emit('get-todos', todo))
                })
            })
        })
}
