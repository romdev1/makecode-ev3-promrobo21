
# promrobo21 — расширение MakeCode EV3

Расширение для программирования LEGO EV3 на соревнованиях.  
Содержит блоки для движения по линии (PID), навигации по графу, поворотов и работы с датчиками.

---

## Установка

### BrickCode (рекомендуется)

1. Открыть [https://beta.brickcode.org](https://beta.brickcode.org)
2. Нажать **Новый проект**
3. Нажать **Расширения** (шестерёнка → Расширения)
4. Вставить URL форка: `https://github.com/romdev1/makecode-ev3-promrobo21`
5. Нажать **Импорт**

### MakeCode (legacy)

1. Открыть [https://makecode.mindstorms.com/](https://makecode.mindstorms.com/)
2. **Новый проект** → **Расширения** → вставить URL

---

## Движение по линии — PIDConfig

Вместо отдельных переменных Kp/Ki/Kd/Kf/v — один объект `PIDConfig` для каждого режима.

| Объект | Режим |
|--------|-------|
| `motions.cfgCrossIntersection2S` | до перекрёстка, два датчика |
| `motions.cfgLeftIntersection`    | до левого перекрёстка, правый датчик |
| `motions.cfgRightIntersection`   | до правого перекрёстка, левый датчик |
| `motions.cfgDist2S`              | на расстояние, два датчика |
| `motions.cfgDistLeft`            | на расстояние, левый датчик |
| `motions.cfgDistRight`           | на расстояние, правый датчик |

**Пример изменения параметров:**
```typescript
motions.cfgCrossIntersection2S.v  = 60;   // скорость
motions.cfgCrossIntersection2S.Kp = 0.5;  // пропорциональный
motions.cfgCrossIntersection2S.Kd = 0.1;  // дифференциальный
```

---

## Навигация — быстрый старт

### Прямоугольная сетка (большинство трасс)

```typescript
// Строим граф 5×5 с шагом 300 мм — одной строкой!
navigation.buildGridGraph(5, 5, 300);

// Стартуем из левого нижнего угла (строка 4, столбец 0), смотрим вправо
navigation.initNavigation(navigation.nodeAt(4, 0), 0);

// Ищем кратчайший путь в центр (строка 2, столбец 2)
const path = navigation.algorithmDijkstra(
    navigation.nodeAt(4, 0),
    navigation.nodeAt(2, 2)
);
```

**Нумерация узлов сетки 5×5:**
```
col:  0   1   2   3   4
row0:[ 0]-[ 1]-[ 2]-[ 3]-[ 4]
      |    |    |    |    |
row1:[ 5]-[ 6]-[ 7]-[ 8]-[ 9]
      |    |    |    |    |
row2:[10]-[11]-[12]-[13]-[14]  ← nodeAt(2,2) = 12
      |    |    |    |    |
row3:[15]-[16]-[17]-[18]-[19]
      |    |    |    |    |
row4:[20]-[21]-[22]-[23]-[24]  ← nodeAt(4,0) = 20 (старт)
```

### Разные шаги по горизонтали и вертикали

```typescript
navigation.buildGridGraphCustomStep(7, 3, 400, 300);
// 7 столбцов, 3 строки, горизонталь 400мм, вертикаль 300мм
```

### Нестандартный граф (произвольные рёбра)

```typescript
navigation.setNodesCount(6);
navigation.buildGraph([
    navigation.createPath(0, 1, NavDirection.RightLeft, 300),
    navigation.createPath(1, 2, NavDirection.RightLeft, 500),
    navigation.createPath(0, 3, NavDirection.UpDown,    300),
]);
```

---

## Алгоритмы поиска пути

| Функция | Когда использовать |
|---------|-------------------|
| `algorithmDijkstra(start, finish)` | Взвешенный граф, нужен кратчайший по расстоянию |
| `algorithmBFS(start, finish)`      | Невзвешенный, кратчайший по числу узлов |
| `algorithmDFS(start, finish)`      | Любой путь (проверка связности) |

---

## Редактировать этот проект

```
git clone https://github.com/romdev1/makecode-ev3-promrobo21.git
```

#### Метаданные (для PXT/gh-pages)

* for PXT/ev3
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
