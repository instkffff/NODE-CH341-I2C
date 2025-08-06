from i2cpy import I2C

i2c = I2C()

i2c = I2C(driver="ch341")

i2c.init()

i2cList = i2c.scan()

print(i2cList)