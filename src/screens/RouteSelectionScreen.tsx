import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RouteSelectionScreenProps {
  navigation: any;
}

const RouteSelectionScreen: React.FC<RouteSelectionScreenProps> = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // 주요 도시 목록 (실제로는 API에서 가져올 데이터)
  const cities = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '수원', '고양', '용인', '성남', '부천', '안산', '안양', '남양주',
    '평택', '시흥', '김포', '하남', '이천', '안성', '의왕', '과천',
    '구리', '군포', '오산', '양평', '여주', '포천', '동두천', '가평',
    '연천', '양주', '파주', '고양', '의정부', '구리', '남양주', '하남',
  ];

  const handleNext = () => {
    if (!departure || !arrival) {
      Alert.alert('알림', '출발지와 도착지를 모두 선택해주세요.');
      return;
    }
    if (departure === arrival) {
      Alert.alert('알림', '출발지와 도착지는 다르게 선택해주세요.');
      return;
    }
    
    navigation.navigate('TimeSelection', {
      departure,
      arrival,
      date: selectedDate,
    });
  };

  const selectCity = (city: string, type: 'departure' | 'arrival') => {
    if (type === 'departure') {
      setDeparture(city);
    } else {
      setArrival(city);
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
        <Text style={styles.headerTitle}>노선 선택</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 출발지 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>출발지</Text>
          <View style={styles.selectedCityContainer}>
            <Text style={styles.selectedCityText}>
              {departure || '출발지를 선택해주세요'}
            </Text>
          </View>
          <View style={styles.cityGrid}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityButton,
                  departure === city && styles.selectedCityButton,
                ]}
                onPress={() => selectCity(city, 'departure')}
              >
                <Text
                  style={[
                    styles.cityButtonText,
                    departure === city && styles.selectedCityButtonText,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 도착지 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>도착지</Text>
          <View style={styles.selectedCityContainer}>
            <Text style={styles.selectedCityText}>
              {arrival || '도착지를 선택해주세요'}
            </Text>
          </View>
          <View style={styles.cityGrid}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityButton,
                  arrival === city && styles.selectedCityButton,
                ]}
                onPress={() => selectCity(city, 'arrival')}
              >
                <Text
                  style={[
                    styles.cityButtonText,
                    arrival === city && styles.selectedCityButtonText,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 날짜 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>날짜</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD 형식으로 입력"
            placeholderTextColor="#999"
            value={selectedDate}
            onChangeText={setSelectedDate}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!departure || !arrival) && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!departure || !arrival}
          >
            <Text style={styles.nextButtonText}>다음</Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  selectedCityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  selectedCityText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cityButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedCityButton: {
    backgroundColor: 'white',
  },
  cityButtonText: {
    color: 'white',
    fontSize: 14,
  },
  selectedCityButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default RouteSelectionScreen;
