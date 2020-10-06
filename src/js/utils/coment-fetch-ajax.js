const comentFetchs = {

    async addComent(coment) {
      const data = new FormData();
      data.append("json", JSON.stringify(coment));
      const response = await fetch ('http://localhost:5000/coment/', {method: "POST", body: data});
      const res = await response.json();
      viewFeed();
      return res
   },
  
   async getAllComents() {
    let response = await fetch('http://localhost:5000/coment/');
    let feed = await response.json();
    return JSON.parse(feed)
   }
   
  }