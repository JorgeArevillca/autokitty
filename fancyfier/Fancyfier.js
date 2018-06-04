var GeneDecoder = require("genedecoder")();
var Comparators = require("ak-comparators");

function fancyfier(upper_wallet_address, web3, ck_contract, targeted_traits){
  self = {};
  self.total_targeted_traits = targeted_traits;
  self.current_targeted_traits = self.total_targeted_traits;

  var Breeder = require("breeder")(upper_wallet_address, web3, ck_contract);

  threshold = 0.22;

  function isOneDominantOrTwoR1(value){
    return value >= 0.22;
  }

  function main(gen_from, gen_to, cats){
    var stageList = designStages(gen_from, gen_to, cats);

    for(var stage in stageList){
      stage = stageList[stage];
      var breedingPairs = stage.solve();

      Breeder._triggerBreedingPairs(breedingPairs);
    }
  }

  function designStages(gen_from, gen_to, cats){
    var stageList = [];
    var amount = total_targeted_traits.length;
    var counter = 0;
    self.catDictionary = {};

    //Making a cat-dictionary to keep track of attributes such as cooldown, matron, sire, time until next breed, etc.
    for(var cat in cats){
      cat = cats[cat];
      self.catDictionary[cat.id] = cat;
    }

    for(var x = gen_from; x < gen_to; x++){
      var listOfTargetedTraitCombinations = selectTargetTraits(self.total_targeted_traits.length+2-counter, counter);
      var threshold = 0.20+(0.05*x);

      for(var y = 0; y < amount; y++){
        var generationFilteredCats = catGenerationFilter(cats, x);
        var stage = new Stage(x, generationFilteredCats, listOfTargetedTraitCombinations[y], threshold);
        stageList.push(stage);
      }
      counter += 1;
    }
    return stageList;
  }

  function selectTargetTraits(amount, traitLevel){
    var traitCombos = [];

    var length = total_targeted_traits.length;

    for(var y = 0; y < amount; y++){
      if(traitLevel == 0){
        traitCombo = [total_targeted_traits[y%length],total_targeted_traits[(y+1)%length]];
        traitCombos.push(traitCombo);

      } else if (traitLevel == 1){
        traitCombo = [total_targeted_traits[y%length],total_targeted_traits[(y+1)%length],total_targeted_traits[(y+2)%length]];
        traitCombos.push(traitCombo);

      } else if (traitLevel == 2){

        traitCombo = [total_targeted_traits[y%length],total_targeted_traits[(y+1)%length],total_targeted_traits[(y+2)%length],total_targeted_traits[(y+3)%length]];
        traitCombos.push(traitCombo);

      }

    }

    return traitCombos;
  }


  function Stage(generation, cats, current_targeted_traits, threshold){
    this.generation = generation;
    this.cats = cats;
    this.threshold = threshold;
    this.current_targeted_traits = current_targeted_traits;
    this.threshold_modified = threshold+(0.05*generation);

    this.solve = function(){
      var listOfScoredCats = scoreAllCats(this.cats, this.threshold);
      var listOfScoredCats = listOfScoredCats.filter(function (el) {
        return el.score > this.threshold_modified;
      });
      var potentialCatPartners = this.cats.slice();
      for(var cat in listOfScoredCats){
        cat = cats[cat];
        missingTraits = getMissingTraits(cat, this.current_targeted_traits);
        topList = createSingleTopList(potentialCatPartners);
        for(var partnerCat in topList){
          partnerCat = topList[partnerCat];
          scoredCat = scoreCat(partnerCat, this.threshold_modified, this.current_targeted_traits);
          if(traitRequirementsMet())
        }

      }
    }
  }

  function decideParentRoles(cat, catPartner, catDictionary, score){
		if(parseInt(catDictionary[""+catPartner.id].cooldownIndex,10) <= parseInt(catDictionary[""+cat.id].cooldownIndex,10)){
      var bp = new BreedingPair(catPartner.id, cat.id, score);
      return bp;
		} else {
      var bp = new BreedingPair(cat.id, catPartner.id, score);
      return bp;
		}
	}

  function createSingleTopList(cats, trait){
		var topList = [];
		for(var cat in cats){
			cat = cats[cat];
			if(cat.chanceOfTrait[trait]){
				topList.push(cat);
			}

		}
		topList.sort(Comparators.traitScoreComparator(trait));
		return topList;
	}

  function CatWithScore(id, cat, score){
    this.id = id;
    this.cat = cat;
    this.score = score;
  }

  function catGenerationFilter(cats, generation){

    var filteredCatList = cats.filter(function (el) {
    return el.generation == generation;
  });
  return filteredCatList;

  }

  function scoreAllCats(cats,threshold_modifier){
    var listOfScoredCats = [];
    for(var cat in cats){
      kittenWithTraits = GeneDecoder.simpleFilter(cats[cat], targeted_traits);
      score = scoreCat(kittenWithTraits, threshold_modifier);
      if(score > 0){
          listOfScoredCats.push(new CatWithScore(kittenWithTraits.id, kittenWithTraits, score));
      }

    }

    listOfScoredCats.sort(Comparators.keyComparator("score"));

    return listOfScoredCats;
  }

  function getMissingTraits(cat, targeted_traits){
    var missingTraits = [];
    for(var trait in targeted_traits){
      trait = targeted_traits[trait];
      if(cat.chanceOfTrait[trait] < 0.20){
        missingTraits.push(trait);
      }
    }
    return missingTraits;
  }
  function scoreCat(cat, threshold_modifier, targeted_traits){
    var threshold_met = false;
    var score = 0;
    for(var trait in targeted_traits){
      trait = targeted_traits[trait];
      if(cat.chanceOfTrait[trait] > 0.20){
        score += cat.chanceOfTrait[trait];
      }
    }

    return score;

  }

  function scoreCatPair(catA, catB, targeted_traits){
    var traitScores = [0,0];
    kittenWithTraitsA = GeneDecoder.simpleFilter(catA, targeted_traits);
    kittenWithTraitsB = GeneDecoder.simpleFilter(catB, targeted_traits);

    for(var trait in targeted_traits){
      traitNumber = trait;
      trait = traits[trait];

      if(kittenWithTraitsA.chanceOfTrait[trait]){
          traitScores[traitNumber] += kittenWithTraitsA.chanceOfTrait[trait];
      }
      if(kittenWithTraitsB.chanceOfTrait[trait]){
        traitScores[traitNumber] += kittenWithTraitsB.chanceOfTrait[trait];
      }

    }
    var totalScore = traitScores[0]*traitScores[1];

    return totalScore;
  }

  function traitRequirementsMet(catA, catB, current_targeted_traits, threshold){
    for(var trait in current_targeted_traits){
      trait = current_targeted_traits[trait];
      if(catA.chanceOfTrait[trait] + catB.chanceOfTrait[trait] > threshold){

      } else {
        return false;
      }
    }

    return true;
  }
}
