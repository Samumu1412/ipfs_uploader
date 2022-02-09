let fs = require("fs");
let axios = require("axios");

function getFiles(length, fileType) {
  let promises = [];
  let ipfsArray = [];

  for (let i = 0; i < length; i++) {  
    promises.push(new Promise( (res, rej) => {
        fs.readFile(`./files/${i}.${fileType}`, (err, data) => {
            if(err) rej();
            ipfsArray.push({
                path: `files/${i}.json`,
                content: data.toString("base64")
            })
            res();
        })
    }))
  }

  return [promises, ipfsArray]
}

const [promises, ipfsArray] = getFiles(3, 'json')


Promise.all(promises).then( () => {
  axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
      ipfsArray,
      {
          headers: {
              "X-API-KEY": 'TzKItK148Iuo4Qot8OMwYEuYfM71oaEvlBZzBvY3Zanmd6u5NU4sVYD3HB4etvu4',
              "Content-Type": "application/json",
              "accept": "application/json"
          }
      }
  ).then( (res) => {
      console.log(res.data);
  })
  .catch ( (error) => {
      console.log(error)
  })
})