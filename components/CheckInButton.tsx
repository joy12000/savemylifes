import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Heart, CircleCheck as CheckCircle } from '@/components/icons';

interface CheckInButtonProps {
  onPress: () => void;
  canCheckIn: boolean;
  lastCheckIn: Date | null;
}

export function CheckInButton({ onPress, canCheckIn, lastCheckIn }: CheckInButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          canCheckIn ? styles.activeButton : styles.disabledButton
        ]}
        onPress={onPress}
        disabled={!canCheckIn}
        activeOpacity={0.8}>
        
        {canCheckIn ? (
          <Heart size={32} color="#FFFFFF" fill="#FFFFFF" />
        ) : (
          <CheckCircle size={32} color="#FFFFFF" />
        )}
        
        <Text style={styles.buttonText}>
          {canCheckIn ? '생존신고하기' : '오늘 신고 완료'}
        </Text>
        
        {canCheckIn && (
          <Text style={styles.buttonSubtext}>
            친구들에게 안전함을 알려주세요
          </Text>
        )}
      </TouchableOpacity>
      
      {!canCheckIn && lastCheckIn && (
        <Text style={styles.nextCheckInText}>
          내일 다시 신고할 수 있습니다
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    minWidth: 200,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  disabledButton: {
    backgroundColor: '#6B7280',
    shadowColor: '#6B7280',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 4,
    textAlign: 'center',
  },
  nextCheckInText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
});