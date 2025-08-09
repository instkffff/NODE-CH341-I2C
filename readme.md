文档是AI写的，有问题自己看ch341.js。
高级用法我也不太会，可以去沁恒官网看看示例，基本就是包装了CH341DLL.H，用法也是相通的。
因为CH341只支持常规速度的usb，我就没封装spi，并口，gpio，pwm等需要高速的高级功能（继续封装只是体力劳动而已）。

# CH341-I2C 使用文档

## 简介

CH341-I2C 是一个用于在 Windows 平台上通过 CH341 USB 转 I2C 接口芯片与 I2C 设备通信的 Node.js 库。

## 安装

```bash
npm install ch341-i2c
```

## 快速开始

```javascript
import { openDevice, closeDevice, writeI2C, readI2C } from 'ch341-i2c';

// 打开设备
const device = openDevice();
if (!device.success) {
  console.error('无法打开设备');
  process.exit(1);
}

// 向 I2C 设备写入数据
const result = writeI2C(0, 0x50, 0x00, 0xAB); // 设备地址0x50, 寄存器0x00, 写入0xAB
if (!result) {
  console.error('写入失败');
}

// 从 I2C 设备读取数据
const readResult = readI2C(0, 0x50, 0x00); // 设备地址0x50, 寄存器0x00
if (readResult.success) {
  console.log('读取到的数据:', readResult.data);
}

// 关闭设备
closeDevice();
```

## API 参考

### 设备管理函数

#### openDevice(index = 0)
打开 CH341 设备
- `index`: 设备索引号，默认为 0
- 返回: `{ success: boolean, handle: object }`

#### closeDevice(index = 0)
关闭 CH341 设备
- `index`: 设备索引号，默认为 0

#### getVersion()
获取 DLL 版本号
- 返回: 版本号 (uint32)

#### getDrvVersion()
获取驱动版本号
- 返回: 版本号 (uint32)

#### getVerIC(index = 0)
获取芯片版本号
- `index`: 设备索引号，默认为 0
- 返回: 芯片版本号 (uint32)

### I2C 操作函数

#### writeI2C(index, device, addr, data)
向 I2C 设备写入单字节数据
- `index`: 设备索引号
- [device](file://h:\dev\ch341a\example.js#L163-L163): 设备地址
- `addr`: 寄存器地址
- [data](file://h:\dev\ch341a\ssd1306.js#L77-L83): 要写入的数据
- 返回: 操作是否成功 (boolean)

#### readI2C(index, device, addr)
从 I2C 设备读取单字节数据
- `index`: 设备索引号
- [device](file://h:\dev\ch341a\example.js#L163-L163): 设备地址
- `addr`: 寄存器地址
- 返回: `{ success: boolean, data: number }`

#### streamI2C(index, writeLength, writeBuffer, readLength, readBuffer)
I2C 数据流传输
- `index`: 设备索引号
- `writeLength`: 写入数据长度
- [writeBuffer](file://h:\dev\ch341a\example.js#L17-L21): 写入数据缓冲区
- `readLength`: 读取数据长度
- [readBuffer](file://h:\dev\ch341a\i2c-scanner.js#L68-L68): 读取数据缓冲区
- 返回: 操作是否成功 (boolean)

#### readEEPROM(index, eepromID, addr, length, buffer)
读取 EEPROM 数据
- `index`: 设备索引号
- `eepromID`: EEPROM 类型 ID
- `addr`: 起始地址
- `length`: 数据长度
- [buffer](file://h:\dev\ch341a\example.js#L37-L41): 数据缓冲区
- 返回: 操作是否成功 (boolean)

#### writeEEPROM(index, eepromID, addr, length, buffer)
写入 EEPROM 数据
- `index`: 设备索引号
- `eepromID`: EEPROM 类型 ID
- `addr`: 起始地址
- `length`: 数据长度
- [buffer](file://h:\dev\ch341a\example.js#L37-L41): 数据缓冲区
- 返回: 操作是否成功 (boolean)

#### writeRead(index, writeLength, writeBuffer, readStep, readTimes, readBuffer)
写入并读取数据
- `index`: 设备索引号
- `writeLength`: 写入数据长度
- [writeBuffer](file://h:\dev\ch341a\example.js#L17-L21): 写入数据缓冲区
- `readStep`: 读取步长
- `readTimes`: 读取次数
- [readBuffer](file://h:\dev\ch341a\i2c-scanner.js#L68-L68): 读取数据缓冲区
- 返回: `{ success: boolean, readLength: number }`

### 数据块操作函数

#### writeData(index, buffer, length)
写入数据块
- `index`: 设备索引号
- [buffer](file://h:\dev\ch341a\example.js#L37-L41): 数据缓冲区
- `length`: 数据长度
- 返回: `{ success: boolean, writtenLength: number }`

#### readData(index, buffer, length)
读取数据块
- `index`: 设备索引号
- [buffer](file://h:\dev\ch341a\example.js#L37-L41): 数据缓冲区
- `length`: 数据长度
- 返回: `{ success: boolean, readLength: number }`

### 常量

#### I2C 速度设置
- `I2C_SPEED_LOW`: 20KHz
- `I2C_SPEED_STANDARD`: 100KHz
- `I2C_SPEED_FAST`: 400KHz
- `I2C_SPEED_HIGH`: 750KHz

#### EEPROM 类型
- `ID_24C01`, `ID_24C02`, `ID_24C04`, `ID_24C08`, `ID_24C16`
- `ID_24C32`, `ID_24C64`, `ID_24C128`, `ID_24C256`, `ID_24C512`
- `ID_24C1024`, `ID_24C2048`, `ID_24C4096`

#### I2C Stream Commands
- `CMD_I2C_STREAM`: 0xAA
- `CMD_I2C_STM_STA`: 0x74
- `CMD_I2C_STM_STO`: 0x75
- `CMD_I2C_STM_OUT`: 0x80
- `CMD_I2C_STM_IN`: 0xC0
- `CMD_I2C_STM_END`: 0x00
- `CMD_I2C_STM_MAX_LEN`: 0x20 (32 bytes)

### 工具函数

#### delay(ms)
延迟函数
- `ms`: 延迟毫秒数

## 使用示例

### 读写 EEPROM

```javascript
import { openDevice, closeDevice, readEEPROM, writeEEPROM, ID_24C02 } from 'ch341-i2c';

const device = openDevice();
if (device.success) {
  const buffer = Buffer.alloc(16);
  
  // 读取 EEPROM 数据
  const readResult = readEEPROM(0, ID_24C02, 0x00, 16, buffer);
  if (readResult) {
    console.log('读取的数据:', buffer);
  }
  
  // 写入 EEPROM 数据
  buffer.fill(0xAA);
  const writeResult = writeEEPROM(0, ID_24C02, 0x00, 16, buffer);
  console.log('写入结果:', writeResult);
  
  closeDevice();
}
```

### 使用 scan 模块扫描设备

```javascript
import scan from 'ch341-i2c/scan';

// 扫描 I2C 总线上的设备
const devices = scan();
console.log('找到的设备:', devices);
```

## 注意事项

1. 仅支持 Windows 平台 (支持 x64 和 ia32 架构)
2. 需要安装 CH341 驱动程序
3. 需要管理员权限运行
4. 确保 CH341 设备已正确连接到计算机