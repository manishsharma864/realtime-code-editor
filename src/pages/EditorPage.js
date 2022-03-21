import React ,{useState,useEffect,useRef}from 'react'
import Client from "../components/Client"
import Editor from "../components/Editor"
import {initSocket} from "../socket"
import ACTIONS from "../Actions"
import {useLocation,useNavigate,Navigate,useParams} from "react-router-dom"
import toast from "react-hot-toast"

const EditorPage = () => {
	const socketRef = useRef(null)
	const [client,setClients] = useState([])
	const codeRef = useRef(null)
	const location = useLocation()
	const reactNavigator = useNavigate()
	const {roomId} = useParams()
	console.log(roomId)
	useEffect(() => {
		const init = async ()=>{
			socketRef.current = await initSocket()
			socketRef.current.on('connect_error',(err)=>handleErrors(err));
				socketRef.current.on('connect_failed',(err)=>handleErrors(err));

				function handleErrors(e){
					console.log('socket error',e)
					toast.error('socket coonection failed')
					reactNavigator("/")
				}
			socketRef.current.emit(ACTIONS.JOIN,{
				roomId,
				username: location.state?.username
			})
			//listening for new joined user

			socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{

				if(username!== location.state?.username)
				{
					toast.success(`${username} joined the room`);
				}
				setClients(clients);
				   socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });

			})

			//listening for disconnecting

			socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
				toast.success(`${username} left the room`)
				setClients((prev)=>{
					return prev.filter((client)=> client.socketId !== socketId)
				})
			})
		}
		init();
		return()=>{
			socketRef.current.disconnect();
			socketRef.current.off(ACTIONS.JOINED)
			socketRef.current.off(ACTIONS.DISCONNECTED)
		}
	}, [])
	async function copyRoomId(){
		try{
			await navigator.clipboard.writeText(roomId)
			toast.success('Room Id has been copied to your clipboard')

		}
		catch(err)
		{
			toast.error('Could not copy room id' )
		}
	}
	function leaveRoom(){
		reactNavigator('/')
	}
	if(!location.state){
		return <Navigate to="/" />
	}

	return (
		<div className="mainWrap">
		<div className="aside">
		<div className="asideInner">
		<div className="logo">
		<img src="/code-sync.png" className="logoImage" />
		</div>
		<h3>Connected</h3>
		<div className="clientsList">
		{
			client.map((c)=>(
				<Client key={c.socketId} username={c.username} />
				))
		}
		</div>
		</div>
		<button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
			<button className="btn leaveBtn" onClick={leaveRoom} >Leave</button>
		</div>
		<div className="editorWrap">
		
		<Editor  socketRef={socketRef} roomId={roomId}   onCodeChange={(code) => {
                        codeRef.current = code;
                    }} />
		</div>
		</div>
	)
}

export default EditorPage