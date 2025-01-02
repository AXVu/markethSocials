const posts = {{data | tojson}};
const main_thread = document.getElementById("main_thread");

console.log(posts)

function buildPost(post) {
    const inner = `
    <div>
        <p>
            <img src="./static/${post.pfp}.webp" class="pfp" />
            <span class="username">${post.username}</span>
            <span class="at">@${post.at}</span>
        </p>
        <div class="content_box">
        <p class="content">${post.content}</p>
        </div>
    </div>
    `;
    return inner;
}

function insertPost(post) {
    console.log(post);
    const primary = document.createElement('li');
    primary.classList.add('primary');

    const replies = document.createElement('ol');
    replies.id = 'replies';
    replies.classList.add('replies')
    
    for (let reply in post.replies) {
        const secondary = document.createElement('li');
        secondary.classList.add("secondary")
        secondary.innerHTML = buildPost(post.replies[reply]);
        replies.appendChild(secondary);
    }

    primary.innerHTML = `
        <div>${buildPost(post)}</div>
        <button class="reply">reply</button>
    `;

    primary.appendChild(replies);

    return primary;
}

function make_post(parent, parent_index) {

    const popup = document.getElementById("popup_overlay");
    popup.style.display = "flex";

    const cancel = document.getElementById("cancel");
    const form = document.getElementById("new_post");
    form.reset()

    cancel.addEventListener("click", ()=>{
        popup.style.display = "none";
        return "cancel";
    });

    function handle_submission(event){
        event.preventDefault();

        const form_result = new FormData(this);
        const form_data = Object.fromEntries(form_result.entries());
        form_data.parent_index = parent_index;

        const content = insertPost(form_data);
        if (parent_index==-1) {
            form_data.replies = [];
            fetch('/new_post', {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(form_data)
            });
            const content = insertPost(form_data);
            const reply_button = content.querySelector(".reply");
            reply_button.addEventListener("click", ()=>make_post(content));
            main_thread.insertBefore(content,main_thread.firstChild);
        } else {
            fetch('/new_post', {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(form_data)
            });
            const secondary = document.createElement('li');
            secondary.classList.add("secondary")
            secondary.innerHTML = buildPost(form_data);
            const replies = parent.querySelector("#replies");
            replies.insertBefore(content,replies.firstChild);
        };

        form.removeEventListener("submit", handle_submission);

        popup.style.display = "none"
        return "posted"

    };

    form.addEventListener("submit", handle_submission);
    
}

for (let post in posts.primary) {
    const content = insertPost(posts.primary[post]);
    const reply_button = content.querySelector(".reply");
    reply_button.addEventListener("click", ()=>make_post(content,post));
    main_thread.appendChild(content);
}

const make_button = document.getElementById("make_thread");
make_button.addEventListener("click", ()=>make_post(main_thread,-1))