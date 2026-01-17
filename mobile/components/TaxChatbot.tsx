import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ================= Types ================= */

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type N8NResponse = {
  output?: string;
  text?: string;
  message?: string;
};

/* ================= Component ================= */

export default function TaxChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI tax assistant. Ask me anything about deductions, ITR filing, or tax savings.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://YOUR_API_URL/api/tax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "tax-chat-session",
          chatInput: userMsg.content,
        }),
      });

      const data: N8NResponse = await res.json();
      const reply =
        data.output || data.text || data.message || "I couldn't understand that.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrapper}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#059669" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Tax Assistant</Text>
          <View style={styles.onlineRow}>
            <View style={styles.dot} />
            <Text style={styles.onlineText}>Always online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageRow,
              m.role === "user" ? styles.right : styles.left,
            ]}
          >
            {m.role === "assistant" && (
              <View style={styles.avatarBot}>
                <Ionicons name="sparkles-outline" size={14} color="#fff" />
              </View>
            )}

            <View
              style={[
                styles.bubble,
                m.role === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  m.role === "user" && { color: "#fff" },
                ]}
              >
                {m.content}
              </Text>
              <Text style={styles.time}>
                {m.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageRow, styles.left]}>
            <View style={styles.avatarBot}>
              <Ionicons name="sparkles-outline" size={14} color="#fff" />
            </View>
            <View style={styles.botBubble}>
              <ActivityIndicator size="small" color="#059669" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about taxes, deductions, ITR..."
          style={styles.input}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && { opacity: 0.4 },
          ]}
        >
          <Ionicons name="send-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 20,
  },

  header: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },

  onlineText: {
    fontSize: 11,
    color: "#64748B",
  },

  messages: {
    padding: 16,
    paddingBottom: 10,
  },

  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
    gap: 8,
  },

  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },

  avatarBot: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
  },

  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 18,
  },

  botBubble: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  userBubble: {
    backgroundColor: "#0F172A",
  },

  text: {
    fontSize: 14,
    color: "#0F172A",
    lineHeight: 20,
  },

  time: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "right",
  },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
});
