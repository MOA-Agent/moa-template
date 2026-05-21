# MOA 디자인 시스템 초기 설정

moa-design 스킬이 전제하는 환경을 세팅한다.
아래 명령들을 Claude가 직접 순서대로 실행한다.

## 1. 패키지 설치

아래 명령을 실행한다.

```bash
npm install @moa-admin/design-system lucide-react
npx shadcn@latest init --defaults
```

shadcn은 `--defaults` 플래그로 비대화형 실행한다 (Style: Default, Base color: Zinc, CSS variables: Yes).

## 2. moa-design 스킬 등록

아래 명령을 실행한다.

```bash
cp -r node_modules/@moa-admin/design-system/. .claude/skills/moa-design/
```

## 3. app/globals.css

```css
@import '@moa-admin/design-system/index.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 4. tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--alias-color-primary-normal)',
          strong: 'var(--alias-color-primary-strong)',
          heavy: 'var(--alias-color-primary-heavy)',
        },
        label: {
          normal: 'var(--alias-color-label-normal)',
          neutral: 'var(--alias-color-label-neutral)',
          alternative: 'var(--alias-color-label-alternative)',
          disabled: 'var(--alias-color-label-disabled)',
        },
        line: {
          normal: 'var(--alias-color-line-normal)',
          strong: 'var(--alias-color-line-strong)',
        },
        status: {
          positive: 'var(--alias-color-status-positive)',
          cautionary: 'var(--alias-color-status-cautionary)',
          negative: 'var(--alias-color-status-negative)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-4)',
        md: 'var(--radius-8)',
        lg: 'var(--radius-12)',
        xl: 'var(--radius-16)',
        '2xl': 'var(--radius-24)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        normal: 'var(--alias-style-shadow-normal)',
        strong: 'var(--alias-style-shadow-strong)',
        heavy: 'var(--alias-style-shadow-heavy)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## 5. 완료 후 안내

```
✅ MOA 디자인 시스템 설정 완료!

설치된 것:
- @moa-admin/design-system (컬러, 타이포, 간격, 반경, 그림자 토큰)
- shadcn/ui
- lucide-react

디자인 시스템 업데이트 시: npm update @moa-admin/design-system
개발 중 UI 작업은 /moa-design 스킬을 활용하세요.
```
