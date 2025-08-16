import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoginScreenProps {
  navigation: any;
  route: {
    params: {
      departure: string;
      arrival: string;
      date: string;
      time: string;
    };
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const { departure, arrival, date, time } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    
    try {
      // 실제 카카오 로그인 구현
      // 여기서는 시뮬레이션을 위해 2초 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 로그인 성공 후 알림 설정 화면으로 이동
      navigation.navigate('AlertSetup', {
        departure,
        arrival,
        date,
        time,
        user: {
          id: 'user123',
          name: '홍길동',
          email: 'hong@example.com',
        },
      });
    } catch (error) {
      Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
        <Text style={styles.headerTitle}>로그인</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
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
          </View>
        </View>

        {/* 로그인 설명 */}
        <View style={styles.loginInfo}>
          <Text style={styles.loginTitle}>알림을 받으려면 로그인이 필요합니다</Text>
          <Text style={styles.loginDescription}>
            카카오 계정으로 간편하게 로그인하고{'\n'}
            빈자리 알림을 받아보세요!
          </Text>
        </View>

        {/* 카카오 로그인 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.kakaoButton, isLoading && styles.disabledButton]}
            onPress={handleKakaoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FEE500" />
            ) : (
              <>
                <Text style={styles.kakaoIcon}>🎯</Text>
                <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 개인정보 처리방침 */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            로그인 시{' '}
            <Text style={styles.privacyLink}>개인정보 처리방침</Text>
            {' '}및{' '}
            <Text style={styles.privacyLink}>이용약관</Text>
            에 동의하게 됩니다.
          </Text>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  infoContainer: {
    marginTop: 20,
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
  loginInfo: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  loginDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(254, 229, 0, 0.5)',
  },
  kakaoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  kakaoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C1E1E',
  },
  privacyContainer: {
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyLink: {
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
