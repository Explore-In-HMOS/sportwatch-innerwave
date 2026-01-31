import router from '@ohos.router';

export default {
    data: {
        title: '',
        slides: [],
        currentIndex: 0,
        sensorResult: ''
    },
    onInit() {
        setTimeout(() => {
            router.replace({
                uri: 'pages/mainPage/mainPage'
            });
        }, 800);
    }
};