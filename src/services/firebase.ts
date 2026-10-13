// Firebase Service with Seamless Offline/Local Storage Fallback
// Provides real Firebase Authentication and Firestore when configured,
// and zero-config local persistence when environment keys are absent.

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore'
import type { UserProfile, FarmDetails, RecommendationHistoryItem } from '../types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
  firebaseConfig.projectId
)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let firestoreInstance: Firestore | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    authInstance = getAuth(app)
    firestoreInstance = getFirestore(app)
    console.info('[CROPSY] Firebase initialized successfully with production credentials.')
  } catch (err) {
    console.warn('[CROPSY] Failed to initialize Firebase SDK, falling back to local storage provider:', err)
  }
} else {
  console.info('[CROPSY] Running with Local Storage Auth & Database provider (zero-config mode).')
}

// Local storage simulated database helpers
const LOCAL_STORAGE_USERS_KEY = 'cropsy_local_users'
const LOCAL_STORAGE_SESSION_KEY = 'cropsy_local_session'
const LOCAL_STORAGE_HISTORY_KEY = 'cropsy_local_history'
const LOCAL_STORAGE_FARM_KEY = 'cropsy_local_farm'

interface LocalUserRecord {
  uid: string
  email: string
  passwordHash: string
  profile: UserProfile
}

function getLocalUsers(): Record<string, LocalUserRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setLocalUsers(users: Record<string, LocalUserRecord>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Storage error', e)
  }
}

// ---------------- AUTH SERVICES ---------------- //

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<UserProfile> {
  if (authInstance) {
    try {
      const cred = await createUserWithEmailAndPassword(authInstance, email, pass)
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: displayName || email.split('@')[0],
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      }
      if (firestoreInstance) {
        await setDoc(doc(firestoreInstance, 'users', profile.uid), profile)
      }
      return profile
    } catch (error: any) {
      throw mapFirebaseError(error.code || error.message)
    }
  }

  // Local Storage fallback
  const users = getLocalUsers()
  if (users[email.toLowerCase()]) {
    throw new Error('Email already registered')
  }

  const uid = 'farmer_' + Math.random().toString(36).substring(2, 9)
  const profile: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  }

  users[email.toLowerCase()] = {
    uid,
    email,
    passwordHash: btoa(pass),
    profile,
  }
  setLocalUsers(users)
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile))
  return profile
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  if (authInstance) {
    try {
      const cred = await signInWithEmailAndPassword(authInstance, email, pass)
      let profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split('@')[0],
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      }

      if (firestoreInstance) {
        const snap = await getDoc(doc(firestoreInstance, 'users', cred.user.uid))
        if (snap.exists()) {
          profile = snap.data() as UserProfile
        }
      }
      return profile
    } catch (error: any) {
      throw mapFirebaseError(error.code || error.message)
    }
  }

  // Local Storage fallback
  const users = getLocalUsers()
  const user = users[email.toLowerCase()]
  if (!user) {
    throw new Error('Account not found')
  }
  if (user.passwordHash !== btoa(pass)) {
    throw new Error('Incorrect password')
  }

  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user.profile))
  return user.profile
}

export async function loginAsGuest(): Promise<UserProfile> {
  const guestProfile: UserProfile = {
    uid: 'guest_farmer_' + Math.random().toString(36).substring(2, 7),
    email: 'guest.farmer@cropsy.ag',
    displayName: 'Farmer Ramesh',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
    isGuest: true,
  }
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(guestProfile))
  return guestProfile
}

export async function logoutUser(): Promise<void> {
  if (authInstance) {
    try {
      await signOut(authInstance)
    } catch (e) {
      console.warn('Sign out warning:', e)
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY)
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (authInstance) {
    try {
      await sendPasswordResetEmail(authInstance, email)
      return
    } catch (error: any) {
      throw mapFirebaseError(error.code || error.message)
    }
  }

  const users = getLocalUsers()
  if (!users[email.toLowerCase()]) {
    throw new Error('Account not found')
  }
}

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
  if (authInstance) {
    return onAuthStateChanged(authInstance, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Farmer',
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
        }
        if (firestoreInstance) {
          try {
            const snap = await getDoc(doc(firestoreInstance, 'users', fbUser.uid))
            if (snap.exists()) {
              profile = snap.data() as UserProfile
            }
          } catch (e) {
            console.error('Failed to get Firestore user doc:', e)
          }
        }
        callback(profile)
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
        if (stored) {
          try {
            callback(JSON.parse(stored))
            return
          } catch {}
        }
        callback(null)
      }
    })
  }

  // Local storage observer
  const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY)
  if (stored) {
    try {
      callback(JSON.parse(stored))
    } catch {
      callback(null)
    }
  } else {
    callback(null)
  }
  return () => {}
}

