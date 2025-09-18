import { openDevice, closeDevice, readEEPROM, writeEEPROM, ID_24C256 } from './ch341.js';

// 测试AT24C256 EEPROM
async function testAT24C256() {
    console.log('开始测试AT24C256 EEPROM...');
    
    // 打开设备
    const device = openDevice();
    if (!device.success) {
        console.error('无法打开CH341设备');
        return;
    }
    
    console.log('设备打开成功');
    
    let testPassed = true;
    
    try {
        // 测试写入数据
        console.log('\n=== 测试写入数据 ===');
        const writeBuffer = Buffer.alloc(256);
        for (let i = 0; i < 256; i++) {
            writeBuffer[i] = i;
        }
        
        console.log('写入数据到地址0x0000...');
        // 注意：CH341函数需要设备索引而不是设备句柄
        const writeResult = writeEEPROM(0, ID_24C256, 0x0000, 256, writeBuffer);
        if (writeResult) {
            console.log('✅ 写入成功');
        } else {
            console.log('❌ 写入失败');
            testPassed = false;
        }
        
        // 测试读取数据
        console.log('\n=== 测试读取数据 ===');
        const readBuffer = Buffer.alloc(256);
        console.log('从地址0x0000读取数据...');
        // 注意：CH341函数需要设备索引而不是设备句柄
        const readResult = readEEPROM(0, ID_24C256, 0x0000, 256, readBuffer);
        
        if (readResult) {
            console.log('✅ 读取成功');
            
            // 验证读取的数据
            let isValid = true;
            for (let i = 0; i < 256; i++) {
                if (readBuffer[i] !== i) {
                    isValid = false;
                    break;
                }
            }
            
            if (isValid) {
                console.log('✅ 数据验证通过 - 读取的数据与写入的数据一致');
            } else {
                console.log('❌ 数据验证失败 - 读取的数据与写入的数据不一致');
                testPassed = false;
            }
            
            // 显示前16个字节作为示例
            console.log('前16个字节内容:');
            for (let i = 0; i < 16; i++) {
                console.log(`地址 0x${(i).toString(16).padStart(4, '0').toUpperCase()}: 0x${readBuffer[i].toString(16).padStart(2, '0').toUpperCase()}`);
            }
        } else {
            console.log('❌ 读取失败');
            testPassed = false;
        }
        
        // 测试部分读写
        console.log('\n=== 测试部分读写 ===');
        const partialWriteBuffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
        console.log('写入部分数据到地址0x0100...');
        // 注意：CH341函数需要设备索引而不是设备句柄
        const partialWriteResult = writeEEPROM(0, ID_24C256, 0x0100, 4, partialWriteBuffer);
        
        if (partialWriteResult) {
            console.log('✅ 部分写入成功');
            
            const partialReadBuffer = Buffer.alloc(4);
            console.log('从地址0x0100读取部分数据...');
            // 注意：CH341函数需要设备索引而不是设备句柄
            const partialReadResult = readEEPROM(0, ID_24C256, 0x0100, 4, partialReadBuffer);
            
            if (partialReadResult) {
                console.log('✅ 部分读取成功');
                console.log('读取的值:', partialReadBuffer.map(b => `0x${b.toString(16).padStart(2, '0').toUpperCase()}`).join(', '));
                
                // 验证
                if (partialReadBuffer.equals(partialWriteBuffer)) {
                    console.log('✅ 部分读写验证通过');
                } else {
                    console.log('❌ 部分读写验证失败');
                    testPassed = false;
                }
            } else {
                console.log('❌ 部分读取失败');
                testPassed = false;
            }
        } else {
            console.log('❌ 部分写入失败');
            testPassed = false;
        }
        
        // 测试边界情况：读写不同地址
        console.log('\n=== 测试不同地址读写 ===');
        const addrTestBuffer = Buffer.from([0x12, 0x34, 0x56, 0x78]);
        console.log('写入数据到地址0x00FF...');
        const addrWriteResult = writeEEPROM(0, ID_24C256, 0x00FF, 4, addrTestBuffer);
        
        if (addrWriteResult) {
            console.log('✅ 地址写入成功');
            
            const addrReadBuffer = Buffer.alloc(4);
            console.log('从地址0x00FF读取数据...');
            const addrReadResult = readEEPROM(0, ID_24C256, 0x00FF, 4, addrReadBuffer);
            
            if (addrReadResult) {
                console.log('✅ 地址读取成功');
                console.log('读取的值:', addrReadBuffer.map(b => `0x${b.toString(16).padStart(2, '0').toUpperCase()}`).join(', '));
                
                if (addrReadBuffer.equals(addrTestBuffer)) {
                    console.log('✅ 地址读写验证通过');
                } else {
                    console.log('❌ 地址读写验证失败');
                    testPassed = false;
                }
            } else {
                console.log('❌ 地址读取失败');
                testPassed = false;
            }
        } else {
            console.log('❌ 地址写入失败');
            testPassed = false;
        }
        
    } catch (error) {
        console.error('测试过程中发生错误:', error);
        testPassed = false;
    } finally {
        // 关闭设备
        closeDevice(0);
        console.log('\n设备已关闭');
        
        // 输出最终测试结果
        console.log('\n' + '='.repeat(50));
        if (testPassed) {
            console.log('🎉 所有测试通过！AT24C256 EEPROM功能正常工作。');
        } else {
            console.log('❌ 部分测试失败，请检查硬件连接或驱动。');
        }
        console.log('='.repeat(50));
    }
}

// 运行测试
testAT24C256();
