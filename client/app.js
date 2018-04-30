const socket = io()

//have atleast one component 

const _Component ={
    templat = `<div>
                </div>`,
    props: ['obj']
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
        projects: [],
        todo = ''
    }
})


//socket events
/* 
1) join user
2) add projects 
3) add todo to the correct project
*/
