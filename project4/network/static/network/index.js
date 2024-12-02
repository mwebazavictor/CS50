document.addEventListener('DOMContentLoaded',() => {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts)
        posts.forEach(post => {
            const parent_div = document.querySelector("#posts");
            const post_div = document.createElement('div');
            post_div.className = 'post_div';
            post_div.innerHTML = `<strong>${post.poster}</strong> <br>${post.content}<br>${post.usable_date}<br>Likes: ${post.number_of_likes}`
            parent_div.append(post_div);
        });
    });
});