# EK Pyogo Rush

10초 안에 EK 표고버섯을 연타해서 키우는 모바일 16:9 웹게임 프로토타입입니다.

## Features

- 10초 제한시간 라운드
- 스테이지가 오를수록 증가하는 목표 터치 수
- 목표치에 가까워질수록 커지는 버섯
- 터치마다 반응하는 하이퍼팝 클럽 조명, 스파크, 말풍선 효과
- 모바일 연타를 위한 더블탭 확대 방지 설정

## Run Locally

```bash
npm run start
```

Then open:

```text
http://127.0.0.1:4174/
```

No build step is required. The app is plain HTML, CSS, and JavaScript.

## Structure

```text
.
├── assets/
│   ├── ek_1.png
│   └── ek_2smile.png
├── game.js
├── index.html
└── styles.css
```

## Deploy

This project can be served directly from the repository root with GitHub Pages.
