const socket = io()

//have atleast one component 
const projectsComponent ={
    template : `<div>
                    <div>
                        <project-component>
                        <h1>Hello</h1>
                        </project-component>
                    </div>
                </div>`,
    props: ['projects']
}
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
    components :{
        'todo-component' : todoComponent,
        'project-component' : projectsComponent
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
