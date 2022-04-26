import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAViU_ny7AR0bb9K7eDDgV3-VZD7vytXLI",
    authDomain: "login-1-d426e.firebaseapp.com",
    projectId: "login-1-d426e",
    storageBucket: "login-1-d426e.appspot.com",
    messagingSenderId: "837139097066",
    appId: "1:837139097066:web:85e58e6fec43c969ef3e93"
  };
  
  // Initialize Firebase
  app.initializeApp(firebaseConfig);

  const db = app.firestore()
  const auth = app.auth()

  export {db, auth}

