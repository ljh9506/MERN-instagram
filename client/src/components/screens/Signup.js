import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import Axios from 'axios';

const Signup = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const { name, email, password } = form;
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  };

  const uploadPic = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta-clone');
    data.append('cloud_name', 'ljhcloud1949');
    Axios.post(
      'https://api.cloudinary.com/v1_1/ljhcloud1949/image/upload',
      data,
    )
      .then((res) => {
        console.log(res.data);
        setUrl(res.data.url);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      M.toast({ html: 'invalid Email', classes: '#c62828 red darken-3' });
      return;
    }
    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          name="name"
          type="text"
          placeholder="name"
          value={name}
          onChange={onChange}
          style={{
            maxWidth: '300px',
            backgroundColor: '#fafafa',
            border: '1px solid rgba(var(--b6a, 219, 219, 219), 1)',
            paddingLeft: '12px',
          }}
        />
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
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>profile Image</span>
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ maxWidth: '100px !important' }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" />
          </div>
        </div>
        <button
          className="btn-small waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
          style={{
            fontWeight: 'bold',
          }}
        >
          Signup
        </button>
        <div>
          <Link
            to="/login"
            style={{
              marginTop: '20px',
              display: 'block',
              padding: '20px 60px',
              border: '1px solid lightgrey',
              fontWeight: 'bold',
            }}
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
