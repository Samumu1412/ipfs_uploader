require('dotenv').config()
const fs = require("fs");
const axios = require("axios");

const moralisAPI = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"

function getFiles(length, fileType) {
  let promises = [];
  let ipfsArray = [];

  for (let i = 0; i < length; i++) {  
    promises.push(new Promise((res, rej) => {
        fs.readFile(`./files/toolPass.${fileType}`, (err, data) => {
            if(err) rej();
            ipfsArray.push({
                path: `tool-pass/metadata.json`,
                content: data.toString("base64")
            })
            res();
        })
    }))
  }

  return [promises, ipfsArray]
}


const [promises, ipfsArray] = getFiles(1, 'json')


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