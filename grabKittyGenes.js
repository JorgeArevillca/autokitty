var net = require('net');
var Web3 = require("Web3");
var bs58 = require('bs58');
var web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', net));
var Promise = require("bluebird");
var hexToBinary = require('hex-to-binary');
var geneGroupNames = {};
var bodyGeneNames = {};
var patternGeneNames = {};
var colorEyesGeneNames = {};
var eyesGeneNames = {};
var colorPrimaryGeneNames = {};
var colorSecondaryGeneNames = {};
var colorTertiaryGeneNames = {};
var wildGeneNames = {};
var mouthGeneNames = {};
var geneNames = {};



function setup(){
	geneGroupNames[0] = "Unknown";
	geneGroupNames[1] = "Unknown";
	geneGroupNames[2] = "Unknown";
	geneGroupNames[3] = "Mouth";
	geneGroupNames[4] = "Wild";
	geneGroupNames[5] = "Color";
	geneGroupNames[6] = "Pattern Color";
	geneGroupNames[7] = "Body Color";
	geneGroupNames[8] = "Eye Type";
	geneGroupNames[9] = "Eye Color";
	geneGroupNames[10] = "Pattern";
	geneGroupNames[11] = "Body";



	bodyGeneNames["Savannah"] = "1";
	bodyGeneNames["Selkirk"] = "2";
	bodyGeneNames["Birman"] = "4";
	bodyGeneNames["Bobtail"] = "6";
	bodyGeneNames["Pixiebob"] = "8";
	bodyGeneNames["Cymric"] = "a";
	bodyGeneNames["Chartreux"] = "b";
	bodyGeneNames["Himalayan"] = "c";
	bodyGeneNames["Munchkin"] = "d";
	bodyGeneNames["Sphynx"] = "e";
	bodyGeneNames["Ragamuffin"] = "f";
	bodyGeneNames["Ragdoll"] = "g";
	bodyGeneNames["Norwegianforest"] = "h";

	patternGeneNames["Tiger"] = "2";
	patternGeneNames["Rascal"] = "3";
	patternGeneNames["Ganado"] = "4";
	patternGeneNames["Leopard"] = "5";
	patternGeneNames["Camo"] = "6";
	patternGeneNames["Totesbasic"] = "7";
	patternGeneNames["Totesbasic2"] = "8";
	patternGeneNames["Calicool"] = "9";
	patternGeneNames["Luckystripe"] = "a";
	patternGeneNames["Amur"] = "b";
	patternGeneNames["Jaguar"] = "c";
	patternGeneNames["Spock"] = "d";
	patternGeneNames["Totesbasic3"] = "f";
	patternGeneNames["Totesbasic4"] = "g";
	patternGeneNames["Thunderstruck"] = "i";
	patternGeneNames["Dippedcone"] = "j";
	patternGeneNames["Tigerpunk"] = "m";
	patternGeneNames["Henna"] = "n";
	patternGeneNames["Totesbasic5"] = "o";
	patternGeneNames["Totesbasic6"] = "p";
	patternGeneNames["Hotrod"] = "s";


	colorEyesGeneNames["Thundergrey"] = "1";
	colorEyesGeneNames["Gold"] = "2";
	colorEyesGeneNames["Topaz"] = "3";
	colorEyesGeneNames["Mintgreen"] = "4";
	colorEyesGeneNames["Sizzurp"] = "6";
	colorEyesGeneNames["Chestnut"] = "7";
	colorEyesGeneNames["Strawberry"] = "8";
	colorEyesGeneNames["Sapphire"] = "9";
	colorEyesGeneNames["Forgetmenot"] = "a";
	colorEyesGeneNames["Coralsunrise"] = "c";
	colorEyesGeneNames["Cyan"] = "g";
	colorEyesGeneNames["Pumpkin"] = "h";
	colorEyesGeneNames["Limegreen"] = "i";
	colorEyesGeneNames["Bubblegum"] = "k";
	colorEyesGeneNames["Twilightsparkle"] = "m";
	colorEyesGeneNames["Babypuke"] = "q";

	eyesGeneNames["Wonky"] = "2";
	eyesGeneNames["Serpent"] = "3";
	eyesGeneNames["Googly"] = "4";
	eyesGeneNames["Otaku"] = "5";
	eyesGeneNames["Simple"] = "6";
	eyesGeneNames["Crazy"] = "7";
	eyesGeneNames["Thicccbrowz"] = "8";
	eyesGeneNames["Baddate"] = "b";
	eyesGeneNames["Chronic"] = "d";
	eyesGeneNames["Slyboots"] = "e";
	eyesGeneNames["Wiley"] = "f";
	eyesGeneNames["Stunned"] = "g";
	eyesGeneNames["Alien"] = "i";
	eyesGeneNames["Fabulous"] = "j";
	eyesGeneNames["Raisedbrow"] = "k";
	eyesGeneNames["Sass"] = "o";
	eyesGeneNames["Sweetmeloncakes"] = "p";
	eyesGeneNames["Wingtips"] = "r";
	eyesGeneNames["Buzzed"] = "t";

	colorPrimaryGeneNames["Shadowgrey"] = "1";
	colorPrimaryGeneNames["Salmon"] = "2";
	colorPrimaryGeneNames["Orangesoda"] = "4";
	colorPrimaryGeneNames["Cottoncandy"] = "5";
	colorPrimaryGeneNames["Mauveover"] = "6";
	colorPrimaryGeneNames["Aquamarine"] = "7";
	colorPrimaryGeneNames["Nachocheez"] = "8";
	colorPrimaryGeneNames["Harbourfog"] = "9";
	colorPrimaryGeneNames["Greymatter"] = "b";
	colorPrimaryGeneNames["Dragonfruit"] = "e";
	colorPrimaryGeneNames["Hintomint"] = "f";
	colorPrimaryGeneNames["Bananacream"] = "g";
	colorPrimaryGeneNames["Cloudwhite"] = "h";
	colorPrimaryGeneNames["Oldlace"] = "j";
	colorPrimaryGeneNames["Koala"] = "k";
	colorPrimaryGeneNames["Verdigris"] = "p";
	colorPrimaryGeneNames["Onyx"] = "r";

	colorSecondaryGeneNames["Egyptiankohl"] = "3";
	colorSecondaryGeneNames["Poisonberry"] = "4";
	colorSecondaryGeneNames["Lilac"] = "5";
	colorSecondaryGeneNames["Apricot"] = "6";
	colorSecondaryGeneNames["Royalpurple"] = "7";
	colorSecondaryGeneNames["Swampgreen"] = "9";
	colorSecondaryGeneNames["Violet"] = "a";
	colorSecondaryGeneNames["Scarlet"] = "b";
	colorSecondaryGeneNames["Barkbrown"] = "c";
	colorSecondaryGeneNames["Coffee"] = "d";
	colorSecondaryGeneNames["Lemonade"] = "e";
	colorSecondaryGeneNames["Chocolate"] = "f";
	colorSecondaryGeneNames["Safetyvest"] = "i";
	colorSecondaryGeneNames["Turtleback"] = "j";
	colorSecondaryGeneNames["Wolfgrey"] = "m";
	colorSecondaryGeneNames["Cerulian"] = "n";
	colorSecondaryGeneNames["Skyblue"] = "o";
	colorSecondaryGeneNames["Royalblue"] = "s";

	colorTertiaryGeneNames["Belleblue"] = "1";
	colorTertiaryGeneNames["Sandalwood"] = "2";
	colorTertiaryGeneNames["Peach"] = "3";
	colorTertiaryGeneNames["Icy"] = "4";
	colorTertiaryGeneNames["Granitegrey"] = "5";
	colorTertiaryGeneNames["Kittencream"] = "7";
	colorTertiaryGeneNames["Emeraldgreen"] = "8";
	colorTertiaryGeneNames["Purplehaze"] = "b";
	colorTertiaryGeneNames["Azaleablush"] = "d";
	colorTertiaryGeneNames["Missmuffett"] = "e";
	colorTertiaryGeneNames["Morningglory"] = "f";
	colorTertiaryGeneNames["Daffodil"] = "h";
	colorTertiaryGeneNames["Flamingo"] = "i";
	colorTertiaryGeneNames["Bloodred"] = "k";
	colorTertiaryGeneNames["Periwinkle"] = "o";
	colorTertiaryGeneNames["Seafoam"] = "q";

	wildGeneNames["Dracula"] = "1";
	wildGeneNames["Santa"] = "d";
	wildGeneNames["Elk"] = "i";
	wildGeneNames["Trioculus"] = "k";

	mouthGeneNames["Whixtensions"] = "1";
	mouthGeneNames["Wasntme"] = "2";
	mouthGeneNames["Wuvme"] = "3";
	mouthGeneNames["Gerbil"] = "4";
	mouthGeneNames["Belch"] = "7";
	mouthGeneNames["Beard"] = "9";
	mouthGeneNames["Pouty"] = "a";
	mouthGeneNames["Saycheese"] = "b";
	mouthGeneNames["Grim"] = "c";
	mouthGeneNames["Happygokitty"] = "f";
	mouthGeneNames["Soserious"] = "g";
	mouthGeneNames["Cheeky"] = "h";
	mouthGeneNames["Starstruck"] = "i";
	mouthGeneNames["Dali"] = "m";
	mouthGeneNames["Grimace"] = "n";
	mouthGeneNames["Tongue"] = "p";
	mouthGeneNames["Yokel"] = "q";
	mouthGeneNames["Neckbeard"] = "s";

	geneNames[0] = "3rd Recessive";
	geneNames[1] = "2nd Recessive";
	geneNames[2] = "1st Recessive";
	geneNames[3] = "Dominant";
}

