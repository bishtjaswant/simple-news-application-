const NEWS_API = `73bde0f9494e46fdb22a8c15552393ce`;
let quer = 'hello';






window.addEventListener('load', fetchNews("nifty"));



async function fetchNews(query) {
    const url = `https://newsapi.org/v2/everything?q=${query}&from=2023-08-19&sortBy=publishedAt&apiKey=${NEWS_API}`;
    let data = await (await fetch(url, {
        method: "GET",
        })).json();


    // binding data to html
    bindData(data, query);
 
}

function bindData( {status,  articles, totalResults} , query  ) {
    let card_container= document.getElementById("card_container");
    let template_news_card= document.getElementById("template_news_card");
    let error_rendering= document.getElementById("error_rendering");
    let template_error = document.getElementById("template_error");
    
    // initialising card_container to empty
    card_container.innerHTML='';

    //initialising error_rendering to empty
    error_rendering.innerHTML='';

    
    let template_error_cloned =  template_error.content.cloneNode(true);

    if ( status === 'ok' &&  totalResults == 0 ) {
        
        fillDataToErrorCard(template_error_cloned, `no news found related to ${query} `);
        error_rendering.appendChild(template_error_cloned);
        return ;
    }

    // show news if found
    articles.forEach(article => {
        if ( !article.urlToImage ) {
            return ;
        }

      let cardcloned=  template_news_card.content.cloneNode(true);

      //fill data to card after fetching data from api
      fillDataToCard(cardcloned, article);
      card_container.appendChild(cardcloned);

    });
}


function fillDataToErrorCard(error_cloned, message){
    console.log(error_cloned)
    let error_message= error_cloned.querySelector("#error_message");
    error_message.innerText= message;
    let error_message_text= error_cloned.querySelector("#error_message_text");
    error_message_text.innerText=    `Sorry, we couldn't find any news related to your search. Please try again with different keywords.`;
}


function fillDataToCard(cardcloned, article) {
    let card_img= cardcloned.querySelector("#card_img");
    let title = cardcloned.querySelector("#title");
    let desc = cardcloned.querySelector("#desc");
    let news_source= cardcloned.querySelector("#news_source");
    card_img.src= article?.urlToImage;;
    title.innerText= article?.title;
    desc.innerText= article?.description;
    let date= new Date(article?.publishedAt).toLocaleString(
        'en-US', {timeZone: 'Asia/Kolkata'}
    );
    news_source.innerText=`${article?.source?.name} | ${date}`;


    cardcloned.querySelector("#read_more_btn").addEventListener("click", () =>window.open(article?.url, "_blank"));


}



// setting active class to nav item
let currentSelectedNavItem= null;
function searchNavLinkNews(id) {
    fetchNews(id);
    let navItem = document.getElementById(id);
    currentSelectedNavItem?.classList?.remove("active");
    currentSelectedNavItem= navItem;
    currentSelectedNavItem?.classList?.add("active");
}


//search using search bar
let search_btn= document.getElementById("search_btn");
search_btn.addEventListener("click", () => {
    let search_input= document.getElementById("search_input");
    let query= search_input?.value;
    if (query && query.trim()) {

        //fetching news from api after user enters valid query
        fetchNews(query);
   
        //clearing search bar after search
       search_input.value= "";
    }
    else{
        alert("can't be empty");
        return;
    }
 
});








