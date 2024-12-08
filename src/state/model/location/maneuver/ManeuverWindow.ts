export interface ManeuverWindow {
	// the first year this maneuver window is available on
	firstYear: number;
	// the number of years between each window
	// (e.g. 1956, 58, 60 ... would have an interval of 2)
	interval: number;
}
