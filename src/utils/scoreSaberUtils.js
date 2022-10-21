function diffToScoreSaberDiff(diff) {
	console.log(
		"🚀 ~ file: scoreSaberUtils.js ~ line 2 ~ diffToScoreSaberDiff ~ diff",
		diff
	);
	switch (diff) {
		case "Easy": {
			return 1;
		}
		case "Normal": {
			return 3;
		}
		case "Hard": {
			return 5;
		}
		case "Expert": {
			return 7;
		}
		case "Expert+": {
			return 9;
		}
		case "ExpertPlus": {
			return 9;
		}
	}
}

module.exports = {
	diffToScoreSaberDiff,
};
