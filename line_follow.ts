namespace motions {

    let lineRefThreshold = 50; // Среднее значение серого для определения границы линии
    let lineFollowRefThreshold = 40; // Пороговое значение определения заезда на перекрёсток
    let lineFollowSetPoint = lineRefThreshold; // Среднее значение серого (уставка) для движения по линии

    let lineFollowByOneSensorConditionMaxErr = 40; // Максимальная ошибка для определения, что робот движется по линии одним датчиком

    let lineFollowSearchTolerance = 10; // Допуск отклонения от уставки для пропуска поиска линии

    let steeringAtSearchLine = 25; // Подруливание при поиске линии для последущего движени одним датчиком

    let lineFollowLoopDt = 10; // Значение dt для циклов регулирования движения по линии и работы с датчиками линии

    let distRollingAfterIntersection = 30; // Дистанция для проезда после опредения перекрёстка для прокатки в мм
    let distContinueRollFromLineAfterIntersection = 20; // Дистанция прокатки на перекрёстке для съезда с него (линии) в мм

    // ── PID-конфиги для каждого режима движения по линии ──────────────────────
    // Вместо 35 отдельных переменных — 6 объектов. Каждый содержит v, Kp, Ki, Kd, Kf.

    export interface PIDConfig {
        v: number;   // скорость (мощность) движения
        Kp: number;  // пропорциональный коэффициент
        Ki: number;  // интегральный коэффициент
        Kd: number;  // дифференциальный коэффициент
        Kf: number;  // коэффициент фильтра дифференциального регулятора
    }

    // Движение по линии до перекрёстка двумя датчиками
    export let cfgCrossIntersection2S: PIDConfig = { v: 50, Kp: 0.4, Ki: 0, Kd: 0, Kf: 0 };
    // Движение по линии правым датчиком до перекрёстка слева
    export let cfgLeftIntersection: PIDConfig    = { v: 50, Kp: 0.7, Ki: 0, Kd: 0, Kf: 0 };
    // Движение по линии левым датчиком до перекрёстка справа
    export let cfgRightIntersection: PIDConfig   = { v: 50, Kp: 0.7, Ki: 0, Kd: 0, Kf: 0 };
    // Движение по линии на расстояние двумя датчиками
    export let cfgDist2S: PIDConfig              = { v: 50, Kp: 0.4, Ki: 0, Kd: 0, Kf: 0 };
    // Движение по линии на расстояние левым датчиком
    export let cfgDistLeft: PIDConfig            = { v: 50, Kp: 0.7, Ki: 0, Kd: 0, Kf: 0 };
    // Движение по линии на расстояние правым датчиком
    export let cfgDistRight: PIDConfig           = { v: 50, Kp: 0.7, Ki: 0, Kd: 0, Kf: 0 };

    // ── Обратная совместимость: старые имена → новые объекты ───────────────────
    // Позволяет params.ts и внешнему коду работать без изменений
    export let lineFollowCrossIntersection2SensorV:  number { get() { return cfgCrossIntersection2S.v;  } set(x) { cfgCrossIntersection2S.v  = x; } }
    export let lineFollowCrossIntersection2SensorKp: number { get() { return cfgCrossIntersection2S.Kp; } set(x) { cfgCrossIntersection2S.Kp = x; } }
    export let lineFollowCrossIntersection2SensorKi: number { get() { return cfgCrossIntersection2S.Ki; } set(x) { cfgCrossIntersection2S.Ki = x; } }
    export let lineFollowCrossIntersection2SensorKd: number { get() { return cfgCrossIntersection2S.Kd; } set(x) { cfgCrossIntersection2S.Kd = x; } }
    export let lineFollowCrossIntersection2SensorKf: number { get() { return cfgCrossIntersection2S.Kf; } set(x) { cfgCrossIntersection2S.Kf = x; } }

    export const pidLineFollow = new automation.PIDController(); // PID для регулирования движения по линии

    // Вспомогательная функция: применить PIDConfig к pidLineFollow (заменяет 5 одинаковых строк в каждой функции)
    function applyPIDConfig(cfg: PIDConfig, saturation: number = 200) {
        pidLineFollow.setGains(cfg.Kp, cfg.Ki, cfg.Kd);
        pidLineFollow.setDerivativeFilter(cfg.Kf);
        pidLineFollow.setControlSaturation(-saturation, saturation);
        pidLineFollow.setPoint(0);
        pidLineFollow.reset();
    }

    /**
     * Установить дистанцию проезда после определения перекрёстка для прокатки в мм.
     * @param dist дистанция прокатки после перекрёстка, eg: 50
     */
    //% blockId="SetDistRollingAfterIntersection"
    //% block="set distance $dist mm rolling after intersection"
    //% block.loc.ru="установить дистанцию $dist мм прокатки после перекрёстка"
    //% inlineInputMode="inline"
    //% weight="99" blockGap="8"
    //% group="Свойства движения"
    export function setDistRollingAfterIntersection(dist: number) {
        distRollingAfterIntersection = dist;
    }

    /**
     * Получить дистанцию проезда после определения перекрёстка для прокатки в мм.
     */
    //% blockId="GetDistRollingAfterIntersection"
    //% block="get distance rolling after intersection in mm"
    //% block.loc.ru="дистанция прокатки после перекрёстка в мм"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства движения"
    export function getDistRollingAfterIntersection(): number {
        return distRollingAfterIntersection;
    }

    // setDistRollingFromLineAfterIntersection / getDistRollingFromLineAfterIntersection удалены (deprecated)

    /**
     * Установить пороговое значение отражения для линии.
     * @param reflection значение отражения, eg: 50
     */
    //% blockId="SetLineRefThreshold"
    //% block="set reflection $reflection threshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения"
    //% inlineInputMode="inline"
    //% weight="89" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineRefThreshold(reflection: number) {
        lineRefThreshold = reflection;
    }

    /**
     * Получить пороговое значение отражения для линии.
     */
    //% blockId="GetLineRefThreshold"
    //% block="get reflection threshold"
    //% block.loc.ru="пороговое значение отражения"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Свойства для датчиков"
    export function getLineRefThreshold(): number {
        return lineRefThreshold;
    }

    /**
     * Установить пороговое значение отражения при движении по линии.
     * @param reflection значение отражения, eg: 40
     */
    //% blockId="SetLineFollowRefThreshold"
    //% block="set line follow $reflection reflection threshold"
    //% block.loc.ru="установить пороговое значение $reflection отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="87" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowRefThreshold(reflection: number) {
        lineFollowRefThreshold = reflection;
    }

    /**
     * Получить пороговое значение отражения при движении по линии.
     */
    //% blockId="GetLineFollowRefThreshold"
    //% block="get line follow reflection threshold"
    //% block.loc.ru="пороговое значение отражения движения по линии"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Свойства для датчиков"
    export function getLineFollowRefThreshold(): number {
        return lineFollowRefThreshold;
    }

    /**
     * Установить уставку (среднее значение) отражения для движения по линии.
     * @param reflectionSetPoint значение уставки движения по линии, eg: 50
     */
    //% blockId="SetLineFollowSetPoint"
    //% block="set line follow set point $reflectionSetPoint reflection"
    //% block.loc.ru="установить уставку $reflectionSetPoint движения по линии"
    //% inlineInputMode="inline"
    //% weight="85" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowSetPoint(reflectionSetPoint: number) {
        lineFollowSetPoint = reflectionSetPoint;
    }

    /**
     * Получить уставку (среднее значение) отражения для движения по линии.
     */
    //% blockId="GetLineFollowSetPoint"
    //% block="get line follow set point"
    //% block.loc.ru="уставка движения по линии"
    //% inlineInputMode="inline"
    //% weight="84"
    //% group="Свойства для датчиков"
    export function getLineFollowSetPoint(): number {
        return lineFollowSetPoint;
    }

    /**
     * Установить максимальную ошибку условия движения одним датчиком по линии.
     * @param maxErr максимальное значение ошибки движения по линии, eg: 40
     */
    //% blockId="SetLineFollowOneSensorConditionMaxErr"
    //% block="set line follow max error $maxErr at moving by one sensor"
    //% block.loc.ru="установить максимальую ошибку $maxErr при движении одним датчиком"
    //% inlineInputMode="inline"
    //% weight="79" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowOneSensorConditionMaxErr(maxErr: number) {
        lineFollowByOneSensorConditionMaxErr = maxErr;
    }

    /**
     * Получить максимальную ошибку условия движения одним датчиком по линии.
     */
    //% blockId="GetLineFollowOneSensorConditionMaxErr"
    //% block="get line follow by one sensor max error"
    //% block.loc.ru="максимальая ошибка при движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="78"
    //% group="Свойства для датчиков"
    export function getLineFollowOneSensorConditionMaxErr(): number {
        return lineFollowByOneSensorConditionMaxErr;
    }

    /**
     * Установить dt для циклов регулирования при движении по линии.
     * @param dt время, за которое цикл регулирования должен выполняться, eg: 10
     */
    //% blockId="SetLineFollowLoopDt"
    //% block="set dt = $dt for regulator at line follow"
    //% block.loc.ru="установить dt = $dt для регулирования движения по линии"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Свойства"
    export function setLineFollowLoopDt(dt: number) {
        lineFollowLoopDt = dt;
    }

    /**
     * Получить dt для циклов регулирования при движении по линии.
     */
    //% blockId="GetLineFollowLoopDt"
    //% block="get dt at regulator at line follow"
    //% block.loc.ru="dt при регулирования движения по линии"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Свойства"
    export function getLineFollowLoopDt() {
        return lineFollowLoopDt;
    }

    /**
     * Установить рулевое управление для поиска линии при движение по линии одним датчиком.
     * @param newSteering получительное значение рулевого подворота к линии, eg: 15
     */
    //% blockId="SetSteeringAtSearchLineForLineFollowOneSensor"
    //% block="set steering $newSteering when searching line to follow line with one sensor"
    //% block.loc.ru="установить рулевое управление $newSteering при поиске линии в движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Свойства движения"
    export function setSteeringAtSearchLineForLineFollowOneSensor(newSteering: number) {
        newSteering = Math.abs(newSteering);
        steeringAtSearchLine = newSteering;
    }

    /**
     * Получить рулевое управление для поиска линии при движение по линии одним датчиком.
     */
    //% blockId="GetSteeringAtSearchLineForLineFollowOneSensor"
    //% block="get steering when searching line to follow line with one sensor"
    //% block.loc.ru="рулевое управление при поиске линии в движении по линии одним датчиком"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Свойства движения"
    export function getSteeringAtSearchLineForLineFollowOneSensor() {
        return steeringAtSearchLine;
    }

    /**
     * Установить допуск (люфт) отклонения от уставки для отмены поиска линии.
     * @param tolerance значение допуска, eg: 8
     */
    //% blockId="SetLineFollowSearchTolerance"
    //% block="set line follow search tolerance $tolerance"
    //% block.loc.ru="установить допуск поиска линии $tolerance"
    //% inlineInputMode="inline"
    //% weight="77" blockGap="8"
    //% group="Свойства для датчиков"
    export function setLineFollowSearchTolerance(tolerance: number) {
        lineFollowSearchTolerance = Math.abs(tolerance);
    }

    /**
     * Получить допуск (люфт) отклонения от уставки для отмены поиска линии.
     */
    //% blockId="GetLineFollowSearchTolerance"
    //% block="get line follow search tolerance"
    //% block.loc.ru="допуск поиска линии"
    //% inlineInputMode="inline"
    //% weight="76"
    //% group="Свойства для датчиков"
    export function getLineFollowSearchTolerance(): number {
        return lineFollowSearchTolerance;
    }

}

