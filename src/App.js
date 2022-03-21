import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import EditorPage from "./pages/EditorPage"
import {Toaster} from "react-hot-toast"
function App() {
  return (
   <>
   <div >
   <Toaster position="top-right" toastOptions={
    {success:{
      theme:{
        primart:'#4aed88'
      }
    }
  }
}></Toaster>
   </div>
   <Router>
   <Routes>
   <Route path="/" element={<Home/>}></Route>
    <Route path="/editor/:roomId" element={<EditorPage />}>
   </Route>
   </Routes>
   </Router>

   </>
  );
}

export default App;
