[![](https://data.jsdelivr.com/v1/package/gh/xpu-pl/ad-drawer/badge)](https://www.jsdelivr.com/package/gh/xpu-pl/ad-drawer)

# PROGRAM TO DRAW ADS FROM A JSON FILE

A program in vanilla Javascript that randomizes ads on a page by excluding ads from the page they are currently on. 

## Configuration

The program compares the site's domain name, with a banners.link in the ad array, and then displays ads for other sites. 
Use this format. You can add more rel attributes or other target. You can also add more tags. 

```json
{
   "banners":[
      {
         "link":"https://examplepage.com",
         "images":{
            "wide skyscraper":"https://examplepage.com/ad.png",
         },
         "configuration":{
            "rel":[
               "nofollow",
            ],
            "target":"_blank"
            
         },
         "tags":[
            "weather"
         ]
      },
   ]
}
```

## MAIN

The draw function is used to add an ad. Specify the type and id of the item to be added.

> let adDrawer= new AdDrawer('./payload.json', 'extra-class-to-image'); 

>  adDrawer.draw("large rectangle","ad");

## IMAGE SIZES

'medium rectangle': { width: '300px', height: '250px' },
'wide skyscraper': { width: '160px', height: '600px' }

## TESTS 

To check the tests add 

> module.exports = AdDrawer; 

at the end of the file AdDrawer.js, and then use the npm test command in the console to run the tests.
