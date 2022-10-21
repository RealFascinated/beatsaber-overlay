export function diffToScoreSaberDiff(diff) {
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
