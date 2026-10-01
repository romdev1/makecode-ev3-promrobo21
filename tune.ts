namespace custom {

    /**
     * Настройка параметров функций и методов.
     * @param startupScreen экран при старте, eg: 0
     */
    //% blockId="FunctionsTune"
    //% block="проверка функций||начальный экран $startupScreen"
    //% expandableArgumentMode="toggle"
    //% weight="99"
    //% group="Дополнительно"
    export function functionsTune(startupScreen: number = 0) {
        const LOOP_DELAY = 10; // Задержка цикла
        const LINE_SCROLL_TRESHOLD = 5; // Начинать скролл параметров с строки
        const BTN_PRESS_LOOP_DELAY = 150; // Задержка в цикле при нажатии
        const REG_COEFFICIENT_STEP_NAMES: string[] = ["Kp_step", "Ki_step", "Kd_step", "N_step"];

        let paramIncrease = false, paramDecrease = false; // Переменные состояния кнопок/влево вправо при изменении параметров    
        // Пользовательские значения
        let methodScreens: { [key: string]: { params: { [key: string]: { [key: string]: any } }, hrStrings: number[], showStepsReg: boolean } } = {
            SYNC_DIST_MOVE: {
                params: {
                    dist: {
                        val: 500,
                        changeStep: 5,
                        min: 0,
                        max: 5000
                    },
                    v: {
                        val: motions.cfgDist2S.v,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: 0.02,
                        changeStep: 0.01
                    },
                    Ki: {
                        val: 0,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: 0.5,
                        changeStep: 0.1
                    },
                    N: {
                        val: 0,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [2],
            },
            SYNC_RAMP_DIST_MOVE: {
                params: {
                    minV: {
                        val: 10,
                        changeStep: 5,
                        min: -100,
                        max: 100
                    },
                    maxV: {
                        val: 50,
                        changeStep: 5,
                        min: -100,
                        max: 100
                    },
                    totalDist: {
                        val: 300,
                        changeStep: 5,
                        min: 100,
                        max: 10000
                    },
                    accelDist: {
                        val: 100,
                        changeStep: 5,
                        min: 0,
                        max: 10000
                    },
                    decelDist: {
                        val: 100,
                        changeStep: 5,
                        min: 0,
                        max: 10000
                    },
                    Kp: {
                        val: 0.02,
                        changeStep: 0.01
                    },
                    Ki: {
                        val: 0,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: 0.5,
                        changeStep: 0.1
                    },
                    N: {
                        val: 0,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [5],
            },
            LW_2S_TO_INTERSECTION: {
                params: {
                    debug: {
                        val: true
                    },
                    v: {
                        val: motions.cfgCrossIntersection2S.v,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: motions.cfgCrossIntersection2S.Kp,
                       changeStep: 0.05
                    },
                    Ki: {
                        val: motions.cfgCrossIntersection2S.Ki,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: motions.cfgCrossIntersection2S.Kd,
                        changeStep: 0.1
                    },
                    N: {
                        val: motions.cfgCrossIntersection2S.Kf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [2],
            },
            LW_2S_TO_DISTANCE: {
                params: {
                    dist: {
                        val: 500,
                        changeStep: 5,
                        min: 0,
                        max: 5000
                    },
                    debug: {
                        val: true
                    },
                    v: {
                        val: motions.cfgDist2S.v,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: motions.cfgDist2S.Kp,
                        changeStep: 0.05
                    },
                    Ki: {
                        val: motions.cfgDist2S.Ki,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: motions.cfgDist2S.Kd,
                        changeStep: 0.1
                    },
                    N: {
                        val: motions.cfgDist2S.Kf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [3]
            },
            LW_TO_SIDE_INTERSECTION: {
                params: {
                    junction: {
                        val: SideIntersection.LeftInside
                    },
                    horizLineLoc: {
                        val: LineLocation.Inside
                    },
                    debug: {
                        val: true
                    },
                    v: {
                        val: motions.cfgDist2S.v,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: motions.cfgDist2S.Kp,
                        changeStep: 0.05
                    },
                    Ki: {
                        val: motions.cfgDist2S.Ki,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: motions.cfgDist2S.Kd,
                        changeStep: 0.1
                    },
                    N: {
                        val: motions.cfgDist2S.Kf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [3]
            },
            CHASSIS_SPIN_TURN: {
                params: {
                    deg: {
                        val: 90,
                        changeStep: 1,
                        min: -360,
                        max: 360
                    },
                    v: {
                        val: 40,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    base_length: {
                        val: chassis.getBaseLength(),
                        changeStep: 1,
                        min: 100,
                        max: 250
                    }
                },
                showStepsReg: false,
                hrStrings: [3]
            },
            CHASSIS_PIVOT_TURN: {
                params: {
                    deg: {
                        val: 90,
                        changeStep: 1,
                        min: -360,
                        max: 360
                    },
                    pivot: {
                        val: WheelPivot.LeftWheel,
                        changeStep: 1
                    },
                    v: {
                        val: 40,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    base_length: {
                        val: chassis.getBaseLength(),
                        changeStep: 1,
                        min: 100,
                        max: 250
                    }
                },
                showStepsReg: false,
                hrStrings: [3]
            },
            SMART_SPIN_TURN: {
                params: {
                    deg: {
                        val: 90,
                        changeStep: 1,
                        min: -360,
                        max: 360
                    },
                    debug: {
                        val: true
                    },
                    base_length: {
                        val: chassis.getBaseLength(),
                        changeStep: 1,
                        min: 100,
                        max: 250
                    },
                    v: {
                        val: chassis.smartSpinTurnV,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: chassis.smartSpinTurnKp,
                        changeStep: 0.05
                    },
                    Ki: {
                        val: chassis.smartSpinTurnKi,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: chassis.smartSpinTurnKd,
                        changeStep: 0.1
                    },
                    N: {
                        val: chassis.smartSpinTurnKf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [3]
            },
            SMART_PIVOT_TURN: {
                params: {
                    deg: {
                        val: 90,
                        changeStep: 1,
                        min: 0,
                        max: 360
                    },
                    pivot: {
                        val: WheelPivot.LeftWheel,
                        changeStep: 1
                    },
                    debug: {
                        val: true
                    },
                    base_length: {
                        val: chassis.getBaseLength(),
                        changeStep: 1,
                        min: 100,
                        max: 250
                    },
                    v: {
                        val: chassis.smartPivotTurnV,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    Kp: {
                        val: chassis.smartPivotTurnKp,
                        changeStep: 0.05
                    },
                    Ki: {
                        val: chassis.smartPivotTurnKi,
                        changeStep: 0.001
                    },
                    Kd: {
                        val: chassis.smartPivotTurnKd,
                        changeStep: 0.1
                    },
                    N: {
                        val: chassis.smartPivotTurnKf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [4]
            },
            LINE_ALIGNMET: {
                params: {
                    location: {
                        val: VerticalLineLocation.Front
                    },
                    time: {
                        val: 2000,
                        changeStep: 50,
                        min: 100,
                        max: 5000
                    },
                    recalibrate: {
                        val: true
                    },
                    debug: {
                        val: true
                    },
                    maxV: {
                        val: levelings.lineAlignmentMaxV,
                        changeStep: 5,
                        min: 5,
                        max: 100
                    },
                    timeOut: {
                        val: levelings.lineAlignmentTimeOut,
                        changeStep: 100,
                        min: 100,
                        max: 10000
                    },
                    leftKp: {
                        val: levelings.lineAlignmentLeftSideKp,
                        changeStep: 0.05
                    },
                    rightKp: {
                        val: levelings.lineAlignmentRightSideKp,
                        changeStep: 0.05
                    },
                    leftKi: {
                        val: levelings.lineAlignmentLeftSideKi,
                        changeStep: 0.001
                    },
                    rightKi: {
                        val: levelings.lineAlignmentRightSideKi,
                        changeStep: 0.001
                    },
                    leftKd: {
                        val: levelings.lineAlignmentLeftSideKd,
                        changeStep: 0.1
                    },
                    rightKd: {
                        val: levelings.lineAlignmentRightSideKd,
                        changeStep: 0.1
                    },
                    leftN: {
                        val: levelings.lineAlignmentLeftSideKf,
                        changeStep: 0.1
                    },
                    rightN: {
                        val: levelings.lineAlignmentRightSideKf,
                        changeStep: 0.1
                    }
                },
                showStepsReg: true,
                hrStrings: [5]
            },
            LINE_ALIGNMET_IN_MOTION: {
                params: {
                    v: {
                        val: 30,
                        changeStep: 5,
                        min: -100,
                        max: 100
                    },
                    debug: {
                        val: false
                    },
                },
                showStepsReg: false,
                hrStrings: [2]
            }
        }

        const screensNums = Object.keys(methodScreens).length; // Количество экранов с регуляторами
        let screen = Math.constrain(startupScreen, 0, screensNums - 1);
        let cursor = 0; // Крусор (выделенная строка)
        let confirm = false; // Подтвержден ли курсор (строка) или нет
        let scroll = 0; // Переменная хранение числа скролла
        let screenChanged = false; // Переменная о смене экрана

        // Защита от бага, что запуск функции по кнопке смещает курсор
        // pauseUntil(() => brick.buttonUp.wasPressed() || brick.buttonDown.wasPressed() || brick.buttonLeft.wasPressed() || brick.buttonRight.wasPressed() || brick.buttonEnter.wasPressed());
        // if (debug) console.log("cursor: " + cursor + ", PARAMS_VALUES[" + screen + "][" + (cursor - 1) + "]: " + PARAMS_VALUES[screen][cursor - 1]);
        
        // Цикл обработки интерфейса
        while (true) {
            brick.clearScreen(); // Очищаем экран
            // console.log(`cursor: ${cursor}, scroll: ${scroll}`);
            const screenName = Object.keys(methodScreens)[screen];
            // console.log(`screenName: ${screenName}`);
            const screenParamsNum = Object.keys(methodScreens[screenName].params).length; // Количество параметров
            const regSteps = methodScreens[screenName].showStepsReg ? REG_COEFFICIENT_STEP_NAMES.length : 0;
            const totalStrNum = screenParamsNum + regSteps + 2; // Общее количество кликабельных строк c параметрами
            // console.log(`totalStrNum: ${totalStrNum}`);
            // if (debug) console.log(`screenParamsNum: ${screenParamsNum}`);
            if (screenChanged) { // Экран на прошлой итеррации цикла был изменён?
                if (cursor > totalStrNum) cursor = totalStrNum; // Если позиция курсора была дальше, чем общее количество строк, тогда курсор ставим на последнюю строку
                screenChanged = false;
            }
            brick.printString(`${screen + 1}) ${screenName}`, 1); // Шапка выводится всегда
            brick.showString("=============================", 2);
            let strPrint = 3; // Строка печати
            if (strPrint - scroll > 2) brick.showString(`${cursor == 0 ? "> " : ""} RUN TEST`, strPrint - scroll);
            strPrint++;
            if (strPrint - scroll > 2) brick.showString("-----------------------------", strPrint - scroll);
            strPrint++;
            //console.log(`strPrint: ${strPrint}, scroll: ${scroll}`);
            const hrArr = methodScreens[screenName].hrStrings; // Массив разделителей
            for (let i = 0; i < screenParamsNum; i++) {
                if (hrArr.indexOf(i) != -1 && strPrint - scroll > 2) { // Проверяем совпадает ли индекс со строкой в массиве разделителей
                    brick.showString("-----------------------------", strPrint - scroll);
                    strPrint++;
                }
                if (strPrint - scroll > 2) {
                    const paramName = Object.keys(methodScreens[screenName].params)[i];
                    let paramValue = methodScreens[screenName].params[paramName].val;
                    if (paramName == "pivot") {
                        if (paramValue == 0) paramValue = "left wheel";
                        else paramValue = "right wheel";
                        brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${paramValue}`, strPrint - scroll);
                    } else if (paramName == "location") {
                        if (paramValue == 0) paramValue = "front";
                        else paramValue = "behind";
                        brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${paramValue}`, strPrint - scroll);
                    } else if (paramName == "junction") {
                        if (paramValue == 0) paramValue = "left cross";
                        else paramValue = "right cross";
                        brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${paramValue}`, strPrint - scroll);
                    } else if (paramName == "horizLineLoc") {
                        if (paramValue == 0) paramValue = "inside";
                        else paramValue = "outside";
                        brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${paramValue}`, strPrint - scroll);
                    } else if (paramName == "debug" || paramName == "recalibrate") brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${paramValue}`, strPrint - scroll);
                    else brick.showString(`${cursor == i + 1 ? (confirm ? ">>> " : "> ") : ""} ${paramName}: ${Math.round(paramValue * 10000) / 10000}`, strPrint - scroll);
                }
                strPrint++;
            }

            if (strPrint - scroll > 2) {
                brick.showString("-----------------------------", strPrint - scroll);
                strPrint++;
            }
            if (strPrint - scroll > 2) {
                brick.showString(`${cursor == screenParamsNum + 1 ? "> " : ""} RUN TEST`, strPrint - scroll);
                strPrint++;
            }
            if (strPrint - scroll > 2) {
                brick.showString("-----------------------------", strPrint - scroll);
                strPrint++;
            }

            // Печать параметров шагов
            if (regSteps > 0) {
                const paramsStepOffset = screenParamsNum - 4; // Отступ от начала для параметров шагов
                for (let i = 0; i < REG_COEFFICIENT_STEP_NAMES.length; i++) {
                    if (strPrint - scroll > 2) {
                        const paramName = Object.keys(methodScreens[screenName].params)[i + paramsStepOffset];
                        let changeStep = methodScreens[screenName].params[paramName].changeStep;
                        changeStep = (changeStep != undefined ? changeStep : 1);
                        brick.showString(`${cursor == i + screenParamsNum + 2 ? (confirm ? ">>> " : "> ") : ""} ${REG_COEFFICIENT_STEP_NAMES[i]}: ${changeStep}`, strPrint - scroll);
                        strPrint++;
                    }
                }
            }

            // Если активно изменение
            if (confirm) {
                // Фиксируем о необходимости изменить параметр
                if (brick.buttonLeft.isPressed()) paramDecrease = true; // Нажатие влево - уменьшаем число
                else if (brick.buttonRight.isPressed()) paramIncrease = true; // Нажатие вправо - увеличиваем число
                else paramDecrease = false, paramIncrease = false; // Если нажатий нет
                if (paramDecrease || paramIncrease) { // Изменяем коэффициент
                    music.playToneInBackground(Note.C, 50); // Сигнал о переключении экрана
                    let paramName = Object.keys(methodScreens[screenName].params)[cursor - 1];
                    // console.log(`paramName: ${paramName}`);
                    if (paramName != undefined && paramName != "debug" && paramName != "recalibrate" && paramName != "pivot" && paramName != "junction" && paramName != "horizLineLoc") { // Параметры функции
                        let changeStep = methodScreens[screenName].params[paramName].changeStep;
                        changeStep = (changeStep != undefined ? changeStep : 0.01);
                        let minLimit = methodScreens[screenName].params[paramName].min;
                        minLimit = (minLimit != undefined ? minLimit : 0);
                        let maxLimit = methodScreens[screenName].params[paramName].max;
                        maxLimit = (maxLimit != undefined ? maxLimit : 1000);
                        if (paramDecrease) methodScreens[screenName].params[paramName].val -= changeStep;
                        else if (paramIncrease) methodScreens[screenName].params[paramName].val += changeStep;
                        methodScreens[screenName].params[paramName].val = Math.constrain(methodScreens[screenName].params[paramName].val, minLimit, maxLimit);
                    } else if (paramName == "debug" || paramName == "recalibrate") {
                        if (paramDecrease || paramIncrease) methodScreens[screenName].params[paramName].val = !methodScreens[screenName].params[paramName].val;
                    } else if (paramName == "pivot" || paramName == "junction" || paramName == "horizLineLoc") {
                        if (paramDecrease) methodScreens[screenName].params[paramName].val -= 1;
                        else if (paramIncrease) methodScreens[screenName].params[paramName].val += 1;
                        methodScreens[screenName].params[paramName].val = Math.constrain(methodScreens[screenName].params[paramName].val, 0, 1);
                    } else { // Параметры шагов
                        function PidParamsStep(paramName: string, deflStep: number, changeStepValue: number, minVal: number, maxVal: number) {
                            let changeStep = methodScreens[screenName].params[paramName].changeStep;
                            if (changeStep == undefined) methodScreens[screenName].params[paramName].changeStep = deflStep; // Если шаг изменения параметра не был указан, тогда установить значение, на которое будет изменяться
                            if (paramDecrease) methodScreens[screenName].params[paramName].changeStep -= changeStepValue; // Уменьшение
                            else if (paramIncrease) methodScreens[screenName].params[paramName].changeStep += changeStepValue; // Увеличение
                            methodScreens[screenName].params[paramName].changeStep = Math.constrain(methodScreens[screenName].params[paramName].changeStep, minVal, maxVal); // Ограничение диапазона возможного числа
                        }
                        if (cursor == screenParamsNum + 2) PidParamsStep("Kp", 0.01, 0.001, 0.001, 1);
                        else if (cursor == screenParamsNum + 3) PidParamsStep("Ki", 0.001, 0.0001, 0.0001, 100);
                        else if (cursor == screenParamsNum + 4) PidParamsStep("Kd", 0.01, 0.001, 0.001, 100);
                        else if (cursor == screenParamsNum + 5) PidParamsStep("N", 0.01, 0.001, 0.001, 100);
                    }
                    loops.pause(BTN_PRESS_LOOP_DELAY);
                    continue;
                }
            } else { // Если изменение не активно
                if (brick.buttonLeft.wasPressed() && control.timer1.millis() >= 100) {
                    screenChanged = true;
                    if (screen > 0) screen--;
                    else screen = screensNums - 1;
                    music.playToneInBackground(Note.C, 50); // Сигнал о переключении экрана
                } else if (brick.buttonRight.wasPressed() && control.timer1.millis() >= 100) {
                    screenChanged = true;
                    if (screen < screensNums - 1) screen++;
                    else screen = 0;
                    music.playToneInBackground(Note.C, 50); // Сигнал о переключении экрана
                }
            }

            // Обрабатываем нажатия
            if (brick.buttonUp.wasPressed()) { // Если нажали кнопку вверх
                if (confirm) confirm = !confirm; // Если изменение было активно, тогда отключаем подтверждение изменения
                if (cursor > 0) { // Изменить курсор, если значение больше первой строке с числом на экране
                    cursor--;
                    if (cursor >= LINE_SCROLL_TRESHOLD) scroll--;
                    else scroll = 0;
                } else { // Иначе ставим курсор в конец и устанавливаем скролл на последнюю строку
                    cursor = totalStrNum - 1;
                    scroll = screenParamsNum + 1;
                }
                music.playToneInBackground(Note.F, 50); // Сигнал
            } else if (brick.buttonDown.wasPressed()) { // Если нажали кнопку вниз
                if (confirm) confirm = !confirm; // Если изменение было активно, тогда отключаем подтверждение изменения
                if (cursor < totalStrNum - 1) { // Изменить курсор, если значение меньше количеству строк с значениями на экране
                    cursor++;
                    if (cursor >= LINE_SCROLL_TRESHOLD) scroll++;
                    else scroll = 0;
                } else { // Иначе ставим курсор в начало и убираем скролл
                    cursor = 0;
                    scroll = 0;
                }
                music.playToneInBackground(Note.F, 50); // Сигнал
            }
            // Обрабатываем нажатие ENTER
            if (brick.buttonEnter.wasPressed()) {
                if (cursor == 0 || cursor == screenParamsNum + 1) { // Нажали на строку RUN TEST?
                    music.playToneInBackground(Note.D, 100); // Сигнал, что было запущено
                    brick.clearScreen();
                    // Запускаем выполнение теста
                    if (screenName == "SYNC_DIST_MOVE") {
                        const dist = methodScreens[screenName].params.dist.val;
                        const v = methodScreens[screenName].params.v.val;
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        chassis.setSyncRegulatorGains(params.Kp, params.Ki, params.Kd);
                        chassis.linearDistMove(dist, v, MotionBraking.Hold);
                    } else if (screenName == "SYNC_RAMP_DIST_MOVE") {
                        const minV = methodScreens[screenName].params.minV.val;
                        const maxV = methodScreens[screenName].params.maxV.val;
                        const totalDist = methodScreens[screenName].params.totalDist.val;
                        const accelDist = methodScreens[screenName].params.accelDist.val;
                        const decelDist = methodScreens[screenName].params.totalDist.val;
                        const params = {
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        chassis.setSyncRegulatorGains(params.Kp, params.Ki, params.Kd);
                        chassis.rampLinearDistMove(minV, maxV, minV, totalDist, accelDist, decelDist);
                    } else if (screenName == "LW_2S_TO_INTERSECTION") {
                        const debug = methodScreens[screenName].params.debug.val;
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        motions.lineFollowToCrossIntersection(AfterLineMotion.HoldStop, params, debug);
                    } else if (screenName == "LW_2S_TO_DISTANCE") {
                        const dist = methodScreens[screenName].params.dist.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        motions.lineFollowToDistanceByTwoSensors(dist, AfterLineMotion.HoldStop, params, debug);
                    } else if (screenName == "LW_TO_SIDE_INTERSECTION") {
                        const junction = methodScreens[screenName].params.junction.val;
                        const lineLocation = methodScreens[screenName].params.lineLocation.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        motions.lineFollowToSideIntersection(junction, AfterLineMotion.HoldStop, params, debug);
                    } else if (screenName == "CHASSIS_SPIN_TURN") {
                        const deg = methodScreens[screenName].params.deg.val;
                        const v = methodScreens[screenName].params.v.val;
                        const baseLength = methodScreens[screenName].params.base_length.val;
                        chassis.setBaseLength(baseLength);
                        chassis.spinTurn(deg, v);
                    } else if (screenName == "CHASSIS_PIVOT_TURN") {
                        const deg = methodScreens[screenName].params.deg.val;
                        const pivot = methodScreens[screenName].params.pivot.val;
                        const v = methodScreens[screenName].params.v.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const baseLength = methodScreens[screenName].params.base_length.val;
                        chassis.setBaseLength(baseLength);
                        chassis.pivotTurn(deg, v, pivot);
                    } else if (screenName == "SMART_SPIN_TURN") {
                        const deg = methodScreens[screenName].params.deg.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const baseLength = methodScreens[screenName].params.base_length.val;
                        chassis.setBaseLength(baseLength);
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        chassis.smartSpinTurn(deg, params, debug);
                    } else if (screenName == "SMART_PIVOT_TURN") {
                        const deg = methodScreens[screenName].params.deg.val;
                        const pivot = methodScreens[screenName].params.pivot.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const baseLength = methodScreens[screenName].params.base_length.val;
                        chassis.setBaseLength(baseLength);
                        const params = {
                            v: methodScreens[screenName].params.v.val,
                            Kp: methodScreens[screenName].params.Kp.val,
                            Ki: methodScreens[screenName].params.Ki.val,
                            Kd: methodScreens[screenName].params.Kd.val,
                            N: methodScreens[screenName].params.N.val
                        };
                        chassis.smartPivotTurn(deg, pivot, params, debug);
                    } else if (screenName == "LINE_ALIGNMET") {
                        const lineLocation = methodScreens[screenName].params.location.val;
                        const time = methodScreens[screenName].params.time.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        const params = {
                            maxV: methodScreens[screenName].params.maxV.val,
                            timeOut: methodScreens[screenName].params.timeOut.val,
                            leftKp: methodScreens[screenName].params.leftKp.val,
                            rightKp: methodScreens[screenName].params.rightKp.val,
                            leftKi: methodScreens[screenName].params.leftKi.val,
                            rightKi: methodScreens[screenName].params.rightKi.val,
                            leftKd: methodScreens[screenName].params.leftKd.val,
                            rightKd: methodScreens[screenName].params.rightKd.val,
                            leftN: methodScreens[screenName].params.leftN.val,
                            rightN: methodScreens[screenName].params.rightN.val
                        };
                        levelings.lineAlignment(lineLocation, time, params, debug);
                    } else if (screenName == "LINE_ALIGNMET_IN_MOTION") {
                        const v = methodScreens[screenName].params.v.val;
                        const debug = methodScreens[screenName].params.debug.val;
                        levelings.lineAlignmentInMotion(v, AfterMotion.HoldStop, debug)
                    }
                } else { // Если нажали на обычную строку с параметром, то подтверждаем для возможности его изменения
                    music.playToneInBackground(Note.F, 50); // Сигнал
                    if (confirm) control.timer1.reset(); // Костыль от переключения экрана после изменения коэффициента и применения
                    confirm = !confirm; // Измение состояния выбора
                    continue;
                }
            }

            loops.pause(LOOP_DELAY);
        }
    }
}