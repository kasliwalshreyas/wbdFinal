const io = require('socket.io')(8800, {
    cors :{
        origin: "http://localhost:4001",
    },
})

let activeUSers = []
let activeProjects = []

io.on("connection", (socket)=>{
    // new user
    socket.on('new-user-add', (newUserId)=>{
        // if user is not added previously
        if(!activeUSers.some((user)=> user.userId === newUserId)){
            activeUSers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        console.log("User Connected", activeUSers)
        io.emit('get-users', activeUSers)
    })
    socket.on('new-project-add', (newProjectId)=>{
        // if user is not added previously
        if(!activeProjects.some((project)=> project.projectId === newProjectId)){
            activeProjects.push({
                projectId: newProjectId,
                socketId: socket.id
            })
        }
        console.log("Project Connected", activeProjects)
        io.emit('get-Projects', activeProjects)
    })
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const { senderId } = data;
        const user = activeUSers.find((user) => user.userId === receiverId);
        const cur_user = activeUSers.find((user) => user.userId === senderId);
        console.log("Sending from socket to :", receiverId)
        console.log("Data: ", data)
        if (user) {
        io.emit('recieve-message', data);
          console.log("sent to ",user.socketId)
          console.log("from ", cur_user.socketId)
        }
      });
    socket.on("disconnect",()=>{
        activeUSers = activeUSers.filter((user)=> user.socketId !== socket.id)
        console.log("User Disconnected", activeUSers)
        io.emit('get-users', activeUSers)
    })
})