// ---------------- FIRESTORE / DATA SERVICES ---------------- //

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (firestoreInstance) {
    try {
      await setDoc(doc(firestoreInstance, 'users', profile.uid), profile, { merge: true })
    } catch (e) {
      console.warn('Firestore user save fallback to localStorage:', e)
    }
  }
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile))
  const users = getLocalUsers()
  if (users[profile.email.toLowerCase()]) {
    users[profile.email.toLowerCase()].profile = profile
    setLocalUsers(users)
  }
}

export async function saveFarmDetails(uid: string, farm: FarmDetails): Promise<void> {
  if (firestoreInstance) {
    try {
      await setDoc(doc(firestoreInstance, 'farms', uid), farm, { merge: true })
    } catch (e) {
      console.warn('Firestore farm save fallback to localStorage:', e)
    }
  }
  localStorage.setItem(`${LOCAL_STORAGE_FARM_KEY}_${uid}`, JSON.stringify(farm))
}

export async function getSavedFarmDetails(uid: string): Promise<FarmDetails | null> {
  if (firestoreInstance) {
    try {
      const snap = await getDoc(doc(firestoreInstance, 'farms', uid))
      if (snap.exists()) {
        return snap.data() as FarmDetails
      }
    } catch (e) {
      console.warn('Firestore fetch farm error:', e)
    }
  }
  const raw = localStorage.getItem(`${LOCAL_STORAGE_FARM_KEY}_${uid}`)
  return raw ? JSON.parse(raw) : null
}

export async function saveRecommendationHistory(
  uid: string,
  item: Omit<RecommendationHistoryItem, 'id'>
): Promise<string> {
  const newItem: RecommendationHistoryItem = {
    ...item,
    id: 'rec_' + Date.now().toString(36),
  }

  if (firestoreInstance) {
    try {
      const ref = await addDoc(
        collection(firestoreInstance, 'users', uid, 'recommendations'),
        newItem
      )
      newItem.id = ref.id
    } catch (e) {
      console.warn('Firestore addDoc error, saving locally:', e)
    }
  }

  // Local storage history
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_KEY}_${uid}`)
    const list: RecommendationHistoryItem[] = raw ? JSON.parse(raw) : []
    list.unshift(newItem)
    // keep latest 25
    localStorage.setItem(
      `${LOCAL_STORAGE_HISTORY_KEY}_${uid}`,
      JSON.stringify(list.slice(0, 25))
    )
  } catch (e) {
    console.error('Local history save error:', e)
  }

  return newItem.id
}

export async function getRecommendationHistory(uid: string): Promise<RecommendationHistoryItem[]> {
  if (firestoreInstance) {
    try {
      const q = query(
        collection(firestoreInstance, 'users', uid, 'recommendations'),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({
          ...(d.data() as RecommendationHistoryItem),
          id: d.id,
        }))
      }
    } catch (e) {
      console.warn('Firestore history fetch error, using local storage:', e)
    }
  }

  const raw = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_KEY}_${uid}`)
  return raw ? JSON.parse(raw) : []
}

function mapFirebaseError(code: string): Error {
  switch (code) {
    case 'auth/invalid-email':
      return new Error('Invalid email')
    case 'auth/user-not-found':
      return new Error('Account not found')
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new Error('Incorrect password')
    case 'auth/email-already-in-use':
      return new Error('Email already registered')
    case 'auth/weak-password':
      return new Error('Weak password')
    case 'auth/network-request-failed':
      return new Error('Network error')
    default:
      return new Error(code || 'Authentication failed. Please try again.')
  }
}
