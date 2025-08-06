// example.js
import {
    openDevice,
    closeDevice,
    streamI2C,
    SSD1306_I2C_ADDRESS
} from './ch341.js';

// SSD1306 控制字节
const SSD1306_COMMAND = 0x80;
const SSD1306_DATA = 0x40;

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
    const buffer = Buffer.from([
        (SSD1306_I2C_ADDRESS << 1), // I2C 写地址
        SSD1306_DATA,               // 数据控制字节
        ...data                     // 实际数据
    ]);
    
    return streamI2C(
        DEVICE_INDEX,
        buffer.length,
        buffer,
        0,                          // 不需要读取
        Buffer.alloc(0)
    );
}

// SSD1306 简单亮屏
function lightSSD1306() {
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
    
    // 全屏点亮 - 使用" Entire Display On "命令
    if (!sendCommand(0xA5)) { // A5命令使整个显示点亮
        console.error('发送全屏点亮命令失败');
        return false;
    }
    
    console.log('屏幕已全亮');
    return true;
}

// 主程序
console.log('开始 SSD1306 亮屏测试...');

// 打开设备
const device = openDevice(DEVICE_INDEX);
if (!device.success) {
    console.error('无法打开 CH341 设备');
    process.exit(1);
}

console.log('CH341 设备已打开');

try {
    // 简单亮屏
    console.log('点亮 SSD1306...');
    if (!lightSSD1306()) {
        console.error('SSD1306 亮屏失败');
        closeDevice(DEVICE_INDEX);
        process.exit(1);
    }
    
    console.log('SSD1306 亮屏成功');
    
} catch (error) {
    console.error('操作过程中发生错误:', error);
} finally {
    // 关闭设备
    closeDevice(DEVICE_INDEX);
    console.log('CH341 设备已关闭');
}