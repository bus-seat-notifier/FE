# 🚌 버스표 알리미 (Bus Seat Alert)

버스표 빈자리를 실시간으로 모니터링하고 알림을 받을 수 있는 React Native 앱입니다.

## ✨ 주요 기능

- **노선 선택**: 출발지와 도착지를 선택하여 원하는 버스 노선 설정
- **시간 선택**: 출발 시간대를 선택하여 알림 받을 시간 설정
- **카카오 로그인**: 간편한 소셜 로그인으로 사용자 인증
- **알림 설정**: 빈자리 개수와 알림 방법(푸시/이메일) 설정
- **실시간 모니터링**: 설정한 조건에 맞는 빈자리 발생 시 즉시 알림
- **알림 관리**: 활성/비활성 상태 변경 및 삭제 기능.

## 🛠 기술 스택

- **React Native** - 크로스 플랫폼 모바일 앱 개발
- **TypeScript** - 타입 안전성과 개발 생산성 향상
- **Expo** - 빠른 개발과 배포를 위한 플랫폼
- **React Navigation** - 화면 간 네비게이션
- **Expo Linear Gradient** - 아름다운 그라데이션 UI

## 📱 화면 구성

1. **시작 화면 (WelcomeScreen)**: 앱 소개 및 시작 버튼
2. **노선 선택 (RouteSelectionScreen)**: 출발지/도착지/날짜 선택
3. **시간 선택 (TimeSelectionScreen)**: 출발 시간대 선택
4. **로그인 (LoginScreen)**: 카카오 로그인
5. **알림 설정 (AlertSetupScreen)**: 빈자리 개수 및 알림 방법 설정
6. **홈 (HomeScreen)**: 알림 목록 및 관리
7. **프로필 (ProfileScreen)**: 사용자 정보 및 설정

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js (v14 이상)
- npm 또는 yarn
- Expo CLI

### 설치 방법

1. **저장소 클론**
```bash
git clone [repository-url]
cd BusSeatAlert
```

2. **의존성 설치**
```bash
npm install
```

3. **앱 실행**
```bash
npm start
```

4. **모바일에서 테스트**
   - Expo Go 앱을 스마트폰에 설치
   - QR 코드를 스캔하여 앱 실행

## 📁 프로젝트 구조

```
BusSeatAlert/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── screens/            # 화면 컴포넌트
│   │   ├── WelcomeScreen.tsx
│   │   ├── RouteSelectionScreen.tsx
│   │   ├── TimeSelectionScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── AlertSetupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/         # 네비게이션 설정
│   │   └── AppNavigator.tsx
│   ├── services/           # API 서비스
│   ├── types/              # TypeScript 타입 정의
│   └── utils/              # 유틸리티 함수
├── App.tsx                 # 메인 앱 컴포넌트
├── package.json
└── README.md
```

## 🎨 UI/UX 특징

- **그라데이션 배경**: 보라색 계열의 아름다운 그라데이션
- **직관적인 인터페이스**: 사용자가 쉽게 이해할 수 있는 UI
- **반응형 디자인**: 다양한 화면 크기에 대응
- **부드러운 애니메이션**: 화면 전환 시 자연스러운 애니메이션

## 🔧 개발 환경 설정

### 개발 도구
- **VS Code** - 코드 에디터
- **Expo DevTools** - 개발 도구
- **React Native Debugger** - 디버깅 도구

### 코드 스타일
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript** - 타입 체크

## 📋 TODO

- [ ] 실제 버스 API 연동
- [ ] 카카오 로그인 SDK 연동
- [ ] 푸시 알림 구현
- [ ] 이메일 알림 서비스 연동
- [ ] 백엔드 서버 구축
- [ ] 데이터베이스 설계
- [ ] 크롤링 서비스 구현
- [ ] 알림 히스토리 기능
- [ ] 다크 모드 지원
- [ ] 다국어 지원

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**버스표 알리미**와 함께 편리한 버스 여행을 경험해보세요! 🚌✨
