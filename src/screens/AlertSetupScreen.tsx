import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/api';

interface AlertSetupScreenProps {
  navigation: any;
  route: {
    params: {
      departure: string;
      arrival: string;
      date: string;
      time: string;
      routeId: string;
      scheduleId: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

const AlertSetupScreen: React.FC<AlertSetupScreenProps> = ({ navigation, route }) => {
  const { departure, arrival, date, time, routeId, scheduleId, user } = route.params;
  const [targetSeats, setTargetSeats] = useState(1);
  const [pushNotification, setPushNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // 실제 서버에 알림 설정을 저장
      const alertData = {
        userId: user.id,
        routeId,
        scheduleId,
        targetSeats,
        pushNotification,
        emailNotification,
      };
      
      await apiService.createAlert(alertData);
      
      Alert.alert(
        '알림 설정 완료!',
        '빈자리가 생기면 즉시 알려드리겠습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('오류', '알림 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const increaseSeats = () => {
    if (targetSeats < 10) {
      setTargetSeats(targetSeats + 1);
    }
  };

  const decreaseSeats = () => {
    if (targetSeats > 1) {
      setTargetSeats(targetSeats - 1);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 선택한 정보 표시 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>선택한 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>노선:</Text>
              <Text style={styles.infoValue}>{departure} → {arrival}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>날짜:</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>시간:</Text>
              <Text style={styles.infoValue}>{time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>사용자:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          </View>
        </View>

        {/* 빈자리 개수 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 받을 빈자리 개수</Text>
          <View style={styles.seatSelector}>
            <TouchableOpacity
              style={styles.seatButton}
              onPress={decreaseSeats}
              disabled={targetSeats <= 1}
            >
              <Text style={styles.seatButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.seatDisplay}>
              <Text style={styles.seatNumber}>{targetSeats}</Text>
              <Text style={styles.seatLabel}>석</Text>
            </View>
            <TouchableOpacity
              style={styles.seatButton}
              onPress={increaseSeats}
              disabled={targetSeats >= 10}
            >
              <Text style={styles.seatButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.seatDescription}>
            {targetSeats}석 이상의 빈자리가 생기면 알림을 받습니다.
          </Text>
        </View>

        {/* 알림 방법 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 방법</Text>
          
          <View style={styles.notificationOption}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>푸시 알림</Text>
              <Text style={styles.notificationDescription}>
                앱에서 즉시 알림을 받습니다
              </Text>
            </View>
            <Switch
              value={pushNotification}
              onValueChange={setPushNotification}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={pushNotification ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.notificationOption}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>이메일 알림</Text>
              <Text style={styles.notificationDescription}>
                {user.email}로 이메일을 보냅니다
              </Text>
            </View>
            <Switch
              value={emailNotification}
              onValueChange={setEmailNotification}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={emailNotification ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 알림 설명 */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>📢 알림 안내</Text>
          <Text style={styles.noticeText}>
            • 빈자리가 생기면 즉시 알림을 받습니다{'\n'}
            • 알림은 24시간 동안 활성화됩니다{'\n'}
            • 원하는 시간에 언제든지 알림을 해제할 수 있습니다
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.completeButton, isLoading && styles.disabledButton]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            <Text style={styles.completeButtonText}>
              {isLoading ? '설정 중...' : '알림 설정 완료'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  seatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  seatButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  seatDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  seatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  seatLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  seatDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  noticeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  completeButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default AlertSetupScreen;
