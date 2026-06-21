class AdDrawer{
    constructor(configuration = './payload.json', addedClass = null){ // default path
       this.configuration = configuration;  
       this.ads = [];
       this.type = null;
       this.addedClass = addedClass;
       this.allowedTypes = {
        'leaderboard': { width: 728, height: 90 },
        'large rectangle': { width: 336, height: 280 },
        'medium rectangle': { width: 300, height: 250 },
        'mobile banner': { width: 300, height: 50 },
        'wide skyscraper': { width: 160, height: 600 }
       };
    }
  
    draw(type, id) {
        if (this.ads && this.ads.banners) {
          return Promise.resolve(this.getRandomAd(this.ads, type, id));
        }

        return fetch(this.configuration)
          .then(res => res.json())
          .then(data => {
            this.ads = data;
            return this.getRandomAd(data, type, id);
          })
          .catch(() => null);
      }
  
    setAd (ad, id){
  
        if(!ad) return
    
        const foundItem = this.ads.banners.find(adv =>
            Object.values(adv.images).includes(ad)
        );
    
        const config = foundItem ? foundItem.configuration : null;
        const tags = foundItem ? foundItem.tags : null;
        const link = foundItem ? foundItem.link : null;
    
        const imgContainer = document.querySelector(`#${id}`);
        if(!imgContainer) return 
    
        imgContainer.innerHTML = '';
        imgContainer.setAttribute('data-ad-drawer', 'true');

        const linkElement = this.createLink(imgContainer, link, config);
        this.createImage(linkElement, ad, tags, config);
    }
  
    createLink(container, link, config = {}){
        if (!link) return container;

        let linkElement = document.createElement('a');

        const blockedRelValues = new Set(['sponsored', 'nofollow', 'noreferrer']);
        const relValues = (config.rel || [])
          .filter(Boolean)
          .map(value => String(value).toLowerCase())
          .filter(value => !blockedRelValues.has(value));

        config.target && linkElement.setAttribute('target', config.target);
        if (relValues.length > 0) {
          linkElement.setAttribute('rel', relValues.join(' '));
        }
        linkElement.setAttribute('href', link);
        linkElement.setAttribute('aria-label', config.description || 'Reklama sponsorowana');

        container.appendChild(linkElement);
        return linkElement;
    }
  
    createImage(container, ad, tags, config = {}){
        let imageElement = document.createElement('img');
  
        const imgSize = this.allowedTypes[this.type];
        if (imgSize) {
          imageElement.width = imgSize.width;
          imageElement.height = imgSize.height;
          imageElement.style.width = `${imgSize.width}px`;
          imageElement.style.height = `${imgSize.height}px`;
        }

        this.addedClass && imageElement.classList.add(this.addedClass);
        
        
        imageElement.src = ad;
        imageElement.loading = 'lazy';
        imageElement.decoding = 'async';
        imageElement.setAttribute('fetchpriority', 'low');
        imageElement.setAttribute('alt', config.description || 'Reklama sponsorowana');
        imageElement.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  
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
        const normalizedCurrentDomain = this.normalizeHostname(currentDomain);

        return banners.filter( ads => {
            const itemDomain = this.normalizeHostname(ads.link);
            return itemDomain && itemDomain !== normalizedCurrentDomain;
        });
    }

    normalizeHostname(value){
        try {
          const url = new URL(value);
          return url.hostname.replace(/^www\./, '');
        } catch {
          if (typeof value !== 'string') return '';
          return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        }
    }
  
    // Function to return ads by type
    // For example, only mobile banners
    // If type is undefined, then the function will randomize after all ads
    // Example input: [{..}. {..}, {..}] - 
    // {link: 'https://przeksztalcenia.pro/', images: {…}, configuration: {…}, tags: Array(2)}
    // output: https://majkesz.pl/leader-grafika.png
    filterAdsByType(filteredAds, type){
        const allowedTypes = Object.keys(this.allowedTypes);
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
  
