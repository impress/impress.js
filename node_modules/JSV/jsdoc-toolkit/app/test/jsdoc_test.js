/** 
 * @fileoverview This file is to be used for testing the JSDoc parser
 * It is not intended to be an example of good JavaScript OO-programming,
 * nor is it intended to fulfill any specific purpose apart from 
 * demonstrating the functionality of the 
 * <a href='http://sourceforge.net/projects/jsdoc'>JSDoc</a> parser
 *
 * @author Gabriel Reid gab_reid@users.sourceforge.net
 * @version 0.1 
 */


/**
 * Construct a new Shape object.
 * @class This is the basic Shape class.  
 * It can be considered an abstract class, even though no such thing
 * really existing in JavaScript
 * @constructor
 * @throws MemoryException if there is no more memory 
 * @throws GeneralShapeException rarely (if ever)
 * @return {Shape|Coordinate} A new shape.
 */
function Shape(){
  
   /**
    * This is an example of a function that is not given as a property
    * of a prototype, but instead it is assigned within a constructor.
    * For inner functions like this to be picked up by the parser, the
    * function that acts as a constructor <b>must</b> be denoted with
    * the <b>&#64;constructor</b> tag in its comment.
    * @type String
    */
   this.getClassName = function(){
      return "Shape";
   }

   /** 
    * This is an inner method, just used here as an example
    * @since version 0.5
    * @author Sue Smart
    */
   function addReference(){
       // Do nothing...
   }
   
}

/**
 * Create a new Hexagon instance.
 * @extends Shape
 * @class Hexagon is a class that is a <i>logical</i> sublcass of 
 * {@link Shape} (thanks to the <code>&#64;extends</code> tag), but in 
 * reality it is completely unrelated to Shape.
 * @param {int} sideLength The length of one side for the new Hexagon
 * @example
 * var h = new Hexagon(2);
 * @example
 * if (hasHex) {
 *     hex   = new Hexagon(5);
 *     color = hex.getColor();
 * }
 */
function Hexagon(sideLength) {
}


/**
 * This is an unattached (static) function that adds two integers together.
 * @param {int} One The first number to add 
 * @param {int} Two The second number to add 
 * @author Gabriel Reid
 * @deprecated So you shouldn't use it anymore! Use {@link Shape#getClassName} instead.
 */
function Add(One, Two){
    return One + Two;
}


/**
 * The color of this shape
 * @type Color
 */
Shape.prototype.color = null;

/**
 * The border of this shape. 
 * @field
 * @type int
 */
Shape.prototype.border = function(){return border;};

/*
 * These are all the instance method implementations for Shape
 */

/**
 * Get the coordinates of this shape. It is assumed that we're always talking
 * about shapes in a 2D location here.
 * @requires The {@link Shape} class
 * @returns A Coordinate object representing the location of this Shape
 * @type Coordinate[]
 */
Shape.prototype.getCoords = function(){
   return this.coords;
}

/**
 * Get the color of this shape.
 * @see #setColor
 * @see The <a href="http://example.com">Color</a> library.
 * @link Shape
 * @type Color
 */
Shape.prototype.getColor = function(){
   return this.color;
}

/**
 * Set the coordinates for this Shape
 * @param {Coordinate} coordinates The coordinates to set for this Shape
 */
Shape.prototype.setCoords = function(coordinates){
   this.coords = coordinates;
}

/**
 * Set the color for this Shape
 * @param {Color} color The color to set for this Shape
 * @param other There is no other param, but it can still be documented if
 *              optional parameters are used
 * @throws NonExistantColorException (no, not really!)
 * @see #getColor
 */
Shape.prototype.setColor = function(color){
   this.color = color;
}

/**
 * Clone this shape
 * @returns A copy of this shape
 * @type Shape
 * @author Gabriel Reid
 */
Shape.prototype.clone = function(){
   return new Shape();
}

/**
 * Create a new Rectangle instance. 
 * @class A basic rectangle class, inherits from Shape.
 * This class could be considered a concrete implementation class
 * @constructor
 * @param {int} width The optional width for this Rectangle
 * @param {int} height Thie optional height for this Rectangle
 * @author Gabriel Reid
 * @see Shape is the base class for this
 * @augments Shape
 * @hilited
 */
function Rectangle(width, // This is the width 
                  height // This is the height
                  ){
   if (width){
      this.width = width;
      if (height){
	 this.height = height;
      }
   }
}


/* Inherit from Shape */
Rectangle.prototype = new Shape();

/**
 * Value to represent the width of the Rectangle.
 * <br>Text in <b>bold</b> and <i>italic</i> and a 
 * link to <a href="http://sf.net">SourceForge</a>
 * @private
 * @type int
 */
Rectangle.prototype.width = 0;

/**
 * Value to represent the height of the Rectangle
 * @private
 * @type int
 */
Rectangle.prototype.height = 0;

/**
 * Get the type of this object. 
 * @type String
 */
Rectangle.prototype.getClassName= function(){
    return "Rectangle";
}

/**
 * Get the value of the width for the Rectangle
 * @type int
 * @see Rectangle#setWidth
 */
Rectangle.prototype.getWidth = function(){
   return this.width;
}

/**
 * Get the value of the height for the Rectangle.
 * Another getter is the {@link Shape#getColor} method in the 
 * {@link Shape} base class.  
 * @return The height of this Rectangle
 * @type int
 * @see Rectangle#setHeight
 */
Rectangle.prototype.getHeight = function(){
    return this.height;
}

