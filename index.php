<!--
	The comments on this page assume that you already understand
		how to use impress.js.
	
	If you don't, or find something you don't quite understand here,
		go check out index-plain.html.
		
		
	
	That being said, let's get down to business.
	
	The first thing we have to do is include the new php scripts.
-->
<?php include('php/Slide.php'); ?>

<!--
	Now we start defining the slides, in the order that we want
		them to appear on the site.
-->
<?php
	$slides = array(
		new Slide(array(
			'content' => '<p>Hello, there</p>'
		))
	);
?>

<html>
	<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1024" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>impress.js with slides.php</title>
    
    <meta name="description" content="impress.js is a presentation tool based on the power of CSS3 transforms and transitions in modern browsers and inspired by the idea behind prezi.com." />
    <meta name="author" content="Jon Egeland" />

    <link href="http://fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|PT+Sans:400,700,400italic,700italic|PT+Serif:400,700,400italic,700italic" rel="stylesheet" />
	</head>

	<body class="impress-not-supported">
		<div class="fallback-message">
    	<p>Your browser <b>doesn't support the features required</b> by impress.js, so you are presented with a simplified version of this presentation.</p>
    	<p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>
		</div>
		
		
		<!--
			Here's where things start changing.
			
			Instead of the normal step-after-step format, we can now
				just iterate over the slides to get a uniform format
				in our HTML.
				
			And it's so clean, too. Just 1 line of PHP can support
				an infinite number of slides, keeping your source short
				and easy to read.
				
			Better yet, you don't have to worry about formatting things
				correctly. As long as you entered your slides correctly,
				everything is spit out in a perfectly formatted chain.
				
			Don't believe me? Go check out the 'View Source' in your
				browser. Then you can complain about formatting.
		-->
		<div id="impress" data-transition-duration="1400">
			<?php foreach($slides as $slide) echo $s-getHTML(); ?>
		</div>
		
		
		<!--
			Then just tell impress to run like normal,
				and you're done!
				
			See, that wasn't so bad.
		-->
		<script type="text/javascript" src="js/impress.js"></script>
		<script type="text/javascript">
			impress().init();
		</script>
	</body>
</html>