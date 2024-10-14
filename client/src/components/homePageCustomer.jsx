import CustButton from './buttonCustomer.jsx';
import './homePageCustomer.css';

function HomePageCustomer(){
     return(
        <div>
             <h1>SELECT A SERVICE</h1>
             <div className="buttonContainer">
                <CustButton serviceId={1} text={"💵BILL PAYMENT"} imag={"bi bi-receipt-cutoff"} routePath={"/bill-payment"}/>
                <CustButton serviceId={2} text={"💳WITHDRAWALS"} imag={"bi bi-credit-card"} routePath={"/withdrawals"}/>
                <CustButton serviceId={3} text={"📦SHIPMENTS"} imag={"bi bi-truck"} routePath={"/shipments"}/>
            </div>
        </div>
     )
}

export default HomePageCustomer;

