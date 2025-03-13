# AI 추천 및 음성 인식과 제스처 기반 레시피 서비스 푸띵(FoodThink)

![메인로고](https://github.com/user-attachments/assets/314dd4a6-0e16-42c6-8d5c-e4f0f628f2ff)


- 배포 URL: https://i12e107.p.ssafy.io/

## 프로젝트 소개

- 푸띵은 1인 가구의 증가와 요리에 미숙한 사람들을 위한 간단 레시피 참고 프로젝트입니다.
- 개인의 레시피를 등록할 수 있고, 피드를 작성하여 이용자들과 소통할 수 있습니다.
- 메뉴를 고를 때 고민된다면 AI의 간단한 질문에 답변하여 상황에 맞는 메뉴를 추천받을 수 있습니다.
- 기피 및 선호 식재료와 이외 다양한 카테고리의 선택으로 원하는 요리를 추천 받고 선택할 수 있습니다.
- 요리 도중, 음성과 손동작으로 요리 과정을 제어하며 위생 관리를 향상할 수 있습니다.

## 1. 개발 환경

- Infra : AWS EC2 / Docker / Jenkins / Nginx

- BackEnd : Spring Boot / JPA / Spring Security (JWT) / Spring GPT API / TTS / OpenAI Whisper / Dialogflow

- FrontEnd : React / PWA / MediaPipe

- 협업 및 기타 툴 : Jira / Git Lab / Notion / Postman / ERD Cloud

- 디자인: Figma

![푸띵_아키텍처_설계도](https://github.com/user-attachments/assets/b0f08a31-acf2-4899-bea8-88e86e1eb8ee)


## 2. 브랜치 전략

- Git-flow 전략을 기반으로 master, develop 브랜치와 feature, style, hotfix 보조 브랜치를 운용했습니다.

  - master 브랜치는 배포 단계에서만 사용하는 브랜치입니다.

  - develop 브랜치는 개발 단계에서 git-flow의 master 역할을 하는 브랜치입니다.

  - feature, style, hotfix 브랜치는 기능 단위로 독립적인 개발 환경을 위하여 사용하고 merge 후 각 브랜치를 삭제해주었습니다.

## 3. 프로젝트 구조

```
├── README.md
├── exec
├── Jenkinsfile
├── docker-compose.yml
├── package-lock.json
└── BE
    └── src/main
        ├── java/com/ssafy/foodthink
            ├── elasticsearch
            ├── feed
            ├── foodRecommend
            ├── global
            ├── myOwnRecipe
            ├── recipeBookmark
            ├── recipes
            ├── speech
            ├── subscribe
            ├── todayRecommend
            ├── user
            ├── webCrawling
            └── FoodThinkApplication.java
        └── resources
            └── application.properties
        ├── Dockerfile
        └── pom.xml
├── FE
    └── public
    └── src
        ├── components
        ├── contexts
        ├── data
        ├── pages
        ├── styles
        ├── App.css
        ├── App.jsx
        ├── index.css
        └── main.jsx
    ├── Dockerfile
    ├── index.html
    ├── nginx.conf
    ├── package-lock.json
    ├── package.json
    └── vite/config.js
```
## 4. ERD

![푸띵_ERD](https://github.com/user-attachments/assets/b165c5f0-b68f-4d90-a2d1-d89a8386a9cf)

## 5. 역할 분담

### 강혜경

- 기능
  - AI 추천, 오늘 뭐 먹지, 선호도, 구독, 마이페이지(회원정보관리, 레시피, 북마크, 피드), 레시피 수정
- UI
  - 레시피 메인, 레시피 디테일, 레시피 작성, AI 추천, 오늘 뭐 먹지, 선호도, 마이페이지, 웹 튜토리얼
  - 반응형 웹

### 박민제

- 기능
  - 레시피 메인, 레시피 검색 결과, 레시피 카테고리 필터 및 최신순/북마크순/조회순 필터링, 요리 과정(제스쳐), 레시피 수정, 북마크,
- UI
  - 요리 과정 전반

### 정승국

- 기능
  - SNS, 요리 과정(음성인식), 제스쳐 및 음성인식 최적화
- UI
  - 홈 화면, SNS 메인, SNS 디테일, SNS 작성 / 수정 / 삭제, 레시피 디테일, 조리 과정 process

### 최정원

- 기능
  - 웹 크롤링 및 데이터 정제, 요리과정(음성인식), 레시피 CRUD
- UI
  - SNS 피드 메인, SNS 피드 작성/수정, 전체 버튼
  - 반응형 웹

### 윤유빈

- 기능
  - 인프라 구축, CI/CD
  - 엘라스틱서치, 레시피/SNS 피드 검색 성능 향상, SNS 피드 CRUD, 구독
- UI
  - 사이드바, 버튼, 메인페이지
- UCC 제작

### 김태영

- 기능
  - AI 요리 추천, 소셜로그인, 오늘 뭐 먹지, 회원정보관리 CRUD, 레시피 북마크 CRUD, 레시피 조회수 CR
- UI
  - 레시피 작성/수정, 메인페이지, 오늘 뭐 먹지, 전체 페이지 폰트

## 6. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간: 2025-01-13 ~ 2025-02-21
- 프로젝트 기획: 2025-01-13 ~ 2025-01-19
- 기능 구현: 2025-01-20 ~ 2025-02-07
- UI 구현: 2025-02-07 ~ 2025-02-14
- 테스팅 및 리펙토링: 2025-02-15 ~ 2025-02-21

### 작업 관리

- Jira, GitLab, Notion을 사용하여 진행 상황을 공유했습니다.
- 일간 스크럼 / 주간 스프린트를 진행하며 작업 순서와 방향성에 대한 고민을 나누고 Notion에 회의 내용을 기록했습니다.

## 7. 페이지별 기능

[홈 화면]

- 레시피 목록, 오늘 뭐 먹지, AI요리 추천, SNS 피드를 클릭하면 페이지로 이동할 수 있습니다.
- 사이드 토글을 클릭하면, 로그인한 사용자는 레시피 작성, SNS 피드 작성, AI 요리 추천 페이지로 이동할 수 있습니다.
![홈_화면](https://github.com/user-attachments/assets/f1fc9bda-1507-4dbf-a056-aa84b8fa4c58)

[로그인]
- 사이드바를 클릭하면 로그인 버튼을 클릭하여 로그인 페이지로 이동합니다.
- 사용자는 소셜로그인으로 빠른 시간에 회원가입 및 로그인을 할 수 있습니다.
- 신규사용자의 경우, 푸띵 서비스의 튜토리얼을 확인할 수 있고 사용자는 선호/기피 재료를 선택할 수 있습니다.

[레시피]
- 레시피 메인 페이지
  - 카테고리 / 최신순 / 북마크순 / 조회순 으로 필터링하며 그에 따른 데이터들이 카드 형식으로 나열됩니다.
  - 오른쪽 상단의 (+) 버튼을 누르면 로그인 사용자에 한하여 레시피 작성을 할 수 있습니다.
- 레시피 상세페이지
  - 재료와 조리 순서, 관련된 피드를 확인할 수 있습니다.
  - 레시피 북마크 기능을 사용하여 마음에 드는 레시피를 저장해 둘 수 있습니다. 
  - 요리 시작 버튼을 눌러 하단의 "요리 과정"기능을 실행할 수 있습니다.
  - 로그인 사용자에 한하여 직접 작성한 게시글을 수정하거나 삭제할 수 있습니다.

![카테고리_선택](https://github.com/user-attachments/assets/8cc900d5-e030-47a2-839a-2faafc799aa5)

[검색 페이지]

- 레시피 목록페이지나 홈 화면에서 검색바에 원하는 레시피에 원하는 재료, 레시피 제목을 입력하면 레시피 검색 페이지로 이동되면 실시간 검색으로 레시피 목록을 최신순으로 확인할 수 있습니다.
![엘라스틱_서치](https://github.com/user-attachments/assets/23a76551-2201-4b43-9a66-755b4ce6e080)

[요리 과정]
- 사용자는 요리 과정중에 타이머 조작, 요리 과정 전/후 넘기기, 다시 읽어주기를 음성인식으로 요리 과정에 도움을 줄 수 있습니다.
![음성인식_타이머_설정_](https://github.com/user-attachments/assets/06fc2dc6-6eeb-4193-bdb7-ef9480d21a73)

[AI 추천]

- 로그인한 사용자는 메인 페이지의 AI 요리추천 버튼이나 사이드바에 있는 AI 추천받기를 클릭하면 AI 요리 추천 받기를 시작할 수 있습니다. 
- 푸띵이의 질문에 따라 사용자는 자신의 상황(기분)에 맞게 응답할 수 있습니다.
  이때, 사용자는 원하지 않는 질문이라면 다음 질문으로 넘어갈 수 있고, 바로 추천받을 수 있습니다.
- 사용자의 활동 정보와 응답한 내용을 기반으로 3가지의 요리를 추천받을 수 있습니다.
- 추천 받은 요리를 클릭하면 해당 요리에 대한 재료, 조리과정을 확인할 수 있습니다. 
![AI_요리추천](https://github.com/user-attachments/assets/362223bb-8e3c-4c3a-9f24-467b1bd5b521)

[오늘 뭐 먹지]

- 메인 페이지의 AI 요리추천 버튼을 클릭하면 오늘 뭐먹지 모달창이 나타납니다.
- 사용자는 랜덤으로 요리를 추천받을 수 있습니다.
- 새로고침 버튼을 클릭하면 다른 요리를 랜덤으로 추천받을 수 있습니다.
![오늘_뭐_먹지](https://github.com/user-attachments/assets/8328a168-ef85-4e04-8d5d-05e069b0b28e)

[SNS]

- 사용자가 자신이 만든 요리의 사진과 레시피를 피드에 올려 다른 사용자와 공유하고 소통할 수 있는 기능을 제공합니다.
- 레시피 상세 페이지로 이동하면 피드 좋아요, 댓글을 작성할 수 있습니다.
- 참조한 레시피가 있는 경우 해당 레시피로 바로 이동하여 레시피를 확인가능합니다.
![SNS_예시_엘라스틱_서치_포함_](https://github.com/user-attachments/assets/80185191-efbf-47c3-b734-cf6f131d312a)

[마이 페이지]

- 사용자가 작성한 레시피, 피드, 북마크한 레시피 목록을 제공합니다.
- 프로필 사진, 닉네임, 프로필 배경, 선호/기피 재료를 수정할 수 있습니다.
- 사용자가 구독한 타 사용자의 목록을 확인할 수 있습니다.
- 사용자가 서비스 회원탈퇴를 원하는 경우 회원탈퇴 버튼을 통해 회원탈퇴할 수 있습니다.
![마이_페이지](https://github.com/user-attachments/assets/445c8eda-306b-47b4-9575-df7c33d215ab)

## 8. 개선 목표

- 제스쳐 및 음성인식 기능 최적화

- 정확도 향상을 위한 데이터 확장
