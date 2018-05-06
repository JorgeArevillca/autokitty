var GeneDecoder = require("genedecoder")();
var Comparators = require("ak-comparators");
var Utilities = require("utilities");

function Breeder(upper_wallet_address, web3, ck_contract){
	let self = {};

	self.pureMuta = false;

	//This dictionary is used for keeping cat generations
	self.o = {};
	self.ck_contract = ck_contract;
	self.web3 = web3;
	self.upper_wallet_address = upper_wallet_address;
	//Ck_contract needs to be initialized before breeding
	self.lower_limit = 0;
	self.breedingPairScores = [];

	//PRESET BREEDING OPTIONS
	self.cats = [];
	self.targetedTraits = [];
	self.unchained = false;
	self.sixPercent = false;
	self.generations_breeding_upper_limit = 999;
	self.generations_breeding_lower_limit = 0;

	self.breedingPairs = [];

	self.outputGeneration = function(generation){
		var catIDs = [];
		var theCats = self.o[generation];
		for(var cat in theCats){
			catIDs.push(theCats[cat]);
		}

		Utilities.saveKittenIdsSpecific(catIDs,generation);
	}
	self.togglePureMuta = function(){
		self.pureMuta = true;
	}
	self.separateByGeneration = function(){
		var filteredCatList = [];
		for (var kitten in self.cats){

			if(!self.o[self.cats[kitten].generation]){
				self.o[self.cats[kitten].generation] = [];
			}
			self.o[self.cats[kitten].generation].push(self.cats[kitten]);

			if(self.cats[kitten].generation <= self.generations_breeding_upper_limit){
				if(self.cats[kitten].generation >= self.generations_breeding_lower_limit){
					//self.o[self.cats[kitten].generation].push(self.cats[kitten]);
					filteredCatList.push(self.cats[kitten]);
				}

			}

		}

		for(x = 0; x < 25; x++){
			self.outputGeneration(x);
		}

		return filteredCatList;
	}

	self.setupBreedingOptions = function(cats, targetedTraits, 
								unchained, sixPercent
								, generations_breeding_upper_limit, generations_breeding_lower_limit){
		self.cats = cats;
		self.targetedTraits = targetedTraits;
		self.unchained = unchained;
		self.sixPercent = sixPercent;
		self.generations_breeding_upper_limit = generations_breeding_upper_limit;
		self.generations_breeding_lower_limit = generations_breeding_lower_limit;
		self.breedingPairScores = [];
		self.breedingPairs = [];

	}
	self.isReadyFilter = function(){
		let filteredCatList = [];
		for(var cat in self.cats){
			if(self.cats[cat].isReady){
				filteredCatList.push(self.cats[cat]);
			}
		}
		return filteredCatList;
	}
	function CatWithScore(id, score, missingTraits){
		this.id = id;
		this.score = score;
		this.missingTraits = missingTraits;
		}


	self.advancedBreedingLoop = function(){
		var filteredCatList = self.separateByGeneration();
		console.log("Excluded generations and was left with: " + filteredCatList.length + " cats!");
		self.cats = filteredCatList;
		GeneDecoder.statistics(self.cats, 3);
		var readyFilteredCatList = self.isReadyFilter(filteredCatList);
		self.cats = readyFilteredCatList;
		console.log("Excluded not ready cats and was left with: " + readyFilteredCatList.length + " cats!");


		//This section was used for trying to bias the breeding selection without actually putting a restriction
		//on which traits could be bred. TODO: Review it
		var extraPoints = ["Bubblegum","Babypuke","Dragonfruit","Hintomint","Verdigris","Onyx","Flamingo","Bloodred",
		"Seafoam","Periwinkle"];
		var extraPoints = ["Orangesoda","Peach","Daffodil",
		"Flamingo","Cottoncandy","Dragonfruit","Hintomint","Bloodred","Seafoam","Bubblegum","Periwinkle","Verdigris"];
		extraPoints = [];
		var combinedTraits = self.targetedTraits.concat(extraPoints);


		var catsWithAnyTargetedTraits = self.getCatsWithTargetTraits(self.cats, combinedTraits);
		self.cats = catsWithAnyTargetedTraits;
		console.log('Fitting kittens found: %d', catsWithAnyTargetedTraits.length);
		console.log("Account used to breed: " + self.web3.eth.defaultAccount);

		//Scoring functions are needed for the breeding algorithm that follows
		var topLists = self.createTopLists(catsWithAnyTargetedTraits);
		var scores = self._scoreCatsBasedOnTraits(catsWithAnyTargetedTraits, combinedTraits);
		var arrayOfScoredCats = self._getSortedArrayOfScoredCatsFromDictionary(scores);

		if(self.pureMuta){
			self.cats = readyFilteredCatList;
			self.breedingPairs = self._simpleMutaBreedingAlgorithm();
		} else {
			self.breedingPairs = self._simpleBreedingAlgorithm(arrayOfScoredCats, scores);
		}



		console.log("Full breeding pairs list: ");
		console.log(self.breedingPairs);
		self._triggerBreedingPairs(self.breedingPairs);
		//self.breedingPairs = [];
	}

	self._breedingAlgorithmMutationMaximizer = function(arrayOfScoredCats, scores, listOfListOfTargetedTraits){

	}
	self._getSortedArrayOfScoredCatsFromDictionary = function(scores){
		var arrayOfScoredCats = [];
		var scoreKeys = Object.keys(scores);

		for(var key in scoreKeys){
			key = scoreKeys[key];
			//arrayOfScoredCats.push(new CatWithScore(scores[score]))
			arrayOfScoredCats.push(scores[key]);
		}
		arrayOfScoredCats.sort(Comparators.keyComparator("score"));
		return arrayOfScoredCats;
	}

	self._getSortedArrayOfScoredMutaCatsFromDictionary = function(scores){
		var arrayOfScoredCats = [];
		var scoreKeys = Object.keys(scores);

		for(var key in scoreKeys){
			key = scoreKeys[key];
			//arrayOfScoredCats.push(new CatWithScore(scores[score]))
			arrayOfScoredCats.push([key,scores[key]]);
		}
		arrayOfScoredCats.sort(function(a,b) {return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);} ); 
		arrayOfScoredCats.reverse();

		//arrayOfScoredCats.sort();
		return arrayOfScoredCats;
	}
	self._makeMutationScoreDictionarySingularHC = function(cat, copyOfCats, catDictionary){
		scoredDictionary = {};
		for(var cat_B in copyOfCats){
			cat_B = copyOfCats[cat_B];
			var totalMutaScore = 0.0;
			totalMutaScore += GeneDecoder.mutationMatcher(cat, cat_B);
			scoredDictionary[cat_B.id] = totalMutaScore;
			//console.log("??")

		}

		return scoredDictionary;

	}
	self._makeMutationScoreDictionarySingular = function(cat, traitScoreList, catDictionary){
		scoredDictionary = {};
		for(var cat_B in traitScoreList){
			cat_B = catDictionary[traitScoreList[cat_B].id];

			var totalMutaScore = 0.0;
			totalMutaScore += GeneDecoder.mutationMatcher(cat, cat_B);
			scoredDictionary[cat_B.id] = totalMutaScore;
			//console.log("??")

		}

		return scoredDictionary;

	}
	self._makeMutationScoreDictionary = function(){
		copyOfCats = self.cats.slice();
		scoredDictionary = {};
		for(var catIndex in self.cats){
			cat = self.cats[catIndex];
			var avgMutaScore = 0.0;
			var totalMutaScore = 0.0;
			for(var copyOfCatIndex in copyOfCats){
				cat_2 = copyOfCats[copyOfCatIndex];
				totalMutaScore += GeneDecoder.mutationMatcher(cat, cat_2);
			}
			avgMutaScore = totalMutaScore/(copyOfCats.length-1);
			scoredDictionary[cat] = avgMutaScore;
		}

		return scoredDictionary;

	}
	self._makeSingleTraitScoreDictionary = function(){
		console.log("Making single scored lists for all traits and putting them in a dict...");
		singleTraitScoreDictionary = {};
		for(let trait in self.targetedTraits){
			trait = self.targetedTraits[trait];
			let traitScoreList = self._scoreCatsBasedOnSingleTrait(trait);
			singleTraitScoreDictionary[trait] = traitScoreList;
		}
		return singleTraitScoreDictionary;

	}
	self._decideBreedOrderAndPush = function(scoredCat, partner, catDictionary){
		if(catDictionary[partner.id].cooldownIndex < catDictionary[scoredCat.id].cooldownIndex){
			self.breedingPairs.push(new BreedingPair(partner.id, scoredCat.id));
		} else {
			self.breedingPairs.push(new BreedingPair(scoredCat.id, partner.id));
		}
	}

	self._triggerBreedingPairs = function(breedingPairs){
		for(var bp in breedingPairs){
			count = bp;
			bp = breedingPairs[bp];
			setTimeout(self.readyToBreedCheckA,300*count, bp.id1, bp.id2);
		}
	}
	self._removeBreedingPairFromAllTraitLists = function(scoredCat, partner, targetedTraits){
		for(var trait in targetedTraits){
			self._removeBreedingPairFromTraitList(scoredCat, partner, targetedTraits[trait]);
		}
	}

	self._removeBreedingPairFromTraitList = function(scoredCat, partner,trait){
		var traitScoreList = self.singleTraitScoreDictionary[trait];
		delete traitScoreList[partner.id];
		delete traitScoreList[scoredCat.id];
		self.singleTraitScoreDictionary[trait] = traitScoreList;
	}

	self._decideTargetTrait = function(scoredCat, targetedTraits, catDictionary){
		var aCOF = catDictionary[scoredCat.id].chanceOfTrait;
		if(aCOF[targetedTraits[0]] > aCOF[targetedTraits[1]]){
			return targetedTraits[1];
		} else {
			return targetedTraits[0];
		}
	}

	self._eitherCatIsBriskOrBetter = function(catA, catB){
		//return ((catA.cooldownIndex <= 6) || (catB.cooldownIndex <= 6));
		return true;
	}

	//Takes two cats and compares their matrons and sires. Depends on the last gotten info from calling the
	//contracts "getKitten" function
	self._isRelated = function(catA,catB){
		var isRelated = ((catA.matronId == catB.matronId) || (catA.sireId == catB.sireId));
		if(catA.generation == 0 && catB.generation == 0){
			isRelated = false;
		}
		return isRelated;
	}

	self.isValidMatch = function(catA, catB){
		if(!(self._isRelated(catA, catB))){

			if(!self.usedCats.includes(catB.id)){

				if(self._eitherCatIsBriskOrBetter(catA, catB)){
					return true;
				} else {
					console.log("Was not either brisk or better?");
				}
			} else {
				console.log("was used cat?");
			}
		} else {
			console.log("was related?");
		}

		return false;
	}
	self._printFive = function(listToPrint){
		for(var item in listToPrint){
			if(item < 5){
				console.log(listToPrint[item]);
			}
		}
	}
	self._pureMutationChaser = function(catDictionary){
		var partner = undefined;

		self.copyOfCats = self.cats.slice();
		for(var cat in self.cats){
			//cat = self.cats[cat];
			console.log("At cat number:" + cat);
			nCat = self.cats[cat];
			mutationUnordered = self._makeMutationScoreDictionarySingularHC(catDictionary[nCat.id], self.copyOfCats, catDictionary);
			mutationOrdered = self._getSortedArrayOfScoredMutaCatsFromDictionary(mutationUnordered);
			self._printFive(mutationOrdered);
			if( mutationOrdered.length != 0){
				partner = catDictionary[mutationOrdered[0][0]];
				if((self.isValidMatch(nCat, partner)) && (mutationOrdered[0][1] > 1.3)){
					console.log("is valid?");
				} else {
					partner = undefined;
				}
			}
			if(partner != undefined){
				Utilities.remove(self.copyOfCats, partner.id);
				Utilities.remove(self.copyOfCats, nCat.id);
				Utilities.remove(self.cats, nCat.id);
				Utilities.remove(self.cats, partner.id);
				self.usedCats.push(nCat.id);
				self.usedCats.push(partner.id);
				//self._removeBreedingPairFromAllTraitLists(nCat, partner, self.targetedTraits);
				self._decideBreedOrderAndPush(nCat, partner, catDictionary);

				console.log("Found match in PURE MUTATION mode!");
				console.log("Match ids are: " + nCat.id + " and " + partner.id + "!");
				//console.log("Match had the score --> : " + scoredCat.score + " , " + scores[partner.id].score);
				/*
				var bpscore = [];
				bpscore.push(scoredCat.score);
				bpscore.push(scores[partner.id].score);
				self.breedingPairScores.push(bpscore);
				*/
			}
		}
		
	}
	self._mutationFindMatch = function(scoredCat, catDictionary, scores, treshold, missing){
		var partner = undefined;

		if(missing == 0){
			
			targetTrait = self._decideTargetTrait(scoredCat, self.targetedTraits, catDictionary);
			console.log(targetTrait);
			console.log(catDictionary[scoredCat.id].chanceOfTrait);
			traitScoreList = self.singleTraitScoreDictionary[targetTrait];
			orderedTraitScoreList = self._unorderedDictionaryToOrderedArrayByScore(traitScoreList);
			mutationUnordered = self._makeMutationScoreDictionarySingular(catDictionary[scoredCat.id],orderedTraitScoreList, catDictionary);
			//console.log(mutationUnordered);
			mutationOrdered = self._getSortedArrayOfScoredMutaCatsFromDictionary(mutationUnordered);
			//console.log(mutationOrdered);
			if(mutationOrdered.length != 0){
				partner = catDictionary[mutationOrdered[0][0]];
				if(self.isValidMatch(scoredCat, partner) && mutationOrdered[0][1] > 0.0){

				} else {
					partner = undefined;
				}
			}

			//console.log("tried to find a match for: " + scoredCat.id );
			//console.log(mutationOrdered);

			

		} else if (missing == 1){
			//targetTrait = self._decideTargetTrait(scoredCat, self.targetedTraits, catDictionary);
			var targetTrait;
			var real_cat = catDictionary[scoredCat.id];

			if(self.targetedTraits[0] in real_cat.chanceOfTrait){
				targetTrait = self.targetedTraits[1];
			} else {
				targetTrait = self.targetedTraits[0];
			}
			traitScoreList = self.singleTraitScoreDictionary[targetTrait];
			orderedTraitScoreList = self._unorderedDictionaryToOrderedArrayByScore(traitScoreList);
			mutationUnordered = self._makeMutationScoreDictionarySingular(catDictionary[scoredCat.id], orderedTraitScoreList, catDictionary);
			//console.log(mutationUnordered);
			mutationOrdered = self._getSortedArrayOfScoredMutaCatsFromDictionary(mutationUnordered);
			//console.log(mutationOrdered);
			console.log(mutationOrdered);
			if(mutationOrdered.length != 0){
				partner = catDictionary[mutationOrdered[0][0]];

				if(self.isValidMatch(scoredCat, partner) && mutationOrdered[0][1] > 0.0){

				} else {
					partner = undefined;
				}
			}
			

			
		}

		
		if(partner != undefined){
			Utilities.remove(self.potentialPartners, partner.id);
			Utilities.remove(self.potentialPartners, scoredCat.id);
			Utilities.remove(self.cats, scoredCat.id);
			Utilities.remove(self.cats, partner.id);
			self.usedCats.push(scoredCat.id);
			self.usedCats.push(partner.id);
			self._removeBreedingPairFromAllTraitLists(scoredCat, partner, self.targetedTraits);
			self._decideBreedOrderAndPush(scoredCat, partner, catDictionary);

			console.log("Found match in " + missing + " missing, mutation mode");
			console.log("Match had the score --> : " + scoredCat.score + " , " + scores[partner.id].score);
			var bpscore = [];
			bpscore.push(scoredCat.score);
			bpscore.push(scores[partner.id].score);
			self.breedingPairScores.push(bpscore);
		}
	}


	self._findMatchZeroMissing = function(scoredCat, catDictionary, scores, treshold){
		console.log("no missing traits, pick top scorer!");
		var targetTrait = self.targetedTraits[0];
		var genOne = false;
		if(self.targetedTraits.length == 2 || !genOne){
			self._mutationFindMatch(scoredCat, catDictionary, scores, treshold, 0);
		} else {
			var partnerCopy = self.potentialPartners.slice();
			for(var partner in partnerCopy){
				partner = partnerCopy[partner];
				if(partner.id != scoredCat.id){
					if(!self.usedCats.includes(partner.id)){
						if(!self._isRelated(catDictionary[partner.id],catDictionary[scoredCat.id])){

							if(self._eitherCatIsBriskOrBetter(scoredCat, catDictionary[partner.id])){
								if(catDictionary[partner.id].isReady){
									Utilities.remove(self.potentialPartners, partner.id);
									Utilities.remove(self.potentialPartners, scoredCat.id);

									self.usedCats.push(scoredCat.id);
									self.usedCats.push(partner.id);
									self._removeBreedingPairFromAllTraitLists(scoredCat, partner, self.targetedTraits);
									self._decideBreedOrderAndPush(scoredCat, partner, catDictionary);
									console.log("Found match in zero missing, larger than two conditional");
									console.log("Match had the score --> : " + scoredCat.score + " , " + partner.score);
									var bpscore = [];
									bpscore.push(scoredCat.score);
									bpscore.push(partner.score);
									self.breedingPairScores.push(bpscore);
									break;
								} else {
									self.usedCats.push(partner.id);
									//Utilities.remove(self.potentialPartners, partner.id);
								}
								
							}
						}
							

					} else {
						Utilities.remove(self.potentialPartners, partner.id);
					}
				}
				
			}
			
			
		}
	}
	self._findMatchOneMissing = function(scoredCat, catDictionary, scores, treshold){
		//console.log("Missing one trait, pick based on top scoring cat of that trait");
		var missingTrait = scoredCat.missingTraits[0];
		var missingTraitScoreList = self.singleTraitScoreDictionary[missingTrait];
		orderedMissingTraitScoreList = self._unorderedDictionaryToOrderedArrayByScore(missingTraitScoreList);
		Utilities.remove(self.potentialPartners, scoredCat.id);
		var genOne = false;
		if(self.targetedTraits.length == 2 && !genOne){
			self._mutationFindMatch(scoredCat, catDictionary, scores, treshold, 1);
		} else {

			if(orderedMissingTraitScoreList.length > 0){
				for(var catInList in orderedMissingTraitScoreList){
					var partner = orderedMissingTraitScoreList[catInList];
					scoredPartner = scores[partner.id];
					if(partner.id != scoredCat.id){
						if(!self.usedCats.includes(partner.id) && !self._isRelated(catDictionary[partner.id],catDictionary[scoredCat.id])){
							if(scoredPartner.score > treshold*self.targetedTraits.length || self.unchained){
							//if(scoredPartner > 0.10 || unchained){
								if(self._eitherCatIsBriskOrBetter(scoredCat, catDictionary[partner.id])){
									if(catDictionary[partner.id].isReady){
										Utilities.remove(self.potentialPartners, scoredCat.id);
										Utilities.remove(self.potentialPartners, partner.id);
										self._removeBreedingPairFromAllTraitLists(scoredCat, scoredPartner, self.targetedTraits);
										self.usedCats.push(scoredCat.id);
										self.usedCats.push(partner.id);

										self._decideBreedOrderAndPush(scoredCat, partner, catDictionary);
										//console.log("Found match in _findMatchOneMissing");
										console.log("Match had the score --> : " + scoredCat.score + " , " + scoredPartner.score);
										var bpscore = [];
										bpscore.push(scoredCat.score);
										bpscore.push(scoredPartner.score);
										self.breedingPairScores.push(bpscore);
										break;
									} else {
										self.usedCats.push(partner.id);

									}
								}
								
							}
						}
					}	

				}
			
			} else {
				console.log("No cat with the cattribute " + missingTrait + " left :(");
			}
		}

	}
	self._findMatchTwoMissing = function(scoredCat, catDictionary, scores, treshold){
		//console.log("Missing two traits.. Looking at both ");

		if(self.targetedTraits.length == 2){
			console.log("Not doing singular partners for mutations..");
		} else {
			var missingTraits = scoredCat.missingTraits;
			//console.log("Missing traits: " + missingTraits[0] + ", " + missingTraits[1]);						
			var firstMissingTraitScoreList = self.singleTraitScoreDictionary[missingTraits[0]];
			var secondMissingTraitScoreList = self.singleTraitScoreDictionary[missingTraits[1]];
			var firstOrderedTraitScoreList = self._unorderedDictionaryToOrderedArrayByScore(firstMissingTraitScoreList);
			var secondOrderedTraitScoreList = self._unorderedDictionaryToOrderedArrayByScore(secondMissingTraitScoreList);
			
			//If there are cats that have both traits remaining
			if(firstOrderedTraitScoreList.length > 0 && secondOrderedTraitScoreList.length > 0){
				for(var tCat in firstOrderedTraitScoreList){
					var tCat = firstOrderedTraitScoreList[tCat];
					scoredPartner = scores[tCat.id];
					if(self._eitherCatIsBriskOrBetter(scoredCat, catDictionary[tCat.id])){

						if(catDictionary[tCat.id].isReady){
							if(!self.usedCats.includes(tCat.id) && !self._isRelated(catDictionary[tCat.id],catDictionary[scoredCat.id]) && (tCat.id != scoredCat.id)){
								if(secondMissingTraitScoreList[tCat.id] > 0.20 && scoredPartner.score > self.targetedTraits.length * treshold ){
									Utilities.remove(self.potentialPartners, scoredCat.id);
									var partner = tCat;
									Utilities.remove(self.potentialPartners, partner.id);

									self._removeBreedingPairFromAllTraitLists(scoredCat, scoredPartner, self.targetedTraits);
									self.usedCats.push(scoredCat.id);
									self.usedCats.push(partner.id);
									self._decideBreedOrderAndPush(scoredCat, partner, catDictionary);
									//console.log("Found a candidate match in _findMatchTwoMissing");
									console.log("Match had the score --> : " + scoredCat.score + " , " + scoredPartner.score);
									var bpscore = [];
									bpscore.push(scoredCat.score);
									bpscore.push(scoredPartner.score);
									self.breedingPairScores.push(bpscore);
									break;
								}
							}
							
						} else {
							self.usedCats.push(tCat.id);
						}
					}
				}
			} else {
				console.log("Neither trait is present");
			}
		}
		
	}

	self._simpleMutaBreedingAlgorithm = function(){
		var catDictionary = {};
		self.usedCats = [];

		for(var cat in self.cats){
			cat = self.cats[cat];
			catDictionary[cat.id] = cat;
		}

		self._pureMutationChaser(catDictionary);

		return self.breedingPairs;
	}
	self._simpleBreedingAlgorithm = function(arrayOfScoredCats, scores){

		var catDictionary = {};
		if(self.unchained == true){
			console.log("Running in unchained mode!");
		}
		for(var cat in self.cats){
			cat = self.cats[cat];
			catDictionary[cat.id] = cat;

		}
		self.singleTraitScoreDictionary = self._makeSingleTraitScoreDictionary();

		console.log("Trying to find find these traits:");
		console.log(self.targetedTraits);
		self.potentialPartners = arrayOfScoredCats.slice();

		self.usedCats = [];
		var treshold = 0.06;
		if(self.sixPercent){
			treshold = 0.06;
		}
		for(var scoredCat in arrayOfScoredCats){
			scoredCat = arrayOfScoredCats[scoredCat];
			if(self._isSuitableCat(scoredCat, catDictionary, treshold)){

				self._findMatch(scoredCat, catDictionary, scores, treshold);
			}
			
		}
		console.log("Tried to find breeding pairs...");
		console.log("Found: " + self.breedingPairs.length + " breeding pairs!");
		console.log("Their scores are:");

		for(var bpscore in self.breedingPairScores){
			console.log(self.breedingPairScores[bpscore]);			
		}
		return self.breedingPairs;
	}

	//Checks for the cat being ready, being in potentialpartners and that it is not in the usedCats list. 
	//Also matches versus the treshold.
	self._isSuitableCat = function(scoredCat, catDictionary, treshold){
		if(catDictionary[scoredCat.id].isReady){
			if(self.potentialPartners.includes(scoredCat) && !self.usedCats.includes(scoredCat.id)){
				if(scoredCat.score > treshold*self.targetedTraits.length){
					//console.log("Cat: " + scoredCat.id + " exceeds threshold and is suitable! Trying to find a match!");
					return true;
				}
			}

		}
		return false;
	}
	self._findMatch = function(scoredCat, catDictionary, scores, treshold){
		if(scoredCat.missingTraits.length == 0){
			//console.log("This cat is missing 0 traits");
			self._findMatchZeroMissing(scoredCat, catDictionary, scores, treshold);
		} else if (scoredCat.missingTraits.length == 1){
			//console.log("This cat is missing 1 traits");			
			self._findMatchOneMissing(scoredCat, catDictionary, scores, treshold);
		} else if (scoredCat.missingTraits.length == 2) {
			//console.log("This cat is missing 2 traits");
			self._findMatchTwoMissing(scoredCat, catDictionary, scores, treshold);								
		} else {
			//console.log("Missing three or more traits, probably should not breed this cat");
			self.usedCats.push(scoredCat.id);
		}
	}

	self._unorderedDictionaryToOrderedArrayByScore = function(catDictionary){
		var scoreKeys = Object.keys(catDictionary);
		var arrayOfScoredCats = [];
		for(var key in scoreKeys){
			key = scoreKeys[key];
			arrayOfScoredCats.push(new CatWithScore(key, catDictionary[key], ""));
			//arrayOfScoredCats.push(scores[key]);
		}

		arrayOfScoredCats.sort(Comparators.keyComparator("score"));

		return arrayOfScoredCats;

	}
	self._scoreCatsBasedOnSingleTrait = function(trait){
		var catScores = {};
		for(var cat in self.cats){
			if(self.cats[cat]){
				var count = cat;
				cat = self.cats[cat];
				var score = 0;
				if(cat.chanceOfTrait){
					var chance = cat.chanceOfTrait[trait];
				} else {
					var chance = 0;
				}
				if(chance > 0){
					score += chance;
					catScores[cat.id] = score;

				}
			}
			

		}
		return catScores;
	}


	self._scoreCatsBasedOnTraits = function(catsWithAnyTrait, extraPoints){
		var catScores = {};
		//Dictionary pairing catIDs with scores.
		for(var cat in catsWithAnyTrait){
			var count = cat;
			cat = catsWithAnyTrait[cat];
			var score = 0;
			var missingTraits = [];
			for(var trait in extraPoints){
				var chance = cat.chanceOfTrait[extraPoints[trait]];
				if(chance > 0){
					if(self.targetedTraits.includes(extraPoints[trait])){
						score += chance;

					} else {
						score += chance*3;
					}
				} else {
					if(self.targetedTraits.includes(extraPoints[trait])){
						missingTraits.push(extraPoints[trait]);
					} 
				}

			}
			catScores[cat.id] = new CatWithScore(cat.id, score, missingTraits);
			//console.log(cat.chanceOfTrait);
		}

		return catScores;
	}

	self.createTopLists = function(){
		var topLists = [];
		for(var trait in self.targetedTraits){
			trait = self.targetedTraits[trait];
			traitTopList = self.createSingleTopList(trait);
			topLists.push(traitTopList);
			//console.log(traitTopList);
		}

		return topLists;
	}

	self.createSingleTopList = function(trait){
		var topList = [];
		for(var cat in self.cats){
			cat = self.cats[cat];
			if(cat.chanceOfTrait[trait]){
				topList.push(cat);
			}

		}
		topList.sort(Comparators.traitScoreComparator(trait));
		return topList;
	}


	self.breedingLoop = function(){
		var filteredCatList = self.separateByGeneration();
		breedingPairs = self.findRandomBreedingPairs(filteredCatList);
		console.log('Kitten breeding pairs found: %d', breedingPairs.length);
		console.log("Account used to breed: " + self.web3.eth.defaultAccount);
	}

	self.readyToBreedCheckA = function(id, id2){
		self.ck_contract.methods.isReadyToBreed(id).call().then(z => self.readyToBreedCheckB(id, id2, z));
	}

	self.readyToBreedCheckB = function(id, id2, aIsReady){
		if(aIsReady){
			self.ck_contract.methods.isReadyToBreed(id2).call().then(z => self.notOnAuctionCheckA(id, id2, z));
		} else {
			console.log("A not ready");
		}
	}

	self.notOnAuctionCheckA = function(id, id2, bIsReady){
		if(bIsReady){
			self.ck_contract.methods.ownerOf(id).call().then(z => self.notOnAuctionCheckB(id, id2, z));
		} else {
			console.log("B not ready");
		}
	}
	self.notOnAuctionCheckB = function(id, id2, address){
		if(address != self.upper_wallet_address){
			console.log("For sale, cannot breed");
		} else {
			self.ck_contract.methods.ownerOf(id2).call().then(z => self.canBreedWithCheck(id,id2,z));
		}
	}
	self.canBreedWithCheck = function(id, id2, address){
		if(address != upper_wallet_address){
			console.log("for sale, cannot breed");
		} else {
			self.ck_contract.methods.canBreedWith(id,id2).call().then(z => self.triggerTransactionOnly(id,id2,z));		
		}
	}

	self.triggerTransactionOnly = function(id, id2, canBreed){
		if(canBreed){
			self.ck_contract.methods.breedWithAuto(id, id2).send({from: self.web3.eth.defaultAccount, value: self.web3.utils.toWei("0.008", "ether"),gasPrice: self.web3.utils.toWei("0.000000016", "ether") });
			console.log("Breeding: " + id +" and " + id2 + " together!");
			console.log("(((would have)))");
		} else {
			console.log("Breeding failed. Possible cause: Too close relation");
		}
	}
	self.bothReady = function(cat, potentialPartner){
		return cat.isReady && potentialPartner.isReady;
	}

	function isEmptyObject( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	}
	//Tuple describing a breeding pair
	function BreedingPair(id1, id2){
		this.id1 = id1;
		this.id2 = id2;
	}

	self.getCatsWithTargetTraits = function(){
		var traitLists = {}
		var newCats = [];
		for(var trait in self.targetedTraits){
			traitLists[self.targetedTraits[trait]] = [];
		}

		for(var cat in self.cats){
			var newKitten = GeneDecoder.simpleFilter(self.cats[cat],self.targetedTraits);
			if(!isEmptyObject(newKitten.chanceOfTrait)){
				newCats.push(newKitten);
			}
		}
		console.log("Found " + newCats.length + " filtered cats!");
		return newCats;
	}

	self.findRandomBreedingPairs = function(){
		var listOfUsedCats = [];
		var newCats = [];
		var breedingPairs = [];
		console.log("Looking at " + self.cats.length + " total cats!");

		for (var cat in self.cats){
			count = cat;
			cat = self.cats[cat];
			var potentialPartners = self.o[cat.generation];
			var potentialPartners = remove(potentialPartners, cat.id);

			var tries = 0;
			var maxTries = 100;
			matchOrTimeOut = false;
			if(cat){
				while (!matchOrTimeOut){

					var potentialPartner = potentialPartners[Math.floor(Math.random()*potentialPartners.length)];
					if (self.ck_contract.methods.canBreedWith(cat.id,potentialPartner.id) && self.bothReady(cat, potentialPartner) && (cat.id != potentialPartner.id)){
						if(!listOfUsedCats.includes(cat.id) && !listOfUsedCats.includes(potentialPartner.id)){
							breedingPairs.push(new BreedingPair(cat.id,potentialPartner.id));
							listOfUsedCats.push(cat.id);
							listOfUsedCats.push(potentialPartner.id);
							matchOrTimeOut = true;
							setTimeout(self.readyToBreedCheckA,150*count, cat.id, potentialPartner.id);
							self.o[cat.generation] = remove(self.o[cat.generation], potentialPartner.id);
							self.o[cat.generation] = remove(self.o[cat.generation], cat.id);
						}
						
					}
					tries++;
					if (tries > maxTries ){
						matchOrTimeOut = true;

					}

				}	
			}



		}
		return breedingPairs;
	}
	return self;
}

module.exports = Breeder;