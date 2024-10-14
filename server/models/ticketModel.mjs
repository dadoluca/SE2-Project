export default function Ticket(id, service, number, status, counter, timestamp) { 
    this.id = id;
    this.service = service;
    this.number = number;
    this.status = status;
    this.counter = counter;
    this.timestamp = timestamp;

    this.toJSON = () => {
        return {
            ...this
        };
    };
}