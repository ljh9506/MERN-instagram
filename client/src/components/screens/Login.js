import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { email, password } = form;
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  };

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      M.toast({ html: 'invalid Email', classes: '#c62828 red darken-3' });
      return;
    }
    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          localStorage.setItem('user', JSON.stringify(''));
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', payload: data.user });
          M.toast({ html: 'login success', classes: '#43a047 green darken-1' });
          history.push('/');
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
          name="email"
          type="text"
          placeholder="email"
          value={email}
          onChange={onChange}
          style={{
            maxWidth: '300px',
            backgroundColor: '#fafafa',
            border: '1px solid rgba(var(--b6a, 219, 219, 219), 1)',
            paddingLeft: '12px',
          }}
        />
        <input
          name="password"
          type="text"
          placeholder="password"
          value={password}
          onChange={onChange}
          style={{
            maxWidth: '300px',
            backgroundColor: '#fafafa',
            border: '1px solid rgba(var(--b6a, 219, 219, 219), 1)',
            paddingLeft: '12px',
          }}
        />
        <button
          className="btn-small waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
          style={{
            fontWeight: 'bold',
          }}
        >
          Login
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h6>
            <Link to="/reset">Forgot the Password?</Link>
          </h6>

          <div>
            <Link
              to="/signup"
              style={{
                marginTop: '20px',
                display: 'block',
                padding: '20px 60px',
                border: '1px solid lightgrey',
                fontWeight: 'bold',
              }}
            >
              Don't have an account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
