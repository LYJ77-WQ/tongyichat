import express from 'express'; //导入 Express 框架，用于构建web 服务器 
import cors from 'cors'; // 导入CORS 中间件，用于处理跨域请求
import OpenAI from 'openai'; //导入 OpenAI 官方库，用于与OpenAI API 交互
import { fileURLToPath } from 'url'; //导入url 模块的 fileURLToPath函数，
import { dirname,join } from 'path';
console.log("===================服务器初始化开始==============");
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
console.log(`当前路径：${_dirname}`);
const app = express(); //创建一个Express 应用
const port = process.env.PORT || 3000; //设置服务器端口，默认为3000端口
console.log(`当前端口：${port}`);
app.use(cors()); //使用CORS 中间件，
app.use(express.json()); //解析JSON格式的请求体
app.use(express.static(join(_dirname, 'public'))); //提供静态文件服务，默认目录为public
console.log("中间层配置成功");
//创建OpenAI 实例，配置API密钥和基础URL
const openai = new OpenAI({
    apiKey: "sk-881d1e441fc54e94a82de385147f676d",
    baseURL:"https://dashscope.aliyuncs.com/compatible-mode/v1"
});
console.log("OpenAI实例创建成功");
//定义一个POST路由，处理/api/chat 接口的请求
app.post('/api/chat', async (req, res) => {
    console.log("===========收到聊天请求==========");
    console.log('请求时间: ${new Date().toLocaleString()}');
    try {
        const {messages} = req.body; //请求体中获取消息数组
        console.log('接收到的消息：',messages); //打印接收到的消息
        const comleption = await openai.chat.completions.create({
            model: "qwen-plus", //使用的模型
            messages: [
                { role: "system", content: "你是一个有好的助手" },
                ...messages
            ]
        });
        console.log("AI接口调用成功");
        const aiResponse = comleption.choices[0].message.content; //获取AI的回复内容
        const aiRole = comleption.choices[0].message.role; //获取AI的角色
        console.log(`AI回复的内容：${aiRole};${aiResponse.substring(0, 50)}...`);
        res.json({
            message: aiResponse,
            role: aiRole
        }); //将AI回复的内容作为JSON响应返回
        console.log("AI回复已发送给用户浏览器");
    } catch (error) {
        console.error("AI接口调用失败：",error);
    }
});

app.listen(port, () => {
    console.log(`服务器正在监听端口 ${port}`);
    console.log(`地址: http://localhost:${port}`);
});
