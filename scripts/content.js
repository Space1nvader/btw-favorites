
const transitionsSelector = '.tw-transition-group';
const transitionClassName = 'tw-transition'
const sideBarSelector = document.querySelector('.side-bar-contents')
let transitions = sideBarSelector.querySelector(transitionsSelector);

let transitionHTMLList;
const favoriteButtonClassName = 'favoriteButton'

const searchField = document.createElement('input');
searchField.className = 'searchField';
searchField.placeholder = 'Search...'

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



const showFavoritesList = () => {
    const twitchMoreButton = document.querySelector(`button[data-a-target="side-nav-show-more-button"]`);


    if(twitchMoreButton){
        twitchMoreButton.click()
        showFavoritesList()
        
    }else{
        const favoritesStorage = window.localStorage.getItem('btwfavorites') || '{}';
        const favorites = JSON.parse(favoritesStorage)
        transitionHTMLList = Array.from(transitions.children).filter((transition) => {
            transition.style.transition = 'all .2s';

            addFavoriteButton(transition)
            const streamerName = transition.querySelector('p[data-a-target="side-nav-title"]')?.textContent

            if(favorites[streamerName]){  
                
                transition.dataset.btwactive = 'active'
            }
            return transition.className.includes(transitionClassName)
        })
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
}


const initBTWF = (target) => {
    document.addEventListener('click', onFavoriteClickHandler)
    transitionHTMLList = Array.from(target.children).filter((transition) => {
        transition.style.transition = 'all .2s';
        addFavoriteButton(transition)
        return transition.className.includes(transitionClassName)
    })
    
    target.prepend(searchField)
    searchField.addEventListener('input', onSearchHandler)
    showFavoritesList()

}

let findTransitionInterval = setInterval(()=>{
    if(!transitions){
        transitions = sideBarSelector.querySelector(transitionsSelector);
    }else{
        clearInterval(findTransitionInterval)
        initBTWF(transitions)   
    }
})



