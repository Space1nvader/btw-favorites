
const transitionsSelector = '.tw-transition-group';

const transitionClassName = 'tw-transition'
let sideBarSelector = document.querySelector('.side-bar-contents');
let transitions = sideBarSelector.querySelector(transitionsSelector);
let transitionHTMLList;
const favoriteButtonClassName = 'favoriteButton'
const COLLAPSED_WIDTH = 50
let isInited = false;

const searchFieldClassName = 'searchField'
const searchField = document.createElement('input');
    searchField.className = searchFieldClassName
    searchField.placeholder = 'Search...'
    searchField.type =  'search'
const hideButton = document.createElement('button')
hideButton.className = 'hideButton';
hideButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
<g id="Iconly/Curved/Hide">
<g id="Hide">
<path id="Stroke 1" d="M6.42 17.7298C4.19 16.2698 2.75 14.0698 2.75 12.1398C2.75 8.85984 6.89 4.83984 12 4.83984C14.09 4.83984 16.03 5.50984 17.59 6.54984" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Stroke 3" d="M19.8498 8.61035C20.7408 9.74035 21.2598 10.9904 21.2598 12.1404C21.2598 15.4204 17.1098 19.4404 11.9998 19.4404C11.0898 19.4404 10.2008 19.3104 9.36975 19.0804" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Stroke 5" d="M9.76572 14.3672C9.17072 13.7782 8.83772 12.9752 8.84072 12.1382C8.83672 10.3932 10.2487 8.97518 11.9947 8.97218C12.8347 8.97018 13.6407 9.30318 14.2347 9.89718" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Stroke 7" d="M15.1095 12.6992C14.8755 13.9912 13.8645 15.0042 12.5725 15.2412" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Stroke 9" d="M19.8917 4.25L4.11768 20.024" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
</svg>`
hideButton.dataset.hide = 0
const btwContainer = document.createElement('div')
btwContainer.className = 'btwContainer'

btwContainer.append(searchField)
btwContainer.append(hideButton)

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

const onHideButtonClick = (event) =>{
    const isHidden = !!+event.currentTarget.dataset.hide;
    event.currentTarget.dataset.hide = Number(!isHidden);
    searchField.value = ''

    const allTransitions = document.querySelectorAll(`div[data-transition]`);


    if(isHidden){
        allTransitions.forEach((targetTransition)=>{
            targetTransition.style.maxHeight = '100px'; 
            targetTransition.style.opacity = 1; 
            targetTransition.style.overflow = 'auto'
        });

        return;
    }

    allTransitions.forEach((targetTransition)=>{
        targetTransition.style.maxHeight = '0px'; 
        targetTransition.style.opacity = 0; 
        targetTransition.style.overflow = 'hidden'
    })   
}

const closeSupportAdsModal = () =>{ 

    const findAdsModal = () => {
        const overlay = document.querySelector('.player-overlay-background--darkness-3');
   
        if(overlay){
            const closeBtn = overlay.querySelector('button');
            closeBtn.click()

        }
    }

    setInterval(()=>{
        findAdsModal()
    }, 1000)
}

const showFavoritesList = (event) => {
    const twitchMoreButton = document.querySelector(`button[data-a-target="side-nav-show-more-button"]`);

    if(typeof twitchMoreButton?.click === 'function'){
    
        setTimeout(()=> {
            twitchMoreButton.click();
            showFavoritesList()
        })
    }
    else{
        const favoritesStorage = window.localStorage.getItem('btwfavorites') || '{}';
        const favorites = JSON.parse(favoritesStorage);

        transitionHTMLList = Array.from(transitions.children).filter((transition) => {
            
            const isTargetTransition = transition.className.includes(transitionClassName);

            if(isTargetTransition){
                transition.style.transition = 'all .2s';
                transition.dataset.transition = true;
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
        
        if(!transitionHTMLList?.length){

        }
        if(event?.target?.className === searchFieldClassName){
            
            searchField.focus()
        }
    }

}



const onSearchHandler = (event) => {
    hideButton.dataset.hide = '0'
    let hiddenTransitionsLength = 0;
    const regex = new RegExp(event.target.value, 'gi');


    transitionHTMLList.forEach((transition) => {
        const streamerName = transition.querySelector('p[data-a-target="side-nav-title"]')
         if(!event.target.value || streamerName?.textContent?.search(regex) !== -1){
            transition.style.maxHeight = '100px'; 
            transition.style.opacity = 1; 
            transition.style.overflow = 'auto'
         } else{
            hiddenTransitionsLength++ 
            transition.style.maxHeight = '0px'; 
            transition.style.opacity = 0; 
            transition.style.overflow = 'hidden'
         }
    })
// Тут будет код который показывает надпись о том что ни одного стримера нет
// Надо еще будет подумать о том что бы искать в глобальном поиске если ничего не нашлось, но там вроде апи твитча придется подрубать
// хотя наверное можно просто в поле поиска твитча пихнуть значения из моего поиска по желанию пользователя  
    if(transitionHTMLList.length === hiddenTransitionsLength){
        //
    }
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
        
        if( entry.contentRect.width > COLLAPSED_WIDTH) {
           entry.target.classList.remove('btw-collapse') 
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
    
    target.prepend(btwContainer)
    searchField.addEventListener('input', onSearchHandler)
    searchField.addEventListener('click', showFavoritesList)
    hideButton.addEventListener('click', onHideButtonClick)
    showFavoritesList()

    closeSupportAdsModal()
    setInterval(()=>{
        showFavoritesList()
    },  10000)

}

let findTransitionInterval = setInterval(()=>{

    if(!transitions){
        sideBarSelector = document.querySelector('.side-bar-contents');
        transitions = sideBarSelector.querySelector(transitionsSelector);
    }else{
        if(transitions.getBoundingClientRect().width > COLLAPSED_WIDTH){
            initBTWF(transitions)   
        }
        sideBarResizeObserver.observe(sideBarSelector);
        clearInterval(findTransitionInterval)
    }
},300)



