import koffi from 'koffi';

const ch341 = koffi.load('./lib/CH341DLLA64.DLL');

// ==================== 设备管理函数 ====================
const CH341OpenDevice = ch341.func('CH341OpenDevice', 'void*', ['uint32']);
const CH341CloseDevice = ch341.func('CH341CloseDevice', 'void', ['uint32']);
const CH341GetVersion = ch341.func('CH341GetVersion', 'uint32', []);
const CH341GetDrvVersion = ch341.func('CH341GetDrvVersion', 'uint32', []);
const CH341GetVerIC = ch341.func('CH341GetVerIC', 'uint32', ['uint32']);

// ==================== I2C 相关函数 ====================
const CH341StreamI2C = ch341.func('CH341StreamI2C', 'bool', ['uint32', 'uint32', 'void*', 'uint32', 'void*']);
const CH341ReadEEPROM = ch341.func('CH341ReadEEPROM', 'bool', ['uint32', 'uint32', 'uint32', 'uint32', 'void*']);
const CH341WriteEEPROM = ch341.func('CH341WriteEEPROM', 'bool', ['uint32', 'uint32', 'uint32', 'uint32', 'void*']);
const CH341ReadI2C = ch341.func('CH341ReadI2C', 'bool', ['uint32', 'uint8', 'uint8', 'uint8*']);
const CH341WriteI2C = ch341.func('CH341WriteI2C', 'bool', ['uint32', 'uint8', 'uint8', 'uint8']);
const CH341WriteRead = ch341.func('CH341WriteRead', 'bool', ['uint32', 'uint32', 'void*', 'uint32', 'uint32', 'uint32*', 'void*']);

// ==================== 数据块读写函数 ====================
const CH341WriteData = ch341.func('CH341WriteData', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341ReadData = ch341.func('CH341ReadData', 'bool', ['uint32', 'void*', 'uint32*']);

// ==================== I2C 速度设置 ====================
const I2C_SPEED_LOW = 0x00;        // 低速/20KHz
const I2C_SPEED_STANDARD = 0x01;   // 标准/100KHz
const I2C_SPEED_FAST = 0x02;       // 快速/400KHz
const I2C_SPEED_HIGH = 0x03;       // 高速/750KHz

// EEPROM 类型
const ID_24C01 = 0;
const ID_24C02 = 1;
const ID_24C04 = 2;
const ID_24C08 = 3;
const ID_24C16 = 4;
const ID_24C32 = 5;
const ID_24C64 = 6;
const ID_24C128 = 7;
const ID_24C256 = 8;
const ID_24C512 = 9;
const ID_24C1024 = 10;
const ID_24C2048 = 11;
const ID_24C4096 = 12;

// ==================== I2C Stream Commands ====================
const CMD_I2C_STREAM = 0xAA;
const CMD_I2C_STM_STA = 0x74;
const CMD_I2C_STM_STO = 0x75;
const CMD_I2C_STM_OUT = 0x80;
const CMD_I2C_STM_IN = 0xC0;
const CMD_I2C_STM_END = 0x00;
const CMD_I2C_STM_MAX_LEN = 0x20; // 32 bytes

// ==================== 设备管理函数封装 ====================
function openDevice(index = 0) {
    const handle = CH341OpenDevice(index);
    return handle ? { success: true, handle } : { success: false, handle: null };
}

function closeDevice(index = 0) {
    CH341CloseDevice(index);
}

function getVersion() {
    return CH341GetVersion();
}

function getDrvVersion() {
    return CH341GetDrvVersion();
}

function getVerIC(index = 0) {
    return CH341GetVerIC(index);
}

// ==================== I2C 函数封装 ====================
function streamI2C(index, writeLength, writeBuffer, readLength, readBuffer) {
    return CH341StreamI2C(index, writeLength, writeBuffer, readLength, readBuffer);
}

function readEEPROM(index, eepromID, addr, length, buffer) {
    return CH341ReadEEPROM(index, eepromID, addr, length, buffer);
}

function writeEEPROM(index, eepromID, addr, length, buffer) {
    return CH341WriteEEPROM(index, eepromID, addr, length, buffer);
}

function readI2C(index, device, addr) {
    const buffer = Buffer.alloc(1);
    const result = CH341ReadI2C(index, device, addr, buffer);
    return { success: result, data: buffer[0] };
}

function writeI2C(index, device, addr, data) {
    return CH341WriteI2C(index, device, addr, data);
}

function writeRead(index, writeLength, writeBuffer, readStep, readTimes, readBuffer) {
    const readLengthBuffer = Buffer.alloc(4);
    const result = CH341WriteRead(index, writeLength, writeBuffer, readStep, readTimes, readLengthBuffer, readBuffer);
    return { success: result, readLength: readLengthBuffer.readUInt32LE(0) };
}

// ==================== 数据块读写函数封装 ====================
function writeData(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341WriteData(index, buffer, lengthBuffer);
    return { success: result, writtenLength: lengthBuffer.readUInt32LE(0) };
}

function readData(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341ReadData(index, buffer, lengthBuffer);
    return { success: result, readLength: lengthBuffer.readUInt32LE(0) };
}

// ==================== 实用工具函数 ====================
function delay(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// 导出所有函数和常量
export {
    // 设备管理
    openDevice,
    closeDevice,
    getVersion,
    getDrvVersion,
    getVerIC,
    
    // I2C 相关
    streamI2C,
    readEEPROM,
    writeEEPROM,
    readI2C,
    writeI2C,
    writeRead,
    
    // 数据块读写
    writeData,
    readData,
    
    // I2C 速度设置
    I2C_SPEED_LOW,
    I2C_SPEED_STANDARD,
    I2C_SPEED_FAST,
    I2C_SPEED_HIGH,
    
    // EEPROM 类型
    ID_24C01,
    ID_24C02,
    ID_24C04,
    ID_24C08,
    ID_24C16,
    ID_24C32,
    ID_24C64,
    ID_24C128,
    ID_24C256,
    ID_24C512,
    ID_24C1024,
    ID_24C2048,
    ID_24C4096,
    
    // I2C Stream Commands
    CMD_I2C_STREAM,
    CMD_I2C_STM_STA,
    CMD_I2C_STM_STO,
    CMD_I2C_STM_OUT,
    CMD_I2C_STM_IN,
    CMD_I2C_STM_END,
    CMD_I2C_STM_MAX_LEN,

    // 工具函数
    delay
};