import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Conversation, Message } from '../../types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
};

// Fetch conversations for a user
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef, 
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTimestamp', 'desc')
      );
      const conversationsSnapshot = await getDocs(q);
      const conversationsList = conversationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      
      return conversationsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch or create conversation between two users
export const fetchOrCreateConversation = createAsyncThunk(
  'chat/fetchOrCreateConversation',
  async ({ userId, otherUserId }: { userId: string; otherUserId: string }, { rejectWithValue }) => {
    try {
      // Check if conversation already exists
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef, 
        where('participants', 'array-contains', userId)
      );
      const conversationsSnapshot = await getDocs(q);
      
      let conversation = conversationsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Conversation)
        .find(conv => conv.participants.includes(otherUserId));
      
      // If conversation doesn't exist, create a new one
      if (!conversation) {
        const newConversation = {
          participants: [userId, otherUserId],
          lastMessage: '',
          lastMessageTimestamp: new Date(),
          unreadCount: 0
        };
        
        const docRef = await addDoc(collection(db, 'conversations'), newConversation);
        conversation = {
          id: docRef.id,
          ...newConversation
        };
      }
      
      return conversation;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch messages for a conversation
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef, 
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );
      const messagesSnapshot = await getDocs(q);
      const messagesList = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      return messagesList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ 
    conversationId, 
    senderId, 
    receiverId, 
    content 
  }: { 
    conversationId: string; 
    senderId: string; 
    receiverId: string; 
    content: string;
  }, { rejectWithValue }) => {
    try {
      // Create message
      const newMessage = {
        conversationId,
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
        isRead: false
      };
      
      const docRef = await addDoc(collection(db, 'messages'), newMessage);
      
      // Update conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageTimestamp: new Date(),
        unreadCount: 1 // Increment unread count for receiver
      });
      
      return {
        id: docRef.id,
        ...newMessage
      } as Message;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Mark messages as read
export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async ({ conversationId, userId }: { conversationId: string; userId: string }, { rejectWithValue }) => {
    try {
      // Get unread messages
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef, 
        where('conversationId', '==', conversationId),
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      );
      const messagesSnapshot = await getDocs(q);
      
      // Mark each message as read
      const updatePromises = messagesSnapshot.docs.map(doc => 
        updateDoc(doc.ref, { isRead: true })
      );
      await Promise.all(updatePromises);
      
      // Reset unread count in conversation
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, { unreadCount: 0 });
      
      // Return updated messages
      return messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isRead: true
      })) as Message[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch or create conversation
      .addCase(fetchOrCreateConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrCreateConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        
        // Add to conversations list if not already there
        const exists = state.conversations.some(conv => conv.id === action.payload.id);
        if (!exists) {
          state.conversations.push(action.payload);
        }
      })
      .addCase(fetchOrCreateConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
        
        // Update conversation
        if (state.currentConversation) {
          state.currentConversation.lastMessage = action.payload.content;
          state.currentConversation.lastMessageTimestamp = action.payload.timestamp;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark messages as read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update messages
        action.payload.forEach(updatedMessage => {
          const index = state.messages.findIndex(msg => msg.id === updatedMessage.id);
          if (index !== -1) {
            state.messages[index].isRead = true;
          }
        });
        
        // Update conversation
        if (state.currentConversation) {
          state.currentConversation.unreadCount = 0;
        }
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentConversation, 
  addMessage, 
  clearCurrentConversation, 
  clearError 
} = chatSlice.actions;

export default chatSlice.reducer;
