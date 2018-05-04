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

            socket.on("addProject", project =>{
                db.createProject(project)
                .then(created => io.emit('successful-project', created))
            })
        })
}
