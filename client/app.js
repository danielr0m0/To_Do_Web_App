const socket = io()

const projectsComponent ={
    template : `<div>
                    <div v-for="proj in projects">
                        <div class="border border-info rounded m-4 d-flex flex-row justify-content-around flex-wrap" :class="{ 'bg-secondary': proj.active }" >
                            <h2 v-on:click="setActive(proj)"  >{{ proj.name }}</h2>
                            <span class="icon mt-2"  v-show="!proj.active">
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
                            <div class="m-2 pl-3 pr-3 d-flex justify-content-start align-items-center border border-info rounded">
                                <div class="d-flex flex-column">
                                    <input type="checkbox" :checked= "todo.done" v-on:change="toggle(todo)">
                                </div>
                                <div class="mt-2 ml-3">
                                 <p v-show="!todo.done">{{todo.description}}</p>
                                 <p v-show="todo.done"><s>{{todo.description}}</s><p>
                                </div>
                                <div class="ml-auto pl-2">
                                    <span class="icon">
                                        <a @click="removeTodo(todo)" class="fa fa-trash text-danger fa-lg" ></a>
                                    </span>
                                </div>
                            </div>
                        </div>
                </div>`,
    props: ['proj' ]
}

const app = new Vue({
    el: '#todo-app',
    data:{
        selected: false,
        project: '',
        error: '',
        todo:'',
        projects: [],
        currentProj : {},
    },
    methods :{
        // Angie
        addProject: function(){
            
            socket.emit('addProject', this.project.trim())
        }, 
        addTodo: function(){
            socket.emit('addTodo', {p_id : this.currentProj._id, description : this.todo.trim()})
            this.todo =''
        },
        clearCompleted: function(){
            socket.emit('clearCompleted', this.currentProj)
        },
        archive: function(){
            socket.emit('archive', this.currentProj)
        }
    },

    components:{
        'todos-component' : todosComponent,
        'projects-component' : projectsComponent
    }

})

const setActive = proj =>{
    socket.emit('setActive', proj)
    socket.emit('getTodos', proj)
    app.selected = true
    app.currentProj = proj
    app.error=''
}

const removeProj = proj => {
    socket.emit('removeProj', proj)
}

const removeTodo = (todo) => {
    socket.emit('removeTodo', todo)
}

const toggle = (todo) =>{
    socket.emit('updateTodos', todo)
}

socket.on('refresh-projects', projects =>{
    app.projects = projects
})

socket.on('successful-todo', todo => {
    app.currentProj.todos.push(todo)
})

socket.on('successful-project', project =>{
    app.error=''
    app.projects.push(project)
    app.project=''
})

socket.on('unsuccessful-project', e =>{
    app.error = `Project '${app.project}' already exists`
    app.project=''
})
socket.on('activeProj', projects =>{
    app.projects = projects
 })
 
 socket.on('set-active', project =>{
     if(project){
         setActive(project)
     }
     else{
         app.selected = false
         app.currentProj={}
     }
 })
socket.on('successful-removeProj', proj => {
    app.projects.splice(app.projects.findIndex(item => item._id == proj._id), 1)
})
 
socket.on('get-todos', todos =>{
    app.currentProj.todos = todos
})
