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

// ==================== SPI 相关函数 ====================
const CH341SetStream = ch341.func('CH341SetStream', 'bool', ['uint32', 'uint32']);
const CH341WriteData = ch341.func('CH341WriteData', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341WriteRead = ch341.func('CH341WriteRead', 'bool', ['uint32', 'uint32', 'void*', 'uint32', 'uint32', 'uint32*', 'void*']);
const CH341StreamSPI4 = ch341.func('CH341StreamSPI4', 'bool', ['uint32', 'uint32', 'uint32', 'void*']);
const CH341StreamSPI5 = ch341.func('CH341StreamSPI5', 'bool', ['uint32', 'uint32', 'uint32', 'void*', 'void*']);
const CH341BitStreamSPI = ch341.func('CH341BitStreamSPI', 'bool', ['uint32', 'uint32', 'void*']);

// ==================== 并口相关函数 ====================
const CH341SetParaMode = ch341.func('CH341SetParaMode', 'bool', ['uint32', 'uint32']);
const CH341InitParallel = ch341.func('CH341InitParallel', 'bool', ['uint32', 'uint32']);
const CH341ReadData0 = ch341.func('CH341ReadData0', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341ReadData1 = ch341.func('CH341ReadData1', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341WriteData0 = ch341.func('CH341WriteData0', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341WriteData1 = ch341.func('CH341WriteData1', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341EppReadData = ch341.func('CH341EppReadData', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341EppReadAddr = ch341.func('CH341EppReadAddr', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341EppWriteData = ch341.func('CH341EppWriteData', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341EppWriteAddr = ch341.func('CH341EppWriteAddr', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341EppSetAddr = ch341.func('CH341EppSetAddr', 'bool', ['uint32', 'uint8']);
const CH341MemReadAddr0 = ch341.func('CH341MemReadAddr0', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341MemReadAddr1 = ch341.func('CH341MemReadAddr1', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341MemWriteAddr0 = ch341.func('CH341MemWriteAddr0', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341MemWriteAddr1 = ch341.func('CH341MemWriteAddr1', 'bool', ['uint32', 'void*', 'uint32*']);

// ==================== GPIO 相关函数 ====================
const CH341SetOutput = ch341.func('CH341SetOutput', 'bool', ['uint32', 'uint32', 'uint32', 'uint32']);
const CH341Set_D5_D0 = ch341.func('CH341Set_D5_D0', 'bool', ['uint32', 'uint32', 'uint32']);
const CH341GetInput = ch341.func('CH341GetInput', 'bool', ['uint32', 'uint32*']);
const CH341GetStatus = ch341.func('CH341GetStatus', 'bool', ['uint32', 'uint32*']);

// ==================== 串口相关函数 ====================
const CH341ReadData = ch341.func('CH341ReadData', 'bool', ['uint32', 'void*', 'uint32*']);
const CH341SetupSerial = ch341.func('CH341SetupSerial', 'bool', ['uint32', 'uint32', 'uint32']);

// ==================== 缓冲区相关函数 ====================
const CH341FlushBuffer = ch341.func('CH341FlushBuffer', 'bool', ['uint32']);
const CH341SetBufUpload = ch341.func('CH341SetBufUpload', 'bool', ['uint32', 'uint32']);
const CH341QueryBufUpload = ch341.func('CH341QueryBufUpload', 'int32', ['uint32']);
const CH341SetBufDownload = ch341.func('CH341SetBufDownload', 'bool', ['uint32', 'uint32']);
const CH341QueryBufDownload = ch341.func('CH341QueryBufDownload', 'int32', ['uint32']);

// ==================== 其他函数 ====================
const CH341SetTimeout = ch341.func('CH341SetTimeout', 'bool', ['uint32', 'uint32', 'uint32']);
const CH341SetDelaymS = ch341.func('CH341SetDelaymS', 'bool', ['uint32', 'uint32']);

// ==================== 常量定义 ====================
// I2C 相关常量
const SSD1306_I2C_ADDRESS = 0x3C;  // SSD1306 I2C 地址 (7-bit)

// SPI 模式常量
const SPI_MODE_0 = 0;              // CPOL=0, CPHA=0
const SPI_MODE_1 = 1;              // CPOL=0, CPHA=1
const SPI_MODE_2 = 2;              // CPOL=1, CPHA=0
const SPI_MODE_3 = 3;              // CPOL=1, CPHA=1

// I2C 速度设置
const I2C_SPEED_LOW = 0x00;        // 低速/20KHz
const I2C_SPEED_STANDARD = 0x01;   // 标准/100KHz
const I2C_SPEED_FAST = 0x02;       // 快速/400KHz
const I2C_SPEED_HIGH = 0x03;       // 高速/750KHz

// SPI IO 设置
const SPI_IO_SINGLE = 0x00;        // 单入单出
const SPI_IO_DOUBLE = 0x04;        // 双入双出

// SPI 位顺序
const SPI_BIT_ORDER_LSB = 0x00;    // 低位在前
const SPI_BIT_ORDER_MSB = 0x80;    // 高位在前

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

// ==================== SPI 函数封装 ====================
function setStream(index, mode) {
    return CH341SetStream(index, mode);
}

function writeData(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341WriteData(index, buffer, lengthBuffer);
    return { success: result, writtenLength: lengthBuffer.readUInt32LE(0) };
}

function writeRead(index, writeLength, writeBuffer, readStep, readTimes, readBuffer) {
    const readLengthBuffer = Buffer.alloc(4);
    const result = CH341WriteRead(index, writeLength, writeBuffer, readStep, readTimes, readLengthBuffer, readBuffer);
    return { success: result, readLength: readLengthBuffer.readUInt32LE(0) };
}

function streamSPI4(index, chipSelect, length, buffer) {
    return CH341StreamSPI4(index, chipSelect, length, buffer);
}

function streamSPI5(index, chipSelect, length, buffer, buffer2) {
    return CH341StreamSPI5(index, chipSelect, length, buffer, buffer2);
}

function bitStreamSPI(index, length, buffer) {
    return CH341BitStreamSPI(index, length, buffer);
}

// ==================== 并口函数封装 ====================
function setParaMode(index, mode) {
    return CH341SetParaMode(index, mode);
}

function initParallel(index, mode) {
    return CH341InitParallel(index, mode);
}

function readData0(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341ReadData0(index, buffer, lengthBuffer);
    return { success: result, readLength: lengthBuffer.readUInt32LE(0) };
}

function readData1(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341ReadData1(index, buffer, lengthBuffer);
    return { success: result, readLength: lengthBuffer.readUInt32LE(0) };
}

function writeData0(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341WriteData0(index, buffer, lengthBuffer);
    return { success: result, writtenLength: lengthBuffer.readUInt32LE(0) };
}

function writeData1(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341WriteData1(index, buffer, lengthBuffer);
    return { success: result, writtenLength: lengthBuffer.readUInt32LE(0) };
}

// ==================== GPIO 函数封装 ====================
function setOutput(index, enable, setDirOut, setDataOut) {
    return CH341SetOutput(index, enable, setDirOut, setDataOut);
}

function setD5D0(index, setDirOut, setDataOut) {
    return CH341Set_D5_D0(index, setDirOut, setDataOut);
}

function getInput(index) {
    const buffer = Buffer.alloc(4);
    const result = CH341GetInput(index, buffer);
    return { success: result, data: buffer.readUInt32LE(0) };
}

function getStatus(index) {
    const buffer = Buffer.alloc(4);
    const result = CH341GetStatus(index, buffer);
    return { success: result, status: buffer.readUInt32LE(0) };
}

// ==================== 串口函数封装 ====================
function readData(index, buffer, length) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(length, 0);
    const result = CH341ReadData(index, buffer, lengthBuffer);
    return { success: result, readLength: lengthBuffer.readUInt32LE(0) };
}

function setupSerial(index, parityMode, baudRate) {
    return CH341SetupSerial(index, parityMode, baudRate);
}

// ==================== 缓冲区函数封装 ====================
function flushBuffer(index) {
    return CH341FlushBuffer(index);
}

function setBufUpload(index, enableOrClear) {
    return CH341SetBufUpload(index, enableOrClear);
}

function queryBufUpload(index) {
    return CH341QueryBufUpload(index);
}

function setBufDownload(index, enableOrClear) {
    return CH341SetBufDownload(index, enableOrClear);
}

function queryBufDownload(index) {
    return CH341QueryBufDownload(index);
}

// ==================== 其他函数封装 ====================
function setTimeout(index, writeTimeout, readTimeout) {
    return CH341SetTimeout(index, writeTimeout, readTimeout);
}

function setDelaymS(index, delay) {
    return CH341SetDelaymS(index, delay);
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
    SSD1306_I2C_ADDRESS,
    
    // SPI 相关
    setStream,
    writeData,
    writeRead,
    streamSPI4,
    streamSPI5,
    bitStreamSPI,
    SPI_MODE_0,
    SPI_MODE_1,
    SPI_MODE_2,
    SPI_MODE_3,
    I2C_SPEED_LOW,
    I2C_SPEED_STANDARD,
    I2C_SPEED_FAST,
    I2C_SPEED_HIGH,
    SPI_IO_SINGLE,
    SPI_IO_DOUBLE,
    SPI_BIT_ORDER_LSB,
    SPI_BIT_ORDER_MSB,
    
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
    
    // 并口相关
    setParaMode,
    initParallel,
    readData0,
    readData1,
    writeData0,
    writeData1,
    readData,
    
    // GPIO 相关
    setOutput,
    setD5D0,
    getInput,
    getStatus,
    
    // 串口相关
    setupSerial,
    
    // 缓冲区相关
    flushBuffer,
    setBufUpload,
    queryBufUpload,
    setBufDownload,
    queryBufDownload,
    
    // 其他
    setTimeout,
    setDelaymS,
    
    // 工具函数
    delay
};