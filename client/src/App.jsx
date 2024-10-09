import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import CustButton from './components/buttonCustomer.jsx';

function App() {
  return (
    <>
      <h1>SELECT A SERVICE</h1>
      <div className="homePage">
        <div className="buttonContainer">
          <CustButton text={"BILL PAYMENT"} imag={"bi bi-receipt-cutoff"}/>
          <CustButton text={"WITHDRAWALS"} imag={"bi bi-credit-card"}/>
          <CustButton text={"SHIPMENTS"} imag={"bi bi-truck"}/>
        </div>
      </div>
    </>
  )
}

export default App
