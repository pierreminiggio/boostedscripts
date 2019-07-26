var cron = require('node-cron');
const puppeteer = require('puppeteer');

// On récupère les ids
let ids = require('./ids.js');

const pullTops = async (ids) => {

  // Créer une instance de navigateur
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Naviguer jusqu'à l'URL cible
  await page.goto(ids.url);

  // Récupérer les données
  var tops = await page.evaluate(() => {
    let tops = document.querySelector('body').innerHTML;
    return JSON.parse(tops);
  });
  

  // Retourner les données (et fermer le navigateur)
  browser.close();
  return tops;
}

const postToBoostedRealm = async (ids, qualityContent) => {

  // Créer une instance de navigateur
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Naviguer jusqu'à l'URL cible
  await page.goto('https://www.facebook.com/');
  
  // Connexion si pas connecté
  var login = await page.evaluate((ids) => {
    document.querySelector('#email').value = ids.mail;
    document.querySelector('#pass').value = ids.pass;
  }, ids);

  await page.click(
    '#loginbutton',
  )
  await page.waitFor(1000); // fait une pause d'une seconde

  // On va sur le groupe des boosted
  await page.goto('https://www.facebook.com/groups/'+ids.group+'/');


  await page.waitFor(1000); // fait une pause d'une seconde

  // use keyboard shortcut to open and focus on create new post
  await page.keyboard.press('KeyP');

  // wait for emoji icon as proxy for "loaded and post ready"
  await page.waitFor('button[data-testid="react-composer-post-button"][type="submit"]');

  // keyboard shortcut put focus in place so we can just type
  await page.keyboard.type(qualityContent);

  // click submit
  await page.click('button[data-testid="react-composer-post-button"][type="submit"]');

  // Retourner les données (et fermer le navigateur)
  browser.close();
  return [];
}

function letsGo () {
  console.log('Récupération des tops');

  // Appelle la fonction pullTops() et affichage les données retournées
  pullTops(ids).then(tops => {
    var qualityContent = '';
    var i = 0;
    for (let [key, value] of Object.entries(tops)) {
      i = i + 1;
      switch (i) {
        case 1:
           qualityContent = "\nEt finalement, le boosted ayant le plus de point est "+value.name+" avec "+value.points+" points !!!\nL'équipe (Kappa) des boosted te donne toutes ses félicitations "+value.name+" ! " + qualityContent;
          break;
        case 2:
          qualityContent = "\nLa médaille d'argent des points revient à "+value.name+" avec "+value.points+" points ! Bravo ! " + qualityContent;
          break;
        case 3:
          qualityContent = "\nBronze aussi bien in game, en points et IRL, nous avons ... "+value.name+" avec "+value.points+" points ! " + qualityContent;
          break;
        case 4:
          qualityContent = "\n4ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 5:
          qualityContent = "\n5ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 6:
          qualityContent = "\n6ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 7:
          qualityContent = "\n7ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 8:
          qualityContent = "\n8ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 9:
          qualityContent = "\n9ème place : "+value.name+" avec "+value.points+" points. " + qualityContent;
          break;
        case 10:
          qualityContent = "\n"+value.name+" arrive de justesse sur cette publication avec "+value.points+" points. " + qualityContent;
          break;
        default:
      }
    }
    qualityContent = "Le temps est venu d'annoncer les résultats tant attendus ! :o \nVoici les 10 boosted les plus actifs de cette semaine ! " + qualityContent;

    // Postage sur le groupe des boosted
    postToBoostedRealm(ids, qualityContent).then(result => {

    });
  });
}

//letsGo();
// Tous les dimanches à 12h si tout se passe bien
cron.schedule('0 12 * * 0', () => {
  letsGo();
});
