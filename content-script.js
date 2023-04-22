// Overwrite a couple global functions in the page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);

// Click any "more comments" links that are visible or about to be visible
let observer = new IntersectionObserver(async (entries, observer) => {
  let visibleAnchors = entries.filter(e => e.isIntersecting).map(e => e.target);
  for (let a of visibleAnchors) {
    a.click();
    console.log('clicking morechildren');
  }
}, {rootMargin: '100% 0% 100% 0%'});

// Intersection observe initial list of "more comments" links
for (let n of document.querySelectorAll('span.morecomments > a')){
  observer.observe(n);
}

// Intersection observe any "more comments" links added to the page
new MutationObserver(mutations => {
  let addedAnchors = mutations
    .flatMap(mutation => Array.from(mutation.addedNodes))
    .flatMap(node => Array.from(node.querySelectorAll?.('span.morecomments > a') ?? []));
  for (let a of addedAnchors) {
    observer.observe(a);
  }
}).observe(document.body, {subtree: true, childList: true});

// Move the recommendations to the bottom of the page
const recommendations = document.querySelector('.seo-comments-recommendations');
if (recommendations) {
  console.log('moving recommendations to bottom');
  recommendations.parentNode.insertBefore(document.querySelector('.sitetable.nestedlisting:last-of-type'), recommendations);
  document.querySelector('.seo-comments.spacer').remove();
  document.querySelector('#bottom-comments').remove();
}

