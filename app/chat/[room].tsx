
import React, { useEffect, useRef, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { useApi } from '@/lib/api';

type Msg = { id: string; userId: string; text: string; ts: number };

export default function ChatRoom() {
  const { room } = useLocalSearchParams<{ room: string }>();
  const { authedFetch } = useApi();
  const [text, setText] = useState('');
  const [items, setItems] = useState<Msg[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await authedFetch(`/.netlify/functions/chat-list?room=${room}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (!alive) return;
        setItems(data.items ?? []);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 0);
      }
    })();
    return () => { alive = false; };
  }, [room]);

  useEffect(() => {
    if (Platform.OS !== 'web') return; // SSE는 웹만
    const es = new EventSource(`/sse/${room}`);
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data) as Msg;
        setItems((prev) => {
          if (prev.some(p => p.id === msg.id)) return prev;
          const next = [...prev, msg].slice(-100);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 0);
          return next;
        });
      } catch {}
    };
    return () => es.close();
  }, [room]);

  async function send() {
    if (!text.trim()) return;
    await authedFetch('/.netlify/functions/chat-post', {
      method: 'POST',
      body: JSON.stringify({ room, text }),
    });
    setText('');
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: String(room || 'chat') }} />
      <ScrollView ref={scrollRef} style={styles.list}>
        {items.map(m => (
          <View key={m.id} style={styles.msg}>
            <Text style={styles.meta}>{new Date(m.ts).toLocaleString()} · {m.userId}</Text>
            <Text style={styles.body}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} placeholder="메시지 입력"
          style={styles.input} />
        <TouchableOpacity onPress={send} style={styles.btn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>보내기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { flex: 1, padding: 12 },
  msg: { paddingVertical: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
  meta: { fontSize: 12, color: '#6b7280' },
  body: { fontSize: 16 },
  composer: { flexDirection: 'row', gap: 8, padding: 12, borderTopColor: '#eee', borderTopWidth: 1 },
  input: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  btn: { backgroundColor: '#10B981', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }
});
