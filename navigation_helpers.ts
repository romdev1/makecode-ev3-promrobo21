namespace navigation {

    // ── Хелперы для упрощённого задания графа ─────────────────────────────────

    /**
     * Получить индекс узла в сетке по номеру строки и столбца.
     * Нумерация строк и столбцов начинается с 0.
     * Например, для сетки 5×5: nodeAt(0, 0) = 0, nodeAt(1, 2) = 7.
     * @param row строка (от 0), eg: 0
     * @param col столбец (от 0), eg: 0
     */
    //% blockId="NavigationNodeAt"
    //% block="node at row $row col $col"
    //% block.loc.ru="узел строка $row столбец $col"
    //% inlineInputMode="inline"
    //% weight="95"
    //% group="Хелперы"
    export function nodeAt(row: number, col: number): number {
        return row * gridCols + col;
    }

    // Внутренняя переменная: количество столбцов последней построенной сетки
    // Нужна для того, чтобы nodeAt знал ширину сетки
    let gridCols: number = 1;

    /**
     * Построить граф прямоугольной сетки cols × rows автоматически.
     * Все рёбра двусторонние. Горизонтальные рёбра — RightLeft, вертикальные — UpDown.
     * Узлы нумеруются построчно слева-направо сверху-вниз:
     *   0  1  2  3  4
     *   5  6  7  8  9
     *  10 11 12 13 14  (для сетки 3×5)
     *
     * @param cols количество столбцов (ширина), eg: 5
     * @param rows количество строк (высота), eg: 5
     * @param stepMm расстояние между узлами в мм, eg: 300
     */
    //% blockId="NavigationBuildGridGraph"
    //% block="build grid graph $cols cols $rows rows step $stepMm mm"
    //% block.loc.ru="построить граф сетки $cols столбцов $rows строк шаг $stepMm мм"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Хелперы"
    export function buildGridGraph(cols: number, rows: number, stepMm: number) {
        if (cols <= 0 || rows <= 0 || stepMm <= 0) {
            console.log("buildGridGraph: неверные параметры (cols/rows/stepMm должны быть > 0)");
            return;
        }

        gridCols = cols; // сохраняем для nodeAt

        const total = cols * rows;
        setNodesCount(total); // инициализирует матрицы

        const paths: NavPath[] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const from = r * cols + c;

                // Горизонтальное ребро вправо (→)
                if (c + 1 < cols) {
                    const to = r * cols + (c + 1);
                    paths.push(createPath(from, to, NavDirection.RightLeft, stepMm));
                }

                // Вертикальное ребро вниз (↓)
                if (r + 1 < rows) {
                    const to = (r + 1) * cols + c;
                    paths.push(createPath(from, to, NavDirection.UpDown, stepMm));
                }
            }
        }

        buildGraph(paths);
        console.log(`buildGridGraph: ${cols}x${rows}, ${total} узлов, ${paths.length} рёбер`);
    }

    /**
     * Построить граф прямоугольной сетки cols × rows с разными шагами по горизонтали и вертикали.
     * @param cols количество столбцов, eg: 5
     * @param rows количество строк, eg: 3
     * @param hStepMm шаг по горизонтали в мм, eg: 400
     * @param vStepMm шаг по вертикали в мм, eg: 300
     */
    //% blockId="NavigationBuildGridGraphCustomStep"
    //% block="build grid graph $cols cols $rows rows h-step $hStepMm mm v-step $vStepMm mm"
    //% block.loc.ru="построить граф сетки $cols столбцов $rows строк шаг по горизонтали $hStepMm мм по вертикали $vStepMm мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Хелперы"
    export function buildGridGraphCustomStep(cols: number, rows: number, hStepMm: number, vStepMm: number) {
        if (cols <= 0 || rows <= 0 || hStepMm <= 0 || vStepMm <= 0) {
            console.log("buildGridGraphCustomStep: неверные параметры");
            return;
        }

        gridCols = cols;

        const total = cols * rows;
        setNodesCount(total);

        const paths: NavPath[] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const from = r * cols + c;

                // Горизонтальное ребро вправо
                if (c + 1 < cols) {
                    const to = r * cols + (c + 1);
                    paths.push(createPath(from, to, NavDirection.RightLeft, hStepMm));
                }

                // Вертикальное ребро вниз
                if (r + 1 < rows) {
                    const to = (r + 1) * cols + c;
                    paths.push(createPath(from, to, NavDirection.UpDown, vStepMm));
                }
            }
        }

        buildGraph(paths);
        console.log(`buildGridGraphCustomStep: ${cols}x${rows}, h=${hStepMm}mm v=${vStepMm}mm`);
    }

    /**
     * Инициализировать навигацию: установить стартовую позицию и направление.
     * Удобный однострочный хелпер вместо двух отдельных блоков.
     * @param startNode стартовый узел, eg: 0
     * @param startDirection начальное направление в градусах (0=вправо, 90=вниз, 180=влево, 270=вверх), eg: 0
     */
    //% blockId="NavigationInit"
    //% block="navigation start at node $startNode direction $startDirection°"
    //% block.loc.ru="навигация старт с узла $startNode направление $startDirection°"
    //% inlineInputMode="inline"
    //% weight="97"
    //% group="Хелперы"
    export function initNavigation(startNode: number, startDirection: number) {
        setCurrentPosition(startNode);
        setCurrentDirection(startDirection);
    }

}
