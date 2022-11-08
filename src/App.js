import React, { useRef, useState } from 'react';
import google_img from './assets/image/google/google-48.svg';
import rocket_53 from './assets/image/rocket/rocket-53.png';
import logo from './assets/image/icon8Color.svg';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAJMPfHzFGkEshuALktKKw955eliInRzxQ",
  authDomain: "react-chatgroup.firebaseapp.com",
  projectId: "react-chatgroup",
  storageBucket: "react-chatgroup.appspot.com",
  messagingSenderId: "61410856883",
  appId: "1:61410856883:web:254d4435e867977e0285c6"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className='header'>
        <div>
          {/* <img src={logo_img} alt="avatar" /> */}
          <img src={logo} alt="avatar" />
          <span className='name'>Group</span>
        </div>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <div className='sign-in'>
        <button onClick={signInWithGoogle}><img src={google_img} alt="google-logo" />&nbsp;&nbsp;Sign In with Google&nbsp;<img src={rocket_53} alt="rockets" /><img src={rocket_53} alt="rockets" /><img src={rocket_53} alt="rockets" /></button>
        <p>Respect the opinions of other users. Feel free to have a healthy debate, and keep the discussion objective and respectful. We want everyone to feel welcomed.</p>
      </div>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out&nbsp;&nbsp;<i class="fa-solid fa-arrow-right-from-bracket"></i></button>
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  return (
    <>
      <div className="chat-room">
        <main>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          <span ref={dummy}></span>
        </main>
      </div>
      <form className='form' onSubmit={sendMessage}>
        <div className="input-wrapper">
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Write a message..." />
        </div>
        <button className='button-send' type='submit' disabled={!formValue}><i className="fa-solid fa-paper-plane"></i></button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || `https://avatars.dicebear.com/api/personas/${uid}.svg`} alt='avatar' />
      <p>{text}</p>
    </div>
  </>)
}

export default App;

// https://avatars.dicebear.com/api/personas/harsh1x4.svg

// 'https://api.adorable.io/avatars/23/abott@adorable.png'