const puppeteer = require('puppeteer');
const shortid = require('shortid');
var wait = ms => new Promise(resolve => setTimeout(resolve, ms));


(async () => {
  console.log("open browser")
  let width = 1920
  let height = 1080
  let username = shortid.generate()

  const browser = await puppeteer.launch({args: ['--no-sandbox','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
  const page = await browser.newPage();
  await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: 1,
  });


  console.log("load page")
  await page.goto('http://localhost:8001');

  console.log("wait for login")
  await page.waitFor('#username')
  await page.type('#username', username  + String.fromCharCode(13))

  console.log("logged in")
  //await page.click('#login');

  await wait(1000 + Math.random() * 5000);

  console.log('send a message');
  await page.waitFor('#message')
  await page.type('#message', 'hello')
  await page.click('#send-message');

  await wait(3000 + Math.random() * 5000);

  console.log('drag somewhere');
  let avatar = await page.$('.avatar');
  let bounding_box = await avatar.boundingBox();
  let x = Math.random() * width;
  let y = Math.random() * height
  await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y);
  await page.mouse.up();

  await wait(2000);

  console.log('send another message');
  await page.waitFor('#message')
  await page.type('#message', 'Now I am here!')
  await page.click('#send-message');

  await wait(3000 + Math.random() * 5000);

  console.log('drag somewhre else');
  let i = 2
  let x_offset =0
  let y_offset=0
  if (height > width) {
      x_offset =  -width * 0.2
      width = width - 2 * x_offset
      y_offset = -height * 0.05
  } else {
    x_offset = 0
    y_offset = -height * 0.05
  }

  let radius = Math.min(height, width) / 2 * 1.3
  let source_dist_fact = 0.6
  let tunein_fact = 0.1
  x = 0.5 * Math.cos((i * 360 - 45)/i * 0.0174532925)
  y = 0.5 * Math.sin((i * 360 - 45)/i * 0.0174532925)

  let source_radius = Math.min(height, width) / 2 * source_dist_fact * 1.3
  x = x_offset + width/2 + radius * x - source_radius * tunein_fact
  y = y_offset + height/2 + radius * y - source_radius * tunein_fact

  avatar = await page.$('.avatar');
  bounding_box = await avatar.boundingBox();
  await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y);
  await page.mouse.up();

  await wait(1000);

  console.log("do screenshot")
  await page.screenshot({ path: ('screenshot-' + username +'.png') });

  console.log("lurk around for a while ...");
  await wait(30000  + Math.random() * 30000)

  console.log("log off.")
  await browser.close();
})();
