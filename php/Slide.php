<?php
	class Slide {
		public
			$attributes = array(
				'id'						=> '',
				'data-x'				=> 0,
				'data-y'				=> 0,
				'data-z'				=> 0,
				'data-rotate-x'	=> 0,
				'data-rotate-y'	=> 0,
				'data-rotate-z'	=> 0,
				'data-scale'		=> 1
			),
			$classes = array('step'),
			$content;
	
		public function __construct($attr = array()) {
			$this->add('class', 'step');
		
			foreach($attr as $key=>$val)
				$this->add($key, $val);
		}
		
		public function add($attr, $val) {
			if($attr == 'content')
				$this->content = $val;
			else if($attr == 'class')
				$classes[] = $val;
			else
				$this->attributes[$attr] = $val;
			
			return $this;
		}
		
		public function get($name) {
			if($name == 'content')
				return $content;
			if($name == 'class')
				return $classes;
			return $attribute[$name];
		}
		
		public function getHTML() {
			$html = '<div class="';
			foreach($this->classes as $class)
				$html .= $class.' ';
			
			$html .= '" ';
			
			foreach($this->attributes as $attr=>$val)
				$html .= ' '.$attr.'="'.$val.'"';
			return $html.'>'.$this->content.'</div>';
		}
	}
?>