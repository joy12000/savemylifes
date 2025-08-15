import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ChatRoomCard } from '@/components/ChatRoomCard';
import { mockData } from '@/data/mockData';

export default function ChatScreen() {
  const router = useRouter();
  const [chatRooms] = useState(mockData.chatRooms);

  const handleChatPress = (chatRoom: any) => {
    if (!chatRoom.unlocked) {
      Alert.alert(
        '채팅 잠금',
        `${chatRoom.friend.name}님과 ${chatRoom.requiredCheckIns - chatRoom.checkInCount}회 더 생존신고를 주고받으면 채팅이 열립니다.`,
        [{ text: '확인' }]
      );
      return;
    }

    // Navigate to chat room
    Alert.alert('채팅방', `${chatRoom.friend.name}님과의 채팅방으로 이동합니다.`);
  };

  const unlockedChats = chatRooms.filter(room => room.unlocked);
  const lockedChats = chatRooms.filter(room => !room.unlocked);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>채팅</Text>
          <Text style={styles.subtitle}>생존신고로 열리는 안전한 소통</Text>
        </View>

        {/* Unlocked Chats */}
        {unlockedChats.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="message-square" size={20} color="#10B981" /
              <Text style={styles.sectionTitle}>활성 채팅 ({unlockedChats.length})</Text>
            </View>
            {unlockedChats.map((chatRoom) => (
              <ChatRoomCard
                key={chatRoom.id}
                chatRoom={chatRoom}
                onPress={() => handleChatPress(chatRoom)}
              />
            ))}
          </View>
        )}

        {/* Locked Chats */}
        {lockedChats.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="lock" size={20} color="#F59E0B" /
              <Text style={styles.sectionTitle}>잠금 채팅 ({lockedChats.length})</Text>
            </View>
            <Text style={styles.sectionDescription}>
              더 많은 생존신고를 통해 채팅을 잠금 해제하세요
            </Text>
            {lockedChats.map((chatRoom) => (
              <ChatRoomCard
                key={chatRoom.id}
                chatRoom={chatRoom}
                onPress={() => handleChatPress(chatRoom)}
              />
            ))}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Feather name="award" size={24} color="#3B82F6" /
          <Text style={styles.infoTitle}>채팅 잠금 해제 방법</Text>
          <Text style={styles.infoText}>
            친구와 서로 10회 이상 생존신고를 주고받으면 채팅 기능이 활성화됩니다. 
            꾸준한 안전 확인을 통해 더 깊은 소통을 시작하세요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoSection: {
    margin: 24,
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#3730A3',
    textAlign: 'center',
    lineHeight: 20,
  },
});