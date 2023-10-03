import {Injectable} from "@nestjs/common";
import {firebaseAdmin} from "./firebase-admin";

@Injectable()
export class FirebaseService {
    constructor() {}

    async sendNotification(body: {}): Promise<any> {
        try {
            const notification = {
                ...body,
                topic: 'test', // The topic to which the notification will be sent
            };

            let response = await firebaseAdmin.messaging().send(notification);

            return {
                success: true,
                message: 'Notification sent successfully',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Notification not sent',
                data: error
            };
        }
    }

    async sendNotificationToDevice(fcm_token: string, body: {}): Promise<any> {
        try {
            const notification = {
                ...body,
                // topic: 'test', // The topic to which the notification will be sent
                tokens: [fcm_token], // The topic to which the notification will be sent
            };

            let response = await firebaseAdmin.messaging().sendMulticast(notification);
            console.log('----sendNotificationToDevice----');
            console.log(response);

            return {
                success: true,
                message: 'Notification sent successfully',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Notification not sent',
                data: error
            };
        }
    }
}
