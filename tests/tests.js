const chai = require('chai');
const expect = chai.expect;
const fetch = require('isomorphic-fetch');
const chaiAsPromised = require('chai-as-promised');

const host = 'http://localhost:4711';

const GET = () => {
  return fetch(`${host}/services`)
    .then(res => {
      return res.json();
    });
};

const POST = payload => {
  return fetch(`${host}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
};

describe('health-monitor', () => {
  describe('/services', () => {
    it('should handle GET ', () => {
      GET().then(res => {
        return expect(res.length > 0).to.be.true;
      });
    });
    
    it('should handle POST', () => {
      const payload = {
        name: 'test',
        url: 'http://localhost:4712'
      };
      return POST(payload)
        .then(res => {
          expect(res.status).to.equal(200);
          return GET();
        })
        .then(res => {
          return expect(res.filter(r => r.name === payload.name).length).to.equal(1);
        });
    });

    it('should handle DELETE', () => {
      const payload = {
        name: 'test',
        url: 'http://localhost:4712'
      };
      return POST(payload)
        .then(GET)
        .then(res => {
          const id = res.filter(r => r.name === payload.name)[0].id;
          return fetch(`${host}/services/${id}`, {method: 'DELETE'})
            .then(res => {
              expect(res.status).to.equal(200);
              return GET();
            })
            .then(res => {
              return expect(res.filter(r => r.id === id).length).to.equal(0);
            });
        });
    });
  });
});
