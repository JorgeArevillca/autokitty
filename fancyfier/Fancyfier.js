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
    for(var x = gen_from; x < gen_to; x++){
      var listOfTargetedTraitCombinations = selectTargetTraits(self.total_targeted_traits.length+2-counter, counter);

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

    this.solve = function(){

    }
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
      score = scoreCat(cats[cat], threshold_modifier);
      listOfScoredCats.push(new CatWithScore(cats[cat].id, cats[cat], score));
    }

    listOfScoredCats.sort(Comparators.keyComparator("score"));

    return listOfScoredCats;
  }

  function scoreCat(cat, threshold_modifier){
    kittenWithTraits = GeneDecoder.simpleFilter(cat, self.targetedTraits);
    var threshold_met = false;
    var score = 0;
    for(var trait in self.current_targeted_traits){
      trait = self.current_targeted_traits[trait];
      if(kittenWithTraits.chanceOfTrait[trait]){
        score += kittenWithTraits.chanceOfTrait[trait];
      }
    }

    return score;

  }

  function scoreCatPair(catA, catB){
    var traitScores = [0,0];
    kittenWithTraitsA = GeneDecoder.simpleFilter(catA, self.targetedTraits);
    kittenWithTraitsB = GeneDecoder.simpleFilter(catB, self.targetedTraits);

    for(var trait in self.current_targeted_traits){
      traitNumber = trait;
      trait = self.current_targeted_traits[traits];

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
}