setup();
var cryptokitties_contract_address = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
//var kitty_abi = [{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cfoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"},{"name":"_preferredTransport","type":"string"}],"name":"tokenMetadata","outputs":[{"name":"infoUrl","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"promoCreatedCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_STARTING_PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSiringAuctionAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pregnantKitties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_kittyId","type":"uint256"}],"name":"isPregnant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_AUCTION_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"siringAuction","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setGeneScienceAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCEO","type":"address"}],"name":"setCEO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCOO","type":"address"}],"name":"setCOO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kittyId","type":"uint256"},{"name":"_startingPrice","type":"uint256"},{"name":"_endingPrice","type":"uint256"},{"name":"_duration","type":"uint256"}],"name":"createSaleAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"sireAllowedToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_matronId","type":"uint256"},{"name":"_sireId","type":"uint256"}],"name":"canBreedWith","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"kittyIndexToApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kittyId","type":"uint256"},{"name":"_startingPrice","type":"uint256"},{"name":"_endingPrice","type":"uint256"},{"name":"_duration","type":"uint256"}],"name":"createSiringAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"val","type":"uint256"}],"name":"setAutoBirthFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_sireId","type":"uint256"}],"name":"approveSiring","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCFO","type":"address"}],"name":"setCFO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_genes","type":"uint256"},{"name":"_owner","type":"address"}],"name":"createPromoKitty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"secs","type":"uint256"}],"name":"setSecondsPerBlock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_CREATION_LIMIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSaleAuctionAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_v2Address","type":"address"}],"name":"setNewAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"secondsPerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"name":"ownerTokens","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_matronId","type":"uint256"}],"name":"giveBirth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAuctionBalances","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"cooldowns","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"kittyIndexToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cooAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"autoBirthFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"erc721Metadata","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_genes","type":"uint256"}],"name":"createGen0Auction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_kittyId","type":"uint256"}],"name":"isReadyToBreed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PROMO_CREATION_LIMIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contractAddress","type":"address"}],"name":"setMetadataAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"saleAuction","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getKitty","outputs":[{"name":"isGestating","type":"bool"},{"name":"isReady","type":"bool"},{"name":"cooldownIndex","type":"uint256"},{"name":"nextActionAt","type":"uint256"},{"name":"siringWithId","type":"uint256"},{"name":"birthTime","type":"uint256"},{"name":"matronId","type":"uint256"},{"name":"sireId","type":"uint256"},{"name":"generation","type":"uint256"},{"name":"genes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_sireId","type":"uint256"},{"name":"_matronId","type":"uint256"}],"name":"bidOnSiringAuction","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"gen0CreatedCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"geneScience","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_matronId","type":"uint256"},{"name":"_sireId","type":"uint256"}],"name":"breedWithAuto","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"matronId","type":"uint256"},{"indexed":false,"name":"sireId","type":"uint256"},{"indexed":false,"name":"cooldownEndBlock","type":"uint256"}],"name":"Pregnant","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"approved","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"kittyId","type":"uint256"},{"indexed":false,"name":"matronId","type":"uint256"},{"indexed":false,"name":"sireId","type":"uint256"},{"indexed":false,"name":"genes","type":"uint256"}],"name":"Birth","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newContract","type":"address"}],"name":"ContractUpgrade","type":"event"}];
var kitty_abi = 
[{"constant":true,"inputs":[{"name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cfoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"},{"name":"_preferredTransport","type":"string"}],"name":"tokenMetadata","outputs":[{"name":"infoUrl","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"promoCreatedCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_STARTING_PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSiringAuctionAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pregnantKitties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_kittyId","type":"uint256"}],"name":"isPregnant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_AUCTION_DURATION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"siringAuction","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setGeneScienceAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCEO","type":"address"}],"name":"setCEO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCOO","type":"address"}],"name":"setCOO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kittyId","type":"uint256"},{"name":"_startingPrice","type":"uint256"},{"name":"_endingPrice","type":"uint256"},{"name":"_duration","type":"uint256"}],"name":"createSaleAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"sireAllowedToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_matronId","type":"uint256"},{"name":"_sireId","type":"uint256"}],"name":"canBreedWith","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"kittyIndexToApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_kittyId","type":"uint256"},{"name":"_startingPrice","type":"uint256"},{"name":"_endingPrice","type":"uint256"},{"name":"_duration","type":"uint256"}],"name":"createSiringAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"val","type":"uint256"}],"name":"setAutoBirthFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_sireId","type":"uint256"}],"name":"approveSiring","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newCFO","type":"address"}],"name":"setCFO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_genes","type":"uint256"},{"name":"_owner","type":"address"}],"name":"createPromoKitty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"secs","type":"uint256"}],"name":"setSecondsPerBlock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GEN0_CREATION_LIMIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setSaleAuctionAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_v2Address","type":"address"}],"name":"setNewAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"secondsPerBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"name":"ownerTokens","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_matronId","type":"uint256"}],"name":"giveBirth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAuctionBalances","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"cooldowns","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"kittyIndexToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cooAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"autoBirthFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"erc721Metadata","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_genes","type":"uint256"}],"name":"createGen0Auction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_kittyId","type":"uint256"}],"name":"isReadyToBreed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PROMO_CREATION_LIMIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contractAddress","type":"address"}],"name":"setMetadataAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"saleAuction","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getKitty","outputs":[{"name":"isGestating","type":"bool"},{"name":"isReady","type":"bool"},{"name":"cooldownIndex","type":"uint256"},{"name":"nextActionAt","type":"uint256"},{"name":"siringWithId","type":"uint256"},{"name":"birthTime","type":"uint256"},{"name":"matronId","type":"uint256"},{"name":"sireId","type":"uint256"},{"name":"generation","type":"uint256"},{"name":"genes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_sireId","type":"uint256"},{"name":"_matronId","type":"uint256"}],"name":"bidOnSiringAuction","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"gen0CreatedCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"geneScience","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_matronId","type":"uint256"},{"name":"_sireId","type":"uint256"}],"name":"breedWithAuto","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"matronId","type":"uint256"},{"indexed":false,"name":"sireId","type":"uint256"},{"indexed":false,"name":"cooldownEndBlock","type":"uint256"}],"name":"Pregnant","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"approved","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"kittyId","type":"uint256"},{"indexed":false,"name":"matronId","type":"uint256"},{"indexed":false,"name":"sireId","type":"uint256"},{"indexed":false,"name":"genes","type":"uint256"}],"name":"Birth","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newContract","type":"address"}],"name":"ContractUpgrade","type":"event"}]

