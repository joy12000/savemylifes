import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MoveVertical as MoreVertical, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle } from '@/components/icons';

interface Friend {
  id: string;
  name: string;
  status: 'safe' | 'overdue' | 'missing';
  lastCheckIn: Date;
  checkInCount: number;
}

interface FriendCardProps {
  friend: Friend;
  onRemove: () => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const getStatusIcon = () => {
    switch (friend.status) {
      case 'safe':
        return <CheckCircle size={16} color="#10B981" />;
      case 'overdue':
        return <Clock size={16} color="#F59E0B" />;
      case 'missing':
        return <AlertTriangle size={16} color="#EF4444" />;
    }
  };

  const getStatusColor = () => {
    switch (friend.status) {
      case 'safe':
        return '#F0FDF4';
      case 'overdue':
        return '#FFFBEB';
      case 'missing':
        return '#FEF2F2';
    }
  };

  const showOptions = () => {
    Alert.alert(
      friend.name,
      '선택하세요',
      [
        { text: '취소', style: 'cancel' },
        { text: '친구 삭제', style: 'destructive', onPress: onRemove }
      ]
    );
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diff = now.getTime() - friend.lastCheckIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <View style={[styles.card, { backgroundColor: getStatusColor() }]}>
      <View style={styles.cardContent}>
        <View style={styles.friendInfo}>
          <View style={styles.friendAvatar}>
            <Text style={styles.avatarText}>
              {friend.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.friendDetails}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <View style={styles.statusRow}>
              {getStatusIcon()}
              <Text style={styles.lastCheckInText}>
                {getTimeAgo()}에 신고
              </Text>
            </View>
            <Text style={styles.checkInCountText}>
              총 {friend.checkInCount}회 신고
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.optionsButton} onPress={showOptions}>
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  friendDetails: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  lastCheckInText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  checkInCountText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  optionsButton: {
    padding: 8,
  },
});