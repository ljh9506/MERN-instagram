import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import '../App.css';

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, 'right');
});

const Navbar = () => {
  const searchModal = useRef(null);
  const searchFocus = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();

  useEffect(() => {
    M.Modal.init(searchModal.current, {
      onCloseStart: function () {
        setSearch('');
        setUserDetails([]);
      },
      onOpenEnd: function () {
        searchFocus.current.focus();
        console.log('열림');
      },
    });
  }, []);

  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger sidenav-close"
            style={{ color: 'black', cursor: 'pointer' }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile" className="sidenav-close">
            Profile
          </Link>
        </li>,
        <li key="3">
          <Link to="/create" className="sidenav-close">
            Create Post
          </Link>
        </li>,
        <li key="4">
          <Link to="/followingposts" className="sidenav-close">
            Following Posts
          </Link>
        </li>,
        <li key="5">
          <button
            className="btn waves-effect waves-light #c62828 red darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/login');
              M.toast({
                html: 'Logout success',
                classes: '#c62828 red darken-1',
              });
            }}
            style={{
              borderRadius: '30px',
              marginLeft: '100px',
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/login" className="sidenav-close">
            Login
          </Link>
        </li>,
        <li key="7">
          <Link to="/signup" className="sidenav-close">
            Signup
          </Link>
        </li>,
      ];
    }
  };

  const fetchUser = (query) => {
    setSearch(query);
    if (query === '') {
      setUserDetails([]);
      return;
    }
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results.user);
        setUserDetails(results.user);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <nav style={{ boxShadow: 'none', maxWidth: '800px', margin: '0 auto' }}>
        <div className="nav-wrapper white">
          <Link to={state ? '/' : '/login'} className="brand-logo left">
            Instagram
          </Link>
          <a
            href="#"
            data-target="mobile-demo"
            className="sidenav-trigger right"
          >
            <i className="material-icons">menu</i>
          </a>
          <ul
            className="right hide-on-med-and-down"
            style={{ marginRight: '20px' }}
          >
            {renderList()}
          </ul>
        </div>

        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: 'black' }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search User"
              value={search}
              onChange={(e) => fetchUser(e.target.value)}
              ref={searchFocus}
            />
            <ul class="collection clear">
              {userDetails.map((data) => {
                return (
                  <Link
                    to={
                      data._id !== state._id
                        ? '/profile/' + data._id
                        : '/profile'
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                    }}
                    style={{
                      backgroundColor: 'white',
                      borderBottom: '1px solid lightgrey',
                    }}
                  >
                    <li class="collection-item">{data.email}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              href="#!"
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => {
                setUserDetails([]);
                setSearch('');
              }}
            >
              Close
            </button>
          </div>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo" style={{ paddingTop: '30px' }}>
        {renderList()}
      </ul>
    </>
  );
};

export default Navbar;
