import { PHONE_APP_FINGERPRINT, PHONE_APP_PACKAGE_NAME } from '../common/constants';
import { Builder, Message, P2pClient } from '../wearengine/wearengine';
import file from '@system.file';

export const wearService = {
    p2pClient: new P2pClient(),
    messageClient: new Message(),
    builderClient: new Builder(),
    file,
    constants: {
        PHONE_APP_FINGERPRINT,
        PHONE_APP_PACKAGE_NAME
    },

    setFingerprint() {
        this.p2pClient.setPeerPkgName(this.constants.PHONE_APP_PACKAGE_NAME);
        this.p2pClient.setPeerFingerPrint(this.constants.PHONE_APP_FINGERPRINT);
    },

    registerMessageReceiver() {
        this.p2pClient.registerReceiver({
            onSuccess: function() {
                console.info('Register message successfully');
            },
            onFailure: function() {
                console.error('Register message fail');
            },
            onReceiveMessage: (data) => {
                if (data?.isFileType) {
                    console.info(`Receive file name: ${data.name}`);
                    const content = this.getPlaylist('internal://app/playlist.json');
                    content !== '' ?
                        this.playlist = JSON.parse(content) :
                        this.playlist = '';
                    return;
                }
                console.info(`Receive message: ${data}`);
            }
        });
    },

    unregisterMessage() {
        this.p2pClient.unregisterReceiver({
            onSuccess: function() {
                console.info('Stop receiving messages is sent');
            }
        });
    },

    sendMusicAction(actionType) {
        const command = {
            action: actionType
        };
        this.builderClient.setDescription(JSON.stringify(command));
        this.messageClient.builder = this.builderClient;
        this.p2pClient.send(this.messageClient, {
            onSuccess: function() {
                console.info('success');
            },
            onFailure: function() {
                console.info(`${actionType} command failed`);
            },
            onSendResult: function(resultCode) {
                console.info(resultCode.data + resultCode.code);
            },
            onSendProgress: function(count) {
                console.info(`send proccess: ${count}`);
            }
        });
    },

    getPlaylist(path) {
        let accumulate = '';
        let finished = false;
        let idx = 0;
        while (!finished) {
            this.file.readText({
                uri: path,
                length: 4000,
                position: 4000 * idx,
                success: (x) => {
                    idx++;
                    accumulate = accumulate + x.text;
                    if (x.text.length < 4000) {
                        finished = true;
                    }
                },
                fail: (data, err) => {
                    return accumulate;
                }
            });
        }
        return accumulate;
    },

    unregisterMessageReceiver() {
        this.p2pClient.unregisterReceiver({
            onSuccess: function() {
                console.info('Stop receiving messages is sent');
            }
        });
    }
};

export const {
    setFingerprint,
    registerMessageReceiver,
    unregisterMessage,
    sendMusicAction,
    getPlaylist,
    unregisterMessageReceiver
} = wearService;