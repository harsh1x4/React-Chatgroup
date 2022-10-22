import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

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
      <header>
        <h1>Chat</h1>
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
    <div>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
      <p>Respect the opinions of other users. Feel free to have a healthy debate, and keep the discussion objective and respectful. We want everyone to feel welcomed.</p>
      </div>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
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
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Write a message..." />
        <button type='submit' disabled={!formValue}><i class="fa fa-paper-plane" /></button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
