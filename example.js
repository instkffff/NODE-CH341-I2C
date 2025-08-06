// example.js
import {
    openDevice,
    closeDevice,
    streamI2C,
} from './ch341.js';

// SSD1306 控制字节
const SSD1306_COMMAND = 0x80;
const SSD1306_DATA = 0x40;
const SSD1306_I2C_ADDRESS = 0x3C;

// 设备索引
const DEVICE_INDEX = 0;

// 发送命令到 SSD1306
function sendCommand(command) {
    const writeBuffer = Buffer.from([
        (SSD1306_I2C_ADDRESS << 1), // I2C 写地址
        SSD1306_COMMAND,            // 命令控制字节
        command                     // 实际命令
    ]);
    
    return streamI2C(
        DEVICE_INDEX,
        writeBuffer.length,
        writeBuffer,
        0,                          // 不需要读取
        Buffer.alloc(0)
    );
}

// 发送数据到 SSD1306
function sendData(data) {
    // 如果传入的是数字，转换为数组
    const dataArray = Array.isArray(data) ? data : [data];
    
    const buffer = Buffer.from([
        (SSD1306_I2C_ADDRESS << 1), // I2C 写地址
        SSD1306_DATA,               // 数据控制字节
        ...dataArray                // 实际数据
    ]);
    
    return streamI2C(
        DEVICE_INDEX,
        buffer.length,
        buffer,
        0,                          // 不需要读取
        Buffer.alloc(0)
    );
}

// SSD1306 初始化
function initSSD1306() {
    // 基本初始化序列
    const initCommands = [
        0xAE, // Display OFF (睡眠模式)
        0xD5, // 设置显示时钟分频因子/振荡器频率
        0x80, // 推荐值
        0xA8, // 设置多路复用率
        0x3F, // 1/64 duty (适用于128x64屏幕)
        0xD3, // 设置显示偏移
        0x00, // 无偏移
        0x40, // 设置显示开始行
        0x8D, // 电荷泵设置
        0x14, // 使能电荷泵
        0x20, // 设置内存寻址模式
        0x00, // 水平寻址模式
        0xA1, // 设置段重映射
        0xC8, // 设置COM输出扫描方向
        0xDA, // 设置COM引脚硬件配置
        0x12, // 替代COM引脚配置
        0x81, // 设置对比度控制
        0xCF, // 对比度值
        0xD9, // 设置预充电周期
        0xF1, // 预充电周期
        0xDB, // 设置VCOMH取消选择电平
        0x40, // VCOMH取消选择电平
        0xA4, // 整个显示开启/关闭 (正常显示)
        0xA6, // 正常/反显显示
        0x2E, // 取消滚动
        0xAF  // 显示开启
    ];

    // 发送初始化命令
    for (const cmd of initCommands) {
        if (!sendCommand(cmd)) {
            console.error(`发送命令 0x${cmd.toString(16)} 失败`);
            return false;
        }
    }
    
    console.log('SSD1306 初始化完成');
    return true;
}

// 清屏
function clearScreen() {
    // 设置内存地址到起始位置
    sendCommand(0x21); // 设置列地址
    sendCommand(0x00); // 起始列
    sendCommand(0x7F); // 结束列
    sendCommand(0x22); // 设置页地址
    sendCommand(0x00); // 起始页
    sendCommand(0x07); // 结束页
    
    // 发送清屏数据（全0，黑色）
    const clearData = new Array(128 * 8).fill(0);
    return sendData(clearData);
}

// 显示简单图案
function displayPattern() {
    // 设置内存地址到起始位置
    sendCommand(0x21); // 设置列地址
    sendCommand(0x00); // 起始列
    sendCommand(0x7F); // 结束列
    sendCommand(0x22); // 设置页地址
    sendCommand(0x00); // 起始页
    sendCommand(0x07); // 结束页
    
    // 创建一个简单的图案数据
    const patternData = new Array(128 * 8).fill(0);
    
    // 在前几页创建一些图案
    for (let page = 0; page < 8; page++) {
        for (let col = 0; col < 128; col++) {
            // 创建条纹图案
            patternData[page * 128 + col] = (col % 8 < 4) ? 0xFF : 0x00;
        }
    }
    
    return sendData(patternData);
}

// 显示文本（简单实现）
function displayText() {
    // 设置内存地址到起始位置
    sendCommand(0x21); // 设置列地址
    sendCommand(0x00); // 起始列
    sendCommand(0x7F); // 结束列
    sendCommand(0x22); // 设置页地址
    sendCommand(0x00); // 起始页
    sendCommand(0x07); // 结束页
    
    // 创建简单的文本数据（这里只是一个示例）
    const textData = new Array(128 * 8).fill(0);
    
    // 在第一页显示一些简单图案代表文字
    for (let col = 0; col < 128; col++) {
        // 创建简单的"HELLO"文字效果
        if (col >= 20 && col <= 108) {
            textData[col] = (col % 4 < 2) ? 0xFF : 0x00;
        }
    }
    
    return sendData(textData);
}

// 主程序
console.log('开始 SSD1306 测试...');

// 打开设备
const device = openDevice(DEVICE_INDEX);
if (!device.success) {
    console.error('无法打开 CH341 设备');
    process.exit(1);
}

console.log('CH341 设备已打开');

try {
    // 初始化屏幕
    console.log('初始化 SSD1306...');
    if (!initSSD1306()) {
        console.error('SSD1306 初始化失败');
        closeDevice(DEVICE_INDEX);
        process.exit(1);
    }
    
    // 清屏
    console.log('清屏...');
    clearScreen();
    
    // 等待一段时间
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    
    // 显示图案
    console.log('显示图案...');
    displayPattern();
    
    // 等待一段时间
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
    
    // 清屏
    console.log('清屏...');
    clearScreen();
    
    // 等待一段时间
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    
    // 显示文本
    console.log('显示文本...');
    displayText();
    
    console.log('SSD1306 测试完成');
    
} catch (error) {
    console.error('操作过程中发生错误:', error);
} finally {
    // 关闭设备
    closeDevice(DEVICE_INDEX);
    console.log('CH341 设备已关闭');
}