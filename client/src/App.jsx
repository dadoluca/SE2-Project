import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import CustButton from './components/buttonCustomer'

function App() {
  return (
    <>
      <h1>SELECT A SERVICE</h1>
      <div>
        <CustButton text={"payment"}/>
      </div>
    </>
  )
}

export default App
