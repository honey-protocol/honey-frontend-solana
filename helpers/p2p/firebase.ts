import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBX-c-_ia8sW8k2b0y4s2gYAGx9lt2tL3I',
  authDomain: 'p2p-contact-details.firebaseapp.com',
  projectId: 'p2p-contact-details',
  storageBucket: 'p2p-contact-details.appspot.com',
  messagingSenderId: '723735988088',
  appId: '1:723735988088:web:30086123ca29ef2c99aa8d',
  measurementId: 'G-G46R1YVFTX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const saveBorrowerContactDetails = async (
  nftMint: string,
  discord: string,
  telegram: string
) => {
  try {
    await setDoc(doc(firestore, 'borrower-details', nftMint), {
      discord,
      telegram,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBorrowerContactDetails = async (nftMint: string) => {
  const docRef = doc(firestore, 'borrower-details', nftMint);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      discord: data.discord,
      telegram: data.telegram,
    };
  } else {
    console.log('Borrower details not found');
    return {};
  }
};
