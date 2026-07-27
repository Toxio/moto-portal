# La Moto — Frontend MVP

Мотобарахолка для байкеров Украины и Европы. Frontend на React + Tailwind с mock-данными.

## Стек

- Vite + React 18 + TypeScript
- Tailwind CSS v4
- React Router v7
- Leaflet (карта)
- Framer Motion (анимации через CSS)

## Команды

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview
npm run lint         # ESLint
npm run lint:fix     # ESLint с автофиксом
npm run format       # Prettier — форматировать
npm run format:check # Prettier — проверить
npm run check        # lint + format:check
```

При коммите автоматически запускается **lint-staged** (ESLint + Prettier для изменённых файлов).

Рекомендуемые расширения VS Code: ESLint, Prettier (см. `.vscode/extensions.json`).

## Разделы

- **Главная** — hero, категории, premium-объявления
- **Объявления** — мотоциклы, запчасти, экипировка
- **Форум** — категории, темы, ответы
- **Карта** — байкеры онлайн/офлайн
- **События** — предстоящие и прошедшие
- **Энциклопедия** — каталог моделей
- **Профиль** — mock-авторизация

## Документация

- [ТЗ](.cursor/rules/la-moto-spec.mdc)
- [План разработки](docs/DEVELOPMENT_PLAN.md)
