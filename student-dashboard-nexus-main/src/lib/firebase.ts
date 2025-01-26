import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    await createUserWithEmailAndPassword(auth, 'admin@123.com', 'admin@123');
    console.log('Admin user created successfully');
  } catch (error: any) {
    // If error is not "email-already-in-use", log it
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating admin user:', error);
    }
  }
};

// Call createAdminUser when the app initializes
createAdminUser();