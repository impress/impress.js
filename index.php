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
			'content'				=>	'<p>Good luck,<br /> and enjoy.</p>',
		)),
		
		new Slide(array(
			'content'				=>	'<p>The fact that you\'re here means you want to know about <a href="https://github.com/audiobahn404/slides.php">slides.php</a>, right?</p>',
			'data-x'				=>	1000
		)),
		
		new Slide(array(
			'content'				=>	'<p>Well, you\'re in luck. I feel like teaching today.</p>',
			'data-x'				=>	1000,
			'data-y'				=>	100,
			'data-z'				=>	-100,
			'data-rotate-x'	=>	-90
		)),
		
		new Slide(array(
			'content'				=>	'<p>Basically, slides.php wraps up all the impress.js syntax into a PHP array.</p>',
			'data-x'				=>	500,
			'data-y'				=>	100,
			'data-z'				=>	-450,
			'data-rotate-x'	=>	-90,
			'data-rotate-z'	=>	90
		)),
		
		new Slide(array(
			'content'				=>	'<p>That array is created with the <b>Slide</b> class.</p>',
			'data-x'				=>	400,
			'data-y'				=>	200,
			'data-z'				=>	-450,
			'data-rotate-x'	=>	-90,
			'data-rotate-y'	=>	90,
			'data-rotate-z'	=>	90
		)),
		
		new Slide(array(
			'content'				=>	'<p>You can create an array of slides, too.<br />Then we start rolling.</p>',
			'data-x'				=>	400,
			'data-y'				=>	500,
			'data-z'				=>	-900,
			'data-rotate-x'	=>	-180,
			'data-rotate-y'	=>	90,
			'data-rotate-z'	=>	90
		)),
		
		new Slide(array(
			'content'				=>	'<p>It can get pretty repetitive, but it\'s consistent and easy to read.</p>',
			'data-x'				=>	300,
			'data-y'				=>	500,
			'data-z'				=>	-1000,
			'data-rotate-x'	=>	-180,
			'data-rotate-y'	=>	0,
			'data-rotate-z'	=>	90
		)),
		
		new Slide(array(
			'content'				=>	'<p><b>Problem</b>: I can\'t explain everything to you.</p>',
			'data-x'				=>	-50,
			'data-y'				=>	1000,
			'data-z'				=>	-1000,
			'data-rotate-x'	=>	-180,
			'data-rotate-y'	=>	0,
			'data-rotate-z'	=>	180
		)),
		
		new Slide(array(
			'content'				=>	'<p><b>Solution</b>: <a href="https://github.com/audiobahn404/slides.php">check the source</a>.</p>',
			'data-x'				=>	-1000,
			'data-y'				=>	500,
			'data-z'				=>	-500,
			'data-rotate-x'	=>	-90,
			'data-rotate-y'	=>	90,
			'data-rotate-z'	=>	90
		)),
		
		new Slide(array(
			'content'				=>	'',
			'data-x'				=>	0,
			'data-y'				=>	0,
			'data-z'				=>	0,
			'data-rotate-x'	=>	0,
			'data-rotate-y'	=>	0,
			'data-rotate-z'	=>	0
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
    <meta name="author" content="Jon Egeland, Bartek Szopka" />

    <link href="http://fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|PT+Sans:400,700,400italic,700italic|PT+Serif:400,700,400italic,700italic" rel="stylesheet" />
    <link href="css/impress-demo.css" rel="stylesheet" />
    
    <link rel="shortcut icon" href="favicon.png" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
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
				browser. I never said the content was formatted.
		-->
		<div id="impress" data-transition-duration="1000">
			<?php foreach($slides as $s) echo $s->getHTML(); ?>
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