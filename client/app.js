const socket = io()

// have at least one component 
const projectsComponent ={

    template : `<div>
                    <div v-for="proj in projects">
                        <div class="border border-info rounded m-4 d-flex flex-row justify-content-around " v-on:click="setActive(proj)" :class="{ 'bg-secondary': proj.active }" >
                            <h2>{{ proj.name }}</h2>
                            <span class="icon mt-2" v-show="!proj.active">
                                <a @click="removeProj(proj)" class="fa fa-trash text-danger fa-2x" ></a>
                             </span>
                             <span class="icon mt-2" v-show="proj.active">
                                <i class="far fa-arrow-alt-circle-right text-info fa-2x"></i>
                             </span>
                        </div>
                    </div>
                </div>`,
    props: ['projects']
}

const todosComponent ={
    template : `<div class="container">
                    <h1 style="border-style: double" >{{proj.name}}</h1>
                        <div v-for="todo in proj.todos">
                            <div class="d-flex align-items-center">
                                <div clas="col">
                                    <input type="checkbox" :checked= "todo.done" v-on:change="toogle(todo,proj)">
                                </div>
                                <div clas="col text-center">
                                    <p>{{todo.description}}</p>
                                </div>
                            </div>
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
            socket.emit('addTodo', {p_id : this.currentProj._id, description : this.todo})
            this.todo =""
        },
        removeProj: function(proj){
            socket.emit('removeProj', proj)
        },
        clearCompleted: function(){
            socket.emit('clearCompleted', this.currentProj)
        }

    },

    components:{
        'todos-component' : todosComponent,
        'projects-component' : projectsComponent
    }

})


const setActive = proj =>{
    socket.emit("setActive", proj)
    socket.emit('getTodos', proj)
    app.selected = true
    app.currentProj = proj
    app.selected = true
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

socket.on('get-todos', todos =>{
    console.log(todos);
    app.currentProj.todos = todos
})

socket.on('successful-removeProj', proj => {
    app.projects.splice(app.projects.findIndex(item => item._id == proj._id), 1)
})

socket.on('activeProj', projects =>{
   app.projects = projects
})

socket.on('set-active', project =>{
    if(project){
        app.selected = true
        app.currentProj = project
    }
    else{
        app.selected = false
        app.currentProj={}
    }
})