//ownerWalletAddress = "0x380a1b2ae01dc2cb1d415c3d7f6bdb8a2a550cb6";
//web3.eth.defaultAccount = ownerWalletAddress;
//Linking to the contract itself
var ck_contract = new web3.eth.Contract(kitty_abi,cryptokitties_contract_address);
sampleId = 553355;

function toBinaryString(n) {
        // revert on out of range input

        var output = [];

        for (var i = 0; i < 5; i++) {
            output[4 - i] = (n % 2 == 1) ? ("1") : ("0");
            n /= 2;
        }

        return output;
    }

function processer(kitten){
	//promise = ck_contract.methods.getKitty(sampleId).call();
	console.log("making a call");
	promise = ck_contract.methods.getKitty(sampleId).call();
	//promise = web3.eth.call({to: cryptokitties_contract_address, data: ck_contract.methods.getKitty(sampleId).encodeABI()});
	console.log(promise);
	return promise;
}
var invert = function (obj) {

  var new_obj = {};

  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
};

function fiveBitToInteger(fiveBits){
	
	var numbers = [16,8,4,2,1];

	var counter = 0;
	var integerForm = 0;
	for (var bit in fiveBits){
		if(fiveBits[bit] == "1"){
			integerForm += numbers[counter];
		}
		counter++;
	}

	return integerForm;
}

