class WebSocketClass {
	constructor(userId, time = 60, callback) {
		// 用户id
		this.userId = userId;
		// WebSocket地址，注意修改为实际地址
		this.url = `ws://127.0.0.1:4000?uid=${userId}`;
		// 心跳检测间隔时间，默认为60秒
		this.timeoutNumber = time;
		// 消息处理回调函数
		this.callback = callback;
		// WebSocket 实例
		this.socketInstance = null;
		// 心跳定时器
		this.heartbeatInterval = null;
		// 断线重连定时器
		this.reconnectInterval = null;
		// WebSocket 是否连接成功
		this.isConnect = false;
		// 是否是主动关闭 WebSocket
		this.isInitiativeClose = false;
		// 断线重连等待时间，默认为 3 秒
		this.reconnectWaitTime = 3;
	}

	// 初始化 WebSocket，包含自动重连
	initWithReconnect() {
		// 创建 WebSocket 实例
		this.connectWebSocket();

		// 监听 WebSocket 打开连接事件
		this.socketInstance.onopen = () => {
			console.log('WebSocket 连接成功');
			// 修改WebSocket连接状态
			this.isConnect = true;
			// 取消重连操作
			this.cancelReconnect();
			// 开始心跳检测
			this.startHeartbeat();
		};

		// 监听 WebSocket 接收到服务器的消息事件
		this.socketInstance.onmessage = (event) => {
			console.log('接收 WebSocket 消息：', event.data);
			const message = JSON.parse(event.data);
			if (this.callback) {
				// 处理消息
				this.callback(message);
			}
		};

		// 监听 WebSocket 关闭事件
		this.socketInstance.onclose = (event) => {
			console.log('WebSocket 连接关闭');
			// 修改 WebSocket 连接状态
			this.isConnect = false;
			// 尝试重新连接 WebSocket
			this.reconnectWebSocket();
		};

		// 监听 WebSocket 错误事件
		this.socketInstance.onerror = (event) => {
			console.log('WebSocket 连接错误');
			console.log(event);
			// 修改 WebSocket 主动关闭状态
			this.isInitiativeClose = false;
		};
	}

	// 创建 WebSocket 实例
	connectWebSocket() {
		this.socketInstance = new WebSocket(this.url);
	}

	// 发送消息
	sendMsg(data) {
		if (this.socketInstance && this.isConnect) {
			// 发送消息
			const message = JSON.stringify(data);
			this.socketInstance.send(message);
			console.log('发送 WebSocket 消息：', message);
		} else {
			console.log('WebSocket 尚未连接或消息发送失败');
		}
	}

	// 开始心跳检测
	startHeartbeat() {
		console.log('开启心跳检测');
		// 心跳消息
		const data = {
			state: 1,
			method: 'heartbeat'
		};
		// 设置心跳定时器
		this.heartbeatInterval = setInterval(() => {
			console.log('发送心跳');
			// 发送心跳消息
			this.sendMsg(data);
		}, this.timeoutNumber * 1000);
	}

	// 取消重连操作
	cancelReconnect() {
		clearTimeout(this.reconnectInterval);
		this.reconnectInterval = null;
	}

	// 重连 WebSocket
	reconnectWebSocket() {
		// 如果是主动关闭 WebSocket，则不重连
		if (this.isInitiativeClose) {
			console.log('WebSocket 已被主动关闭');
			return;
		}
		console.log(`尝试 ${this.reconnectWaitTime} 秒后重新连接 WebSocket`);
		// 设置重连定时器
		this.reconnectInterval = setTimeout(() => {
			console.log('重新连接 WebSocket');
			// 重新连接 WebSocket
			this.connectWebSocket();
		}, this.reconnectWaitTime * 1000);
	}

	// 关闭 WebSocket
	closeWebSocket(reason = '关闭') {
		if (this.socketInstance) {
			// 关闭 WebSocket
			this.socketInstance.close({
				reason,
				success() {
					// 修改 WebSocket 连接状态
					this.isConnect = false;
					// 修改主动关闭 WebSocket 状态
					this.isInitiativeClose = true;
					// 取消心跳检测
					clearInterval(this.heartbeatInterval);
					// 取消重连定时器
					clearTimeout(this.reconnectInterval);
					this.socketInstance = null;
					console.log('关闭 WebSocket 成功')
				},
				fail() {
					console.log('关闭 WebSocket 失败')
				}
			});
		} else {
			console.log('WebSocket 尚未创建或已关闭');
		}
	}
}

export default WebSocketClass;