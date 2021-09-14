import React from "react";
import callApi from '../services/CallAPI';
import CallAuthAPI from '../services/CallAuthAPI';

const TOKEN = 'TOKEN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

let UserStateContext = React.createContext();
let UserDispatchContext = React.createContext();

function UserProvider({ children }) {
  const [loginState, setLoginState] = React.useState({ isAuthenticated: false, profile: null });

  React.useEffect(() => {
    const fetchData = async () => {
      if (!loginState.isAuthenticated) {
        try {
          // console.log('user context')
          // console.log(loginState)
          const res = await CallAuthAPI('/user/profile', 'GET', null);
          // console.log(res.data)
          if (res) {
            setLoginState({ isAuthenticated: true, profile: res.data })
          } else {
            setLoginState({ isAuthenticated: false, profile: null })
          }
        } catch (err) {
          console.log(err)
          setLoginState({ isAuthenticated: false, profile: null })
        }
      }
    }
    fetchData();
  }, [loginState.isAuthenticated])

  // console.log(loginState)
  return (
    <UserStateContext.Provider value={loginState}>
      <UserDispatchContext.Provider value={setLoginState}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

function loginUser(dispatch, username, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!username && !!password) {
    callApi('/user/login', 'POST', { username, password })
      .then(res => {
        localStorage.setItem(TOKEN, res.data.token)
        setError(false);
        setIsLoading(false);
        dispatch({ isAuthenticated: LOGIN_SUCCESS });
      })
      .catch(err => {
        console.log(err)
        if (err.response) {
          setError(err.response.data.err);
        } else {
          setError("Login fail!");
        }
        setIsLoading(false);
      })
  } else {
    setError(true);
    setIsLoading(false);
  }
}

function logoutUser(dispatch, history) {
  localStorage.removeItem(TOKEN);
  dispatch({ type: LOGOUT_SUCCESS, user: null });
  history.push("/");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, logoutUser };
