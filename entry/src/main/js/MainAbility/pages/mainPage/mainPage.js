import router from '@ohos.router';
import utils from '../../utils/utils';
import file from '@system.file';
import app from '@system.app';
import device from '@system.device';
import sensor from '@system.sensor';

export default {
    data: {
        menuList: [
            {
                name: 'Tracking',
                src: '/images/tracking.png',
                url: 'pages/mainPage/mainPage'
            },
            {
                name: 'Trainings',
                src: '/images/training.png',
                url: 'pages/mainPage/mainPage'

            },
            {
                name: 'Settings',
                src: '/images/settings.png',
                url: 'pages/settings/settings'
            }
        ],
        trackingData: {
            'daily': {
                steps: '1234',
                target: '12345'

            },
            'weakly': {
                steps: '1233',
                target: '12345'
            }
        },
        title: '',
        pages: ['1', '2', '3'],
        tracking: ['1', '2', '3'],
        text: 'test',
        percent: 0,
        currentIndex: 1,
        dotIndex: 1,
        trackingDotIndex: 0,
        heart: 0,
        steps: 0,
        systemTime: null,
        intervalId: null,
        trainingList: null,
        rect: false,
        time: 0,
        cal: 0,
        prevStep: 0,
        sensorResult: null
    },
    onInit() {
        this.systemTime = utils.getTime();
        const td = this.getTrainings();
        this.trainingList = JSON.parse(td);
        this.subscribeStepCounter();
        this.subscribeHeartRate();
        setInterval(() => {
            this.systemTime = utils.getTime();
        }, 1000);
    },
    routeOutputScreen() {
        router.replaceUrl({
            uri: 'pages/index/index'
        });
    },
    getDeviceType() {
        device.getInfo({
            success: (e) => {
                if (e.screenShape === 'rect') {
                    this.rect = true;
                }
            }
        });
    },
    getTrainings() {
        let trainingData = '';
        let finished = false;
        let idx = 0;
        while (!finished) {
            file.readText({
                uri: 'internal://app/rawfile/training.txt',
                length: 4000,
                position: 4000 * idx,
                success: (x) => {
                    idx++;
                    trainingData = trainingData + x.text;
                    if (x.text.length < 4000) {
                        finished = true;
                    }
                },
                fail: (data, err) => {
                    console.info('Finished ERROR');
                    console.info(data);
                    console.info(err);
                    return trainingData;
                }
            });

        }
        return trainingData;
    },
    estimateCalories(hr, steps) {
        if (steps === 0) {
            return;
        }
        if (hr === 0) {
            hr = 130;
        }
        if (this.steps === this.prevStep) {
            return;
        }
        const calFromSteps = steps * 0.05;
        const hrFactor = Math.max((hr - 60) / 100, 0);

        this.cal = Math.round((calFromSteps * (1 + hrFactor) / 5));
    },
    click(trainingData) {
        if (!trainingData) {
            return;
        }

        router.replaceUrl({
            uri: 'pages/training/training',
            params: {
                'trainingData': trainingData
            }
        });
    },
    clickMenuItem(menuItem) {
        if (!menuItem) {
            return;
        }

        router.replaceUrl({
            uri: menuItem.url,
            params: { currentIndex: menuItem.name === 'Trainings' ? 2 : 0 }
        });
    },
    change(e) {
        this.dotIndex = e.index;
    },
    changeTracking(e) {
        this.trackingDotIndex = e.index;
    },
    onDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },
    subscribeStepCounter() {
        this.unsubscribeHeartRate();
        this.unsubscribeOnBodyState();
        const subscribeOptions = {
            success: (ret) => {
                this.steps = ret.steps;
                this.trackingData.daily.steps = this.steps;
                this.estimateCalories(this.heart, this.steps);
                this.prevStep = ret.steps;
                this.steps = ret.steps;
            },
            fail: (data, code) => {
                console.error(`Step counter failed. Code: ${code}, data: ${data}`);
                this.sensorResult = `Error: ${code} - ${data}`;
            }
        };
        sensor.subscribeStepCounter(subscribeOptions);
    },
    subscribeHeartRate() {
        const subscribeOptions = {
            success: (ret) => {
                this.heart = ret.heartRate;
            },
            fail: (data, code) => {
                console.error(`Heart rate failed. Code: ${code}, data: ${data}`);
                this.sensorResult = `Error: ${code} - ${data}`;
            }
        };
        sensor.subscribeHeartRate(subscribeOptions);
    },
    subscribeOnBodyState() {
        const subscribeOptions = {
            success: (ret) => {
                console.info(`On body state data: value=${ret.value}`);
                this.sensorResult = `On Body: ${ret.value}`;
            },
            fail: (data, code) => {
                console.error(`On body state failed. Code: ${code}, data: ${data}`);
                this.sensorResult = `Error: ${code} - ${data}`;
            }
        };
        sensor.subscribeOnBodyState(subscribeOptions);
    },
    getOnBodyState() {
        const getOptions = {
            success: (ret) => {
                console.info(`Get on body state: value=${ret.value}`);
                this.sensorResult = `On Body: ${ret.value}`;
            },
            fail: (data, code) => {
                console.error(`Get on body state failed. Code: ${code}, data: ${data}`);
                this.sensorResult = `Error: ${code} - ${data}`;
            }
        };
        sensor.getOnBodyState(getOptions);
    },
    unsubscribeStepCounter() {
        sensor.unsubscribeStepCounter();
    },
    unsubscribeHeartRate() {
        sensor.unsubscribeHeartRate();
    },
    unsubscribeOnBodyState() {
        sensor.unsubscribeOnBodyState();
    },
    swipeEvent(e) {
        if (e.direction === 'right') {
            app.terminate();
        }
    }
};