const socket = io()

//have atleast one component 
const projectsComponent ={
    template : `<div>
                    <div v-for="proj in projects">
                        <div class ="bg-danger border border-info rounded m-4"  >
                            <h2>{{ proj.name }}</h2>
                        </div>
                    </div>
                </div>`,
    props: ['projects']
}

const todoComponent ={
    template : `<div>
                    <h2>hi</h2>
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
        setActive: function(proj){
            proj.active =true
        },
        addProject: function(){
            socket.emit('addProject', this.project)

        }, 
        addTodo: function(){
            socket.emit('addTodo', this.todo)
        }

    },
    components:{
        'todo-component' : todoComponent,
        'projects-component' : projectsComponent
    }

})

app.projects.push({name: "test" , active :false, todos: [{description : "tester" , done :false},{description : "tester" , done :false} ]})
app.projects.push({name: "test2tedryfgyftdrty fgfygiuyftdrytfuyg" , active: false, todos: [{description : "tester2ftfyfytfyftffyfytf" , done :false},{description : "tester2" , done :false} ]})

//socket events
/* 
1) join user
2) add projects 
3) add todo to the correct project
*/

socket.on('successful-project', project =>{
    app.projects.push(project)
})

socket.on('successful-todo', todo => {
    app.todos.push(todo)
})