namespace motions {

    interface LineMotionOptions {
        actionAfterMotion: AfterLineMotion,
        v?: number,
        lineFollowMode?: LineFollowMode
    }

    

    // Функция для вывода на экран отладочной информации при движении по линии
    export function printDubugLineFollow(refLeftLS: number, refRightLS: number, error: number, u: number, dt: number) {
        brick.clearScreen(); // Очистка экрана
        brick.printValue("refLeftLS", refLeftLS, 1);
        brick.printValue("refRightLS", refRightLS, 2);
        brick.printValue("error", error, 3);
        brick.printValue("u", u, 4);
        brick.printValue("dt", dt, 12);
    }

    // Функция расчёта ошибки
    export function getLineFollowError(lineFollowMode: LineFollowMode, refLeftLS: number, refRightLS: number): number {
        if (lineFollowMode == LineFollowMode.LeftSensor) return refLeftLS - getLineFollowSetPoint();
        else if (lineFollowMode == LineFollowMode.RightSensor) return getLineFollowSetPoint() - refRightLS;
        return refLeftLS - refRightLS;
    }

    // Функция, которая выполняет действие после цикла с движением по линии
    export function actionAfterLineMotion(options: LineMotionOptions) {
        if (options.actionAfterMotion == AfterLineMotion.Rolling) { // Прокатка, чтобы встать на линию после определния перекрёстка
            chassis.linearDistMove(motions.getDistRollingAfterIntersection(), options.v, MotionBraking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.SmoothRolling) { // Прокатка, чтобы вставать на линию с мягким торможением после определния перекрёстка
            chassis.decelFinishLinearDistMove(options.v, motions.getMinPwrAtEndMovement(), motions.getDistRollingAfterIntersection(), motions.getDistRollingAfterIntersection(), AfterMotion.HoldStop);
        } else if (options.actionAfterMotion == AfterLineMotion.LineRolling) { // Прокатка с движением по линии на расстояние и торможением
            rollingLineFollowing(LineFollowMode.TwoSensors, motions.getDistRollingAfterIntersection(), options.v, AfterMotion.HoldStop);
        } else if (options.actionAfterMotion == AfterLineMotion.LineSmoothRolling) { // Прокатка с движением по линии и плавным торможением
            rampRollingLineFollowingByTwoSensors(motions.getDistRollingAfterIntersection(), options.v, MotionBraking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.LineContinueRoll) { // Прокатка с движением по линии для съезда с линии с продолжением движения
            if (options.lineFollowMode == LineFollowMode.TwoSensors) {
                rollingLineFollowing(LineFollowMode.TwoSensors, motions.getDistRollingFromLineAfterIntersection(), options.v, AfterMotion.NoStop);
            } else if (options.lineFollowMode == LineFollowMode.LeftSensor) {
                rollingLineFollowing(LineFollowMode.LeftSensor, motions.getDistRollingFromLineAfterIntersection(), options.v, AfterMotion.NoStop);
            } else if (options.lineFollowMode == LineFollowMode.RightSensor) {
                rollingLineFollowing(LineFollowMode.RightSensor, motions.getDistRollingFromLineAfterIntersection(), options.v, AfterMotion.NoStop);
            } else {
                return;
            }
        } else if (options.actionAfterMotion == AfterLineMotion.HoldStop) { // Тормоз c удержанием
            chassis.stop(Braking.Hold);
        } else if (options.actionAfterMotion == AfterLineMotion.FloatStop) { // Тормоз с освобождением мотора, т.е. прокаткой по инерции
            chassis.stop(Braking.Coast);
        } else if (options.actionAfterMotion == AfterLineMotion.Continue) { // В continue не подаётся команда на торможение, а просто вперёд, например для перехвата следующей функцией управления моторами
            chassis.steeringCommand(0, options.v);
        }
    }

    // Вспомогательная функция для движения по линии одним датчиком и для того, чтобы подрулувать с ожиданием нахождения линии
    export function steeringUntilFindLine(lineSensor: LineSensor, steering: number, v: number) {
        // ToDo сделать учитывание, что мы не привысили дистанцию общего движения одним датчиком на расстояние

        // Сначала ПРОВЕРЯЕМ: если мы уже на линии, вообще ничего не делаем и сразу выходим
        if (sensors.getNormalizedReflectionValue(lineSensor) < (getLineFollowSetPoint() + getLineFollowSearchTolerance())) return;

        const { speedLeft, speedRight } = chassis.getSpeedsAtSteering(steering, v);

        chassis.pidChassisSync.setGains(chassis.getSyncRegulatorKp(), chassis.getSyncRegulatorKi(), chassis.getSyncRegulatorKd()); // Установка коэффицентов регулятора
        chassis.pidChassisSync.setDerivativeFilter(chassis.getSyncRegulatorKf()); // Установить фильтр дифференциального регулятора
        chassis.pidChassisSync.setControlSaturation(-100, 100); // Установка диапазона регулирования регулятора
        chassis.pidChassisSync.setPoint(0); // Установить нулевую уставку регулятору
        chassis.pidChassisSync.reset(); // Сброс ПИД регулятора

        const emlPrev = chassis.leftMotor.angle(); // We read the value from the encoder from the left and right motor before starting
        const emrPrev = chassis.rightMotor.angle();

        let prevTime = control.millis(); // Last time time variable for loop
        while (true) { // Synchronized motion control cycle
            const currTime = control.millis();
            const dt = currTime - prevTime;
            prevTime = currTime;
            const refLS = sensors.getNormalizedReflectionValue(lineSensor); // Нормализованное значение с датчика линии
            if (refLS < getLineFollowSetPoint()) break;
            const eml = chassis.leftMotor.angle() - emlPrev; // Get left motor and right motor encoder current value
            const emr = chassis.rightMotor.angle() - emrPrev;
            const error = advmotctrls.getErrorSyncMotors(eml, emr, speedLeft, speedRight); // Find out the error in motor speed control
            const u = chassis.pidChassisSync.compute(dt == 0 ? 1 : dt, -error); // Find out and record the control action of the regulator
            const powers = advmotctrls.getPwrSyncMotors(u, speedLeft, speedRight); // Find out the power of motors for regulation
            chassis.setPower(powers.pwrLeft, powers.pwrRight); // Set power/speed motors
            control.pauseUntilTimeMs(currTime, 1); // Wait until the control cycle reaches the set amount of time passed
        }
        music.playToneInBackground(587, 50); // Издаём сигнал завершения поиска
    }

    // Вспомогательная функция движения по линии на расстояние, для съезда с линии и последующего движения по ней одним датчиком
    export function rollingLineFollowing(lineFollowMode: LineFollowMode, rollingDist: number, v: number, actionAfterMotion: AfterMotion, debug: boolean = false) {
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        const calcMotRot = Math.distanceToTicks(rollingDist);

        pidLineFollow.setPoint(0); // Установить нулевую уставку регулятору, временное
        // Сбрасывать регулятор не требуется, т.е. его состояние будет дальше использоваться с предыдущей функции

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) {
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторов
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = getLineFollowError(lineFollowMode, refLeftLS, refRightLS);
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error);
            chassis.regulatorSteering(u, v);
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt());
        }
        motions.actionAfterMotion(actionAfterMotion, v);
    }
    
}

