const fs = require('fs');
const puppeteer = require('puppeteer');

//read list of process
const lerListaProcessos = (path)=>{
    return fs.readFileSync(`${path}`, `utf-8`).split('\n').map((elt)=>{
        const process = elt;
        return process;
    });
};

const listProcess = lerListaProcessos('list.csv');

(async ()=>{
    const browser = await puppeteer.launch({ headless: false });  
    const page = await browser.newPage();
    const url = `http://www.protocolo.gestao.mt.gov.br/acessogeral/logon.php`;
    await page.goto(url);
    //login
    await page.waitForSelector("input[name=matricula]");
    await page.type('input[name=matricula]', '',{delay:200});
    await page.type('input[name=senha]', '',{delay:200});
    await page.keyboard.press('Enter');
    const url2 = `http://www.protocolo.gestao.mt.gov.br/acessogeral/ConsultarProcesso.php?`;
    //insert status location
    for (let i = 0; i < listProcess.length; i++) {
        const process = listProcess[i].split('/');
        //search process        
        await page.goto(url2);
        await page.waitForSelector("input[name=p_numeroProcessoA]");
        await page.type('select[name=p_anoProcesso]', `${process[1]}`,{delay:200});
        await page.type('input[name=p_numeroProcessoA]', `${process[0]}`,{delay:200});        
        await page.keyboard.press('Enter');
        //click in status location button
        await page.waitForSelector('img[src="../imagens/localizador.png"]');
        await page.click('img[src="../imagens/localizador.png"]');
        //select radio button and insert value input 'outros motivos'
        await page.waitForSelector("input[name=btnRadio]");
        await page.click('#btnNaoLocalizado');
        await page.click('#rdMotivo_3');
        await page.type('input[name=txtMotivo]', 'PROCESSO NAO LOCALIZADO',{delay:200});   
        await page.click('input[name=cadastrar]');
        //wait for next step
        await page.waitForTimeout(2000);
    }
    //close browser
    await browser.close();
}
)();