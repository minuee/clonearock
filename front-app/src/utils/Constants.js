import CommonUtil from './CommonUtils';

export default {
    appName : "Dream E Wallet",
    baseColor : '#e5293e',

    //테스트
    SERVER_API : "http://10.10.10.148:8000",
    SERVER_WS : "ws://10.10.10.148:3000",

    //iamport
    storeCode : 'imp52519973',
    //font
    navTitle : CommonUtil.scale(18),
    navIcon : CommonUtil.scale(20),    
    mainTitle: CommonUtil.scale(15),
    subTitle: CommonUtil.scale(13),

    // nft
    deployedPrivateKey : '0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766',
    deployedAddress : '0xcb30451512778ae649011e1150e430b031e437d4',
    deployedABI : [{"constant":true,"inputs":[],"name":"count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06661abd"},{"constant":true,"inputs":[],"name":"lastParticipant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xbfe7e4e3"},{"constant":false,"inputs":[],"name":"plus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x18b0c3fd"},{"constant":false,"inputs":[],"name":"minus","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x14434fa5"}],
    deployedABI2 : [{
        "constant":true,
        "inputs":[{"name":"interfaceId","type":"bytes4"}],
        "name":"supportsInterface",
        "outputs":[{"name":"","type":"bool"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function",
        "signature":"0x01ffc9a7"
        },
        {
            "constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],
            "name":"getApproved",
            "outputs":[{"name":"","type":"address"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x081812fc"
        },
        {
            "constant":false,
            "inputs":[{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],
            "name":"approve",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x095ea7b3"
        },
        {
            "constant":true,
            "inputs":[],
            "name":"totalSupply",
            "outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x18160ddd"
        },
        {
            "constant":true,
            "inputs":[{"name":"owner","type":"address"},{"name":"index","type":"uint256"}],
            "name":"tokenOfOwnerByIndex",
            "outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x2f745c59"
        },
        {
            "constant":false,
            "inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],
            "name":"safeTransferFrom",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x42842e0e"
        },
        {
            "constant":true,
            "inputs":[{"name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x4f6ccce7"
        },
        {
            "constant":true,
            "inputs":[{"name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x6352211e"
        },
        {
            "constant":true,
            "inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x70a08231"
        },
        {
            "constant":false,
            "inputs":[{"name":"to","type":"address"},{"name":"approved","type":"bool"}],
            "name":"setApprovalForAll",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0xa22cb465"
        },
        {
            "constant":false,
            "inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],
            "name":"safeTransferFrom",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable"
            ,"type":"function",
            "signature":"0xb88d4fde"
        },
        {
            "constant":true,
            "inputs":[{"name":"owner","type":"address"},{"name":"operator","type":"address"}],
            "name":"isApprovedForAll",
            "outputs":[{"name":"","type":"bool"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0xe985e9c5"
        },
        {
            "anonymous":false,
            "inputs":[{"indexed":true,"name":"tokenId","type":"uint256"},{"indexed":false,"name":"photo","type":"bytes"},{"indexed":false,"name":"title","type":"string"},{"indexed":false,"name":"location","type":"string"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],
            "name":"PhotoUploaded","type":"event","signature":"0x0971e902ddb5848e55de7462bd04b0602c56f164021096456aefe8ad55b59e59"
        },
        {
            "anonymous":false,
            "inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],
            "name":"Transfer",
            "type":"event",
            "signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        },
        {
            "anonymous":false,
            "inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],
            "name":"Approval",
            "type":"event",
            "signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
        },
        {
            "anonymous":false,
            "inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"approved","type":"bool"}],
            "name":"ApprovalForAll",
            "type":"event",
            "signature":"0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31"
        },
        {
            "constant":false,
            "inputs":[{"name":"photo","type":"bytes"},{"name":"title","type":"string"},{"name":"location","type":"string"},{"name":"description","type":"string"}],
            "name":"uploadPhoto",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x99f52d9e"
        },
        {
            "constant":false,
            "inputs":[{"name":"tokenId","type":"uint256"},{"name":"to","type":"address"}],
            "name":"transferOwnership",
            "outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"address"}],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x29507f73"
        },
        {
            "constant":false,
            "inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],
            "name":"transferFrom",
            "outputs":[],
            "payable":false,
            "stateMutability":"nonpayable",
            "type":"function",
            "signature":"0x23b872dd"
        },
        {
            "constant":true,
            "inputs":[],
            "name":"getTotalPhotoCount",
            "outputs":[{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0x70dc232a"
        },
        {
            "constant":true,
            "inputs":[{"name":"tokenId","type":"uint256"}],
            "name":"getPhoto",
            "outputs":[{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"bytes"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"}],
            "payable":false,
            "stateMutability":"view",
            "type":"function",
            "signature":"0xb6be128a"
        }
    ],
    CONTACT_ABI : [
        {
          "constant": true,
          "inputs": [],
          "name": "count",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x06661abd"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "contacts",
          "outputs": [
            {
              "name": "id",
              "type": "uint256"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "phone",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xe0f478cb"
        },
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor",
          "signature": "constructor"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_name",
              "type": "string"
            },
            {
              "name": "_phone",
              "type": "string"
            }
          ],
          "name": "createContact",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0x3dce4920"
        }
    ]
}