namespace motions {

    function lineFollowToIntersection(actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        
    }

    /**
     * Функция движения по линии до перекрёстка двумя датчиками.
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToCrossIntersection"
    //% block="line follow to intersection after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="99"
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    export function lineFollowToCrossIntersection(actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgCrossIntersection2S.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgCrossIntersection2S.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgCrossIntersection2S.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgCrossIntersection2S.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgCrossIntersection2S.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgCrossIntersection2S);

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            if (refLeftLS < getLineFollowRefThreshold() && refRightLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgCrossIntersection2S.v); // Команда моторам
            // console.log(`refLS: ${refLeftLS} ${refRightLS}, error: ${error}, u: ${u}`);
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.TwoSensors, v: cfgCrossIntersection2S.v }); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии до определения перекрёстка слева или справа.
     * Если слева, тогда движение осуществляется правым датчиком и левый отвечает за определение.
     * Если справа, тогда за движение отвечает левый датчик, а правый отвечает за определение перекрёстка.
     * @param sideIntersection перекрёсток слева или справа, eg: SideIntersection.LeftInside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToSideIntersection"
    //% block="line follow to intersection $sideIntersection after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка $sideIntersection с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="89"
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    export function lineFollowToSideIntersection(sideIntersection: SideIntersection, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (sideIntersection == SideIntersection.LeftInside) {
            lineFollowToLeftIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.LeftOutside) {
            lineFollowToLeftIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightInside) {
            lineFollowToRightIntersection(LineLocation.Inside, actionAfterMotion, params, debug);
        } else if (sideIntersection == SideIntersection.RightOutside) {
            lineFollowToRightIntersection(LineLocation.Outside, actionAfterMotion, params, debug);
        }
    }

    /**
     * Функция движения по линии до определения перекрёстка слева правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param AfterLineMotion действие после перекрёстка, eg: AfterMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToLeftIntersection"
    //% block="line follow to left intersection $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка слева $lineLocation c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="88" blockGap="8"
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
    export function lineFollowToLeftIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgLeftIntersection.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgLeftIntersection.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgLeftIntersection.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgLeftIntersection.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgLeftIntersection.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgLeftIntersection);

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), cfgLeftIntersection.v);

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowOneSensorConditionMaxErr() && refLeftLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток, когда робот едет по линии
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgLeftIntersection.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.RightSensor, v: cfgLeftIntersection.v }); // Действие после алгоритма движения
    }

    /**
     * Функция движения по линии до определения перекрёстка справа левым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToRightIntersection"
    //% block="line follow to right intersection $lineLocation after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии до перекрёстка справа $lineLocation c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="87"
    //% subcategory="По линии"
    //% group="Движение по линии до перекрёстка"
    //% blockHidden="true"
    export function lineFollowToRightIntersection(lineLocation: LineLocation, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgRightIntersection.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgRightIntersection.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgRightIntersection.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgRightIntersection.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgRightIntersection.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgRightIntersection);

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Left, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? 1 : -1), cfgRightIntersection.v);

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Цикл регулирования движения по линии
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            if (Math.abs(error) <= getLineFollowOneSensorConditionMaxErr() && refRightLS < getLineFollowRefThreshold()) break; // Проверка на перекрёсток в момент, когда робот едет по линии
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgRightIntersection.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.LeftSensor, v: cfgRightIntersection.v }); // Действие после алгоритма движения
    }

}

namespace motions {

    /**
     * Движение по линии на расстояние.
     * @param dist дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByTwoSensors"
    //% block="line follow to distance $dist mm after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии на расстояние $dist мм с действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="79"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceByTwoSensors(dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgDist2S.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgDist2S.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgDist2S.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgDist2S.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgDist2S.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgDist2S);

        const calcMotRot = Math.distanceToTicks(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторов
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            const error = refLeftLS - refRightLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgDist2S.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.TwoSensors, v: cfgDist2S.v }); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние одним из датчиков.
     * @param followLineSensor выбранным сенсором и позицией, eg: FollowLineSensor.LeftInside
     * @param dist дистанция движения в мм eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByOneSensor"
    //% block="line follow $followLineSensor sensor to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии $followLineSensor датчиком на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="76"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    export function lineFollowToDistanceByOneSensor(dist: number, followLineSensor: FollowLineSensor, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (followLineSensor == FollowLineSensor.LeftInside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Inside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.LeftOutside) {
            lineFollowToDistanceByLeftSensor(LineLocation.Outside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.RightInside) {
            lineFollowToDistanceByRightSensor(LineLocation.Inside, dist, actionAfterMotion, params, debug);
        } else if (followLineSensor == FollowLineSensor.RightOutside) {
            lineFollowToDistanceByRightSensor(LineLocation.Outside, dist, actionAfterMotion, params, debug);
        }
    }

    /**
     * Движение по линии на расстояние левым датчиком. Очень грубый метод.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByLeftSensor"
    //% block="line follow left sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии левым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="75"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByLeftSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgDistLeft.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgDistLeft.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgDistLeft.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgDistLeft.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgDistLeft.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgDistLeft);

        const calcMotRot = Math.distanceToTicks(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Left, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? 1 : -1), cfgDistLeft.v);

        let prevTime = control.millis(); // Переменная времени за предыдущую итерацию цикла
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторы
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = refLeftLS - getLineFollowSetPoint(); // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = getLineFollowSetPoint() - refLeftLS; // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgDistLeft.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.RightSensor, v: cfgDistLeft.v }); // Действие после алгоритма движения
    }

    /**
     * Движение по линии на расстояние правым датчиком.
     * @param lineLocation позиция линии для движения, eg: LineLocation.Inside
     * @param dist дистанция движения в мм, eg: 250
     * @param actionAfterMotion действие после перекрёстка, eg: AfterLineMotion.Rolling
     * @param debug отладка, eg: false
     */
    //% blockId="LineFollowToDistanceByRightSensor"
    //% block="line follow right sensor at line $lineLocation to distance $dist mm|after motion $actionAfterMotion||params: $params|debug $debug"
    //% block.loc.ru="движение по линии правым датчиком при линия $lineLocation на расстояние $dist мм|c действием после $actionAfterMotion||параметры: $params|отладка $debug"
    //% inlineInputMode="inline"
    //% expandableArgumentMode="enabled"
    //% debug.shadow="toggleOnOff"
    //% params.shadow="LineFollowEmptyParams"
    //% weight="74" blockGap="8"
    //% subcategory="По линии"
    //% group="Движение по линии на расстояние"
    //% blockHidden="true"
    export function lineFollowToDistanceByRightSensor(lineLocation: LineLocation, dist: number, actionAfterMotion: AfterLineMotion, params?: params.LineFollow, debug: boolean = false) {
        if (params) { // Если были переданы параметры
            if (params.v  >= 0) cfgDistRight.v  = Math.abs(params.v);
            if (params.Kp >= 0) cfgDistRight.Kp = Math.abs(params.Kp);
            if (params.Ki >= 0) cfgDistRight.Ki = Math.abs(params.Ki);
            if (params.Kd >= 0) cfgDistRight.Kd = Math.abs(params.Kd);
            if (params.Kf >= 0) cfgDistRight.Kf = Math.abs(params.Kf);
        }
        applyPIDConfig(cfgDistRight);

        const calcMotRot = Math.distanceToTicks(dist); // Дистанция в мм, которую нужно проехать по линии
        const emlPrev = chassis.leftMotor.angle(); // Значения с энкодеров моторов до запуска
        const emrPrev = chassis.rightMotor.angle();

        // Подруливаем плавно к линии
        steeringUntilFindLine(LineSensor.Right, getSteeringAtSearchLineForLineFollowOneSensor() * (lineLocation == LineLocation.Inside ? -1 : 1), cfgDistRight.v);

        let prevTime = control.millis(); // Переменная предыдущего времения для цикла регулирования
        while (true) { // Пока моторы не достигнули градусов вращения
            const currTime = control.millis(); // Текущее время
            const dt = currTime - prevTime; // Время за которое выполнился цикл
            prevTime = currTime; // Новое время в переменную предыдущего времени
            const eml = chassis.leftMotor.angle() - emlPrev; // Значения с энкодеров моторы
            const emr = chassis.rightMotor.angle() - emrPrev;
            if (Math.abs(eml) >= Math.abs(calcMotRot) || Math.abs(emr) >= Math.abs(calcMotRot)) break;
            const refLeftLS = sensors.getNormalizedReflectionValue(LineSensor.Left); // Нормализованное значение с левого датчика линии
            const refRightLS = sensors.getNormalizedReflectionValue(LineSensor.Right); // Нормализованное значение с правого датчика линии
            let error = 0; // Переменная для хранения ошибки регулирования
            if (lineLocation == LineLocation.Inside) error = getLineFollowSetPoint() - refRightLS; // Ошибка регулирования
            else if (lineLocation == LineLocation.Outside) error = refRightLS - getLineFollowSetPoint(); // Ошибка регулирования
            const u = pidLineFollow.compute(dt == 0 ? 1 : dt, -error); // Управляющее воздействие
            chassis.regulatorSteering(u, cfgDistRight.v); // Команда моторам
            if (debug) printDubugLineFollow(refLeftLS, refRightLS, error, u, dt);
            control.pauseUntilTimeMs(currTime, getLineFollowLoopDt()); // Ожидание выполнения цикла
        }
        music.playToneInBackground(262, 250); // Издаём сигнал завершения
        motions.actionAfterLineMotion({ actionAfterMotion, lineFollowMode: LineFollowMode.LeftSensor, v: cfgDistRight.v }); // Действие после алгоритма движения
    }

}