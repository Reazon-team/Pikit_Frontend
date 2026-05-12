<div align="center">

# 🎨 Pikit Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.5-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Zustand-1F2937?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"/>
</p>

<p align="center">
  <strong>인스타그램 AI 이미지 프롬프트 아카이브 - 프론트엔드</strong>
</p>

<p align="center">
  <a href="https://pikit.life">🌐 Live Demo</a> ·
  <a href="https://github.com/Reazon-team/Pikit_Backend">⚙️ Backend Repo</a> ·
  <a href="#-시작하기">🚀 시작하기</a>
</p>

</div>

---

## 📖 소개

**Pikit**은 인스타그램에서 인기 있는 AI 생성 이미지의 **프롬프트를 모아두고 공유**하는 아카이브 플랫폼입니다.

크리에이터들이 직접 만든 프롬프트와 결과 이미지를 한 곳에서 모아볼 수 있고, **before/after 슬라이더**로 원본과 AI 변환 결과를 비교할 수 있습니다.

<br/>

## ✨ 주요 기능

### 🎯 핵심 기능
- 🖼️ **프롬프트 갤러리** - AI 이미지 프롬프트 모음 (12개 시드 데이터)
- 🔀 **Before/After 슬라이더** - 원본과 결과 비교 인터랙티브 뷰
- 🔐 **인증 시스템** - JWT 기반 회원가입 / 로그인 / 자동 토큰 갱신
- ❤️ **상호작용** - 좋아요 / 북마크 / 복사 카운트
- 📊 **정렬** - 최신순 / 인기순 토글

### 🎨 디자인
- **다크 테마** + **네온 그린(#4CFF91)** 포인트 컬러
- **터미널 / 코드 에디터** 스타일 UX
- **JetBrains Mono** + **Pretendard** 타이포그래피

<br/>

## 🛠 기술 스택

| 분야 | 기술 |
|---|---|
| **Framework** | Next.js 16.2.5 (App Router, Static Export) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State** | Zustand (with persist) |
| **HTTP** | Fetch API + Custom Client |
| **Icons** | Lucide React |
| **Deployment** | Cloudflare Pages |

<br/>

## 📁 프로젝트 구조

```
Pikit_Frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 갤러리 페이지
│   │   ├── login/page.tsx     # 로그인 페이지
│   │   ├── signup/page.tsx    # 회원가입 페이지
│   │   ├── layout.tsx         # 전역 레이아웃
│   │   └── globals.css        # 전역 스타일
│   │
│   ├── components/             # 재사용 컴포넌트
│   │   ├── Header.tsx         # 상단 헤더
│   │   ├── PromptCard.tsx     # 프롬프트 카드
│   │   └── BeforeAfterSlider.tsx  # 비교 슬라이더
│   │
│   ├── lib/                    # 유틸리티
│   │   ├── api.ts             # API 클라이언트
│   │   └── auth.ts            # 인증 헬퍼
│   │
│   ├── store/                  # 상태 관리
│   │   └── authStore.ts       # 인증 스토어 (Zustand)
│   │
│   └── types/                  # TypeScript 타입
│       └── index.ts
│
├── public/                     # 정적 자산
├── next.config.ts             # Next.js 설정 (Static Export)
├── tailwind.config.ts         # Tailwind 설정
└── package.json
```

<br/>

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+
- npm 또는 pnpm

### 설치

```bash
# 1. 레포지토리 클론
git clone https://github.com/Reazon-team/Pikit_Frontend.git
cd Pikit_Frontend

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.local.example .env.local
```

### 환경변수 설정

`.env.local` 파일에 다음 내용을 추가:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> 프로덕션 환경에서는 `https://pikit-backend-5nnb.onrender.com` 사용

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
```

`out/` 폴더에 정적 파일 생성됨 (Cloudflare Pages 배포용)

<br/>

## 🌐 배포

### Cloudflare Pages

본 프로젝트는 **Cloudflare Pages**에 자동 배포됩니다.

| 설정 | 값 |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npx next build` |
| Build output directory | `out` |
| Production branch | `main` |

**환경변수**:
```
NEXT_PUBLIC_API_URL=https://pikit-backend-5nnb.onrender.com
```

`main` 브랜치에 push하면 자동으로 빌드 + 배포됩니다.

<br/>

## 🎨 디자인 시스템

### 색상 팔레트

```css
--bg-primary: #0A0A0A      /* 배경 */
--bg-secondary: #141414    /* 카드 배경 */
--accent: #4CFF91          /* 네온 그린 (포인트) */
--text-primary: #FAFAFA    /* 메인 텍스트 */
--text-secondary: #888     /* 보조 텍스트 */
--border: #2A2A2A          /* 테두리 */
```

### 타이포그래피

- **헤더 / 코드**: JetBrains Mono
- **본문**: Pretendard

<br/>

## 🤝 백엔드 연동

이 프론트엔드는 **Pikit Backend** (Spring Boot)와 연동됩니다.

- 📦 [Backend Repository](https://github.com/Reazon-team/Pikit_Backend)
- 📚 API 문서: 백엔드 README 참고

<br/>