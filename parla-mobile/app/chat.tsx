import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};



export default function ChatScreen() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
 
const hasMessages = messages.length > 0;
  const handleSubmit = () => {
  if (!input.trim()) return;

  const newMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: input,
  };

  setMessages(prev => [...prev, newMessage]);

  setInput(''); // 🔥 clears input
};

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
    <SafeAreaView style={styles.container}>
{/* Header */}
      <View style={styles.header}>
  <Ionicons name="menu" size={26} color="#fff" />
  <Text style={styles.heading}>Ask AI</Text>
  <View style={{ width: 26 }} /> 
</View>
  <View style={styles.content}>
  {messages.length === 0 ? (
    <View style={styles.emptyState}>
      <Ionicons 
        name="chatbubble-ellipses-outline"
        size={64}
        color="#6B6B6B"
        style={styles.icon}
      />

      <Text style={styles.title}>
        Practice your language skills
      </Text>

      <Text style={styles.subtitle}>
        Get instant explanations, break down sentences,
        and build your vocabulary as you chat.
      </Text>
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
  {messages.map((msg) => (
    <View
      key={msg.id}
      style={[
        styles.bubble,
        msg.role === 'user'
          ? styles.userBubble
          : styles.assistantBubble,
      ]}
    >
      <Text style={styles.bubbleText}>
        {msg.content}
      </Text>
    </View>
  ))}
</View>
    </View>
  )}
</View>

<View style={styles.inputContainer}>
  <View style={styles.inputBar}>
    
    {/* Left Plus Button */}
    <TouchableOpacity style={styles.iconLeft}>
      <Feather name="plus" size={22} color="#aaa" />
    </TouchableOpacity>

    {/* Text Input */}
    <TextInput
  value={input}
  onChangeText={setInput}
  placeholder="Ask anything"
  placeholderTextColor="#8E8E93"
  style={styles.textInput}
  onSubmitEditing={handleSubmit}
/>

    {/* Mic Icon */}
    <TouchableOpacity style={styles.iconRight}>
      <Feather name="mic" size={20} color="#aaa" />
    </TouchableOpacity>

    {/* Voice Circle Button */}
   <TouchableOpacity
  style={styles.voiceButton}
  onPress={handleSubmit}
>
  <Ionicons name="arrow-up" size={20} color="#000" />
</TouchableOpacity>

  </View>
</View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
  flexDirection: 'row',
  alignItems: 'center',

  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 12,
},

heading: {
  color: '#fff',
  fontSize: 20,
  fontWeight: '600',
  marginLeft: 12,  // 👈 spacing from menu icon
},
icon: {
  marginBottom: 20,
},
  content: {
    flex: 1,
    justifyContent: 'center',
    
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
  paddingHorizontal: 16,
  paddingBottom: 10,
},

inputBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1C1C1E',
  borderRadius: 28,
  paddingHorizontal: 14,
  paddingVertical: 10,
},

iconLeft: {
  marginRight: 8,
},

textInput: {
  flex: 1,
  color: 'white',
  fontSize: 16,
},

iconRight: {
  marginHorizontal: 8,
},

voiceButton: {
  backgroundColor: '#fff',
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
},
  placeholder: {
    color: '#8E8E93',
  },
  bubble: {
  maxWidth: '80%',
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderRadius: 18,
  marginBottom: 10,
},

userBubble: {
  alignSelf: 'flex-end',
  backgroundColor: '#1C1C1E', // user bubble
},

assistantBubble: {
  alignSelf: 'flex-start',
  backgroundColor: '#1C1C1E', // assistant bubble
},

bubbleText: {
  color: '#fff',
  fontSize: 16,
},

});