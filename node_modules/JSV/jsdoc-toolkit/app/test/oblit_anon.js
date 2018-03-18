/** the options */
opt = Opt.get(
	arguments, 
	{
	 d: "directory",
	 c: "conf",
	 "D[]": "define"
	}
);

/** configuration */
opt.conf = {
	/** keep */
	keep: true,
	/** base */
	base: getBase(this, {p: properties})
}



