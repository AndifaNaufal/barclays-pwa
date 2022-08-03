const base_url = "https://api.football-data.org/v2/";
const endPointTeams = `${base_url}competitions/2021/teams`
const endPointStandings = `${base_url}competitions/2021/standings`
const fetchData = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      'X-Auth-Token': `8b7b83c7d9bb4322913ed102de9931c7`
    }
  })
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getTeams() {
  if ("caches" in window) {
    caches.match(endPointTeams).then((response) => {
      if (response) {
        response.json().then((data) => {
          let TeamsHTML = "";
          data.teams.forEach((Team) => {
            TeamsHTML += `
                  <div class="card" padding-top: 50px; padding-left: 250px;">
                    <a href="./Team.html?id=${Team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${Team.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${Team.name}</span>
                      <p class="blue-text text-darken-2">${Team.address}</p>
                    </div>
                  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("Teams").innerHTML = TeamsHTML;
        });
      }
    });
  }

  fetchData(endPointTeams)
    .then(status)
    .then(json)
    .then((data) => {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      let TeamsHTML = "";
      data.teams.forEach((Team) => {
        TeamsHTML += `
              <div class="card">
                <a href="./Team.html?id=${Team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${Team.crestUrl}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${Team.name}</span>
                  <p class="blue-text text-darken-2" >${Team.address}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("Teams").innerHTML = TeamsHTML;
    })
    .catch(error);
}
function getTeamById() {
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam + { mode: 'no-cors'}).then((response) => {
        if (response) {
          response.json().then((data) => {
            let TeamHTML = `
            <div class= "col s7 m4" style = "padding-top: 50px; padding-left: 100px;">
            <div class="card s7 m4 transparent">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.name}</span>
                <p class="blue-text text-darken-2"> ${data.website} </p>
              </div>
            </div>
            </div>
            
          `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = TeamHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchData(base_url + "teams/" + idParam)
      .then(status)
      .then(json)
      .then((data) => {
        // Objek JavaScript dari response.json() masuk lewat letiabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        let TeamHTML = `
        <div class= "col s7 m4" style = "padding-top: 50px; padding-left: 100px;">
        <div class="card transparent">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.crestUrl}" />
          </div>
          <div class="card-content">
            <span class="card-title light-blue-text">${data.name}</span>
            <p class="blue-text text-darken-2">${data.website} </p>
          </div>
        </div>
        </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = TeamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedTeams() {
  getAll().then((Teams) => {
    console.log(Teams);
    // Menyusun komponen card artikel secara dinamis
    let TeamsHTML = "";
    Teams.forEach((Team) => {

      TeamsHTML += `
                  <div class = "col s12 m7">
                  <div class="card transparent">
                    <a href="./Team.html?id=${Team.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${Team.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                    <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="deletedTeam(${Team.id});" id="deleted"><i class="material-icons">delete</i></a>
                      <span class="card-title truncate light-green-text">${Team.name}</span>
                      <p class = "light green-text"> ${Team.website}</p>
                    </div>
                  </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = TeamsHTML;
  });
}

function getSavedTeamById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  getById(idParam).then((Team) => {
    let TeamHTML = `
    <div class="card transparent">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${Team.crestUrl}" />
      </div>
      <div class="card-content">
        <span class="card-title">${Team.name}</span>
        <p class="blue-text text-darken-2" >${Team.website}</p>
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = TeamHTML;
  });
}

function getAllStandings() {
  let Team = ""
  if ("caches" in window) {
    caches.match(endPointStandings).then((response) => {
      if (response) {
        response.json().then((data) => {
          data.standings[0].table.forEach((standing) => {
            Team += `
            <tr>
            <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
            <td>${standing.team.name}</td>
            <td>${standing.won}</td>
            <td>${standing.draw}</td>
            <td>${standing.lost}</td>
            <td>${standing.points}</td>
            <td>${standing.goalsFor}</td>
            <td>${standing.goalsAgainst}</td>
            <td>${standing.goalDifference}</td>
            <td><a href="./Team.html?id=${standing.team.id}"class="container-waves-effect waves-light btn">  <i class="material-icons">search</i></a></td>
        </tr>
            

`;
          });
          TeamsHTML =

            `
          <div class="col s12 m12">
          <div class="card s12 m12" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

          <table class="striped responsive-table">
              <thead>
                  <tr>
                      <th></th>
                      <th>Team Name</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GA</th>
                      <th>GD</th>
                      <th>Detail Tim</th>
                  </tr>
               </thead>
              <tbody>
                ${Team}
              </tbody>
          </table>
          
          </div>
          </div>`
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("standings").innerHTML = TeamsHTML;
        });
      }
    });
  }

  fetchData(endPointStandings)
    .then(status)
    .then(json)
    .then((data) => {
      data.standings[0].table.forEach((standing) => {
        Team += `
            <tr>
            <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
            <td>${standing.team.name}</td>
            <td>${standing.won}</td>
            <td>${standing.draw}</td>
            <td>${standing.lost}</td>
            <td>${standing.points}</td>
            <td>${standing.goalsFor}</td>
            <td>${standing.goalsAgainst}</td>
            <td>${standing.goalDifference}</td>
            <td><a href="./Team.html?id=${standing.team.id}"class="container-waves-effect waves-light btn">  <i class="material-icons">search</i></a></td>
        </tr>
            

`
      });
      TeamsHTML = `
      <div class="col s12 m12">
      <div class="card s12 m12" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

      <table class="striped responsive-table">
          <thead>
              <tr>
                  <th></th>
                  <th>Team Name</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
              </tr>
           </thead>
          <tbody>
            ${Team}
          </tbody>
      </table>
      
      </div>
      </div>`

      document.getElementById("standings").innerHTML = TeamsHTML;



    })
    .catch(error);
}
