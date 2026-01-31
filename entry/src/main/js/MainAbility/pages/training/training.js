import router from '@ohos.router';

export default {
    data: {
        trainingData: null,
        currentExerciseIndex: 0,
        timerInterval: null,
        remainingTime: 0,
        totalRemainingTime: 0,
        trainingHeader: '',
        moveName: '',
        timer: '00:00',
        totalTimer: '00:00',
        moveCount: 0,
        isPlaying: false,
        difficulty: ''
    },
    onInit() {
        this.totalRemainingTime = parseInt(this.trainingData.total_duration);
        this.moveCount = this.trainingData.exercises.length;
        this.setCurrentExercise();
    },
    setCurrentExercise() {
        const currentExercise = this.trainingData.exercises[this.currentExerciseIndex];
        this.trainingHeader = currentExercise.name;
        this.difficulty = currentExercise.difficulty;
        this.moveName = this.trainingData.training_name;
        this.remainingTime = parseInt(currentExercise.duration);
        this.formatAllTimers();
    },
    formatTime(time) {
        const m = Math.floor(time / 60);
        const s = time % 60;
        return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
    },
    formatAllTimers() {
        this.timer = this.formatTime(this.remainingTime);
        this.totalTimer = this.formatTime(this.totalRemainingTime);
    },
    updateTimer() {
        if (this.remainingTime > 0) {
            this.remainingTime--;
            this.totalRemainingTime--;
            this.formatAllTimers();
            this.timerInterval = setTimeout(() => this.updateTimer(), 1000);
            return;
        }
        this.nextExercise();
    },
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
            return;
        }
        this.start();
    },
    start() {
        if (!this.timerInterval) {
            this.isPlaying = true;
            this.updateTimer();
        }
    },
    pause() {
        this.isPlaying = false;
        clearTimeout(this.timerInterval);
        this.timerInterval = null;
    },
    prevExercise() {
        this.pause();
        if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
            this.setCurrentExercise();
            this.calculateTotalRemaining();
        }
    },
    nextExercise() {
        this.pause();
        if (this.currentExerciseIndex < this.trainingData.exercises.length - 1) {
            this.currentExerciseIndex++;
            this.setCurrentExercise();
            this.calculateTotalRemaining();
            return;
        }
        this.trainingHeader = 'Done!';
        this.timer = '00:00';
        this.totalTimer = '00:00';
    },
    calculateTotalRemaining() {
        let total = 0;
        for (let i = this.currentExerciseIndex; i < this.trainingData.exercises.length; i++) {
            if (i === this.currentExerciseIndex) {
                total += this.remainingTime;
            } else {
                total += parseInt(this.trainingData.exercises[i].duration);
            }
        }
        this.totalRemainingTime = total;
        this.formatAllTimers();
    },
    onSwipe(e) {
        if (e.direction === 'right') {
            router.replaceUrl({
                uri: 'pages/mainPage/mainPage',
                params: {
                    currentIndex: 2,
                    dotIndex: 2
                }
            });
        }
    }
};