import React, { Component } from 'react'

import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'

class EventsPage extends Component {
    state = {
        creating: false
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }

    modalConfirmHandler = () => {
        this.setState({creating: false})
    }

    modalCancelHandler = () => {
        this.setState({creating: false})
    }

    render() {
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
                    <p>Conteúdo do Modal</p>
                </Modal>}
                <div className="events-control">
                    <p>Compartilhe seus Eventos!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Criar Evento</button>
                </div>;
            </React.Fragment>
        )
    }
}

export default EventsPage;