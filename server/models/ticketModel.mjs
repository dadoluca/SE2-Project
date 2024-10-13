export default function Ticket(idTicket, day, service, counter, served) { 
    this.idTicket = idTicket;
    this.day = day;
    this.service = service;
    this.counter = counter;
    this.served = served;

    this.toJSON = () => {
        return {
            ...this
        };
    };
}