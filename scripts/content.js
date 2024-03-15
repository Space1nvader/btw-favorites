
const transitionsSelector = '.tw-transition-group';
const transitionClassName = 'tw-transition'
const sideBarSelector = document.querySelector('.side-bar-contents')
let transitions = sideBarSelector.querySelector(transitionsSelector);
let transitionHTMLList;
const favoriteButtonClassName = 'favoriteButton'
const COLLAPSED_WIDTH = 50
let isInited = false;

const searchFieldClassName = 'searchField'
const searchField = document.createElement('input');
searchField.className = searchFieldClassName;
searchField.placeholder = 'Search...'
searchField.type = 'search'


const addFavoriteButton = (transition) => {

    if(!transition?.querySelector(`.${favoriteButtonClassName}`)){
        
        const streamerName = transition.querySelector('p[data-a-target="side-nav-title"]')

        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = '♥';
        favoriteButton.dataset.streamer = streamerName?.textContent || 'undefined'
        favoriteButton.className = favoriteButtonClassName;
        
        transition.prepend(favoriteButton)
        
    }

}



const showFavoritesList = (event) => {
    const twitchMoreButton = document.querySelector(`button[data-a-target="side-nav-show-more-button"]`);

    if(twitchMoreButton){
        twitchMoreButton.click();
        showFavoritesList()
    }
    else{
        const favoritesStorage = window.localStorage.getItem('btwfavorites') || '{}';
        const favorites = JSON.parse(favoritesStorage);

        transitionHTMLList = Array.from(transitions.children).filter((transition) => {
            
            const isTargetTransition = transition.className.includes(transitionClassName);

            if(isTargetTransition){
                transition.style.transition = 'all .2s';

                addFavoriteButton(transition)
                const streamerName = transition.querySelector('p[data-a-target="side-nav-title"]')?.textContent
    
                if(favorites[streamerName]){  
                    transition.dataset.btwactive = 'active';
    
                    if(!transition?.dataset?.btwinsert){   
                        transition.dataset.btwinsert = '1';
                        transitions.prepend(transition)
                    }
    
                }
                return true
            }
            return false
           
        })
        
        if(event?.target?.className === searchFieldClassName){
            
            searchField.focus()
        }
    }

}



const onSearchHandler = (event) => {
    
    const regex = new RegExp(event.target.value, 'gi');

    
    transitionHTMLList.forEach((transition) => {
        const streamerName = transition.querySelector('p[data-a-target="side-nav-title"]')
         if(!event.target.value || streamerName?.textContent?.search(regex) !== -1){
            transition.style.maxHeight = '100px'; 
            transition.style.opacity = 1; 
            transition.style.overflow = 'auto'
         } else{
            transition.style.maxHeight = '0px'; 
            transition.style.opacity = 0; 
            transition.style.overflow = 'hidden'
         }
    })
}


const onFavoriteClickHandler = (event) =>{
    if(event.target.className === favoriteButtonClassName && event.target.dataset.streamer){

        const favoritesStorage = window.localStorage.getItem('btwfavorites') || '{}'
        const favorites = JSON.parse(favoritesStorage)
        const targetValue = !favorites[event.target.dataset.streamer]

        const transition = event.target.closest(`.${transitionClassName}`)
        
        if(transition) transition.dataset.btwactive = targetValue ? 'active': ''

        
        window.localStorage.setItem('btwfavorites', JSON.stringify({...favorites, [event.target.dataset.streamer]: !favorites[event.target.dataset.streamer] }))
    }

    
    if(event.isTrusted && event.target.dataset.aTarget === "side-nav-show-more-button"){
        showFavoritesList()
    }
}

const sideBarResizeObserver = new ResizeObserver((entries) => {

    for(let entry of entries){
        console.log('entry.target.width ', entry.contentRect.width)
        if( entry.contentRect.width > COLLAPSED_WIDTH) {
           entry.target.classList.remove('btw-collapse') 
           console.log(' entry.contentRect.width', entry.contentRect.width )
           initBTWF(transitions)   
          } else{
            entry.target.classList.add('btw-collapse');
          }
    }


})

 
   
    const initBTWF = (target) => {
        if(isInited){
            return null;
        }
        isInited = true;
    
    document.addEventListener('click', onFavoriteClickHandler)
    
    transitionHTMLList = Array.from(target.children).filter((transition) => {
        transition.style.transition = 'all .2s';
        addFavoriteButton(transition)
        return transition.className.includes(transitionClassName)
    })
    
    target.prepend(searchField)
    searchField.addEventListener('input', onSearchHandler)
    searchField.addEventListener('click', showFavoritesList)
    showFavoritesList()
    setInterval(()=>{
        showFavoritesList()
    },  10000)

}

let findTransitionInterval = setInterval(()=>{
    if(!transitions){
        transitions = sideBarSelector.querySelector(transitionsSelector);
    }else{
        if(transitions.getBoundingClientRect().width > COLLAPSED_WIDTH ){
            initBTWF(transitions)   
        }
        sideBarResizeObserver.observe(sideBarSelector);
        clearInterval(findTransitionInterval)
    }
},300)



