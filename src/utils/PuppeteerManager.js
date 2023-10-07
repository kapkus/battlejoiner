import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import randomUserAgent from 'random-useragent';
puppeteer.use(StealthPlugin())

export class PuppeteerManager {
    constructor(){
        this.runningInstances = [];
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.puppeteerUserDataDir = path.join(this.__dirname + '/../puppeteer_user_data');
    }

    async runPuppeteer(configName){
        //let dataCount = checkDataDirCount();
    
        const browser = await puppeteer.launch({ headless: false, userDataDir: `${puppeteerUserDataDir}/user_${configName}` });
        runningInstances.push(configName);
        
        browser.on('disconnected', () => {
            removeFromArray(runningInstances, configName);
        });
    
        try{
            const pages = await browser.pages();
            const page = pages[0];
            await page.setViewport({ width: 767, height: 900 });
            await page.goto('https://key-drop.com/pl/panel/profil');
            //const cookies = await page.cookies('https://key-drop.com');
            //checkDataDirCount();
            //console.log('test')
            await new Promise(resolve => browser.on('disconnected', resolve));
        }catch(err){
            console.log(err);
        }
    }

    async checkAccount(configName){
        const accountInfo = await getAccountInfo(configName);
        if(typeof accountInfo.userName === 'undefined'){
            console.log('Nie jesteś zalogowany')
            return false;
        }
        const user = {
            userName: accountInfo.userName,
            avatar: accountInfo.avatar
        }
        const jsonUser = JSON.stringify(user);
        try {
            fs.writeFileSync(`${puppeteerUserDataDir}/user_${configName}/user.json`, jsonUser);
            console.log('JSON object has been saved to output.json file.');
        } catch (err) {
            console.error('Error writing JSON object to file:', err);
        }
        return true;
    }

}