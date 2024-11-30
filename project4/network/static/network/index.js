document.addEventListener('DOMContentLoaded',() => {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts)
        posts.forEach(post => {
            const parent_div = document.querySelector("#posts");
            const post_div = document.createElement('div');
            post_div.className = 'post_div';
            post_div.append(post.content);
            parent_div.append(post_div);
        });
    });
});