import React, { Component } from 'react'

import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'

class EventsPage extends Component {
    state = {
        creating: false,
        events: []
    }

    static contextType = AuthContext

    constructor(props) {
        super(props)
        this.titleElementRef = React.createRef()
        this.dateElementRef = React.createRef()
        this.priceElementRef = React.createRef()
        this.descriptionElementRef = React.createRef()
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }

    modalCancelHandler = () => {
        this.setState({ creating: false })
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false })
        const title = this.titleElementRef.current.value
        const price = +this.priceElementRef.current.value
        const date = this.dateElementRef.current.value
        const description = this.descriptionElementRef.current.value

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return
        }


        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                _id
                title
                description
                date
                price
                creator {
                    _id
                    email
                }
              }
            }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                this.fetchEvents();
            })
            .catch(err => {
                console.log(err);
            });
    };

    fetchEvents() {

        const requestBody = {
            query: `
                query {
                  events {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        email
                    }
                  }
                }
              `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                const events = resData.data.events
                this.setState({ events: events })
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const eventList = this.state.events.map(event => {
            return (
                <li key={event._id} className="events__list-item">
                    {event.title}
                </li>
            )
        })
        console.log(eventList)

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating &&
                    <Modal
                        title="Adicionar Evento"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Titulo</label>
                                <input type="text" id="title" ref={this.titleElementRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Preço</label>
                                <input type="number" id="price" ref={this.priceElementRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Data</label>
                                <input type="datetime-local" id="date" ref={this.dateElementRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Descrição</label>
                                <textarea id="description" rows="4" ref={this.descriptionElementRef}></textarea>
                            </div>
                        </form>
                    </Modal>}
                {this.context.token && (
                    <div className="events-control">
                        <p>Compartilhe seus Eventos!</p>
                        <button className="btn" onClick={this.startCreateEventHandler}>Criar Evento</button>
                    </div>
                )}
                <ul className="events__list">{eventList}</ul>
            </React.Fragment>
        )
    }
}

export default EventsPage;