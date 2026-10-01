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

namespace params {

    // Интерфейс перадачи параметров для алгоритма движения по линии с ускорениями и замедлениями
    export interface RampLineFollow {
        vStart?: number;
        vMax?: number;
        vFinish?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newMinStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newMinFihishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetRampLineFollow2SensorParams"
    //% block="set line follow params at start v = $newMinStartV\\% max = $newMaxV\\% final = $newMinFihishV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="установить параметры движения по линии при начальной v = $newMinStartV\\% макс = $newMaxV\\% конечной = $newMinFihishV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function setRampLineFollow2SensorParams(newMinStartV: number, newMaxV: number, newMinFihishV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number) {
        if (newMinStartV) motions.rampLineFollowToDistance2SensorStartV = newMinStartV;
        if (newMaxV) motions.rampLineFollowToDistance2SensorMaxV = newMaxV;
        if (newMinFihishV) motions.rampLineFollowToDistance2SensorFinishV = newMinFihishV;
        if (newKp) motions.rampLineFollowToDistance2SensorKp = newKp;
        if (newKi) motions.rampLineFollowToDistance2SensorKi = newKi;
        if (newKd) motions.rampLineFollowToDistance2SensorKd = newKd;
        if (newKf) motions.rampLineFollowToDistance2SensorKf = newKf;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="RampLineFollowEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowEmptyParams(): RampLineFollow {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     */
    //% blockId="RampLineFollowThreeParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finally $newFinishV\\%"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowThreeParams(newStartV: number, newMaxV: number, newFinishV: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     */
    //% blockId="RampLineFollowFourParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowFourParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowSixParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowSixParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number, newKd?: number, newKf?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp,
            Kd: newKd,
            Kf: newKf
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newStartV начальная скорость движения, eg: 10
     * @param newMaxV максимальная скорость движения, eg: 50
     * @param newFinishV конечная скорость движения, eg: 10
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="RampLineFollowAllParams"
    //% block="start v = $newStartV\\% max = $newMaxV\\% finaly $newFinishV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="начальная v = $newStartV\\% макс = $newMaxV\\% конечная $newFinishV\\% Kp = $newKp Ki = $newKi Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры движения по линии двумя датчиками c ускорениями/замедлениями"
    export function rampLineFollowAllParams(newStartV: number, newMaxV: number, newFinishV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number): RampLineFollow {
        return {
            vStart: newStartV,
            vMax: newMaxV,
            vFinish: newFinishV,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            Kf: newKf
        };
    }

}

namespace params {

    // Интерфейс перадачи параметров для алгоритма выравнивания на линии
    export interface LineAlignment {
        vMax?: number;
        timeOut?: number;
        leftKp?: number;
        rightKp?: number;
        leftKi?: number;
        rightKi?: number;
        leftKd?: number;
        rightKd?: number;
        leftKf?: number;
        rightKf?: number;
    }

