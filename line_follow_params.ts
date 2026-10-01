namespace params {

    // Интерфейс перадачи параметров для алгоритма движения по линии
    export interface LineFollow {
        v?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
        dir?: number
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetLineFollow2SensorParams"
    //% block="set line follow params at v = $newV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="установить параметры движения по линии на v = $newV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками"
    export function setLineFollow2SensorParams(newV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number) {
        if (newV)  motions.cfgCrossIntersection2S.v  = newV;
        if (newKp) motions.cfgCrossIntersection2S.Kp = newKp;
        if (newKi) motions.cfgCrossIntersection2S.Ki = newKi;
        if (newKd) motions.cfgCrossIntersection2S.Kd = newKd;
        if (newKf) motions.cfgCrossIntersection2S.Kf = newKf;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="LineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии"
    export function lineFollowEmptyParams(): LineFollow {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v.
     * @param newV скорость движения, eg: 50
     */
    //% blockId="LineFollowOneParams"
    //% block="v = $newV\\%"
    //% block.loc.ru="v = $newV\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры движения по линии"
    export function lineFollowOneParams(newV?: number): LineFollow {
        return {
            v: newV
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp.
     * @param newV скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     */
    //% blockId="LineFollowTwoParams"
    //% block="v = $newV\\% Kp = $newKp"
    //% block.loc.ru="v = $newV\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры движения по линии"
    export function lineFollowTwoParams(newV?: number, newKp?: number): LineFollow {
        return {
            v: newV,
            Kp: newKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="LineFollowFourParams"
    //% block="v = $newV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="v = $newV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры движения по линии"
    export function lineFollowFourParams(newV?: number, newKp?: number, newKd?: number, newKf?: number): LineFollow {
        return {
            v: newV,
            Kp: newKp,
            Kd: newKd,
            Kf: newKf
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV скорость движения, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="LineFollowAllParams"
    //% block="v = $newV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="v = $newV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры движения по линии"
    export function lineFollowAllParams(newV?: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number): LineFollow {
        return {
            v: newV,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            Kf: newKf
        };
    }

}