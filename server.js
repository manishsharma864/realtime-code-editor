const express = require('express')
const app=express()
const http=require('http')
const {Server} = require('socket.io')
const ACTIONS = require('./src/Actions')
const path = require('path')
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('build'));
app.use((req,res,next)=>{
res.sendFile(path.join(__dirname,'build','index.html'))
})

const userSocketMap = {};

function getAllconnectedClients(roomId){
	//map data type
	return Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map((socketId)=>{
return{
	socketId,
	username: userSocketMap[socketId],
}

	})
}

io.on('connection',(socket)=>{
	console.log('socket',socket.id)
	socket.on(ACTIONS.JOIN,({roomId,username})=>{

userSocketMap[socket.id] = username;//store the username
socket.join(roomId);//joins the room

const clients = getAllconnectedClients(roomId)
clients.forEach(({socketId})=>{
	//notify that some one has joined
io.to(socketId).emit(ACTIONS.JOINED,{
	clients,
	username,
	socketId:socket.id,
})
})
	})

	socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
		socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code})
	})

	socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
		io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
	})

	//disconnecting user and notifying the other users

	socket.on('disconnecting',()=>{
		const rooms = [...socket.rooms]
		rooms.forEach((roomId)=>{
			socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
				socketId:socket.id,
				username: userSocketMap[socket.id],
			})
		})
		delete userSocketMap[socket.id]
		socket.leave();
	})
})
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log(`listening on port ${PORT}`))
