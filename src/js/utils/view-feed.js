async function viewFeed() {
    const $postElement = document.querySelector('.feed__post');
    const $feedContainer = document.querySelector('.feed__container');
    const allFeedPosts = await feedFetchs.getAllFeedPosts();//[{login: "2@2", authorID: "5f...", authorFirstName: "2", authorLastName: "2", img: "file-...", name: "Hel....", text: "...", date: "..."}, {...}, {...}, {...}]
    const $hr = document.createElement('hr');
    $hr.classList.add('break_line');

    $feedContainer.innerHTML = '';

    const allComents = await comentFetchs.getAllComents();//[{_id: "...", postID: "...", authorID: "....", comentText: "..."}, {}, {}, {}, {}]

    allFeedPosts.forEach(async (el) => {
        const double =  $postElement.cloneNode(true)
        const doubleHr =  $hr.cloneNode(true)
        double.classList.remove('not_display');
        double.id = `${el._id}`;
        double.querySelector('.feed__post_name').innerText = el.name;
        double.querySelector('.feed__post_name').title = el.name;

        double.querySelector('.feed__post_user').href = `#members/${el.login}`;
        const user = await userFetchs.getOneUsersByLogin(el.login)
     
        double.querySelector('.feed__post_user').innerText = `${user[0].firstName}  ${user[0].lastName}`;
        double.querySelector('.feed__post_user').title = `${user[0].firstName}  ${user[0].lastName}`;
        
        double.querySelector('.feed__post_image').src = `http://localhost:5000/${el.img}`
        double.querySelector('.feed__post_description').innerText = el.text;

        double.querySelector('.feed__post_delete').classList.add(el.authorID)
        double.querySelector('.feed__post_edit').classList.add(el.authorID)
        double.querySelector('.feed__post_hide').classList.add(el.authorID)

        double.querySelector('.feed__post_delete').id = `${el._id}`;
        double.querySelector('.feed__post_edit').id = `${el._id}`;
        double.querySelector('.feed__post_hide').id = `${el._id}`;
        double.querySelector('.feed__post_coment').id = `${el._id}`;


        double.querySelector('.feed__post_delete').onclick = (e) => deleteFeedPost(e.target);
        double.querySelector('.feed__post_edit').onclick = (e) => editFeedPost(e.target, double);
        double.querySelector('.feed__post_hide').onclick = (e) => hideFeedPost(e.target, double);
        double.querySelector('.feed__post_coment').onclick = (e) => hideComentForm(e.target, double);

        double.querySelector('.feep__post_chat').innerHTML = '';

        const currentComents = allComents.filter(coment => coment.postID === el._id);
        currentComents.forEach(async (coment) => {
            const fullUser = await userFetchs.getOneUsersByID(coment.authorID);
            const $oneComentContainer = document.querySelector('.coment__container');
            const doubleComent = $oneComentContainer.cloneNode(true);
            doubleComent.classList.remove('not_display');
        
            doubleComent.querySelector('.coment__container_link').href = `#members/${fullUser[0].login}`;
            doubleComent.querySelector('.coment__container_link').style.backgroundImage = `url(http://localhost:5000/${fullUser[0].photo})`;
            doubleComent.querySelector('.coment__container_text').innerText = coment.comentText

            double.querySelector('.feep__post_chat').appendChild(doubleComent);
        })





        $feedContainer.appendChild(double);
        $feedContainer.appendChild(doubleHr);

    })    
};

async function editFeedPost(el, post) {
    const id = localStorage.getItem('auth');
    if(el.classList.contains(id)) {
        const $postName = post.querySelector('.feed__post_name');
        const $input = document.querySelector('#input_example');
        const doubleInput = $input.cloneNode(true);
        doubleInput.classList.remove('not_display');
        doubleInput.classList.add('feed_input');
        doubleInput.placeholder = $postName.innerText
        $postName.innerHTML = '';
        $postName.appendChild(doubleInput);
        doubleInput.oninput = (event) => {
            feedFetchs.changePostName(el.id, event.target.value)
        }

        const $postBody = post.querySelector('.feed__post_description');
        const $textarea = document.querySelector('#textarea_example');
        const doubleTextarea = $textarea.cloneNode(true);
        doubleTextarea.classList.remove('not_display');
        doubleTextarea.classList.add('feed_input');
        doubleTextarea.placeholder = $postBody.innerText;
        $postBody.innerHTML = '';
        $postBody.appendChild(doubleTextarea)
        doubleTextarea.oninput = (event) => {
            feedFetchs.changePostBody(el.id, event.target.value)
        }
        document.onclick = (event) => {
            if (!event.target.classList.contains('feed_input')) {
                location.reload()
            }
        }
    }
};

async function deleteFeedPost(el) {
    const id = localStorage.getItem('auth');
    if(el.classList.contains(id)) {
        await feedFetchs.deletePostById(el.id);
    }
};

async function hideFeedPost(el, post) {
    post.querySelector('.feed__post_description').classList.toggle('full_body')
    post.querySelector('.feed__post_name').classList.toggle('full_name')
    el.classList.toggle('full_button');
};

async function hideComentForm(element, post) {
    const input = post.querySelector('.feed__coment_testarea')
    const $comentContainer =  post.querySelector('.feed__coment_container')
    $comentContainer.classList.toggle('not_display');
    input.focus()

    document.onclick = (event) => {
        if (!event.target.classList.contains('feed__coment_testarea') && !event.target.classList.contains('feed__post_coment')) {
            $comentContainer.classList.add('not_display');
        }
    }

    post.querySelector('.feed__coment_form').onsubmit = (event) => {
        event.preventDefault();
        const comentText = input.value;
        const postID = element.id;
        const authorID = localStorage.getItem('auth')
        if(comentText !== '') {
            comentFetchs.addComent({ postID, authorID, comentText})
            $comentContainer.classList.add('not_display');
            input.value = '';
        }
        
        
    }
}