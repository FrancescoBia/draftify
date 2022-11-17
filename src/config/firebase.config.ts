import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyCQSjLvkWIxLanzecsl_SdbyIUngvOPSjg',
	authDomain: 'journal-prod-2.firebaseapp.com',
	projectId: 'journal-prod-2',
	storageBucket: 'journal-prod-2.appspot.com',
	messagingSenderId: '1078150081537',
	appId: '1:1078150081537:web:e48f1a5e8475ca90062400',
}

const app = initializeApp(firebaseConfig)
const database = getFirestore(app)

// emulators
connectFirestoreEmulator(database, 'localhost', 8080)

export { database }
