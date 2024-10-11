import CustButton from './buttonCustomer.jsx';
import './homePage.css';

function HomePage(){
     return(
        <div className="buttonContainer">
            <CustButton text={"BILL PAYMENT"} imag={"bi bi-receipt-cutoff"} routePath={"/bill-payment"}/>
            <CustButton text={"WITHDRAWALS"} imag={"bi bi-credit-card"} routePath={"/withdrawals"}/>
            <CustButton text={"SHIPMENTS"} imag={"bi bi-truck"} routePath={"/shipments"}/>
        </div>
     )
}

export default HomePage;

