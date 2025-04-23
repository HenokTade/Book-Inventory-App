const firebaseConfig = {
  apiKey: "AIzaSyAVNSuX9F514lV639wdmdrE1M8TbpxEdLI",
  authDomain: "book-app-82028.firebaseapp.com",
  projectId: "book-app-82028",
  storageBucket: "book-app-82028.appspot.com",
  messagingSenderId: "719476182260",
  appId: "1:719476182260:web:68064c3c91a4b586d3a2a1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Enable offline data persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("Persistence is not supported by this browser or environment.");
    }
  });
