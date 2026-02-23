import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};



export default function ChatScreen() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const handleNewChat = () => {
  setMessages([]);
};
 const flatListRef = useRef<FlatList>(null);
const hasMessages = messages.length > 0;
const [isLoading, setIsLoading] = useState(false);
const insets = useSafeAreaInsets();
const [keyboardOpen, setKeyboardOpen] = useState(false);

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
  const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

const handleSubmit = async () => {
  if (!input.trim()) return;

  Keyboard.dismiss(); // 👈 closes keyboard immediately

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: input,
  };

  setMessages(prev => [...prev, userMessage]);

  const currentInput = input;
  setInput("");
  setIsLoading(true);
  try {
    const response = await fetch("http://192.168.0.19:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          { role: "user", content: currentInput },
        ],
      }),
    });

    const data = await response.json();

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: data.content,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);

  } catch (err) {
    console.error("Chat error:", err);
  }
};
useEffect(() => {
  flatListRef.current?.scrollToEnd({ animated: true });
}, [messages]);
  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={0}
>
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
{/* Header */}
      <View style={styles.header}>
  
  {/* Left side */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name="menu" size={26} color="#fff" />
    <Text style={styles.heading}>Ask AI </Text>
  </View>

  {/* Right side */}
  <TouchableOpacity onPress={handleNewChat} style={{ padding: 6 }}>
    <Ionicons name="create-outline" size={24} color="#fff" />
  </TouchableOpacity>

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
    <FlatList
  ref={flatListRef}
  data={isLoading ? [...messages, { id: "typing", role: "assistant", content: "..." }] : messages}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  }}
renderItem={({ item }) => {
  if (item.role === "user") {
    return (
      <View style={[styles.bubble, styles.userBubble]}>
        <Text style={styles.bubbleText}>{item.content}</Text>
      </View>
    );
  }

  // Assistant message (no bubble)
  return (
    <View style={styles.assistantContainer}>
      <Text style={styles.assistantText}>
        {item.content}
      </Text>
    </View>
  );
}}
/>
  )}
</View>

<View style={[styles.inputContainer, { paddingBottom: keyboardOpen ? 15: insets.bottom + 13 }]}>
  
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
  multiline
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
  justifyContent: 'space-between', // 👈 THIS is key
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
    
    paddingHorizontal: 0,
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
assistantContainer: {
  paddingHorizontal: 16,
  paddingVertical: 12,
},

assistantText: {
  color: "#fff",
  fontSize: 16,
  lineHeight: 22,
},

});