import {
    openDevice,
    closeDevice,
    writeRead,
    writeData,
    readData,
    CMD_I2C_STREAM,
    CMD_I2C_STM_STA,
    CMD_I2C_STM_STO,
    CMD_I2C_STM_OUT,
    CMD_I2C_STM_IN,
    CMD_I2C_STM_END,
    CMD_I2C_STM_MAX_LEN,
} from "./ch341.js";


/**
 * Generate a START condition on the bus
 * (SDA transitions to low while SCL is high).
 */
function _start(fd) {
    // 创建包含I2C命令流的缓冲区
    const buf = Buffer.from([
        CMD_I2C_STREAM,
        CMD_I2C_STM_STA,
        CMD_I2C_STM_END
    ]);
    
    // 使用已有的writeData函数发送命令
    const result = writeData(fd, buf, buf.length);
    
    // 检查结果是否成功
    if (!result.success) {
        throw new Error(`CH341WriteData failed, written length: ${result.writtenLength}`);
    }
    
    return result;
}

/**
 * Generate a STOP condition on the bus
 * (SDA transitions to high while SCL is high).
 */
function _stop(fd) {
    // 创建包含I2C命令流的缓冲区
    const buf = Buffer.from([
        CMD_I2C_STREAM,
        CMD_I2C_STM_STO,
        CMD_I2C_STM_END
    ]);
    
    // 使用已有的writeData函数发送命令
    const result = writeData(fd, buf, buf.length);
    
    // 检查结果是否成功
    if (!result.success) {
        throw new Error(`CH341WriteData failed, written length: ${result.writtenLength}`);
    }
    
    return result;
}

/**
 * Send a byte and check for ACK
 * @param {number} fd - Device handle
 * @param {number} obyte - Byte to send
 * @returns {boolean} - True if ACK received, false otherwise
 */
function _out_byte_check_ack(fd, obyte) {
    // 创建包含I2C命令流的缓冲区
    const buf = Buffer.from([
        CMD_I2C_STREAM,
        CMD_I2C_STM_OUT,
        obyte,
        CMD_I2C_STM_END
    ]);
    
    // 创建读取缓冲区 (假设mCH341_PACKET_LENGTH为32，与CMD_I2C_STM_MAX_LEN相同)
    const ibuf = Buffer.alloc(32);
    
    // 使用writeRead函数发送命令并读取响应
    const result = writeRead(fd, buf.length, buf, CMD_I2C_STM_MAX_LEN, 1, ibuf);
    
    // 检查结果是否成功
    if (!result.success) {
        throw new Error(`CH341WriteRead failed, read length: ${result.readLength}`);
    }
    
    // 检查是否有数据返回并且最后一位是ACK(0)
    // ACK: bit7=0, NAK: bit7=1
    return result.readLength > 0 && (ibuf[result.readLength - 1] & 0x80) === 0;
}
/**
 * Check if a device at the specified address exists
 * @param {number} fd - Device handle
 * @param {number} addr - I2C device address
 * @returns {boolean} - True if device exists, false otherwise
 */
function check_device(fd, addr) {
    // 生成START条件
    _start(fd);
    
    try {
        // 构造设备地址字节（写操作）
        // 通常I2C设备地址需要左移1位，最低位表示读(1)/写(0)
        const obyte = (addr << 1) & 0xFE; // 确保最低位为0（写操作）
        
        // 发送地址字节并检查ACK
        return _out_byte_check_ack(fd, obyte);
    } finally {
        // 无论成功与否，都要生成STOP条件
        _stop(fd);
    }
}

/**
 * 扫描I2C总线上的设备
 * @param {number} deviceIndex - 设备索引
 * @param {number} start - 起始地址 (默认 0x08)
 * @param {number} stop - 结束地址 (默认 0x77)
 * @returns {Array<number>} 找到的设备地址列表
 */
function scan(deviceIndex, start = 0x08, stop = 0x77) {
    const foundDevices = [];
    
    console.log(`开始扫描I2C总线上的设备 (地址范围: 0x${start.toString(16)} - 0x${stop.toString(16)})...`);
    
    // 扫描指定地址范围
    for (let addr = start; addr <= stop; addr++) {
        try {
            // 检查当前地址是否有设备
            const deviceExists = check_device(deviceIndex, addr);
            
            if (deviceExists) {
                foundDevices.push(addr);
            }
        } catch (error) {
            console.error(`扫描地址 0x${addr.toString(16).padStart(2, '0')} 时出错:`, error.message);
        }
    }
    
    return foundDevices;
}

export { scan };

/* // 使用示例
function scanExample() {
    const deviceIndex = 0;
    
    try {
        // 打开设备
        const device = openDevice(deviceIndex);
        
        if (!device.success) {
            console.error("无法打开CH341设备");
            return;
        }
        
        console.log("CH341设备已打开");
        
        try {
            // 扫描默认地址范围内的设备
            const foundDevices = scan(deviceIndex);
            
            // 输出扫描结果
            console.log("\n=== 扫描完成 ===");
            if (foundDevices.length > 0) {
                console.log(`共找到 ${foundDevices.length} 个设备:`);
                foundDevices.forEach(addr => {
                    console.log(`  - 0x${addr.toString(16).padStart(2, '0')}`);
                });
            } else {
                console.log("未找到任何I2C设备");
            }
            
            // 也可以扫描特定范围，例如:
            // const specificDevices = scan(deviceIndex, 0x20, 0x50);
            
        } catch (error) {
            console.error("扫描过程中出错:", error.message);
        } finally {
            // 关闭设备
            closeDevice(deviceIndex);
            console.log("CH341设备已关闭");
        }
    } catch (error) {
        console.error("初始化设备时出错:", error.message);
    }
}

// 运行扫描示例
scanExample(); */