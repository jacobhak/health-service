import fetch from 'isomorphic-fetch';

const host = 'http://localhost:4711';

export const GET = () => {
  return fetch(`${host}/services`)
    .then(res => {
      return res.json();
    });
};

export const DELETE = id => {
  return fetch(`${host}/services/${id}`, {method: 'DELETE'});
}

export const POST = payload => {
  return fetch(`${host}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
};
