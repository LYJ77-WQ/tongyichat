//当dom完全加载之后执行脚本，就是把这个html,css都渲染出来之后，在执行js文件
document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages"); //聊天内容框
    const userInput = document.getElementById("user-input");//用户输入框
    const sendBth = document.getElementById("send-btn"); //发送按钮
    let messages = [{
        role: "assistant", //角色助手
        content: "你好，我是基于阿里的ai助手！"
    }]; //用于存储聊天消息的数组

    //发送消息的函数
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;
        userInput.value = "";
        userInput.focus();
        appendMessage("user", userMessage); //将用户消息添加到聊天页面
        messages.push({
            role: "user", //角色为用户
            content: userMessage
        }); //将用户消息添加到消息数组中
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "message assistant";
        loadingDiv.innerHTML = `
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);//添加加载动画
        chatMessages.scrollTop = chatMessages.scrollHeight; //滚动到最新消息
        axios.post('/api/chat', {
            messages
        }).then((response) => {
            chatMessages.removeChild(loadingDiv);
            appendMessage("assistant", response.data.message);
            messages.push({
                role: response.data.role, //角色为助手
                content: response.data.message
            });
        });
    }     //定义将用户消息添加到聊天界面的函数

    function appendMessage(sender, content) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;
        chatMessages.appendChild(messageDiv); //将消息添加到聊天内容框中
        chatMessages.scrollTop = chatMessages.scrollHeight; //滚动到最新消息
    }
    sendBth.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); //阻止默认行为（换行）
            sendMessage(); //发送消息
        }
    });
    userInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight < 120 ? this.scrollHeight + "px" : "120px"; //设置输入框高度
    });
});