    /**
     * Установка параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV скорость движения, eg: 50
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKi интегральный коэффицент левой стороны, eg: 0
     * @param newRightKi интегральный коэффицент правой стороны, eg: 0
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftKf коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightKf коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="SetLineAlignmentParams"
    //% block="set line alignment params at v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% block.loc.ru="установить параметры выравнивания на линии с макс v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function setLineAlignmentParams(newV: number, newLeftKp: number, newRightKp: number, newLeftKi: number, newRightKi: number, newLeftKd: number, newRightKd: number, newLeftKf?: number, newRightKf?: number) {
        if (newV) levelings.lineAlignmentMaxV = newV;
        if (newLeftKp) levelings.lineAlignmentLeftSideKp = newLeftKp;
        if (newRightKp) levelings.lineAlignmentRightSideKp = newRightKp;
        if (newLeftKi) levelings.lineAlignmentLeftSideKi = newLeftKi;
        if (newRightKi) levelings.lineAlignmentRightSideKi = newRightKi;
        if (newLeftKd) levelings.lineAlignmentLeftSideKd = newLeftKd;
        if (newRightKd) levelings.lineAlignmentRightSideKd = newRightKd;
        if (newLeftKf) levelings.lineAlignmentLeftSideKf = newLeftKf;
        if (newRightKf) levelings.lineAlignmentRightSideKf = newRightKf;
    }

    /**
     * Установка сокращённых параметров для алгоритма выравнивания на линии перпендикулярно с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV скорость движения, eg: 50
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftKf коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightKf коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="SetLineAlignmentShortParams"
    //% block="set line alignment params at v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% block.loc.ru="установить параметры выравнивания на линии с макс скоростью v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="98"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function setLineAlignmentShortParams(newV: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftKf?: number, newRightKf?: number) {
        if (newV) levelings.lineAlignmentMaxV = newV;
        if (newLeftKp) levelings.lineAlignmentLeftSideKp = newLeftKp;
        if (newRightKp) levelings.lineAlignmentRightSideKp = newRightKp;
        if (newLeftKd) levelings.lineAlignmentLeftSideKd = newLeftKd;
        if (newRightKd) levelings.lineAlignmentRightSideKd = newRightKd;
        if (newLeftKf) levelings.lineAlignmentLeftSideKf = newLeftKf;
        if (newRightKf) levelings.lineAlignmentRightSideKf = newRightKf;
    }

    /**
     * Пустые праметры для алгоритма с регулятором.
     */
    //% blockId="LineAlignmentEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function lineAlignmentEmptyParams(): LineAlignment {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v.
     * @param newV максимальная скорость выравнивания, eg: 40
     */
    //% blockId="LineAlignmentOneParams"
    //% block="v = $newV\\%"
    //% block.loc.ru="v = $newV\\%"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function lineAlignmentOneParams(newV?: number): LineAlignment {
        return {
            vMax: newV
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp.
     * @param newV максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     */
    //% blockId="LineAlignmentThreeParams"
    //% block="v = $newV\\%|leftKp = $newLeftKp|rightKp = $newRightKp"
    //% block.loc.ru="v = $newV\\%|leftKp = $newLeftKp|rightKp = $newRightKp"
    //% inlineInputMode="inline"
    //% weight="87"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function lineAlignmentThreeParams(newV?: number, newLeftKp?: number, newRightKp?: number): LineAlignment {
        return {
            vMax: newV,
            leftKp: newLeftKp,
            rightKp: newRightKp
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftKf коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightKf коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="LineAlignmentSevenParams"
    //% block="v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% block.loc.ru="v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="86"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function lineAlignmentSevenParams(newV?: number, newLeftKp?: number, newRightKp?: number, newLeftKd?: number, newRightKd?: number, newLeftKf?: number, newRightKf?: number): LineAlignment {
        return {
            vMax: newV,
            leftKp: newLeftKp,
            rightKp: newRightKp,
            leftKd: newLeftKd,
            rightKd: newRightKd,
            leftKf: newLeftKf,
            rightKf: newRightKf
        };
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV максимальная скорость выравнивания, eg: 40
     * @param newLeftKp пропорциональный коэффицент левой стороны, eg: 1
     * @param newRightKp пропорциональный коэффицент правой стороны, eg: 1
     * @param newLeftKi интегральный коэффицент левой стороны, eg: 0
     * @param newRightKi интегральный коэффицент правой стороны, eg: 0
     * @param newLeftKd дифференциальный коэффицент левой стороны, eg: 0
     * @param newRightKd дифференциальный коэффицент правой стороны, eg: 0
     * @param newLeftKf коэффицент фильтрации дифференциального регулятора левой стороны, eg: 0
     * @param newRightKf коэффицент фильтрации дифференциального регулятора правой стороны, eg: 0
     */
    //% blockId="LineAlignmentAllParams"
    //% block="v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% block.loc.ru="v = $newV\\%|leftKp = $newLeftKp rightKp = $newRightKp|leftKi = $newLeftKi rightKi = $newRightKi|leftKd = $newLeftKd rightKd = $newRightKd||leftKf = $newLeftKf rightKf = $newRightKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="85"
    //% group="Параметры перпендикулярного выравнивания на линии"
    export function lineAlignmentAllParams(newV?: number, newLeftKp?: number, newRightKp?: number, newLeftKi?: number, newRightKi?: number, newLeftKd?: number, newRightKd?: number, newLeftKf?: number, newRightKf?: number): LineAlignment {
        return {
            vMax: newV,
            leftKp: newLeftKp,
            rightKp: newRightKp,
            leftKi: newLeftKi,
            rightKi: newLeftKi,
            leftKd: newLeftKd,
            rightKd: newRightKd,
            leftKf: newLeftKf,
            rightKf: newRightKf
        };
    }

}

namespace params {

    // Интерфейс перадачи параметров для алгоритма позиционирования на линии
    export interface LinePositioning {
        vMax?: number;
        timeOut?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

    /**
     * Установка параметров для алгоритма позицианирования (выравнивание) на линии датчиками линии с возможностью установить скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newV максимальная скорость выравнивания, eg: 40
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="SetLinePositioningParams"
    //% block="set line positioning params at v = $newV\\% Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="установить параметры позиционирования на линии на скорости = $newV\\% Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="99"
    //% group="Параметры позиционирования на линии"
    export function setLinePositioningParams(newV: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number) {
        if (newV) levelings.linePositioningMaxV = newV;
        if (newKp) levelings.linePositioningKp = newKp;
        if (newKi) levelings.linePositioningKi = newKi;
        if (newKd) levelings.linePositioningKd = newKd;
        if (newKf) levelings.linePositioningKf = newKf;
    }

    /**
     * Пустые параметры для алгоритма с позиционированием на линии.
     */
    //% blockId="LinePositioningEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры позиционирования на линии"
    export function linePositioningEmptyParams(): LinePositioning {
        return null;
    }

    /**
     * Параметры для алгоритма с регулятором с возможностью установить время таймаута, макс скорость v, Kp, Ki, Kd, и Kf - фильтр дифференциального регулятора.
     * @param newTimeOut максимальная время работы алгоритма, eg: 2000
     * @param newMaxV максимальная скорость выравнивания, eg: 50
     * @param newKp пропорциональный коэффицент, eg: 1
     * @param newKi интегральный коэффицент, eg: 0
     * @param newKd дифференциальный коэффицент, eg: 0
     * @param newKf коэффицент фильтрации дифференциального регулятора, eg: 0
     */
    //% blockId="LinePositioningAllParams"
    //% block="timeout = $newTimeOut|max v = $newMaxV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% block.loc.ru="таймаут = $newTimeOut|макс v = $newMaxV\\%|Kp = $newKp|Ki = $newKi|Kd = $newKd||Kf = $newKf"
    //% expandableArgumentMode="enabled"
    //% inlineInputMode="inline"
    //% weight="88"
    //% group="Параметры позиционирования на линии"
    export function linePositioningAllParams(newTimeOut?: number, newMaxV?: number, newKp?: number, newKi?: number, newKd?: number, newKf?: number): LinePositioning {
        return {
            vMax: newMaxV,
            timeOut: newTimeOut,
            Kp: newKp,
            Ki: newKi,
            Kd: newKd,
            Kf: newKf
        };
    }

}

namespace params {

    export interface MotorRegulator {
        vMax?: number;
        timeOut?: number;
        errorThreshold?: number;
        vMinThreshold?: number;
        Kp?: number;
        Ki?: number;
        Kd?: number;
        Kf?: number;
    }

    /**
     * Пустые параметры для алгоритма регулирования мотора для установки на позицию.
     */
    //% blockId="MotorSetPosEmptyParams"
    //% block="empty"
    //% block.loc.ru="пусто"
    //% inlineInputMode="inline"
    //% weight="89"
    //% group="Параметры регулирования управления мотора"
    export function motorSetPosEmptyParams(): MotorRegulator {
        return null;
    }

}

namespace params {

    export interface NavLineFollow {
        moveStartV: number,
        moveMaxV: number,
        turnV: number,
        accelStartDist?: number
        Kp: number,
        Ki?: number,
        Kd?: number,
        Kf?: number,
    }

}