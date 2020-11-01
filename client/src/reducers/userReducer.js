export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === 'USER') {
    return action.payload;
  }
  if (action.type === 'CLEAR') {
    return null;
  }
  if (action.type === 'UPDATE') {
    if (state.following.includes(action.payload.following)) {
      return;
    }
    if (state.followers.includes(action.payload.followers)) {
      return;
    }
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === 'UPDATEPIC') {
    return {
      ...state,
      pic: action.payload.pic,
    };
  }
};
