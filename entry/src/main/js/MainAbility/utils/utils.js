function getTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const strTime = `${hours}:${minutes}`;
    return { time: `${strTime}`, ampm: `${ampm}` };
}

export default { getTime };