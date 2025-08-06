// i2c scan
import { 
    openDevice, 
    closeDevice, 
    CMD_I2C_STREAM, 
    CMD_I2C_STM_STA, 
    CMD_I2C_STM_OUT, 
    CMD_I2C_STM_STO, 
    CMD_I2C_STM_END,
    streamI2C,
    writeRead,
    writeData,
    readData
} from './ch341.js';
