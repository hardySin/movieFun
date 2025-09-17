import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, setDoc, getDocs, query, where, orderBy, Timestamp, DocumentData, QuerySnapshot, addDoc, serverTimestamp, deleteDoc, updateDoc, increment, getDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import {
  getAuth, Auth, signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, GoogleAuthProvider,
  GithubAuthProvider, FacebookAuthProvider, signInWithPopup, updateEmail, updatePassword, sendPasswordResetEmail, deleteUser, reauthenticateWithCredential, EmailAuthProvider
} from 'firebase/auth';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAnalytics, Analytics, logEvent } from 'firebase/analytics';
import { getPerformance, FirebasePerformance, trace } from 'firebase/performance';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// interfaces/comment.ts
export interface CommentData {
  id: string;
  userId: string;
  userName: string;
  userComment: string;
  movieId: string;
  timing: Date;
  likes: number;
  replies: number;
  likedBy?: string[];
  year?: number;
  month?: number;
  date?: number;
}

export interface ReplyData {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userComment: string;
  movieId: string;
  timing: Date;
  likes: number;
  likedBy?: string[];
  year?: number;
  month?: number;
  date?: number;
}

export interface LikeData {
  userId: string;
  timestamp: Date;
}

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  favoriteMovies?: string[];
  watchlist?: string[];
}

