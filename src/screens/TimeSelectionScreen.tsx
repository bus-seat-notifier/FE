import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TimeSelectionScreenProps {
  navigation: any;
  route: {
    params: {
      departure: string;
      arrival: string;
      date: string;
    };
  };
}

const TimeSelectionScreen: React.FC<TimeSelectionScreenProps> = ({ navigation, route }) => {
  const { departure, arrival, date } = route.params;
  const [selectedTime, setSelectedTime] = useState('');

  // 시간대별 버스 스케줄 (실제로는 API에서 가져올 데이터)
  const timeSlots = [
    { time: '06:00', available: true, price: 15000 },
    { time: '07:00', available: true, price: 15000 },
    { time: '08:00', available: false, price: 15000 },
    { time: '09:00', available: true, price: 15000 },
    { time: '10:00', available: true, price: 15000 },
    { time: '11:00', available: false, price: 15000 },
    { time: '12:00', available: true, price: 15000 },
    { time: '13:00', available: true, price: 15000 },
    { time: '14:00', available: true, price: 15000 },
    { time: '15:00', available: false, price: 15000 },
    { time: '16:00', available: true, price: 15000 },
    { time: '17:00', available: true, price: 15000 },
    { time: '18:00', available: false, price: 15000 },
    { time: '19:00', available: true, price: 15000 },
    { time: '20:00', available: true, price: 15000 },
    { time: '21:00', available: true, price: 15000 },
    { time: '22:00', available: true, price: 15000 },
    { time: '23:00', available: true, price: 15000 },
  ];

  const handleNext = () => {
    if (!selectedTime) {
      Alert.alert('알림', '시간을 선택해주세요.');
      return;
    }
    
    navigation.navigate('Login', {
      departure,
      arrival,
      date,
      time: selectedTime,
    });
  };

  const selectTime = (time: string) => {
    const timeSlot = timeSlots.find(slot => slot.time === time);
    if (timeSlot && timeSlot.available) {
      setSelectedTime(time);
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
        <Text style={styles.headerTitle}>시간 선택</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          {departure} → {arrival}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>출발 시간을 선택하세요</Text>
        
        <View style={styles.timeGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              style={[
                styles.timeButton,
                selectedTime === slot.time && styles.selectedTimeButton,
                !slot.available && styles.unavailableTimeButton,
              ]}
              onPress={() => selectTime(slot.time)}
              disabled={!slot.available}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  selectedTime === slot.time && styles.selectedTimeButtonText,
                  !slot.available && styles.unavailableTimeButtonText,
                ]}
              >
                {slot.time}
              </Text>
              <Text
                style={[
                  styles.priceText,
                  selectedTime === slot.time && styles.selectedPriceText,
                  !slot.available && styles.unavailablePriceText,
                ]}
              >
                {slot.available ? `₩${slot.price.toLocaleString()}` : '매진'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTime && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedInfoText}>
              선택된 시간: {selectedTime}
            </Text>
            <Text style={styles.selectedInfoText}>
              가격: ₩{timeSlots.find(slot => slot.time === selectedTime)?.price.toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedTime && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!selectedTime}
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
  routeInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTimeButton: {
    backgroundColor: 'white',
    borderColor: '#667eea',
  },
  unavailableTimeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedTimeButtonText: {
    color: '#667eea',
  },
  unavailableTimeButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  priceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  selectedPriceText: {
    color: '#667eea',
  },
  unavailablePriceText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  selectedInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  selectedInfoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 30,
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

export default TimeSelectionScreen;
