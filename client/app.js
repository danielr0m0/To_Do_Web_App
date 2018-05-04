const socket = io()

//have atleast one component 
const projectComponent ={
    template : `<div>
                    <h2>project</h2>
                </div>`,
    props: ['project']
}

const todoComponent ={
    template : `<div>
                    <h2>todo</h2>
                </div>`,
props: ['todo']
}

//projects can be a dictionary aka hashmap in java  
//[key : value] value can be array of tod and key
// be the project todos 
const app = new Vue({
    el: '#todo-app',
    data:{
        loggedIn: false,
        userName: '',
        password: '',
        failedName: '',
        user: {},
        project: '',
        todo:'',
        projects: [],
        todos : [],
    },
    methods :{
        addProject: function(){
            socket.emit('addProject', this.project)
        }

    },
    component:{
        'todo-component' : todoComponent,
        'project-component' : projectComponent
    }

})


//socket events
/* 
1) join user
2) add projects 
3) add todo to the correct project
*/

socket.on('successful-project', project =>{
    app.projects.push(project)
})

