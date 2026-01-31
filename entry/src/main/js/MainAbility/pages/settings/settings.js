import vibrator from '@system.vibrator';
import brightness from '@system.brightness';
import router from '@ohos.router';

export default {
    data: {
        title: 'Vibration',
        vibrationEnabled: true,
        amount: 5,
        brightness: 0,
        lastvalue: 0
    },
    onInit() {
        brightness.getValue({
            success: (data) => {
                this.brightness = data.value;
            }
        });
    },
    setValue(e) {
        this.brightness = e.value;
        brightness.setValue({
            value: this.brightness
        });
    },
    switchChange(e) {
        this.vibrationEnabled = e.checked;
        if (this.vibrationEnabled) {
            vibrator.vibrate({ mode: 'short' });
        }
    },
    onSwipe(e) {
        if (e.direction === 'right') {
            router.replaceUrl({
                uri: 'pages/mainPage/mainPage'
            });
        }
    },
    toggleSwitch() {
        this.vibrationEnabled = !this.vibrationEnabled;

        if (this.vibrationEnabled) {
            vibrator.vibrate({ mode: 'short' });
        }
    }
};