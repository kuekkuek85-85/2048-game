import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)

// 학교 네트워크는 WebSocket/gRPC 스트리밍을 막는 경우가 많아, 필요 시
// 자동으로 long-polling으로 전환하도록 설정한다.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
})
