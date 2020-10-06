const feedFetchs = {

  async addPost(post) {
    const data = new FormData();
    data.append("json", JSON.stringify(post));
    const response = await fetch ('http://localhost:5000/feed/', {method: "POST", body: data});
    const res = await response.json();
    viewFeed();
    return res
 },

 async getAllFeedPosts() {
  let response = await fetch('http://localhost:5000/feed/');
  let feed = await response.json();
  return JSON.parse(feed)
 },
   
 async deletePostById(id) {
  let response = await fetch(`http://localhost:5000/feed/${id}`, {method: "DELETE"});
  let user = await response.json();
  viewFeed();
  return user;
 },

 async changePostName(id, newName) {
  const data = new FormData();
  data.append("json", JSON.stringify(newName));
  let response = await fetch(`http://localhost:5000/feed/name/${id}`, {method: "PUT", body: data} );
  let res = await response.json();
  return res
 },

 async changePostBody(id, newBody) {
  const data = new FormData();
  data.append("json", JSON.stringify(newBody));
  let response = await fetch(`http://localhost:5000/feed/body/${id}`, {method: "PUT", body: data} );
  let res = await response.json();
  return res
 },
}