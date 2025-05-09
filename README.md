# MJU Smart Login

> 명지대학교 통합 로그인 자동화 크롬 확장 프로그램  
> 사용자의 Google UID를 기반으로 AES 암호화를 적용하여 안전한 자동 로그인을 지원합니다.

---

## 📦 기능 소개

- 명지대학교 [SSO 포털](https://sso1.mju.ac.kr/login.do) 자동 로그인
- 비밀번호는 **사용자 UID 기반 AES-GCM 256bit로 암호화**하여 안전하게 저장
- `chrome.storage.local`을 사용하여 로컬 저장소에 ID/비밀번호 저장
- 자동 로그인 토글 스위치 제공
- 로컬 환경에 설치 가능 (웹스토어 등록 미포함)

---

## 🔐 보안 구조

- 사용자의 Google UID를 기반으로 `PBKDF2`로 파생한 고유 AES 키 생성
- 매 로그인 시 `iv`를 랜덤 생성하여 암호문 다변화
- 비밀번호는 복호화 없이 외부에서 절대 열람 불가
- `chrome.identity` API로 UID와 email 추출 (popup에서만)

---

## 🚀 설치 방법

1. 이 저장소를 다운로드하거나 ZIP으로 압축 해제  
2. `chrome://extensions` 접속 후 `개발자 모드` 활성화  
3. "압축해제된 확장 프로그램 로드" 클릭  
4. 프로젝트 폴더 선택 후 설치 완료

---

## 🛠 사용 방법

1. 아이디와 비밀번호 입력 후 `저장하기` 버튼 클릭  
2. "자동 로그인 설정" 스위치를 켜면 로그인 페이지 접속 시 자동 입력 및 로그인 수행  
3. 로그인 페이지(`https://sso1.mju.ac.kr/login.do`) 접속 시 content script가 실행되어 자동 입력

---

## 🔧 개발 기술

| 구성 요소 | 기술 |
|-----------|------|
| UI        | HTML, CSS, JS (모듈 없이 전역 스코프 사용) |
| 보안      | Web Crypto API (AES-GCM + PBKDF2 + SHA-256) |
| 스토리지 | `chrome.storage.local` |
| 계정 정보 | `chrome.identity.getProfileUserInfo()` |

---

## 🔒 권한 설명

| 권한 | 목적 |
|------|------|
| `identity` | 사용자 UID 기반 암호화 키 생성 |
| `identity.email` | 로그인 UI 자동 입력을 위한 이메일 사용 |
| `storage` | 암호화된 로그인 정보 저장 |
| `host_permissions` | `https://sso1.mju.ac.kr/*` 로그인 페이지 자동 제어를 위한 접근 허용 |