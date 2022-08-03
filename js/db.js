const dbPromised = idb.open("news-reader", 1, (upgradeDb)=> {
  const teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function saveForLater(team) {
  dbPromised
    .then((db)=> {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      console.log(team);
      store.put(team);
      return tx.complete;
    })
    .then(()=> {
      console.log("Team Favourite berhasil di simpan.");
      M.toast({html: 'Team Favourite disimpan'})
    });
}

function getAll() {
  return new Promise((resolve, reject)=> {
    dbPromised
      .then((db)=> {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.getAll();
      })
      .then((teams)=> {
        resolve(teams);
      });
  });
}


function getById(id) {
  return new Promise((resolve, reject)=> {
    dbPromised
      .then((db)=> {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.get(parseInt(id));
      })
      .then((Team)=> {
        resolve(Team);
      });
  });
}

function deletedTeam(team) {
  dbPromised
    .then((db)=> {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      console.log(team);
      store.delete(team);
      return tx.complete;
    })
    .then(()=>{
      console.log("berhasil di hapus");
      M.toast({html: 'Team Favourite dihapus'});
    });

  getSavedTeams();
}


