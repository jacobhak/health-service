import React, { Component } from 'react';
import { GET, POST, DELETE } from './api';
import ServiceForm from './ServiceForm';

const Service = ({ service, onDelete }) => {
  const statusColor = service.status === 'OK' ? 'rgb(0, 200, 0)' : 'rgb(255, 64, 5)';
  return (
    <div style={{borderRadius: '5px', borderWidth: '1px', borderColor: 'rgb(204, 204, 204)', borderStyle: 'solid', display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
      <div style={{marginLeft: '5px', marginTop: '5px', marginBottom: '5px', borderRadius: '5px', backgroundColor: statusColor, width: '20px'}}></div>
      <div style={{flexGrow: 1, paddingLeft: '20%', paddingRight: '20%', marginTop: '5px'}}>
        <div style={{display: 'flex', alignItems: 'baseline', marginBottom: '10px'}}>
          <div style={{fontSize: '1.5em', marginRight: '10px'}}>
            {service.name}
          </div>
          <div style={{textAlign: 'bottom', fontSize: '0.9em'}}>
            <label htmlFor='link'>Url: </label>
            <a style={{color: 'grey'}} name='link' href={service.url}>{service.url}</a>
            
          </div>
        </div>
        
        <div style={{fontSize: '0.8em', textAlign: 'left', marginBottom: '10px'}}>Last updated: {service.lastCheck}</div>
      </div>
      <div>
        <button onClick={onDelete}>X</button>
      </div>
    </div>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      services: []
    }
  }
  
  componentDidMount() {
    this.getServices();
  }

  getServices() {
    GET()
      .then(services => {
        console.log('setting services: ', services);
        this.setState({ services: services });
      });    
  }

  deleteFunction(id) {
    return () => {
      DELETE(id).then(this.getServices.bind(this));
    };

  }

  addService(service) {
    return POST(service).then(this.getServices.bind(this));
  }
  
  render() {
    return (
      <div style={{display: 'flex', fontFamily:'Helvetica', flexDirection: 'column', textAlign: 'center'}}>
        <div >
          <h1>Health Service</h1>
        </div>
        <div style={{marginBottom: '20px'}}>
          <ServiceForm onSubmit={this.addService.bind(this)}/>
        </div>
        <div style={{marginLeft: '20%', marginRight: '20%'}}>
          {this.state.services.map((s, i) => (<Service key={i} service={s} onDelete={this.deleteFunction(s.id).bind(this)}/>))}
      </div>
      </div>
    );
  }
}
export default App;