/**
 * Set the width value for this Rectangle.
 * @param {int} width The width value to be set
 * @see #setWidth
 */
Rectangle.prototype.setWidth = function(width){
   this.width = width;
}

/**
 * Set the height value for this Rectangle.
 * @param {int} height The height value to be set
 * @see #getHeight
 */
Rectangle.prototype.setHeight = function(height){
   this.height = height;
}

/**
 * Get the value for the total area of this Rectangle
 * @return total area of this Rectangle
 * @type int
 */
Rectangle.prototype.getArea = function(){
   return width * height;
}


/**
 * Create a new Square instance.
 * @class A Square is a subclass of {@link Rectangle}
 * @param {int} width The optional width for this Rectangle
 * @param {int} height The optional height for this Rectangle
 * @augments Rectangle
 */
function Square(width, height){
   if (width){
      this.width = width;
      if (height){
	 this.height = height;
      }
   } 
   
}

/* Square is a subclass of Rectangle */
Square.prototype = new Rectangle();

/**
 * Set the width value for this Shape.
 * @param {int} width The width value to be set
 * @see #getWidth
 */
Square.prototype.setWidth = function(width){
   this.width = this.height = width;
}

/**
 * Set the height value for this Shape 
 * Sets the {@link Rectangle#height} attribute in the Rectangle.
 * @param {int} height The height value to be set
 */
Square.prototype.setHeight = function(height){
   this.height = this.width = height;
}


/**
 * Create a new Circle instance based on a radius.
 * @class Circle class is another subclass of Shape
 * @extends Shape
 * @param {int} radius The optional radius of this {@link Circle }
 * @mixin Square.prototype.setWidth as this.setDiameter
 */
function Circle(radius){
   if (radius) {
      /** The radius of the this Circle. */
      this.radius = radius;
   }
}

/* Circle inherits from {@link Shape} */
Circle.prototype = new Shape();

/** 
 * The radius value for this Circle 
 * @private
 * @type int
 */
Circle.prototype.radius = 0;

/** 
 * A very simple class (static) field that is also a constant
 * @final
 * @type float
 */
Circle.PI = 3.14;

/**
 * Get the radius value for this Circle
 * @type int
 * @see #setRadius
 */
Circle.prototype.getRadius = function(){
   return this.radius;
}

/** 
 * Set the radius value for this Circle
 * @param {int} radius The {@link Circle#radius} value to set
 * @see #getRadius
 */
Circle.prototype.setRadius = function(radius){
   this.radius = radius;
}

/** 
 * An example of a  class (static) method that acts as a factory for Circle
 * objects. Given a radius value, this method creates a new Circle.
 * @param {int} radius The radius value to use for the new Circle.
 * @type Circle
 */
Circle.createCircle = function(radius){
    return new Circle(radius);
}


/**
 * Create a new Coordinate instance based on x and y grid data.
 * @class Coordinate is a class that can encapsulate location information.
 * @param {int} [x=0] The optional x portion of the Coordinate
 * @param {int} [y=0] The optinal y portion of the Coordinate
 */
function Coordinate(x, y){
   if (x){
      this.x = x;
      if (y){
	 this.y = y;
      }
   }
}

/** 
 * The x portion of the Coordinate 
 * @type int
 * @see #getX
 * @see #setX
 */
Coordinate.prototype.x = 0;

/** 
 * The y portion of the Coordinate 
 * @type int
 * @see #getY
 * @see #setY
 */
Coordinate.prototype.y = 0;

/**
 * Gets the x portion of the Coordinate.
 * @type int
 * @see #setX
 */
Coordinate.prototype.getX = function(){
   return this.x;
}

/** 
 * Get the y portion of the Coordinate.
 * @type int
 * @see #setY
 */
Coordinate.prototype.getY = function(){
   return this.y;
}

/**
 * Sets the x portion of the Coordinate.
 * @param {int} x The x value to set
 * @see #getX
 */
Coordinate.prototype.setX = function(x){
   this.x = x;
}

/** 
 * Sets the y portion of the Coordinate.
 * @param {int} y The y value to set
 * @see #getY
 */
Coordinate.prototype.setY = function(y){
   this.y = y;
}

/**
 * @class This class exists to demonstrate the assignment of a class prototype
 * as an anonymous block.
 */
function ShapeFactory(){
}

ShapeFactory.prototype = {
   /** 
    * Creates a new {@link Shape} instance.
    * @return A new {@link Shape}
    * @type Shape
    */
   createShape: function(){
      return new Shape();
   }
}

/**
 * An example of a singleton class
 * @param ... Arguments represent {@link coordinate}s in the shape.
 * @constructor
 */
MySingletonShapeFactory = function(){

   /**
    * Get the next {@link Shape}
    * @type Shape
    * @return A new {@link Shape}
    */
   this.getShape = function(){ 
      return null; 
   }

}


/** 
 * Create a new Foo instance.
 * @class This is the Foo class. It exists to demonstrate 'nested' classes.
 * @constructor 
 * @see Foo.Bar
 */
function Foo(){}

/** 
 * Creates a new instance of Bar.
 * @class This class exists to demonstrate 'nested' classes.
 * @constructor 
 * @see Foo.Bar
 */
function Bar(){}

/** 
 * Nested class
 * @constructor 
 */
Foo.Bar = function(){
	/** The x. */ this.x = 2;
}

Foo.Bar.prototype = new Bar();
/** The y. */ 
Foo.Bar.prototype.y = '3';