function translateGenesToKAI(genes){
	var hexGenes = web3.utils.toHex(genes).replace("0x","");
	var binaryString = hexToBinary(hexGenes);

	var numberSequence = [];
	for (var x = 0; x<binaryString.length/5; x++){
		var nextInteger = fiveBitToInteger(binaryString.substring(x*5,(x+1)*5));
		numberSequence.push(nextInteger);
	}

	var bs58Alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
	var KAISequence = []

	for(var number in numberSequence){
		_number = numberSequence[number];
		KAISequence.push(bs58Alphabet[_number]);
	}
	KAISequence = KAISequence.join("");
	console.log("Translated:\n " + hexGenes + " to the KAI sequence:\n " + KAISequence);
	return KAISequence;

}

function outputGroupAttribute(group, groupDictionary){
	var recessiveA = "unknown";
	var recessiveB = "unknown";
	var recessiveC = "unknown";
	var dominant = "unknown";
	groupDictionary = invert(groupDictionary);
	if(groupDictionary[group[0]]){
		recessiveA = groupDictionary[group[0]]
	}

	if (groupDictionary[group[1]]) {
		recessiveB = groupDictionary[group[1]]
	}

	if (groupDictionary[group[2]]) {
		recessiveC = groupDictionary[group[2]]
	}

	if (groupDictionary[group[3]]) {
		dominant = groupDictionary[group[3]]
	}

	return "Recessive genes: " + "\n" + recessiveA + "\n" + recessiveB + "\n" + recessiveC + "\nDominant genes: " + dominant + "\n";

}
function outputCattributes(KaiGroups){
	for (var group in KaiGroups){
		console.log("Now looking at the " + geneGroupNames[group]);
		if(group == 0){
			console.log(outputGroupAttribute(KaiGroups[group],{}));
		} else if (group == 1){
			console.log(outputGroupAttribute(KaiGroups[group],{}));
		} else if (group == 2){
			console.log(outputGroupAttribute(KaiGroups[group],{}))
		} else if (group == 3){
			console.log(outputGroupAttribute(KaiGroups[group],mouthGeneNames));
		} else if (group == 4){
			console.log(outputGroupAttribute(KaiGroups[group],wildGeneNames));
		} else if (group == 5){
			console.log(outputGroupAttribute(KaiGroups[group],colorTertiaryGeneNames));
		} else if (group == 6){
			console.log(outputGroupAttribute(KaiGroups[group],colorSecondaryGeneNames));
		} else if (group == 7){
			console.log(outputGroupAttribute(KaiGroups[group],colorPrimaryGeneNames));
		} else if (group == 8){
			console.log(outputGroupAttribute(KaiGroups[group],eyesGeneNames));
		} else if (group == 9){
			console.log(outputGroupAttribute(KaiGroups[group],colorEyesGeneNames));
		} else if (group == 10){
			console.log(outputGroupAttribute(KaiGroups[group],patternGeneNames));
		} else if (group == 11){
			console.log(outputGroupAttribute(KaiGroups[group],bodyGeneNames));
		}
	}	
}
function readKitten(kitten){
	var testKaiSequence = "9ac9558524a2f4fad8185144f97c17513483441qdgdagegg";
	var KAISequence = translateGenesToKAI(kitten.genes);

	//KAISequence = testKaiSequence;
	var KaiGroups = [];
	for(var x = 0; x<KAISequence.length/4; x++){
		var nextGroup = KAISequence.substring(x*4,(x+1)*4);
		KaiGroups.push(nextGroup);
	}
	console.log("Kaisequence in groups is: " + KaiGroups);

	outputCattributes(KaiGroups);
	var genePercentages = {};

	genePercentages[0] = 0.0078;
	genePercentages[1] = 0.0313;
	genePercentages[2] = 0.1250;
	genePercentages[3] = 0.3359;


}

//var kitten = ck_contract.methods.getKitty(sampleId).call().then(readKitten);

//readKitten("");
processer().then(readKitten);
//processer().then(readKitten);

//processer().then(readKitten);

//console.log(kitten);
//console.log(kitten.genes);

//var result = web3.utils.toHex(kitten.genes);

//console.log(result);
