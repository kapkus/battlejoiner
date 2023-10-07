import express from "express";
import {runPuppeteer, checkAccount, getCurrentAccounts, checkIfInstanceRunning, deleteAccount} from '../utils/addAccount.js';
import {checkRunningInstances} from '../utils/manageAccout.js'
const router = express.Router();


router.get('/test', (req, res) => {
    //console.log(puppeteerManager.puppeteerUserDataDir)
    //console.log(puppeteerManager.runningInstances)
    res.send('ok');

});

router.post('/addAccount', async (req, res) => {
    const { message } = req.body;
    if (checkIfInstanceRunning(message)) {
        res.status(429).json({
            status: 'failure',
            message: 'Browser is already running'
        })
        return;
    }

    await runPuppeteer(message);
    res.status(200).json({
        status: 'success',
        message: 'Puppeteer exited successfully'
    })
    // await checkAccount(message);
    
});

router.post('/deleteAccount', async (req, res) => {
    const { message } = req.body;
    if(deleteAccount(message)){
        console.log("ok")
        res.status(200).json({
            status: 'success',
            message: 'Successfully added account'
        })
    }else{
        console.log("nok")
        res.status(200).json({
            status: 'error',
            message: 'Error while adding account'
        })
    }
});

router.post('/checkAccount', async (req, res) => {
    const { message } = req.body;
    if (checkIfInstanceRunning(message)) {
        res.status(429).json({
            status: 'failure',
            message: 'Browser is already running'
        })
        return;
    }
    const isAccountOkay = await checkAccount(message);
    if(isAccountOkay){
        res.status(200).json({
            status: 'success',
            message: 'Account added successfully'
        })
    }else{
        res.status(400).json({
            status: 'error',
            message: 'Error while adding account'
        })
    }
});

router.post('/getAccountDetails', (req, res) => checkRunningInstances(req, res));


export default router;