class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private storage: FirebaseStorage;
  private analytics: Analytics;
  private performance: FirebasePerformance;

  private googleProvider: GoogleAuthProvider;
  private githubProvider: GithubAuthProvider;
  private facebookProvider: FacebookAuthProvider;

  constructor(config: FirebaseConfig) {
    this.app = initializeApp(config);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);
    this.analytics = getAnalytics(this.app);
    this.performance = getPerformance(this.app);

    // Initialize auth providers
    this.googleProvider = new GoogleAuthProvider();
    this.githubProvider = new GithubAuthProvider();
    this.facebookProvider = new FacebookAuthProvider();

    // Add scopes if needed
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');

    console.log('Firebase initialized successfully');
  }

  // Auth Methods
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.logEvent('login', { method: 'email' });
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async socialLogin(provider: 'google' | 'github' | 'facebook'): Promise<User> {
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = this.googleProvider;
          break;
        case 'github':
          authProvider = this.githubProvider;
          break;
        case 'facebook':
          authProvider = this.facebookProvider;
          break;
        default:
          throw new Error('Unsupported provider');
      }

      const userCredential = await signInWithPopup(this.auth, authProvider);
      this.logEvent('login', { method: provider });
      return userCredential.user;
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.logEvent('logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Generate random name if not provided
      const userName = displayName || `User${Math.floor(Math.random() * 10000)}`;

      await updateProfile(user, {
        displayName: userName,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D6EFD&color=fff`
      });

      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        displayName: userName,
        email: user.email!,
        createdAt: new Date(),
        lastLogin: new Date(),
        favoriteMovies: [],
        watchlist: []
      });

      this.logEvent('sign_up', { method: 'email' });
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, updates);
    this.logEvent('update_profile');
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updateEmail(user, newEmail);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updatePassword(user, newPassword);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }


  async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    await setDoc(doc(this.db, "users", userId), {
      ...profile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(this.db, "users", userId);
    const docSnap = await getDocs(collection(this.db, "users"));

    const userDoc = docSnap.docs.find(d => d.id === userId);
    if (!userDoc) return null;

    const data = userDoc.data();
    return {
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      favoriteMovies: data.favoriteMovies || [],
      watchlist: data.watchlist || []
    };
  }

  async addToFavorites(movieId: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be logged in');

    const userProfile = await this.getUserProfile(user.uid);
    const updatedFavorites = [...(userProfile?.favoriteMovies || []), movieId];

    await setDoc(doc(this.db, "users", user.uid), {
      favoriteMovies: updatedFavorites
    }, { merge: true });

    this.logEvent('add_to_favorites', { movieId });
  }

  async addToWatchlist(movieId: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be logged in');

    const userProfile = await this.getUserProfile(user.uid);
    const updatedWatchlist = [...(userProfile?.watchlist || []), movieId];

    await setDoc(doc(this.db, "users", user.uid), {
      watchlist: updatedWatchlist
    }, { merge: true });

    this.logEvent('add_to_watchlist', { movieId });
  }

  // Storage Methods
  async uploadUserPhoto(file: File): Promise<string> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User must be logged in');

    const storageRef = ref(this.storage, `users/${user.uid}/profile/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await this.updateUserProfile({ photoURL: downloadURL });
    return downloadURL;
  }

  // Analytics
  private logEvent(eventName: string, params?: { [key: string]: any }): void {
    logEvent(this.analytics, eventName, params);
  }

  // Performance Monitoring
  startTrace(name: string) {
    const t = trace(this.performance, name);
    t.start();
    return t;
  }

  // Error Handling
  getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  // Utility Methods
  async waitForAuthInitialization(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async addComment(userId: string, username: string, movieId: string, comment: string): Promise<string> {
    const commentData = {
      userId,
      userName: username,
      userComment: comment,
      movieId,
      timing: serverTimestamp(),
      likes: 0,
      replies: 0,
      likedBy: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate()
    };

    const docRef = await addDoc(collection(this.db, "comments"), commentData);
    return docRef.id;
  }

  // Add reply to comment
  async addReply(commentId: string, userId: string, username: string, movieId: string, replyText: string): Promise<string> {
    try {
      // Create reply in replies subcollection
      const repliesCollection = collection(this.db, "comments", commentId, "replies");
      const replyRef = doc(repliesCollection);

      const replyData = {
        id: replyRef.id,
        commentId,
        userId,
        userName: username,
        userComment: replyText,
        movieId,
        timing: serverTimestamp(),
        likes: 0,
        likedBy: [],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        date: new Date().getDate()
      };

      // Update comment reply count
      const commentRef = doc(this.db, "comments", commentId);
      updateDoc(commentRef, {
        replies: increment(1),
        lastUpdated: serverTimestamp()
      });

      // Add reply
      setDoc(replyRef, replyData);

      return replyRef.id;

    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  }

  // Toggle like on comment
  async toggleCommentLike(commentId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    try {
      const commentRef = doc(this.db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        throw new Error('Comment not found');
      }

      const data = commentDoc.data();
      const likedBy: string[] = data.likedBy || [];
      let likes = data.likes || 0;
      let liked = false;

      if (likedBy.includes(userId)) {
        // Remove like
        likes--;
        liked = false;
        updateDoc(commentRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      } else {
        // Add like
        likes++;
        liked = true;
        updateDoc(commentRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      }

      return { likes, liked };
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  }

  // Toggle like on reply
  async toggleReplyLike(commentId: string, replyId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    try {
      const replyRef = doc(this.db, "comments", commentId, "replies", replyId);
      const replyDoc = await getDoc(replyRef);

      if (!replyDoc.exists()) {
        throw new Error('Reply not found');
      }

      const data = replyDoc.data();
      const likedBy: string[] = data.likedBy || [];
      let likes = data.likes || 0;
      let liked = false;

      if (likedBy.includes(userId)) {
        // Remove like
        likes--;
        liked = false;
        updateDoc(replyRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      } else {
        // Add like
        likes++;
        liked = true;
        updateDoc(replyRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      }

      return { likes, liked };
    } catch (error) {
      console.error("Error toggling reply like:", error);
      throw error;
    }
  }

  // Get comments with replies
  async getCommentsWithReplies(movieId: string): Promise<{ comments: CommentData[]; replies: Map<string, ReplyData[]> }> {
    try {
      // Get comments
      const commentsQuery = query(
        collection(this.db, "comments"),
        where("movieId", "==", movieId),
      );

      const commentsSnapshot = await getDocs(commentsQuery);
      const comments: CommentData[] = [];
      const repliesMap = new Map<string, ReplyData[]>();

      for (const doc of commentsSnapshot.docs) {
        const data = doc.data();
        comments.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userComment: data.userComment,
          timing: data.timing?.toDate() || new Date(),
          movieId: data.movieId,
          likes: data.likes || 0,
          replies: data.replies || 0,
          likedBy: data.likedBy || [],
          year: data.year,
          month: data.month,
          date: data.date
        });

        // Get replies for this comment
        const repliesQuery = query(
          collection(this.db, "comments", doc.id, "replies"),
        );

        const repliesSnapshot = await getDocs(repliesQuery);
        const replies: ReplyData[] = [];

        repliesSnapshot.forEach((replyDoc) => {
          const replyData = replyDoc.data();
          replies.push({
            id: replyDoc.id,
            commentId: replyData.commentId,
            userId: replyData.userId,
            userName: replyData.userName,
            userComment: replyData.userComment,
            timing: replyData.timing?.toDate() || new Date(),
            movieId: replyData.movieId,
            likes: replyData.likes || 0,
            likedBy: replyData.likedBy || [],
            year: replyData.year,
            month: replyData.month,
            date: replyData.date
          });
        });

        repliesMap.set(doc.id, replies);
      }

      return { comments, replies: repliesMap };
    } catch (error) {
      console.error("Error fetching comments with replies:", error);
      throw error;
    }
  }

  // Get user's liked status for comments and replies
  async getUserLikeStatus(movieId: string, userId: string): Promise<{
    commentLikes: Map<string, boolean>;
    replyLikes: Map<string, boolean>;
  }> {
    const commentLikes = new Map<string, boolean>();
    const replyLikes = new Map<string, boolean>();

    try {
      // Get comments
      const commentsQuery = query(
        collection(this.db, "comments"),
        where("movieId", "==", movieId)
      );

      const commentsSnapshot = await getDocs(commentsQuery);

      for (const commentDoc of commentsSnapshot.docs) {
        const data = commentDoc.data();
        const likedBy: string[] = data.likedBy || [];
        commentLikes.set(commentDoc.id, likedBy.includes(userId));

        // Check replies for this comment
        const repliesQuery = query(
          collection(this.db, "comments", commentDoc.id, "replies")
        );

        const repliesSnapshot = await getDocs(repliesQuery);
        repliesSnapshot.forEach((replyDoc) => {
          const replyData = replyDoc.data();
          const replyLikedBy: string[] = replyData.likedBy || [];
          replyLikes.set(replyDoc.id, replyLikedBy.includes(userId));
        });
      }

      return { commentLikes, replyLikes };
    } catch (error) {
      console.error("Error fetching user like status:", error);
      return { commentLikes, replyLikes };
    }
  }
}



// Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  databaseURL: `${process.env.REACT_APP_FIREBASE_DATABASE_URL}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`,
};

// Create and export singleton instance
export const firebase = new FirebaseService(firebaseConfig);
export default firebase;