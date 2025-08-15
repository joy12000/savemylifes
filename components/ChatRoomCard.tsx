import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Lock, MessageSquare, User } from '@/components/icons';

interface ChatRoom {
  id: string;
  friend: {
    name: string;
    avatar?: string;
  };
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  unlocked: boolean;
  checkInCount: number;
  requiredCheckIns: number;
}

interface ChatRoomCardProps {
  chatRoom: ChatRoom;
  onPress: () => void;
}

export function ChatRoomCard({ chatRoom, onPress }: ChatRoomCardProps) {
  const progress = (chatRoom.checkInCount / chatRoom.requiredCheckIns) * 100;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !chatRoom.unlocked && styles.lockedCard
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            !chatRoom.unlocked && styles.lockedAvatar
          ]}>
            <User size={24} color="#FFFFFF" />
          </View>
          {!chatRoom.unlocked && (
            <View style={styles.lockBadge}>
              <Lock size={12} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.friendName}>{chatRoom.friend.name}</Text>
          
          {chatRoom.unlocked ? (
            <>
              {chatRoom.lastMessage && (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chatRoom.lastMessage}
                </Text>
              )}
              {chatRoom.lastMessageTime && (
                <Text style={styles.messageTime}>
                  {chatRoom.lastMessageTime.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.lockMessage}>
                생존신고 {chatRoom.checkInCount}/{chatRoom.requiredCheckIns}회
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${Math.min(progress, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {chatRoom.requiredCheckIns - chatRoom.checkInCount}회 남음
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.rightSection}>
          {chatRoom.unlocked && chatRoom.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chatRoom.unreadCount}</Text>
            </View>
          )}
          
          {chatRoom.unlocked ? (
            <MessageSquare size={20} color="#10B981" />
          ) : (
            <Lock size={20} color="#9CA3AF" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  lockedCard: {
    backgroundColor: '#F9FAFB',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedAvatar: {
    backgroundColor: '#9CA3AF',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  lockMessage: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  unreadText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});