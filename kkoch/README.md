# 프로젝트 설정

### vite 생성기

- npm create vite@latest
- project name: kkoch
- framework: React
- variant: TypeScript


### 추가설정
- npm i framer-motion : 애니메이션 라이브러리
- npm i react-router-dom : 라우터 추가
- @heroicons/react : tailwind에서 제공해주는 아이콘 라이브러리


### Dev Dependencies
- @types/node : path module 

### Tailwind css 적용하기
- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- tailwind.config.js 안 내용 수정
    ```
    /** @type {import('tailwindcss').Config} */
    export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    }
    ```
- index.css import하기
    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
- npm i -D prettier prettier-plugin-tailwindcss

### React 코드 컨벤션
- [노션 보러가기](https://www.notion.so/a4a/React-Code-Convention-25699f34f072436daeead48fd76be502)