import React,{useState} from 'react'
import {v4 as uuidv4 } from "uuid"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
const Home = () => {
	const navigate = useNavigate()
	const [roomId, setRoomId] = useState('')
	const [username,setUsername] = useState('')

	const createNewRoom =(e)=>{
		e.preventDefault();
		const id = uuidv4();
		setRoomId(id);

		toast.success('Cretaed a New Room')

	}
	const joinRoom =()=>{
		if(!roomId || !username){
			toast.error('ROOM ID and username is required')
			return;
		}
		navigate(`/editor/${roomId}`,{
			state:{
				
				username,
			}
		})
	}
	const handleInput=(e)=>{
		
		if(e.code === "Enter")
		{
			joinRoom();
		}

	}
	return (
		<div className="homePageWrapper">
		<div className="formWrapper">
		<img src="/code-sync.png" alt="code_sync logo" className="logo"  />
		<h4 className="mainLabel">Paste Invitation Room ID</h4>
		<div className="inputGroup">
		<input onKeyUp={handleInput} type="text" className="inputBox" value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder="ROOM ID" />
		<input onKeyUp={handleInput} type="text" className="inputBox" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="UserName" />
		<button className="btn joinBtn" onClick={joinRoom}>Join</button>

		<span className="createInfo">If you don't have invite then create &nbsp;<a href="" className="createNewBtn" onClick={(e)=>createNewRoom(e)}>new room</a></span>
		</div>
		</div>
		<footer>
		<h4>Built with &hearts;</h4>
		</footer>

	
		</div>
	)
}

export default Home