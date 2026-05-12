import axios from 'axios';

axios.put('http://localhost:5000/api/users/69f84591e766cc95aa8afb29', {
  name: 'Test'
}).then(res => {
  console.log('Success:', res.status);
}).catch(err => {
  console.log('Error:', err.response ? err.response.status : err.message);
  console.log('Data:', err.response ? err.response.data : '');
});
