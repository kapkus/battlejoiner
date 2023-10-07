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


export function checkRunningInstances(req, res){
    const { message } = req.body;
    console.log(message);
    if(message){
        res.status(200).json({
            status: 'success',
            message: message
        })
    }else{
        res.status(400).json({
            status: 'error',
            message: 'Error while adding account'
        })
    }
}
