require('dotenv').config()
const fs = require("fs");
const axios = require("axios");

const moralisAPI = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"

function getFiles(fileName, fileType, folderLength) {
  let promises = [];
  let ipfsArray = [];

  for (let i = 0; i < folderLength; i++) {  
    promises.push(new Promise((res, rej) => {
        fs.readFile(`./files/${fileName}.${fileType}`, (err, data) => {
            if(err) rej();
            ipfsArray.push({
                path: `${fileName}/metadata.json`,
                content: data.toString("base64")
            })
            res();
        })
    }))
  }

  return [promises, ipfsArray]
}


const [promises, ipfsArray] = getFiles('example', 'json', 1)


Promise.all(promises).then( () => {
  axios.post(moralisAPI, 
      ipfsArray,
      {
          headers: {
              "X-API-KEY": process.env.API_KEY,
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