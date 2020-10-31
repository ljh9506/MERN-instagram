import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    password: '',
  });
  const { password } = form;
  const { token } = useParams();
  console.log(token);
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  };

  const PostData = () => {
    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ ...form, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          M.toast({ html: data.message, classes: '#43a047 green darken-1' });
          history.push('/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          name="password"
          type="text"
          placeholder="Enter Your new password"
          value={password}
          onChange={onChange}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
