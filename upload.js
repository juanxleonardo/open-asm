import lighthouse from "@lighthouse-web3/sdk";
// ... other code
const filePath = '/home/juanx/lotus/coba.text'; // change the path of your file
const APIKey = '1289ce15.5191baf700b04f188315dc66d3bb2e52';// the API key from the lighthouse account
const uploadResponse = await lighthouse.upload(filePath, APIKey);