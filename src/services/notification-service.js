/* eslint-disable */

class NotificationService {
	constructor() {
		this.expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
	}

	async sendPushNotification(pushTokens, title, body, data = {}) {
		try {
			const tokenArray = Array.isArray(pushTokens) ? pushTokens : [pushTokens];

			const messages = tokenArray.map((token) => ({
				to: token,
				sound: "default",
				title,
				body,
				data,
				priority: "high",
			}));

			const response = await axios.post(this.expoPushEndpoint, messages, {
				headers: {
					Accept: "application/json",
					"Accept-encoding": "gzip, deflate",
					"Content-Type": "application/json",
				},
			});

			console.log("Push notification sent:", response.data);
			return response.data;
		} catch (error) {
			console.error("Error sending push notification:", error);
			throw error;
		}
	}
}

export default new NotificationService();
