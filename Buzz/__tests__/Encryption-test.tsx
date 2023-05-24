// import 'react-native';
import Encryption from "../model/Encryption";

it('generates key', ()=>{
    const key = Encryption.generateKey('password', 'salt', 1000, 256);
    expect(key).toBeDefined();
})

it('encrypts data', async ()=>{
    const key = await Encryption.generateKey('password', 'salt', 1000, 256);
    const encryptedData = await Encryption.encryptData('data', key);
    expect(encryptedData).toBeDefined();
    expect(encryptedData.cipher).toBeDefined();
    expect(encryptedData.iv).toBeDefined();
    console.log(encryptedData);
    expect(encryptedData.cipher).not.toEqual('data');
})