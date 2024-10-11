import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/homepage.jsx';
import QRCodePage from './components/codePage.jsx';
import { Routes, Route, useNavigate} from 'react-router-dom';

function App() {
  return (
    <>
      <h1>SELECT A SERVICE</h1>
      <div className="homePage">
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/bill-payment" element={<QRCodePage/>} />
          <Route path="/withdrawals" element={<QRCodePage/>} />
          <Route path="/shipments" element={<QRCodePage/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
