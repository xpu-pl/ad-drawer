class AdDrawer{
    constructor(configuration = './payload.json', addedClass = null){ // default path
       this.configuration = configuration;  
       this.ads = [];
       this.type = null;
       this.addedClass = addedClass;
    }
  
    draw(type, id) {
        return fetch(this.configuration)
          .then(res => res.json())
          .then(data => {
            this.ads = data;
            return this.getRandomAd(data, type, id);
          })
      }
  
    setAd (ad, id){
  
        if(!ad) return
    
        const foundItem = this.ads.banners.find(adv =>
            Object.values(adv.images).includes(ad)
        );
    
        const config = foundItem ? foundItem.configuration : null;
        const tags = foundItem ? foundItem.tags : null;
        const link = foundItem ? foundItem.link : null;
    
        // Check if a class exists
        const imgContainer = document.querySelector(`#${id}`);
        if(!imgContainer) return 
    
        const linkElement = this.createLink(imgContainer, link, config);
        this.createImage(linkElement, ad, tags, config);
    }
  
    createLink(container, link, config){
        let linkElement = document.createElement('a');
        config.target && linkElement.setAttribute('target', config.target);
        config.rel && linkElement.setAttribute('rel', config.rel.join(' '));
        link && linkElement.setAttribute('href', link);
        container.appendChild(linkElement);
        return linkElement;
    }
  
    createImage(container, ad, tags, config){
        let imageElement = document.createElement('img');
  
        const imgSizes = {
          'leaderboard': { width: '728px', height: '90px' },
          'large rectangle': { width: '336px', height: '289px' },
          'medium rectangle': { width: '300px', height: '250px' },
          'mobile banner': { width: '300px', height: '50px' },
          'wide skyscraper': { width: '160px', height: '600px' }
        };
  
        const imgSize = imgSizes[this.type];
        imageElement.style.width = imgSize.width;
        imageElement.style.height = imgSize.height;
        this.addedClass && imageElement.classList.add(this.addedClass);
        
        
        imageElement.src = ad;
        config.description && imageElement.setAttribute('alt', config.description);
  
        tags && imageElement.setAttribute('data-tags', tags.join(' '));
  
        container.appendChild(imageElement);
        return imageElement;
    }
  
    getRandomAd(data, type, id){
        const { banners } = data;
        const filteredAdsByDomain = this.filterAdsByDomain(banners, this.getCurrentDomain());
        const randomAd = this.filterAdsByType(filteredAdsByDomain, type);   
        this.setAd(randomAd, id);
        return randomAd
    }
  
    getCurrentDomain(){
        return window.location.hostname;
    }
    
  
    // Function to check the current domain and filter data
        filterAdsByDomain(banners, currentDomain){
        return banners.filter( ads => {
            let itemDomain = new URL(ads.link).hostname;
            return itemDomain !== currentDomain
        });
    }
  
    // Function to return ads by type
    // For example, only mobile banners
    // If type is undefined, then the function will randomize after all ads
    // Example input: [{..}. {..}, {..}] - 
    // {link: 'https://przeksztalcenia.pro/', images: {…}, configuration: {…}, tags: Array(2)}
    // output: https://majkesz.pl/leader-grafika.png
    filterAdsByType(filteredAds, type){
        const allowedTypes = ["wide skyscraper", "leaderboard", "large rectangle", "medium rectangle", "mobile banner"];
        if(type === undefined || !allowedTypes.includes(type)) return 
        
        const adType = filteredAds.map(item => item.images[type]).filter(value => value !== undefined)
        if(adType.length === 0) return
        this.type = type;
        return this.getRandomAdURL(adType)      
    }
  
    // Function to return single advertisement 
    // input: [Array(3), Array(3)] or ['https://example.com/example.png', "https://example.com/example.jpg"]
    // output: https://example.com/example.png
    getRandomAdURL(ads) {
        if (ads == null) return null;
        const allAdsURLs = Object.values(ads).flat();
        if (allAdsURLs.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * allAdsURLs.length); 
        return allAdsURLs[randomIndex];
    }
  
  
  }
  