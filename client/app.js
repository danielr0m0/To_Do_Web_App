const socket = io()

//have atleast one component 
const projectsComponent ={
    template : `<div>
                    <div v-for="proj in projects">
                        <div class="border border-info rounded m-4 d-flex flex-row justify-content-around " v-on:click="setActive(proj)" :class="{ 'bg-secondary': proj.active }" >
                            <h2>{{ proj.name }}</h2>
                            <span class="icon mt-2" >
                                <a @click="removeProj(proj)" class="fa fa-trash has-text-danger"></a>
                             </span>
                        </div>
                    </div>
                </div>`,
    props: ['projects']
}
const todosComponent ={
    template : `<div>
                    <div v-for="todo in proj.todos">
                        <h2> <input type="checkbox" :checked= "todo.done" v-on:change="toogle(todo,proj)">  {{todo.description}}</h2>
                    </div>
                </div>`,
    props: ['proj']
}

//projects can be a dictionary aka hashmap in java  
//[key : value] value can be array of tod and key
// be the project todos 
const app = new Vue({
    el: '#todo-app',
    data:{
        selected: false,
        userName: '',
        password: '',
        failedName: '',
        user: {},
        project: '',
        todo:'',
        projects: [],
        currentProj : {},
    },
    methods :{
        addProject: function(){
            socket.emit('addProject', this.project)

        }, 
        addTodo: function(){
            socket.emit('addTodo', this.todo)
        },
        removeProj: function(proj){
            socket.emit('removeProj', proj)
        }

    },
    components:{
        'todos-component' : todosComponent,
        'projects-component' : projectsComponent
    }

})


const setActive = proj =>{
    socket.emit("setActive", proj)
    app.selected = true
    app.currentProj = proj
}

const removeProj = proj => {
    socket.emit('removeProj', proj)
}

const toogle = (todo, proj) =>{
    if(todo.done)
        todo.done=false
    else
        todo.done=true
}


socket.on('refresh-projects', projects =>{
    app.projects = projects
})

socket.on('successful-project', project =>{
    app.projects.push(project)
})

socket.on('successful-todo', todo => {
    app.currentProj.todos.push(todo)
})

socket.on('successful-removeProj', proj => {
    app.projects.splice(app.projects.findIndex(item => item._id == proj._id), 1)
})

socket.on('activeProj', r =>{
    console.log(r)
})
