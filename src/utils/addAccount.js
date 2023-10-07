import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import randomUserAgent from 'random-useragent';
import { removeFromArray } from './tools.js';
import handlebars from 'handlebars';
import JSONStorageManager from './JSONStorageManager.js';

puppeteer.use(StealthPlugin())
const __dirname = dirname(fileURLToPath(import.meta.url));
const puppeteerUserDataDir = path.join(__dirname + '/../puppeteer_user_data');

const storage = new JSONStorageManager('./src/database/data/storage.json');

export async function runPuppeteer(configName){
    storage.addEntry(configName, 'runningInstance', 'addAccount' );
    const browser = await puppeteer.launch({ headless: false, userDataDir: `${puppeteerUserDataDir}/${configName}` });
    
    browser.on('disconnected', () => {
        storage.updateEntry(configName, 'runningInstance', 'none');
    });

    try{
        const pages = await browser.pages();
        const page = pages[0];
        await page.setViewport({ width: 767, height: 900 });
        await page.goto('https://key-drop.com/pl/panel/profil');
        await new Promise(resolve => browser.on('disconnected', resolve));
    }catch(err){
        console.log(err);
    }
}

export async function checkAccount(configName){
    const accountInfo = await getAccountInfo(configName);
    if(typeof accountInfo.userName === 'undefined'){
        console.log('Nie jesteś zalogowany')
        return false;
    }
    storage.addEntry(configName, 'userName', accountInfo.userName);
    storage.addEntry(configName, 'avatar', accountInfo.avatar);
    return true;
}

async function getAccountInfo(configName){
    storage.addEntry(configName, 'runningInstance', 'addAccount' );

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], userDataDir: `${puppeteerUserDataDir}/${configName}` });

    browser.on('disconnected', () => {
        storage.addEntry(configName, 'runningInstance', 'none' );
    });

    try{
        const pages = await browser.pages();
        const page = pages[0];
        const userAgent = randomUserAgent.getRandom();
        await page.setUserAgent(userAgent);
        await page.setViewport({ width: 767, height: 900 });
        // these options are crucial
        await page.goto("https://key-drop.com/pl/apiData/Init/", {
            timeout: 20000,
            waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        })

        const bodyText = await page.$eval('body', el => el.textContent);
        const jsonObj = await JSON.parse(bodyText);
        browser.close();
        return jsonObj;
    }catch(err){
        console.log(err);
    }
}

export function checkIfInstanceRunning(configName){
    const userConfig = storage.getUserConfig(configName);
    if(userConfig.runningInstance !== 'none'){
        return true;
    }else {
        return false;
    }
}

export function getCurrentAccounts(){
    const data = storage.getAllEntries();

    const templateFile = fs.readFileSync('./public/views/partials/accountsData.handlebars', 'utf8');
    const template = handlebars.compile(templateFile);
    const html = template({ data });
    return html;
}

export function deleteAccount(configName){
    try{
        if(fs.existsSync(path.join(puppeteerUserDataDir, configName))){
            fs.rmSync(path.join(puppeteerUserDataDir, configName), { recursive: true});
            storage.deleteUser(configName);
            return true;
        }
        return false;
    }catch(error){
        console.log(error);
        return false;
    }
}