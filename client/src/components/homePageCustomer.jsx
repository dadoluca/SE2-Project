import CustButton from './buttonCustomer.jsx';
import './homePageCustomer.css';

function HomePageCustomer(){
     return(
        <div>
             <h1>SELECT A SERVICE</h1>
             <div className="buttonContainer">
                <CustButton text={"💵BILL PAYMENT"} imag={"bi bi-receipt-cutoff"} routePath={"/bill-payment"}/>
                <CustButton text={"💳WITHDRAWALS"} imag={"bi bi-credit-card"} routePath={"/withdrawals"}/>
                <CustButton text={"📦SHIPMENTS"} imag={"bi bi-truck"} routePath={"/shipments"}/>
            </div>
        </div>
     )
}

export default HomePageCustomer;

